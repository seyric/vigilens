import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

/* ============================
   Request Types
============================ */

export interface LoginRequest {
  username: string;
  password?: string;
  rank: string;
  district: string;
}

/* ============================
   Response Types
============================ */

export interface LoginResponse {
  user: {
    id: string;
    role: number;
    district_id: string;
    station_id: string;
    is_active: boolean;
  };
  token: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

/* ============================
   Authentication API
============================ */

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  return response.data;
}