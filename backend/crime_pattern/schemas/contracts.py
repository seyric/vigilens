from typing import Any
from pydantic import BaseModel, Field
class ParsedCrimeData(BaseModel):
    name:list[str]=Field(default_factory=list); phone:list[str]=Field(default_factory=list); vehicle:list[str]=Field(default_factory=list); bank_account:list[str]=Field(default_factory=list); email:list[str]=Field(default_factory=list); district:list[str]=Field(default_factory=list); police_station:list[str]=Field(default_factory=list); fir_no:list[str]=Field(default_factory=list); case_no:list[str]=Field(default_factory=list); crime_type:list[str]=Field(default_factory=list); date:list[str]=Field(default_factory=list); aadhaar:list[str]=Field(default_factory=list); pan:list[str]=Field(default_factory=list); location:list[str]=Field(default_factory=list); organization:list[str]=Field(default_factory=list)
class CrimePatternResponse(BaseModel):
    success:bool=True; filename:str; parsed_data:ParsedCrimeData; matched_records:dict[str,list[dict[str,Any]]]; similar_matches:list[dict[str,Any]]; ai_summary:str|None=None; processing_time_ms:int
