import { useState, useRef, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import apiClient from "../../api/client";
import { PageHeader } from "../../components/ui/DashboardComponents";
import {
  InvestigationIngestion,
  FeaturedSimilarCase,
  SimilarityAnalysis,
  PatternComparison,
  SimilarCasesTable,
  AIInsightCard,
  RecommendedActions,
} from "./components";
import type {
  SimilarityCaseData,
  MatchingFactor,
  ComparisonAttribute,
} from "./components";

// Define the full catalog of simulated matching templates
const CASE_MATCHES_DATABASE: Record<
  string,
  {
    featured: SimilarityCaseData;
    factors: MatchingFactor[];
    attributes: ComparisonAttribute[];
    insight: string;
    similarCatalog: SimilarityCaseData[];
  }
> = {
  "FIR-2024-119": {
    featured: {
      caseId: "FIR-2023-908",
      crimeType: "Burglary",
      district: "Bengaluru Urban",
      similarityScore: 93,
      status: "Solved",
      confidenceLevel: "Very High",
      date: "14-NOV-2023",
      officer: "Inspector Ramesh",
    },
    factors: [
      {
        factor: "Same Weapon Type",
        confidence: 95,
        matched: true,
        desc: "Heavy iron pry-bars identified in both toolmark casts.",
      },
      {
        factor: "Similar Entry Point",
        confidence: 92,
        matched: true,
        desc: "Forced rear sliding window latch tampering.",
      },
      {
        factor: "Similar Escape Route",
        confidence: 88,
        matched: true,
        desc: "Bypass exit leading toward national highway exit.",
      },
      {
        factor: "Same Crime Category",
        confidence: 100,
        matched: true,
        desc: "Classified under residential burglaries.",
      },
      {
        factor: "Similar Time Window",
        confidence: 85,
        matched: true,
        desc: "Midnight to 03:00 AM heist execution.",
      },
      {
        factor: "Similar Target Type",
        confidence: 90,
        matched: true,
        desc: "Unoccupied independent villas.",
      },
    ],
    attributes: [
      {
        attributeName: "Crime Method",
        sourceValue: "Forced window lock tampering",
        matchValue: "Forced patio window jimmying",
        correlation: 94,
      },
      {
        attributeName: "Weapon",
        sourceValue: "Iron Rod (EV-901)",
        matchValue: "Heavy pry-bar toolmarks",
        correlation: 90,
      },
      {
        attributeName: "Victim Profile",
        sourceValue: "Independent villa owner",
        matchValue: "Ground floor residential bungalow",
        correlation: 95,
      },
      {
        attributeName: "Entry Point",
        sourceValue: "Rear sliding glass window",
        matchValue: "Back door sliding pane",
        correlation: 92,
      },
      {
        attributeName: "Escape Route",
        sourceValue: "J.C. Nagar bypass road",
        matchValue: "Bypass road highway junction",
        correlation: 100,
      },
      {
        attributeName: "Vehicle",
        sourceValue: "White Swift hatchback",
        matchValue: "White sedan spotted on ANPR",
        correlation: 82,
      },
      {
        attributeName: "Time Pattern",
        sourceValue: "01:00 AM - 03:00 AM",
        matchValue: "Midnight - 02:00 AM",
        correlation: 88,
      },
      {
        attributeName: "Location Pattern",
        sourceValue: "J.C. Nagar sector 4",
        matchValue: "J.C. Nagar sector 2",
        correlation: 98,
      },
    ],
    insight:
      "Vigilens identified strong behavioural similarities with previously investigated burglary cases. The operational method, geographical movements, and late-night timing indicators overlap with a known pattern. Further investigation into communication logs is recommended.",
    similarCatalog: [
      {
        caseId: "FIR-2023-908",
        crimeType: "Burglary",
        district: "Bengaluru Urban",
        similarityScore: 93,
        status: "Solved",
        confidenceLevel: "Very High",
        date: "14-NOV-2023",
        officer: "Inspector Ramesh",
      },
      {
        caseId: "FIR-2023-742",
        crimeType: "Burglary",
        district: "Bengaluru Urban",
        similarityScore: 82,
        status: "Solved",
        confidenceLevel: "High",
        date: "02-SEP-2023",
        officer: "Inspector Ramesh",
      },
      {
        caseId: "FIR-2023-551",
        crimeType: "Burglary",
        district: "Mysuru Central",
        similarityScore: 74,
        status: "Pending Trial",
        confidenceLevel: "Medium",
        date: "12-JUN-2023",
        officer: "Sub-Inspector Anil",
      },
      {
        caseId: "FIR-2023-201",
        crimeType: "Theft",
        district: "Bengaluru Urban",
        similarityScore: 68,
        status: "Solved",
        confidenceLevel: "Medium",
        date: "08-MAR-2023",
        officer: "Inspector Ramesh",
      },
    ],
  },
  "FIR-2024-204": {
    featured: {
      caseId: "FIR-2023-412",
      crimeType: "Robbery",
      district: "Hubballi Rural",
      similarityScore: 88,
      status: "Solved",
      confidenceLevel: "High",
      date: "19-JUL-2023",
      officer: "Inspector Girish",
    },
    factors: [
      {
        factor: "Same Crime Category",
        confidence: 100,
        matched: true,
        desc: "Classified under highway cargo hijacks.",
      },
      {
        factor: "Similar Time Window",
        confidence: 90,
        matched: true,
        desc: "Late night highway blocking events.",
      },
      {
        factor: "Similar Escape Route",
        confidence: 82,
        matched: true,
        desc: "Direct escape route via regional bypass corridors.",
      },
      {
        factor: "Similar Geographic Pattern",
        confidence: 95,
        matched: true,
        desc: "Spotted on Hubballi highway sector ANPR.",
      },
      {
        factor: "Same Target Type",
        confidence: 88,
        matched: true,
        desc: "Commercial logistics transit vans.",
      },
      {
        factor: "Similar Behavioural Pattern",
        confidence: 84,
        matched: true,
        desc: "Tampering vehicle tags preceding the heist.",
      },
    ],
    attributes: [
      {
        attributeName: "Crime Method",
        sourceValue: "Blocking cargo truck with car",
        matchValue: "Highway road block intercept",
        correlation: 92,
      },
      {
        attributeName: "Weapon",
        sourceValue: "Threat of tactical blades",
        matchValue: "Forced knife-point threat",
        correlation: 85,
      },
      {
        attributeName: "Victim Profile",
        sourceValue: "Logistics cargo truck driver",
        matchValue: "Logistics transport driver",
        correlation: 90,
      },
      {
        attributeName: "Entry Point",
        sourceValue: "Driver side window smash",
        matchValue: "Cab door force open",
        correlation: 80,
      },
      {
        attributeName: "Escape Route",
        sourceValue: "Hubballi bypass corridor east",
        matchValue: "Bypass exit leading north",
        correlation: 96,
      },
      {
        attributeName: "Vehicle",
        sourceValue: "Hatchback blocking path",
        matchValue: "Hatchback blocking path",
        correlation: 100,
      },
      {
        attributeName: "Time Pattern",
        sourceValue: "10:00 PM - 01:00 AM",
        matchValue: "11:00 PM - 02:00 AM",
        correlation: 91,
      },
      {
        attributeName: "Location Pattern",
        sourceValue: "Hubballi bypass junction",
        matchValue: "Hubballi bypass junction",
        correlation: 98,
      },
    ],
    insight:
      "Vigilens flags high similarity to logistics robbery groups. The signature use of a blocking vehicle during night shifts matches a past case history profile. Surveillance operations on nearby rest stops are recommended.",
    similarCatalog: [
      {
        caseId: "FIR-2023-412",
        crimeType: "Robbery",
        district: "Hubballi Rural",
        similarityScore: 88,
        status: "Solved",
        confidenceLevel: "High",
        date: "19-JUL-2023",
        officer: "Inspector Girish",
      },
      {
        caseId: "FIR-2023-288",
        crimeType: "Robbery",
        district: "Hubballi Rural",
        similarityScore: 81,
        status: "Under Investigation",
        confidenceLevel: "High",
        date: "04-MAY-2023",
        officer: "Inspector Girish",
      },
      {
        caseId: "FIR-2023-119",
        crimeType: "Theft",
        district: "Dharwad Urban",
        similarityScore: 71,
        status: "Pending Trial",
        confidenceLevel: "Medium",
        date: "11-FEB-2023",
        officer: "Inspector Satish",
      },
    ],
  },
  "FIR-2024-305": {
    featured: {
      caseId: "FIR-2023-772",
      crimeType: "Robbery",
      district: "Mysuru Central",
      similarityScore: 84,
      status: "Under Investigation",
      confidenceLevel: "High",
      date: "02-OCT-2023",
      officer: "Inspector Divya",
    },
    factors: [
      {
        factor: "Similar Target Type",
        confidence: 92,
        matched: true,
        desc: "Logistics parks and storage depots.",
      },
      {
        factor: "Similar Entry Point",
        confidence: 88,
        matched: true,
        desc: "Perimeter wire snip and roller shutter force.",
      },
      {
        factor: "Same Crime Category",
        confidence: 100,
        matched: true,
        desc: "Commercial storage warehouse break-ins.",
      },
      {
        factor: "Similar Time Window",
        confidence: 78,
        matched: true,
        desc: "Early morning shifts (02:00 - 05:00 AM).",
      },
      {
        factor: "Same Weapon Type",
        confidence: 94,
        matched: true,
        desc: "Tactical knives used to hold guards.",
      },
      {
        factor: "Similar Escape Route",
        confidence: 80,
        matched: true,
        desc: "Motorcycle escape through industrial lanes.",
      },
    ],
    attributes: [
      {
        attributeName: "Crime Method",
        sourceValue: "Warehouse fence cutter",
        matchValue: "Perimeter wire snip toolmarks",
        correlation: 91,
      },
      {
        attributeName: "Weapon",
        sourceValue: "Tactical folder knife",
        matchValue: "Heavy tactical blade threat",
        correlation: 94,
      },
      {
        attributeName: "Victim Profile",
        sourceValue: "Logistics watch supervisor",
        matchValue: "Security depot gate guard",
        correlation: 85,
      },
      {
        attributeName: "Entry Point",
        sourceValue: "Side metal roll-up shutter",
        matchValue: "Side loading bay door force",
        correlation: 88,
      },
      {
        attributeName: "Escape Route",
        sourceValue: "Industrial suburb bypass lanes",
        matchValue: "Logistics park bypass road",
        correlation: 82,
      },
      {
        attributeName: "Vehicle",
        sourceValue: "Pulsar motorbike escape",
        matchValue: "Two-wheeler getaway escape",
        correlation: 90,
      },
      {
        attributeName: "Time Pattern",
        sourceValue: "02:00 AM - 04:00 AM",
        matchValue: "03:00 AM - 05:00 AM",
        correlation: 80,
      },
      {
        attributeName: "Location Pattern",
        sourceValue: "Mysuru industrial yard",
        matchValue: "Mysuru logistics suburb",
        correlation: 89,
      },
    ],
    insight:
      "Warehouse break-in signatures exhibit a high correlation with local industrial park cargo thefts. The specialized entry method using cutter tools and motorcycle escapes suggests Vikram Malhotra's crew. Cross-referencing ANPR logs for grey motorbikes is recommended.",
    similarCatalog: [
      {
        caseId: "FIR-2023-772",
        crimeType: "Robbery",
        district: "Mysuru Central",
        similarityScore: 84,
        status: "Under Investigation",
        confidenceLevel: "High",
        date: "02-OCT-2023",
        officer: "Inspector Divya",
      },
      {
        caseId: "FIR-2023-601",
        crimeType: "Theft",
        district: "Mysuru Central",
        similarityScore: 78,
        status: "Solved",
        confidenceLevel: "High",
        date: "11-AUG-2023",
        officer: "Inspector Divya",
      },
      {
        caseId: "FIR-2023-314",
        crimeType: "Burglary",
        district: "Chamarajanagar",
        similarityScore: 69,
        status: "Solved",
        confidenceLevel: "Medium",
        date: "15-APR-2023",
        officer: "Sub-Inspector Raju",
      },
    ],
  },
  "FIR-2024-411": {
    featured: {
      caseId: "FIR-2023-991",
      crimeType: "Cyber Fraud",
      district: "Bengaluru Urban",
      similarityScore: 91,
      status: "Pending Trial",
      confidenceLevel: "Very High",
      date: "28-NOV-2023",
      officer: "Inspector Sneha",
    },
    factors: [
      {
        factor: "Same Crime Category",
        confidence: 100,
        matched: true,
        desc: "Classified under banking phishing frauds.",
      },
      {
        factor: "Similar Behavioural Pattern",
        confidence: 94,
        matched: true,
        desc: "Using cryptocurrency mixers to wash funds.",
      },
      {
        factor: "Same Target Type",
        confidence: 92,
        matched: true,
        desc: "Retail banking depositors and consumers.",
      },
      {
        factor: "Similar Geographic Pattern",
        confidence: 78,
        matched: true,
        desc: "Hosted on remote proxy servers.",
      },
      {
        factor: "Same Weapon Type",
        confidence: 96,
        matched: true,
        desc: "Banking portal spoof scripting.",
      },
      {
        factor: "Similar Time Window",
        confidence: 82,
        matched: true,
        desc: "Outbound campaigns during banking hours.",
      },
    ],
    attributes: [
      {
        attributeName: "Crime Method",
        sourceValue: "Phishing login credential theft",
        matchValue: "Bank portal credential spoofing",
        correlation: 95,
      },
      {
        attributeName: "Weapon",
        sourceValue: "Outbound blast SMS gate",
        matchValue: "SMS gateway phishing API",
        correlation: 96,
      },
      {
        attributeName: "Victim Profile",
        sourceValue: "Retail depositors accounts",
        matchValue: "Local banking card holders",
        correlation: 92,
      },
      {
        attributeName: "Entry Point",
        sourceValue: "Fake bank domain campaign",
        matchValue: "Spoofed portal gateway log",
        correlation: 90,
      },
      {
        attributeName: "Escape Route",
        sourceValue: "Crypto mixer contract address",
        matchValue: "Smart contract coin wash pools",
        correlation: 94,
      },
      {
        attributeName: "Vehicle",
        sourceValue: "N/A (Digital routing)",
        matchValue: "N/A (Digital VPN)",
        correlation: 100,
      },
      {
        attributeName: "Time Pattern",
        sourceValue: "10:00 AM - 04:00 PM",
        matchValue: "09:00 AM - 05:00 PM",
        correlation: 98,
      },
      {
        attributeName: "Location Pattern",
        sourceValue: "Remote proxy servers",
        matchValue: "VPN server address logs",
        correlation: 91,
      },
    ],
    insight:
      "The cyber fraud signature shows an active banking phishing cluster. The use of crypto mixers to wash proceeds, outbound SMS blast gates, and specific web spoof scripts align with Kiran Gowda's technical profile. Recommend tracking server logs and registrar registries.",
    similarCatalog: [
      {
        caseId: "FIR-2023-991",
        crimeType: "Cyber Fraud",
        district: "Bengaluru Urban",
        similarityScore: 91,
        status: "Pending Trial",
        confidenceLevel: "Very High",
        date: "28-NOV-2023",
        officer: "Inspector Sneha",
      },
      {
        caseId: "FIR-2023-810",
        crimeType: "Cyber Fraud",
        district: "Bengaluru Urban",
        similarityScore: 83,
        status: "Solved",
        confidenceLevel: "High",
        date: "15-OCT-2023",
        officer: "Inspector Sneha",
      },
      {
        caseId: "FIR-2023-455",
        crimeType: "Cyber Fraud",
        district: "Mangaluru Urban",
        similarityScore: 76,
        status: "Solved",
        confidenceLevel: "Medium",
        date: "10-JUN-2023",
        officer: "Sub-Inspector Kumar",
      },
    ],
  },
};

export function AICrimePatternSimilarityPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTabSelected, setActiveTabSelected] = useState<string | null>(
    null,
  );
  const [activeMatch, setActiveMatch] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);

  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCaseSelected = async (caseData: any, isUploaded = false) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAnalyzing(true);
    setSelectedCaseId(null);
    setActiveMatch(null);

    if (isUploaded && caseData instanceof File) {
      try {
        const formData = new FormData();
        formData.append("file", caseData);
        const envBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
        const baseUrl = envBaseUrl.replace("/api/v1", "");
        const res = await apiClient.post(
          `${baseUrl}/api/crime-pattern/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        const data = res.data;
        const similarCatalog: any[] = [];

        if (data.matched_records) {
          for (const key of Object.keys(data.matched_records)) {
            data.matched_records[key].forEach((rec: any) => {
              similarCatalog.push({
                caseId:
                  rec.fir_number ||
                  rec.suspect_id ||
                  rec.vehicle_id ||
                  `REC-${key}`,
                crimeType: rec.category_name || rec.description || key,
                district: rec.district_name || "DB Match",
                similarityScore: 100,
                status: rec.status || "Verified Match",
                confidenceLevel: "Very High",
                date: rec.incident_date || "N/A",
                officer: rec.investigating_officer || "N/A",
              });
            });
          }
        }

        if (data.similar_matches) {
          data.similar_matches.forEach((sm: any) => {
            similarCatalog.push({
              caseId:
                sm.record?.full_name ||
                sm.record?.registration_number ||
                `SIM-${sm.dataset}`,
              crimeType: "Fuzzy Match",
              district: sm.dataset,
              similarityScore: sm.similarity_percentage,
              status: "Potential Link",
              confidenceLevel:
                sm.similarity_percentage > 80 ? "High" : "Medium",
              date: "N/A",
              officer: "N/A",
            });
          });
        }

        const featured =
          similarCatalog.length > 0
            ? similarCatalog[0]
            : {
                caseId: "NO-MATCH",
                crimeType: "N/A",
                district: "N/A",
                similarityScore: 0,
                status: "N/A",
                confidenceLevel: "Low",
                date: "N/A",
                officer: "N/A",
              };

        const factors = data.parsed_data
          ? Object.keys(data.parsed_data)
              .filter(
                (k) =>
                  Array.isArray(data.parsed_data[k]) &&
                  data.parsed_data[k].length > 0,
              )
              .map((k) => ({
                factor: `Extracted ${k}`,
                confidence: 95,
                matched: true,
                desc: `Found: ${data.parsed_data[k].join(", ")}`,
              }))
          : [];

        setActiveMatch({
          featured,
          factors,
          attributes: [],
          insight:
            data.ai_summary ||
            `Processed file ${data.filename} in ${data.processing_time_ms}ms. ${similarCatalog.length} records found in Postgres DB.`,
          similarCatalog,
        });
        setSelectedCaseId(data.filename);
      } catch (err) {
        console.error("API Error", err);
        alert("Failed to connect to Crime Pattern Analyzer backend.");
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      timerRef.current = setTimeout(() => {
        setIsAnalyzing(false);
        setSelectedCaseId(caseData as string);
        setActiveMatch(CASE_MATCHES_DATABASE[caseData as string]);
      }, 1200);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleGenerateReport = () => {
    if (!selectedCaseId) return;
    addNotification(
      `[DOSSIER EXPORT] Compiling similarity match report dossier for target: ${selectedCaseId}. Report saved successfully to encrypted KSP drive folder.`,
    );
  };

  const handleAssignInvestigation = () => {
    if (!selectedCaseId) return;
    addNotification(
      `[OPERATION SUCCESS] Alert dispatched to Inspector Ramesh. Case links flagged on assignment board.`,
    );
  };

  const handleExportAnalysis = () => {
    if (!selectedCaseId || !activeMatch) return;

    // Create new PDF instance
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 100);
    doc.text("VIGILENS", 14, 22);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("CRIME PATTERN ANALYSIS DOSSIER", 14, 30);

    // Target Information
    doc.setFontSize(11);
    doc.text(`Target Case Scope: ${selectedCaseId}`, 14, 40);
    doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 46);

    // AI Insight Summary
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text("AI Behavioural Summary", 14, 56);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitInsight = doc.splitTextToSize(
      activeMatch.insight || "No insight generated.",
      180,
    );
    doc.text(splitInsight, 14, 62);

    let currentY = 62 + splitInsight.length * 5 + 5;

    // Matching Factors Table
    if (activeMatch.factors && activeMatch.factors.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Matching Factor", "Confidence", "Description"]],
        body: activeMatch.factors.map((f: any) => [
          f.factor,
          `${f.confidence}%`,
          f.desc,
        ]),
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Similar Cases Link Matrix Table
    if (activeMatch.similarCatalog && activeMatch.similarCatalog.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Case ID", "Crime Type", "District", "Similarity", "Status"]],
        body: activeMatch.similarCatalog.map((c: any) => [
          c.caseId,
          c.crimeType,
          c.district,
          `${c.similarityScore}%`,
          c.status,
        ]),
        theme: "grid",
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9 },
      });
    }

    // Save PDF
    doc.save(
      `Vigilens_Analysis_Report_${selectedCaseId.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
    );

    addNotification(
      `[EXPORT SUCCESS] PDF analysis dossier successfully compiled and downloaded for target: ${selectedCaseId}.`,
    );
  };

  return (
    <div className="space-y-6 animate-fade-in select-none relative">
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="animate-slide-up flex items-start gap-3 bg-[#0B1220] border border-[#10B981]/30 p-4 rounded-xl shadow-2xl max-w-sm w-full relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981]"></div>
            <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-[#10B981] text-xs font-bold tracking-wider uppercase mb-1">
                Success
              </h4>
              <p className="text-[#94A3B8] text-xs leading-relaxed">
                {notif.message}
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notif.id),
                )
              }
              className="text-[#94A3B8]/50 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 1. Page Header Panel */}
      <PageHeader
        title="AI Crime Pattern Similarity"
        subtitle="Compare new investigations with historical crime records using AI-powered behavioural analysis"
        role="Intelligence Analyst"
      />

      {/* 2. Top Banner Alert */}
      <div className="bg-[#121826] border border-[rgba(255,255,255,0.06)] rounded-xl p-4.5 text-[11px] font-mono text-[#94A3B8]/90 leading-relaxed uppercase">
        <div className="flex items-center gap-2 text-[#2563EB] font-bold mb-1">
          <span>COGNITIVE MATCHING CORE // ACTIVE SERVICE</span>
        </div>
        Vigilens compares targets using semantic embeddings, ANPR vector spaces,
        cellular intersection logs, and crime methodology profiles rather than
        static text matches.
      </div>

      {/* 3. Ingestion Panel (Upload/Select) */}
      <InvestigationIngestion
        onCaseSelected={handleCaseSelected}
        isAnalyzing={isAnalyzing}
      />

      {/* 4. Matches & Analysis Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        {/* Left Column: Top Match profile (col-span-4) */}
        <div className="col-span-1 lg:col-span-4 h-full">
          <FeaturedSimilarCase
            matchCase={activeMatch ? activeMatch.featured : null}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Right Column: Match Factors (col-span-6) */}
        <div className="col-span-1 lg:col-span-6 h-full">
          <SimilarityAnalysis
            factors={activeMatch ? activeMatch.factors : null}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>

      {/* 5. Pattern comparisons Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        {/* Left 60% side: attribute comparison */}
        <div className="col-span-1 lg:col-span-6 h-full">
          <PatternComparison
            attributes={activeMatch ? activeMatch.attributes : null}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Right 40% side: AI insight report card */}
        <div className="col-span-1 lg:col-span-4 h-full">
          <AIInsightCard
            insight={activeMatch ? activeMatch.insight : null}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>

      {/* 6. Similar Cases List Table */}
      <SimilarCasesTable
        cases={activeMatch ? activeMatch.similarCatalog : null}
        isAnalyzing={isAnalyzing}
        onSelectCase={(id) => setActiveTabSelected(id)}
        selectedMatchId={activeTabSelected}
      />

      {/* 7. Action Button Controls Footer */}
      <RecommendedActions
        onGenerateReport={handleGenerateReport}
        onAssignInvestigation={handleAssignInvestigation}
        onExportAnalysis={handleExportAnalysis}
        hasData={!!selectedCaseId && !isAnalyzing}
        matchedCaseId={activeMatch ? activeMatch.featured.caseId : null}
      />
    </div>
  );
}

export default AICrimePatternSimilarityPage;
