export const ENDPOINTS = {
  // ==========================
  // Authentication
  // ==========================
  AUTH: {
    LOGIN: "/auth/login",
  },

  // ==========================
  // Core APIs
  // ==========================
  CORE: {
    FIRS: "/core/firs",
    CRIMES: "/core/crimes",
    OFFICERS: "/core/officers",
    DISTRICTS: "/core/districts",
    EVIDENCE: "/core/evidence",
  },

  // ==========================
  // Analytics APIs
  // ==========================
  ANALYTICS: {
    DASHBOARD_STATS: "/analytics/dashboard/stats",
    CRIMES_BY_CATEGORY: "/analytics/dashboard/crimes-by-category",
    CRIMES_BY_DISTRICT: "/analytics/dashboard/crimes-by-district",
    MONTHLY_STATS: "/analytics/dashboard/monthly-stats",
    OFFICER_WORKLOAD: "/analytics/dashboard/officer-workload",

    GIS_HEATMAP: "/analytics/gis/heatmap",
    GIS_CLUSTERING: "/analytics/gis/clustering",

    NETWORK: "/analytics/network/suspects",

    SEARCH: "/analytics/search",
  },

  // ==========================
  // AI APIs
  // ==========================
  AI: {
    ASSISTANT: "/ai/assistant",
    OCR: "/ai/ocr",
    REPORT: "/ai/report",
    TRANSLATE: "/ai/translate",
  },
} as const;
