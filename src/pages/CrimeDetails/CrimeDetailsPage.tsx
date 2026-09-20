import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CheckCircle2, X } from "lucide-react";
import PageLoader from "../../components/ui/PageLoader";
import {
  CrimeHeader,
  CrimeTabs,
  CaseInformationCard,
  CaseSummaryCard,
  AISummaryCard,
  Timeline,
  EvidenceCard,
  VictimCard,
  AccusedCard,
  VehicleCard,
  QuickActions,
} from "./components";
import { getFIRDetails } from "../../api/core.api";

function CrimeDetailsPage() {
  const { crimeId } = useParams<{ crimeId: string }>();
  const navigate = useNavigate();
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

  // Tab Switcher Active state
  const [activeTab, setActiveTab] = useState("Overview");

  const [firDetails, setFirDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (!crimeId) return;
      try {
        setError(null);
        setLoading(true);
        const data = await getFIRDetails(crimeId);
        setFirDetails(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load case file details.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [crimeId]);

  // Normalizers and Mappers
  let mappedStatus: "Active" | "Investigating" | "Closed" = "Active";
  const rawStat = (firDetails?.status || "").toLowerCase();
  if (rawStat.includes("investig")) mappedStatus = "Investigating";
  else if (rawStat.includes("close")) mappedStatus = "Closed";

  let mappedSeverity: "High" | "Medium" | "Low" = "Medium";
  const rawSev = (firDetails?.severity || "").toLowerCase();
  if (rawSev === "high" || rawSev === "critical") mappedSeverity = "High";
  else if (rawSev === "low") mappedSeverity = "Low";

  let dateStr = firDetails?.fir_date || "13 May 2025, 14:30";
  if (typeof firDetails?.fir_date === "string") {
    const date = new Date(firDetails.fir_date);
    if (!isNaN(date.getTime())) {
      dateStr = date.toLocaleString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  const caseHeader = {
    fir: firDetails?.fir_number || crimeId || "FIR123456",
    caseType:
      (firDetails?.type || firDetails?.crime_type || "Theft Case") + " File",
    status: mappedStatus,
  };

  const caseInformation = {
    fir: firDetails?.fir_number || crimeId || "FIR123456",
    crimeType: firDetails?.type || firDetails?.crime_type || "Theft",
    dateTime: dateStr,
    district:
      firDetails?.district_name || firDetails?.district || "Bengaluru Urban",
    station: firDetails?.station_name || firDetails?.station || "JC Nagar",
    officer: firDetails?.investigating_officer_name || "Inspector Ramesh",
    status: mappedStatus,
    severity: mappedSeverity,
  };

  const caseSummary = {
    summaryText:
      firDetails?.complaint_details ||
      "A residential burglary involving forced entry was reported in Bengaluru Urban. Cash, jewellery and electronic devices were stolen. Investigation is currently underway.",
    estimatedLoss: "₹4.5 Lakhs",
    category: "Property Crime",
  };

  const aiInsights = [
    "Similar burglary pattern found in two nearby FIRs.",
    "Vehicle KA01AB1234 appears in another investigation.",
    "Nearby CCTV cameras should be reviewed.",
    "Fingerprints matched partially.",
  ];

  const accusedData = {
    name: "Ravi Kumar",
    age: 34,
    riskScore: "High (92%)",
    status: "Detained",
  };

  const victimData = {
    name: firDetails?.complainant_name || "Suresh Babu",
    age: 43,
    address: "12th Cross, JC Nagar, Bengaluru",
    contact: "+91 98450 12345",
  };

  const vehicleData = {
    registration: "KA01AB1234",
    type: "White Swift Hatchback",
    owner: "Aniket Sharma",
  };

  // Action Panel handlers
  const handleQuickAction = async (actionName: string) => {
    if (actionName === "Open Investigation") {
      navigate("/investigation");
    } else if (actionName === "View Criminal Network") {
      navigate("/criminal-network");
    } else if (actionName === "Ask AI Assistant") {
      addNotification("Connecting to Vigilens Assistant...");
      setTimeout(() => navigate("/digital-intelligence"), 1000);
    } else if (actionName === "Assign Officer") {
      addNotification(
        `Case ${caseHeader.fir} successfully assigned to Inspector Ramesh for immediate field review.`,
      );
    } else if (actionName === "Generate Report") {
      if (!crimeId) return;
      addNotification("Generating official PDF dossier...");
      try {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(0, 0, 100);
        doc.text("VIGILENS", 14, 22);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("CRIME INVESTIGATION DOSSIER", 14, 30);

        doc.setFontSize(11);
        doc.text(`FIR Number: ${caseHeader.fir}`, 14, 40);
        doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 46);

        doc.setFontSize(12);
        doc.text("Case Summary", 14, 56);
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const splitSummary = doc.splitTextToSize(caseSummary.summaryText, 180);
        doc.text(splitSummary, 14, 62);

        let currentY = 62 + splitSummary.length * 5 + 5;

        autoTable(doc, {
          startY: currentY,
          head: [["Parameter", "Detail"]],
          body: [
            ["Crime Type", caseInformation.crimeType],
            ["District", caseInformation.district],
            ["Station", caseInformation.station],
            ["Officer", caseInformation.officer],
            ["Status", caseInformation.status],
            ["Estimated Loss", caseSummary.estimatedLoss],
          ],
          theme: "grid",
          headStyles: { fillColor: [37, 99, 235] },
          styles: { fontSize: 9 },
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("AI Insights", 14, currentY);
        currentY += 6;
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        aiInsights.forEach((insight) => {
          doc.text(`• ${insight}`, 14, currentY);
          currentY += 5;
        });

        doc.save(
          `Crime_Dossier_${caseHeader.fir.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        );
        addNotification("PDF Dossier successfully downloaded.");
      } catch (err) {
        console.error(err);
        addNotification("Failed to generate PDF report.");
      }
    }
  };

  if (loading) {
    return <PageLoader message="Loading case details..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[#EF4444] font-mono text-sm tracking-widest">
        {error}
      </div>
    );
  }

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
                System Notice
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
      <div className="border-b border-[rgba(255,255,255,0.06)] pb-5 select-none">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
          Crime Details
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-mono mt-1">
          View complete case information, evidence and investigation progress.
        </p>
      </div>

      {/* 2. Top Case Header Badge Card */}
      <CrimeHeader {...caseHeader} />

      {/* 3. Detail Navigation Tabs */}
      <CrimeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. Tab Workspace Layout */}
      {activeTab === "Overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
          {/* Left / Center Panels (75% width on large screens) */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            {/* Top Cards Row: Information, Summary & AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CaseInformationCard {...caseInformation} />
              <CaseSummaryCard {...caseSummary} />
              <AISummaryCard insights={aiInsights} />
            </div>

            {/* Timeline Row */}
            <Timeline />

            {/* Bottom Row: Evidence, Suspects and Victims details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EvidenceCard />
              <AccusedCard {...accusedData} />
              <VictimCard {...victimData} />
              <VehicleCard {...vehicleData} />
            </div>
          </div>

          {/* Right Sticky Operations Panel (25% width on large screens) */}
          <div className="col-span-1">
            <QuickActions onAction={handleQuickAction} />
          </div>
        </div>
      ) : (
        /* Alternate Tabs Stand-in View */
        <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 text-center animate-fade-in">
          <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono mb-2">
            {activeTab} Registry Workspace
          </h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
            Authorized access only. Case logs list for {caseHeader.fir}{" "}
            {activeTab.toLowerCase()} reports are securely mapped.
          </p>
          <button
            onClick={() => setActiveTab("Overview")}
            className="mt-6 text-[9px] font-mono font-bold tracking-widest text-[#2563EB] hover:text-white hover:bg-[#2563EB] border border-[#2563EB]/40 bg-transparent px-4 py-2 rounded-lg transition-all duration-150 uppercase"
          >
            Go back to Overview
          </button>
        </div>
      )}
    </div>
  );
}

export default CrimeDetailsPage;
