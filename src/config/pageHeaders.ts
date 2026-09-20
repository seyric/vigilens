export interface HeaderConfig {
  title: string;
  subtitle: string;
  role?: string;
}

export const PAGE_HEADERS: Record<string, HeaderConfig> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Real-Time Crime Intelligence Overview",
    role: "SCRB Analyst",
  },
  "/analytics": {
    title: "Crime Analytics",
    subtitle: "Crime Trends, Statistics & Predictive Insights",
    role: "SCRB Analyst",
  },
  "/crime-database": {
    title: "Crime Database",
    subtitle: "Search and Manage FIRs, Suspects & Investigation Records",
    role: "SCRB Analyst",
  },
  "/gis": {
    title: "GIS Intelligence",
    subtitle: "Geospatial Hotspots & Tactical Risk Mapping",
    role: "SCRB Analyst",
  },
  "/investigation": {
    title: "Investigation Workspace",
    subtitle: "Case Coordination, Suspect Profiles & Case Timeline",
    role: "SCRB Analyst",
  },
  "/investigation-diary": {
    title: "Officer Investigation Diary",
    subtitle: "Personal Case Logs, Notes & Daily Field Diary",
    role: "SCRB Analyst",
  },
  "/criminal-network": {
    title: "Criminal Network",
    subtitle: "Graph Relationship Mapping & Suspect Linkage",
    role: "SCRB Analyst",
  },
  "/ai-assistant": {
    title: "AI Intelligence",
    subtitle:
      "Automated Reasoning, Suspect Risk Profiling & Crime Pattern Synthesis",
    role: "SCRB Intelligence Unit",
  },
  "/voice-search": {
    title: "Voice Search",
    subtitle: "Voice-Activated Criminal Record & Case Query Engine",
    role: "SCRB Analyst",
  },
  "/multilingual-ai": {
    title: "Multilingual AI",
    subtitle: "Real-Time Vernacular FIR Translation & Legal Entity Mapping",
    role: "Vernacular Unit",
  },
  "/reports": {
    title: "FIR Upload & Evidence",
    subtitle: "Digital Evidence Intake & Document Verification",
    role: "SCRB Analyst",
  },
  "/ocr-review": {
    title: "OCR Review",
    subtitle: "Automated Document Scanning & Text Verification",
    role: "SCRB Analyst",
  },
  "/digital-intelligence": {
    title: "Digital Intelligence Hub",
    subtitle: "Legally Obtained Digital Evidence & Forensic Analysis",
    role: "Forensics Inspector",
  },
  "/crime-pattern-similarity": {
    title: "AI Crime Pattern Similarity",
    subtitle: "Modus Operandi Matching & Historical Pattern Intelligence",
    role: "Intelligence Analyst",
  },
  "/settings": {
    title: "System Settings",
    subtitle: "Configure Preferences and Operational Telemetry",
    role: "Administrator",
  },
  "/admin": {
    title: "Administration",
    subtitle: "Server, database, provider, and access control status",
    role: "System Administrator",
  },
};

export function getHeaderForPath(pathname: string): HeaderConfig {
  // Direct match
  if (PAGE_HEADERS[pathname]) {
    return PAGE_HEADERS[pathname];
  }

  // Dynamic route matches (e.g. /crime-database/:id)
  if (pathname.startsWith("/crime-database/")) {
    return {
      title: "Crime Details",
      subtitle: "Detailed Criminal Investigation Record",
      role: "SCRB Analyst",
    };
  }

  // Fallback defaults
  return {
    title: "Vigilens",
    subtitle: "AI Crime Intelligence Operating System",
    role: "SCRB Analyst",
  };
}
