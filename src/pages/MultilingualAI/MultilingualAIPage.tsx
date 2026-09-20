import { useEffect, useState } from "react";
import {
  Languages,
  Sparkles,
  FileText,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { translateText } from "../../api/ai.api";

interface SampleFIR {
  id: string;
  title: string;
  sourceLang: string;
  station: string;
  originalText: string;
  sourceLanguage:
    | "English"
    | "Kannada"
    | "Hindi"
    | "Tamil"
    | "Telugu"
    | "Malayalam"
    | "Marathi";
  legalEntities: {
    ipcSection: string;
    accused: string;
    victim: string;
    location: string;
    stolenAssets: string;
  };
}

const TARGET_LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { value: "Hindi", label: "Hindi" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Marathi", label: "Marathi" },
] as const;

type SupportedLanguage = (typeof TARGET_LANGUAGES)[number]["value"];

const SAMPLE_FIRS: SampleFIR[] = [
  {
    id: "fir-kn-01",
    title: "HUBBALLI PS - FIR #342/2025",
    sourceLang: "Kannada (ಕನ್ನಡ)",
    sourceLanguage: "Kannada",
    station: "Hubballi Suburban Police Station",
    originalText: `ದಿನಾಂಕ 14/05/2025 ರಂದು ರಾತ್ರಿ 01:30 ಗಂಟೆಯ ಸುಮಾರಿಗೆ ಹುಬ್ಬಳ್ಳಿ ಹಳೆ ಬಸ್ ನಿಲ್ದಾಣದ ಹತ್ತಿರವಿರುವ ಕೇಶವಾಪುರ ಪ್ರದೇಶದ ವಸತಿ ಗೃಹವೊಂದರಲ್ಲಿ ಕನ್ನಗಳ್ಳತನ ನಡೆದಿದೆ. ಆರೋಪಿ ರವಿ ಕುಮಾರ್ ಹಿಂಬಾಗಿಲನ್ನು ಮುರಿದು ಒಳನುಗ್ಗಿ 4.5 ಲಕ್ಷ ಮೌಲ್ಯದ ಚಿನ್ನದ ಆಭರಣಗಳನ್ನು ಹಾಗೂ 80,000 ನಗದನ್ನು ಕಳವು ಮಾಡಿದ್ದಾನೆ.`,
    legalEntities: {
      ipcSection: "IPC Section 457, 380 (Burglary)",
      accused: "Ravi Kumar",
      victim: "Suresh Babu",
      location: "Keshavapur, Hubballi Urban",
      stolenAssets: "Gold Ornaments (4.5 Lakhs), Cash (₹80,000)",
    },
  },
  {
    id: "fir-hi-02",
    title: "BELAGAVI RURAL - FIR #118/2025",
    sourceLang: "Hindi (हिंदी)",
    sourceLanguage: "Hindi",
    station: "Belagavi Border Control Unit",
    originalText: `दिनांक 10 मई 2025 को रात्रि 11:45 बजे बेलागावी राजमार्ग चेकपोस्ट पर एक संदिग्ध काले रंग की एसयूवी (KA-22-M-9081) को रोका गया। वाहन की तलाशी के दौरान अवैध हथियार और जाली भारतीय मुद्रा (₹2.5 लाख) बरामद की गई।`,
    legalEntities: {
      ipcSection: "IPC Section 489B, 489C (Counterfeit Currency)",
      accused: "Prakash Patil",
      victim: "Regional authority",
      location: "NH-48 Checkpost, Belagavi Rural",
      stolenAssets: "Fake Currency ₹2.5L, Unlicensed Pistol",
    },
  },
];

export default function MultilingualAIPage() {
  const [selectedFir, setSelectedFir] = useState<SampleFIR>(SAMPLE_FIRS[0]);
  const [selectedLang, setSelectedLang] =
    useState<SupportedLanguage>("Kannada");
  const [inputText, setInputText] = useState(SAMPLE_FIRS[0].originalText);
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const text = inputText.trim();

    if (!text) {
      setTranslatedText("");
      setTranslationError("Enter text to translate.");
      setIsTranslating(false);
      return undefined;
    }

    let isCurrentRequest = true;
    const timeoutId = window.setTimeout(async () => {
      setIsTranslating(true);
      setTranslationError("");

      try {
        const response = await translateText({
          text,
          sourceLanguage: selectedFir.sourceLanguage,
          targetLanguage: selectedLang,
        });

        if (isCurrentRequest) {
          setTranslatedText(response.translatedText);
        }
      } catch {
        if (isCurrentRequest) {
          setTranslatedText("");
          setTranslationError(
            "Translation could not be completed. Please try again.",
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsTranslating(false);
        }
      }
    }, 400);

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timeoutId);
    };
  }, [inputText, selectedFir.sourceLanguage, selectedLang]);

  const handleFirSelect = (fir: SampleFIR) => {
    setSelectedFir(fir);
    setInputText(fir.originalText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in select-none max-w-[1600px] mx-auto pb-12 font-sans">
      {/* SECTION 1: UPLOAD / SELECT FIR & LANGUAGE TOGGLE BAR */}
      <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2563EB]/15 border border-[#2563EB]/30 rounded-xl text-[#2563EB]">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Multilingual AI FIR Translator & Legal Information Extractor
              </h2>
              <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                Automatic Language Detection • Information Extraction • English
                ↔ Kannada Toggle
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#080D1A] border border-[rgba(255,255,255,0.08)] p-1.5 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase px-2">
              Display Language:
            </span>
            <select
              value={selectedLang}
              onChange={(event) =>
                setSelectedLang(event.target.value as SupportedLanguage)
              }
              aria-label="Translation target language"
              className="bg-transparent text-white font-bold outline-none cursor-pointer px-2 py-1"
            >
              {TARGET_LANGUAGES.map((language) => (
                <option
                  key={language.value}
                  value={language.value}
                  className="bg-[#080D1A]"
                >
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset FIR Selection Buttons */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold block">
            Select FIR Record to Translate & Extract:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_FIRS.map((fir) => (
              <button
                key={fir.id}
                onClick={() => handleFirSelect(fir)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                  selectedFir.id === fir.id
                    ? "bg-[#2563EB]/15 border-[#2563EB] text-white font-bold"
                    : "bg-[#080D1A] border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.15)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#2563EB]" />
                  <span>{fir.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded font-bold">
                    DETECTED: {fir.sourceLang}
                  </span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 ${selectedFir.id === fir.id ? "text-[#2563EB]" : "opacity-40"}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: TRANSLATED DASHBOARD & INFORMATION EXTRACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Original Vernacular Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Original FIR Input Document
              </h3>
              <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-2 py-0.5 rounded font-bold">
                AUTO-DETECTED: {selectedFir.sourceLang}
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              aria-label="FIR text to translate"
              className="w-full p-4 bg-[#080D1A] border border-[rgba(255,255,255,0.04)] rounded-xl text-xs leading-relaxed text-[#F8FAFC] font-mono min-h-[140px] resize-none outline-none"
            />
          </div>
        </div>

        {/* Right Column: Information Extraction in Selected Language */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0B1220] border border-[#2563EB]/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#2563EB]" />
                <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                  Extracted FIR Dashboard ({selectedLang})
                </h3>
              </div>

              <button
                onClick={handleCopy}
                className="bg-[#080D1A] hover:bg-[#182235] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>Copy</span>
              </button>
            </div>

            {/* Translated Statement */}
            <div className="p-4 bg-[#080D1A] border border-[#2563EB]/20 rounded-xl text-xs text-[#F8FAFC] leading-relaxed font-mono min-h-[140px]">
              {isTranslating
                ? "Translating..."
                : translationError || translatedText}
            </div>

            {/* Information Extraction Grid */}
            <div className="space-y-2 border-t border-[rgba(255,255,255,0.06)] pt-4">
              <h4 className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider">
                Extracted Legal Parameters:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#080D1A] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">
                    IPC / Offense Section
                  </span>
                  <span className="text-[#2563EB] font-bold block mt-0.5">
                    {selectedFir.legalEntities.ipcSection}
                  </span>
                </div>

                <div className="bg-[#080D1A] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">
                    Accused / Suspect
                  </span>
                  <span className="text-[#EF4444] font-bold block mt-0.5">
                    {selectedFir.legalEntities.accused}
                  </span>
                </div>

                <div className="bg-[#080D1A] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">
                    Victim / Complainant
                  </span>
                  <span className="text-[#10B981] font-bold block mt-0.5">
                    {selectedFir.legalEntities.victim}
                  </span>
                </div>

                <div className="bg-[#080D1A] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">
                    Stolen Property
                  </span>
                  <span className="text-[#F59E0B] font-bold block mt-0.5">
                    {selectedFir.legalEntities.stolenAssets}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
