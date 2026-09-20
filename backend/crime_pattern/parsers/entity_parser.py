import re
from collections import defaultdict
from backend.crime_pattern.schemas.contracts import ParsedCrimeData
from utils.logger import logger

_spacy_nlp = None

def _get_spacy():
    global _spacy_nlp
    if _spacy_nlp is None:
        import spacy
        try:
            logger.info("Loading spaCy model en_core_web_sm...")
            _spacy_nlp = spacy.load("en_core_web_sm")
        except Exception as error:
            logger.warning("Failed to load spaCy model: {}", str(error))
    return _spacy_nlp

def normalize_vehicle_number(val: str) -> str:
    s = re.sub(r'[^A-Z0-9]', '', val.upper())
    if not s:
        return s
    let_to_dig = {'O': '0', 'I': '1', 'L': '1', 'Z': '2', 'S': '5', 'B': '8', 'G': '6', 'T': '1'}
    dig_to_let = {'0': 'O', '1': 'I', '2': 'Z', '5': 'S', '8': 'B', '6': 'G'}
    
    if 7 <= len(s) <= 10:
        chars = list(s)
        for i in range(2):
            if chars[i].isdigit() and chars[i] in dig_to_let:
                chars[i] = dig_to_let[chars[i]]
        for i in range(2, 4):
            if chars[i].isalpha() and chars[i] in let_to_dig:
                chars[i] = let_to_dig[chars[i]]
        for i in range(len(chars) - 4, len(chars)):
            if chars[i].isalpha() and chars[i] in let_to_dig:
                chars[i] = let_to_dig[chars[i]]
        for i in range(4, len(chars) - 4):
            if chars[i].isdigit() and chars[i] in dig_to_let:
                chars[i] = dig_to_let[chars[i]]
        s = "".join(chars)
    return s

class CrimeEntityParser:
    patterns = {
        "phone": r"(?<!\d)(?:\+91[-\s]?)?[6-9]\d{9}(?!\d)",
        "vehicle": r"\b[A-Za-z0-9]{2}\s?[A-Za-z0-9]{1,2}\s?[A-Za-z0-9]{1,3}\s?[A-Za-z0-9]{4}\b",
        "bank_account": r"(?<!\d)\d{9,18}(?!\d)",
        "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        "fir_no": r"\b(?:FIR\s*(?:No\.?|Number)?\s*[:#-]?\s*)?\d{1,5}\s*/\s*(?:19|20)\d{2}\b",
        "case_no": r"\b(?:Case\s*(?:No\.?|Number)?\s*[:#-]?\s*)[A-Z0-9/-]{3,30}\b",
        "aadhaar": r"(?<!\d)\d{4}[\s-]?\d{4}[\s-]?\d{4}(?!\d)",
        "pan": r"\b[A-Za-z]{5}\d{4}[A-Za-z]\b",
        "date": r"\b(?:\d{1,2}[/-]\d{1,2}[/-](?:19|20)?\d{2}|(?:19|20)\d{2}-\d{2}-\d{2})\b"
    }
    
    labels = {
        "name": r"(?:Name|Accused|Suspect|Complainant)\s*[:=-]\s*([A-Za-z][A-Za-z .'-]{2,80})",
        "district": r"District\s*[:=-]\s*([A-Za-z][A-Za-z .'-]{2,80})",
        "police_station": r"(?:Police Station|P\.S\.)\s*[:=-]\s*([A-Za-z][A-Za-z .'-]{2,80})",
        "location": r"(?:Location|Place of Occurrence|Address)\s*[:=-]\s*([^\n]{3,120})",
        "organization": r"(?:Organization|Company|Bank)\s*[:=-]\s*([A-Za-z][A-Za-z .&'-]{2,100})"
    }

    def parse(self, text: str) -> ParsedCrimeData:
        out = defaultdict(list)
        # Find values using general patterns
        for k, p in self.patterns.items():
            matches = re.findall(p, text, re.I)
            out[k].extend(matches)
            
        # Find labeled values
        for k, p in self.labels.items():
            matches = re.findall(p, text, re.I)
            out[k].extend(x.strip(" .:-") for x in matches)
            
        # Specific Normalizations
        # Phone: strip non-digits to get last 10 digits
        cleaned_phones = []
        for p in out["phone"]:
            digits = re.sub(r'\D', '', p)
            if len(digits) >= 10:
                cleaned_phones.append(digits[-10:])
        out["phone"] = cleaned_phones

        # Vehicle: normalize OCR substitutions and formats
        cleaned_vehicles = []
        for v in out["vehicle"]:
            normalized = normalize_vehicle_number(v)
            if normalized:
                cleaned_vehicles.append(normalized)
            cleaned_vehicles.append(re.sub(r'[^A-Z0-9]', '', v.upper()))
        out["vehicle"] = cleaned_vehicles

        # Aadhaar: strip spaces/dashes
        out["aadhaar"] = [re.sub(r'[^0-9]', '', a) for a in out["aadhaar"]]

        # PAN: upper/strip
        out["pan"] = [re.sub(r'[^A-Z0-9]', '', p.upper()) for p in out["pan"]]

        # Crime type list lookup
        out["crime_type"] = [
            x.title() for x in (
                "cyber fraud", "theft", "robbery", "burglary", "assault", "murder", 
                "kidnapping", "narcotics", "forgery", "extortion", "cheating", "fraud"
            )
            if x in text.lower() and not (x == "fraud" and "cyber fraud" in text.lower())
        ]
        
        # spaCy entities
        nlp = _get_spacy()
        if nlp is not None:
            doc = nlp(text)
            for e in doc.ents:
                val = e.text.strip()
                if not val:
                    continue
                if e.label_ == "PERSON":
                    out["name"].append(val)
                elif e.label_ in {"GPE", "LOC", "FAC"}:
                    out["location"].append(val)
                elif e.label_ == "ORG":
                    out["organization"].append(val)
                    
        return ParsedCrimeData(**{k: list(dict.fromkeys(map(str, v))) for k, v in out.items()})
