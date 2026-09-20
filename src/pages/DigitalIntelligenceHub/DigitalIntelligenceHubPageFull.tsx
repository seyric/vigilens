import { useState, useRef } from "react";
import { PageHeader } from "../../components/ui/DashboardComponents";
import {
  EvidenceUploadPanel,
  AIProcessingPanel,
  ExtractedIntelligence,
  AIInvestigationSummary,
  RecommendedActions,
} from "./components";
import type { IntelligenceStats } from "./components";

const INITIAL_STATS: IntelligenceStats = {
  phoneNumbers: 0,
  emails: 0,
  ipAddresses: 0,
  devices: 0,
  locations: 0,
  people: 0,
  vehicles: 0,
  documents: 0,
};

export function DigitalIntelligenceHubPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [stats, setStats] = useState<IntelligenceStats>(INITIAL_STATS);
  const [summary, setSummary] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [sourceCount, setSourceCount] = useState<number | null>(null);

  // Keep a reference to the active simulation timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEvidenceSelected = async (file: File) => {
    // Clear any running simulation
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const fileName = file.name;
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setUploadedFileName(fileName);
    setStats({ ...INITIAL_STATS, documents: 1 });
    setSummary(null);
    setConfidenceScore(null);
    setSourceCount(null);

    // Analyze document and compare it to database formats
    let computedSimilarity = 0;
    try {
      if (
        file.type.includes("text") ||
        fileName.toLowerCase().endsWith(".json") ||
        fileName.toLowerCase().endsWith(".csv")
      ) {
        const text = await file.text();
        const keywords = [
          "fir",
          "crime",
          "date",
          "location",
          "suspect",
          "evidence",
          "district",
          "police",
          "report",
          "incident",
          "weapon",
          "witness",
        ];
        let matches = 0;
        keywords.forEach((kw) => {
          if (text.toLowerCase().includes(kw)) matches++;
        });
        computedSimilarity = Math.min(
          Math.floor((matches / keywords.length) * 100) + 25,
          99,
        );
      } else {
        // Binary files (PDF, Images, Video) simulated forensic hash analysis
        let hash = 0;
        for (let i = 0; i < fileName.length; i++) {
          hash = fileName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const baseSimilarity = Math.abs(hash % 40) + 40; // Base 40-80%
        let formatBoost = 0;
        if (fileName.toLowerCase().includes("fir")) formatBoost += 25;
        if (fileName.toLowerCase().includes("report")) formatBoost += 15;
        if (fileName.toLowerCase().includes("analysis")) formatBoost += 10;
        computedSimilarity = Math.min(baseSimilarity + formatBoost, 99);
      }
    } catch (err) {
      computedSimilarity = 72; // Fallback similarity score
    }

    // Simulate steps running sequentially
    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      setCurrentStepIndex(step);

      // Dynamically increment entity statistics at specific stages of analysis
      setStats((prev) => {
        const next = { ...prev };
        if (step === 1) {
          // OCR Extraction complete -> Metadata Analysis
          next.documents = 1;
        } else if (step === 2) {
          // Metadata Analysis complete -> Entity Recognition
          next.locations = 2;
        } else if (step === 3) {
          // Entity Recognition complete -> Timeline Reconstruction
          next.phoneNumbers = fileName.toLowerCase().includes("cdr") ? 28 : 12;
          next.emails = fileName.toLowerCase().includes("email") ? 14 : 4;
          next.people = 3;
        } else if (step === 4) {
          // Timeline Reconstruction complete -> Network Analysis
          next.locations = fileName.toLowerCase().includes("gps") ? 31 : 8;
        } else if (step === 5) {
          // Network Analysis complete -> Criminal Matching
          next.ipAddresses = fileName.toLowerCase().includes("log") ? 48 : 8;
          next.devices = 5;
        } else if (step === 6) {
          // Criminal Matching complete -> AI Summary Generation
          next.vehicles = 2;
          next.people = 7;
        }
        return next;
      });

      if (step >= 7) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsProcessing(false);

        // Generate customized summary depending on evidence content
        let customSummary =
          "The uploaded evidence has been analyzed successfully. Multiple entities, communication records, and location patterns have been detected. Several observations overlap with existing investigation records and may assist investigators in identifying potential relationships.";
        if (
          fileName.toLowerCase().includes("cdr") ||
          fileName.toLowerCase().includes("call")
        ) {
          customSummary = `Call Detail Record [${fileName}] parsed successfully. Extracted communication ties reveal recurring late-night links between suspect SIMs and 3 blacklisted burner numbers. Intersecting cellular towers place the handset within a 200m radius of the primary incident location at the estimated time of occurrence.`;
        } else if (
          fileName.toLowerCase().includes("gps") ||
          fileName.toLowerCase().includes("map")
        ) {
          customSummary = `GPS Location History data [${fileName}] processed. Identified travel speed changes and prolonged dwell-times. Plotting coordinates correlates to suspect location patterns overlapping with 2 other case timelines. System flags suspicious rendezvous at a logistics yard.`;
        } else if (
          fileName.toLowerCase().includes("chat") ||
          fileName.toLowerCase().includes("message")
        ) {
          customSummary = `Chat export transcript [${fileName}] decoded via NLP. Entity recognition flagged key conspiratorial keywords, weapon references, and scheduled meetup logistics. Cross-referencing reveals named associates matching active intelligence profiles.`;
        }

        setSummary(customSummary);
        // Set the dynamic database format similarity score computed earlier
        setConfidenceScore(computedSimilarity);
        setSourceCount(Math.floor(Math.random() * 25) + 24);
      }
    }, 850);
  };

  const handleGenerateReport = () => {
    if (!uploadedFileName) return;
    alert(
      `[FORENSIC EXPORT] Generating Official intelligence dossier for evidence target: ${uploadedFileName}\nCase report saved to local secure environment folder.`,
    );
  };

  const handleSaveSession = () => {
    if (!uploadedFileName) return;
    alert(
      `[SAVE SUCCESS] Forensics session for ${uploadedFileName} cached to Vigilens secure ledger.\nAuthorized officer session signed.`,
    );
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. Page Header Panel */}
      <PageHeader
        title="Digital Intelligence Hub"
        subtitle="Upload legally obtained digital evidence for AI-powered forensic analysis"
        role="Forensics Inspector"
      />

      {/* 2. Page Description Banner */}
      <div className="bg-[#121826] border border-[rgba(255,255,255,0.06)] rounded-xl p-4.5 text-[11px] font-mono text-[#94A3B8]/90 leading-relaxed uppercase select-none">
        <div className="flex items-center gap-2.5 text-[#2563EB] font-bold mb-1.5">
          <span>CLASSIFIED // AUTHORIZED KSP PERSONNEL ONLY</span>
        </div>
        Investigators are legally mandated to upload only seized evidence with
        active court warrants. All data actions, file metadata analysis, and
        report generation procedures are logged in compliance with the workspace
        forensics protocol.
      </div>

      {/* 3. Main Workspace: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <EvidenceUploadPanel
            onEvidenceSelected={handleEvidenceSelected}
            isProcessing={isProcessing}
          />
        </div>
        <div className="h-full">
          <AIProcessingPanel
            currentStepIndex={currentStepIndex}
            uploadedFileName={uploadedFileName}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* 4. Extracted Intelligence Panel */}
      <ExtractedIntelligence stats={stats} />

      {/* 5. AI Investigation Summary */}
      <AIInvestigationSummary
        summary={summary}
        confidenceScore={confidenceScore}
        sourceCount={sourceCount}
      />

      {/* 6. Recommended Actions */}
      <RecommendedActions
        onGenerateReport={handleGenerateReport}
        onSaveSession={handleSaveSession}
        hasData={!!uploadedFileName && !isProcessing}
      />
    </div>
  );
}

export default DigitalIntelligenceHubPage;
