import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "react-router-dom";
import PageLoader from "../../components/ui/PageLoader";
import {
  GlobalSearch,
  InvestigationTabs,
  CaseOverviewCard,
  EntityCard,
  AIRecommendationCard,
  OfficerDiary,
} from "./components";
import apiClient from "../../api/client";

interface EntityAccused {
  type: "accused";
  name: string;
  age: number;
  role: string;
}

interface EntityVehicle {
  type: "vehicle";
  regNo: string;
  typeDesc: string;
}

interface EntityVictim {
  type: "victim";
  name: string;
  age: number;
  status: string;
}

type EntityItem = EntityAccused | EntityVehicle | EntityVictim;

function InvestigationPage() {
  const [searchParams] = useSearchParams();

  const initialTab =
    searchParams.get("diary") === "true"
      ? "Investigation Diary"
      : "Case Overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [firData, setFirData] = useState<any>(null);
  const [evidenceData, setEvidenceData] = useState<any[]>([]);
  const [crimesData, setCrimesData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [allFirs, setAllFirs] = useState<any[]>([]);
  const [firSearchText, setFirSearchText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [entitiesList, setEntitiesList] = useState<EntityItem[]>([
    { type: "accused", name: "Ravi Kumar", age: 34, role: "Primary Associate" },
    {
      type: "vehicle",
      regNo: "KA01AB1234",
      typeDesc: "White Swift • Seen at 12:15 PM",
    },
    { type: "victim", name: "Suresh Babu", age: 43, status: "Resident" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [firsRes, evidenceRes, crimesRes] = await Promise.all([
          apiClient.get("/core/firs"),
          apiClient.get("/core/evidence"),
          apiClient.get("/core/crimes"),
        ]);

        if (firsRes.data && firsRes.data.length > 0) {
          setAllFirs(firsRes.data);
          setFirData(firsRes.data[0]);
          setFirSearchText(firsRes.data[0].fir_number);
        }
        setEvidenceData(evidenceRes.data || []);
        setCrimesData(crimesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (firData) {
      setChatMessages([
        {
          role: "ai",
          content: `I am your AI Investigation Assistant. I have loaded context for case ${firData.fir_number}. How can I assist you with this case today?`,
        },
      ]);

      // Fetch entities for this specific FIR
      const fetchEntitiesForFir = async () => {
        try {
          const entitiesRes = await apiClient.get(
            `/core/entities?fir_id=${firData.fir_id}`,
          );
          if (entitiesRes.data) {
            const sus = entitiesRes.data.suspect;
            const veh = entitiesRes.data.vehicle;
            const vic = entitiesRes.data.victim;
            const newEntities: EntityItem[] = [];
            if (sus)
              newEntities.push({
                type: "accused",
                name: sus.full_name || "Unknown",
                age: 30,
                role: sus.status || "Suspect",
              });
            if (veh)
              newEntities.push({
                type: "vehicle",
                regNo: veh.registration_number || "Unknown",
                typeDesc: veh.vehicle_type || "Vehicle",
              });
            if (vic)
              newEntities.push({
                type: "victim",
                name: vic.full_name || "Unknown",
                age: 30,
                status: vic.injured ? "Injured" : "Resident",
              });
            setEntitiesList(newEntities.length > 0 ? newEntities : []);
          }
        } catch (err) {
          console.error("Failed to fetch entities for FIR", err);
          setEntitiesList([]);
        }
      };
      fetchEntitiesForFir();

      // Clear old AI insight for the new case
      setAiInsight("");
    }
  }, [firData]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: chatInput },
      {
        role: "ai",
        content: "Analyzing your request based on case context...",
      },
    ]);
    setChatInput("");
  };

  const caseData = firData
    ? {
        fir: firData.fir_number,
        caseType: "Criminal Offense", // Derived conceptually
        district: firData.district_name || firData.district_id || "Unknown",
        station: firData.station_name || firData.station_id || "Unknown",
        officer:
          firData.officer_name ||
          firData.investigating_officer_id ||
          "Unassigned",
        status: firData.status || "Under Investigation",
        severity: firData.severity || "Medium",
      }
    : {
        fir: "FIR123456",
        caseType: "Theft Case",
        district: "Bengaluru Urban",
        station: "JC Nagar",
        officer: "Inspector Ramesh",
        status: "Under Investigation",
        severity: "Medium",
      };

  const recommendations = [
    "Check CCTV at 3 nearby locations.",
    "Similar modus operandi detected in 3 cases.",
    "Verify accused’s mobile location.",
    "Vehicle linked to previous FIR.",
    "Cross-check fingerprints.",
  ];

  const handleInspectEntity = (item: EntityItem) => {
    if (item.type === "accused") setActiveTab("Suspects");
    else if (item.type === "vehicle") setActiveTab("Vehicles");
    else if (item.type === "victim") setActiveTab("Victims");
  };

  const handleAskAI = async () => {
    if (!firData) return;
    setAiLoading(true);
    setActiveTab("AI Insights");
    try {
      const res = await apiClient.post("/ai/report", {
        fir_id: firData.fir_id,
      });
      setAiInsight(res.data.report || "Generated AI Report data unavailable.");
    } catch (err) {
      console.error(err);
      setAiInsight(
        "Failed to generate AI Insights. Ensure the AI service is active.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  // UI rendering blocks for each tab
  const filteredCrimes = firData
    ? crimesData.filter((c) => c.fir_id === firData.fir_id)
    : crimesData;
  const filteredEvidence = firData
    ? evidenceData.filter((e) => e.fir_id === firData.fir_id)
    : evidenceData;

  const renderTimeline = () => (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 animate-fade-in">
      <h3 className="text-sm font-bold text-white mb-4">Case Timeline</h3>
      <div className="space-y-4">
        {filteredCrimes.slice(0, 5).map((crime) => (
          <div
            key={crime.crime_id}
            className="flex gap-4 border-l-2 border-[#2563EB]/40 pl-4 py-2"
          >
            <div className="text-xs text-[#94A3B8] font-mono min-w-[120px]">
              {new Date(crime.reported_at).toLocaleString()}
            </div>
            <div>
              <div className="text-sm text-white font-bold">
                {crime.crime_description || "Crime Event"}
              </div>
              <div className="text-xs text-[#94A3B8]">
                Severity: {crime.severity} | Category ID: {crime.category_id}
              </div>
            </div>
          </div>
        ))}
        {firData && (
          <div className="flex gap-4 border-l-2 border-green-500/40 pl-4 py-2">
            <div className="text-xs text-[#94A3B8] font-mono min-w-[120px]">
              {new Date(firData.fir_date).toLocaleString()}
            </div>
            <div>
              <div className="text-sm text-white font-bold">FIR Registered</div>
              <div className="text-xs text-[#94A3B8]">
                {firData.complainant_name} filed FIR {firData.fir_number}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEvidence = () => (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 animate-fade-in">
      <h3 className="text-sm font-bold text-white mb-4">Evidence Registry</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.length > 0 ? (
          filteredEvidence.map((ev) => (
            <div
              key={ev.evidence_id}
              className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] p-4 rounded-lg"
            >
              <div className="text-xs text-[#2563EB] font-mono font-bold mb-1 uppercase">
                {ev.evidence_type}
              </div>
              <div className="text-sm text-white font-bold">
                {ev.description || "No description provided"}
              </div>
              <div className="text-xs text-[#94A3B8] mt-2">
                Storage: {ev.storage_location || "Unknown"}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-[#94A3B8] text-sm">
            No evidence logs found.
          </div>
        )}
      </div>
    </div>
  );

  const renderEntitiesGrid = (entities: EntityItem[], filterType: string) => (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 animate-fade-in">
      <h3 className="text-sm font-bold text-white mb-4 uppercase">
        {filterType} PROFILES
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entities
          .filter((e) => e.type === filterType)
          .map((ent, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] p-4 rounded-lg"
            >
              <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <div className="text-sm text-white font-bold">
                  {ent.type === "vehicle" ? ent.regNo : (ent as any).name}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {ent.type === "vehicle"
                    ? ent.typeDesc
                    : `${(ent as any).age} yrs • ${(ent as any).role || (ent as any).status}`}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderLinkedCases = () => (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 animate-fade-in">
      <h3 className="text-sm font-bold text-white mb-4">Linked Cases</h3>
      <div className="space-y-3">
        {crimesData
          .filter((c) => firData && c.fir_id !== firData.fir_id)
          .slice(0, 3)
          .map((c, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-[#0B1220] p-4 rounded-lg border border-[rgba(255,255,255,0.06)] cursor-pointer hover:border-[#2563EB]/40"
            >
              <div>
                <div className="text-sm text-white font-bold">
                  {c.crime_description}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  Severity: {c.severity}
                </div>
              </div>
              <div className="text-xs font-mono text-[#2563EB]">
                MATCH: HIGH
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Vigilens Report
          </h3>
          <button
            onClick={handleAskAI}
            disabled={aiLoading || !firData}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shrink-0"
          >
            {aiLoading ? "Generating..." : "Generate Insight"}
          </button>
        </div>
        <div className="text-sm text-[#94A3B8] leading-relaxed bg-[#0B1220] p-6 rounded-lg border border-[rgba(255,255,255,0.06)] flex-1 overflow-y-auto">
          {aiInsight ? (
            <div className="prose prose-invert max-w-none prose-sm prose-headings:text-[#2563EB] prose-a:text-blue-400 prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal">
              <ReactMarkdown>{aiInsight}</ReactMarkdown>
            </div>
          ) : (
            'No AI insights generated yet. Click "Generate Insight" to compile the case brief.'
          )}
        </div>
      </div>

      <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 flex flex-col h-[500px]">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest font-mono">
          Interactive Case Assistant
        </h3>
        <div className="flex-1 bg-[#0B1220] rounded-lg border border-[rgba(255,255,255,0.04)] p-4 overflow-y-auto mb-4 space-y-4 flex flex-col custom-scrollbar">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-[#182235] text-[#94A3B8] border border-[rgba(255,255,255,0.05)]"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            placeholder="Ask about this case..."
            className="flex-1 bg-[#0B1220] border border-[rgba(255,255,255,0.1)] text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleSendChat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <PageLoader message="Loading workspace..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. Full-Width Global Input Bar */}
      <GlobalSearch
        value={firSearchText}
        onChange={setFirSearchText}
        suggestions={allFirs}
        onSelect={(item) => setFirData(item)}
      />

      {/* 3. Navigation tabs panel */}
      <InvestigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. Tab Contents layout */}
      {activeTab === "Case Overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6 pt-2">
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <CaseOverviewCard {...caseData} />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-4">
            <EntityCard
              entities={entitiesList}
              onInspect={handleInspectEntity}
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <AIRecommendationCard
              recommendations={recommendations}
              onAskAI={handleAskAI}
            />
          </div>
        </div>
      )}
      {["TIMELINE", "Timeline"].includes(activeTab) && renderTimeline()}
      {["EVIDENCE", "Evidence"].includes(activeTab) && renderEvidence()}
      {["SUSPECTS", "Suspects"].includes(activeTab) &&
        renderEntitiesGrid(entitiesList, "accused")}
      {["VICTIMS", "Victims"].includes(activeTab) &&
        renderEntitiesGrid(entitiesList, "victim")}
      {["VEHICLES", "Vehicles"].includes(activeTab) &&
        renderEntitiesGrid(entitiesList, "vehicle")}
      {["LINKED CASES", "Linked Cases"].includes(activeTab) &&
        renderLinkedCases()}
      {["AI INSIGHTS", "AI Insights"].includes(activeTab) && renderAIInsights()}
      {activeTab === "Investigation Diary" && (
        <OfficerDiary
          firNumber={firData?.fir_number || "FIR-2024-119"}
          officerName={firData?.officer_name || "Inspector Ramesh"}
        />
      )}
    </div>
  );
}

export default InvestigationPage;
