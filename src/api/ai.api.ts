import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

/* ============================
   Request / Response Types
============================ */

export interface ParseImageOCRRequest {
  image_path: string;
}

export interface ParseImageOCRResponse {
  image_path: string;
  extracted_text: string;
}

export interface AskAIAssistantRequest {
  question: string;
}

export interface AskAIAssistantResponse {
  question: string;
  response: string;
}

export interface GenerateBriefReportRequest {
  fir_id: string;
}

export interface GenerateBriefReportResponse {
  fir_id: string;
  report: string;
}

export interface TranslateTextRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslateTextResponse {
  translatedText: string;
}

/* ============================
   AI API Endpoints
============================ */

export async function parseImageOCR(body: ParseImageOCRRequest): Promise<ParseImageOCRResponse> {
  const response = await apiClient.post<ParseImageOCRResponse>(
    ENDPOINTS.AI.OCR,
    body
  );
  return response.data;
}

export async function askAIAssistant(body: AskAIAssistantRequest): Promise<AskAIAssistantResponse> {
  const response = await apiClient.post<AskAIAssistantResponse>(
    ENDPOINTS.AI.ASSISTANT,
    body
  );
  return response.data;
}

export async function generateBriefReport(body: GenerateBriefReportRequest): Promise<GenerateBriefReportResponse> {
  const response = await apiClient.post<GenerateBriefReportResponse>(
    ENDPOINTS.AI.REPORT,
    body
  );
  return response.data;
}

export async function translateText(body: TranslateTextRequest): Promise<TranslateTextResponse> {
  const response = await apiClient.post<TranslateTextResponse>(
    ENDPOINTS.AI.TRANSLATE,
    body,
  );
  return response.data;
}
