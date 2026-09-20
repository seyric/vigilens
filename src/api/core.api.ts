import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

/* ============================
   Response Types
============================ */

export interface FIRRecord {
  fir_id: string;
  fir_number: string;
  fir_date: string;
  station_id: string;
  district_id: string;
  complainant_name: string;
  complaint_details: string;
  investigating_officer_id: string;
  status: string;
  severity: string;
}

export interface CrimeRecord {
  crime_id: string;
  fir_id: string;
  category_id: string;
  crime_description: string;
  modus_operandi: string;
  reported_at: string;
  severity: string;
}

export interface DistrictRecord {
  district_id: string;
  district_name: string;
  district_code: string;
  region: string;
  headquarters: string;
  boundary_geojson: string;
}

export interface OfficerRecord {
  officer_id: string;
  full_name: string;
  badge_number: string;
  rank: string;
  designation: string;
  station_id: string;
  district_id: string;
  status: string;
  specializations: string[];
  joined_at: string;
}

export interface EvidenceRecord {
  evidence_id: string;
  evidence_type: string;
  evidence_subtype: string;
  description: string;
  collected_by: string;
  storage_location: string;
  chain_of_custody: any;
}

export interface GetFIRsParams {
  station_id?: string;
  district_id?: string;
  status?: string;
  severity?: string;
}

/* ============================
   Core API Endpoints
============================ */

export async function getFIRs(params?: GetFIRsParams): Promise<FIRRecord[]> {
  const response = await apiClient.get<FIRRecord[]>(
    ENDPOINTS.CORE.FIRS,
    { params }
  );
  return response.data;
}

export async function getFIRDetails(fir_id: string): Promise<FIRRecord> {
  const response = await apiClient.get<FIRRecord>(
    `${ENDPOINTS.CORE.FIRS}/${fir_id}`
  );
  return response.data;
}

export async function getCrimes(): Promise<CrimeRecord[]> {
  const response = await apiClient.get<CrimeRecord[]>(
    ENDPOINTS.CORE.CRIMES
  );
  return response.data;
}

export async function getCrimeDetails(crime_id: string): Promise<CrimeRecord> {
  const response = await apiClient.get<CrimeRecord>(
    `${ENDPOINTS.CORE.CRIMES}/${crime_id}`
  );
  return response.data;
}

export async function getDistricts(): Promise<DistrictRecord[]> {
  const response = await apiClient.get<DistrictRecord[]>(
    ENDPOINTS.CORE.DISTRICTS
  );
  return response.data;
}

export async function getDistrictDetails(district_id: string): Promise<DistrictRecord> {
  const response = await apiClient.get<DistrictRecord>(
    `${ENDPOINTS.CORE.DISTRICTS}/${district_id}`
  );
  return response.data;
}

export async function getOfficers(): Promise<OfficerRecord[]> {
  const response = await apiClient.get<OfficerRecord[]>(
    ENDPOINTS.CORE.OFFICERS
  );
  return response.data;
}

export async function getOfficerDetails(officer_id: string): Promise<OfficerRecord> {
  const response = await apiClient.get<OfficerRecord>(
    `${ENDPOINTS.CORE.OFFICERS}/${officer_id}`
  );
  return response.data;
}

export async function getEvidence(): Promise<EvidenceRecord[]> {
  const response = await apiClient.get<EvidenceRecord[]>(
    ENDPOINTS.CORE.EVIDENCE
  );
  return response.data;
}

export async function getEvidenceDetails(evidence_id: string): Promise<EvidenceRecord> {
  const response = await apiClient.get<EvidenceRecord>(
    `${ENDPOINTS.CORE.EVIDENCE}/${evidence_id}`
  );
  return response.data;
}
