import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

/* ============================
   Response Types
============================ */

export interface DashboardStatsResponse {
  total_firs: number;
  total_crimes: number;
  total_officers: number;
  clearance_rate_percent: number;
  arrest_rate_percent: number;
}

export interface DistrictCrimeRecord {
  district_name: string;
  crime_count: number;
}

export interface CategoryCrimeRecord {
  category_name: string;
  crime_count: number;
}

export interface MonthlyCrimeRecord {
  month: string;
  crime_count: number;
}

export interface OfficerWorkloadRecord {
  officer_name: string;
  assigned_firs: number;
}

export interface GisHeatmapRecord {
  district_name: string;
  boundary_geojson: string;
  firs: number;
}

export interface GisClusteringRecord {
  station_name: string;
  latitude: number;
  longitude: number;
  fir_count: number;
}

export interface SuspectNode {
  id: string;
  label: string;
  gender: string;
  status: string;
}

export interface SuspectEdge {
  source: string;
  target: string;
  relationship: string;
  notes: string;
}

export interface SuspectNetworkResponse {
  nodes: SuspectNode[];
  edges: SuspectEdge[];
}

export interface SearchFIRRecord {
  fir_id: string;
  fir_number: string;
  complainant_name: string;
  status: string;
}

export interface SearchCrimeRecord {
  crime_id: string;
  fir_number: string;
  severity: string;
  crime_description: string;
}

export interface SearchSuspectRecord {
  suspect_id: string;
  full_name: string;
  gender: string;
  status: string;
}

export interface SearchOfficerRecord {
  officer_id: string;
  full_name: string;
  badge_number: string;
  rank: string;
}

export interface GlobalSearchResponse {
  firs: SearchFIRRecord[];
  crimes: SearchCrimeRecord[];
  suspects: SearchSuspectRecord[];
  officers: SearchOfficerRecord[];
}

/* ============================
   Analytics API Endpoints
============================ */

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await apiClient.get<DashboardStatsResponse>(
    ENDPOINTS.ANALYTICS.DASHBOARD_STATS
  );
  return response.data;
}

export async function getCrimesByDistrict(): Promise<DistrictCrimeRecord[]> {
  const response = await apiClient.get<DistrictCrimeRecord[]>(
    ENDPOINTS.ANALYTICS.CRIMES_BY_DISTRICT
  );
  return response.data;
}

export async function getCrimesByCategory(): Promise<CategoryCrimeRecord[]> {
  const response = await apiClient.get<CategoryCrimeRecord[]>(
    ENDPOINTS.ANALYTICS.CRIMES_BY_CATEGORY
  );
  return response.data;
}

export async function getMonthlyStats(): Promise<MonthlyCrimeRecord[]> {
  const response = await apiClient.get<MonthlyCrimeRecord[]>(
    ENDPOINTS.ANALYTICS.MONTHLY_STATS
  );
  return response.data;
}

export async function getOfficerWorkload(): Promise<OfficerWorkloadRecord[]> {
  const response = await apiClient.get<OfficerWorkloadRecord[]>(
    ENDPOINTS.ANALYTICS.OFFICER_WORKLOAD
  );
  return response.data;
}

export async function getGisHeatmap(): Promise<GisHeatmapRecord[]> {
  const response = await apiClient.get<GisHeatmapRecord[]>(
    ENDPOINTS.ANALYTICS.GIS_HEATMAP
  );
  return response.data;
}

export async function getGisClustering(): Promise<GisClusteringRecord[]> {
  const response = await apiClient.get<GisClusteringRecord[]>(
    ENDPOINTS.ANALYTICS.GIS_CLUSTERING
  );
  return response.data;
}

export async function getSuspectNetwork(): Promise<SuspectNetworkResponse> {
  const response = await apiClient.get<SuspectNetworkResponse>(
    ENDPOINTS.ANALYTICS.NETWORK
  );
  return response.data;
}

export async function globalSearch(q: string): Promise<GlobalSearchResponse> {
  const response = await apiClient.get<GlobalSearchResponse>(
    ENDPOINTS.ANALYTICS.SEARCH,
    { params: { q } }
  );
  return response.data;
}
