import { useState, useRef } from "react";
import {
  GitCompare,
  UploadCloud,
  Search,
  Crosshair,
  MapPin,
  LogIn,
  Package,
  Navigation,
} from "lucide-react";

export function AICrimePatternSimilarityPage() {
  const [selectedFir, setSelectedFir] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "search">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const matchedPatterns = [
    {
      title: "Same Weapon",
      detail: "Hydraulic Steel Cutter & Gas Torch",
      match: "96%",
      icon: Crosshair,
      color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30",
    },
    {
      title: "Same District",
      detail: "Bangalore North (Indiranagar / JC Nagar)",
      match: "94%",
      icon: MapPin,
      color: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/30",
    },
    {
      title: "Same Entry Point",
      detail: "Rear Skylight Lock Disablement",
      match: "92%",
      icon: LogIn,
      color: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30",
    },
    {
      title: "Same Stolen Objects",
      detail: "Gold Jewellery Vault & Unsorted Cash",
      match: "90%",
      icon: Package,
      color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
    },
    {
      title: "Same Escape Route",
      detail: "NH-44 Toll Bypass Highway Node",
      match: "88%",
      icon: Navigation,
      color: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0].name);
      setSelectedFir(null); // clear search selection if any
    }
  };

  const showAnalysis = !!uploadedFile || !!selectedFir;
  const displayTarget = uploadedFile ? uploadedFile : selectedFir;

  return (
    <div className="space-y-8 animate-fade-in select-none max-w-[1600px] mx-auto pb-12 font-sans">
      {/* SECTION 1: FIR SELECTOR / UPLOAD */}
      <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div>
            <h2 className="text-base font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-[#2563EB]" />
              <span>Select or Upload FIR for Similarity Analysis</span>
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Upload a new FIR or select an existing FIR to run AI pattern
              similarity analysis.
            </p>
          </div>

          {/* Option Selector Toggle */}
          <div className="flex items-center gap-1.5 bg-[#080D1A] border border-[rgba(255,255,255,0.08)] p-1 rounded-xl font-mono text-xs">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                activeTab === "upload"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Option A: Upload FIR
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                activeTab === "search"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Option B: Select FIR
            </button>
          </div>
        </div>

        {/* Option A: Upload Workspace */}
        {activeTab === "upload" && (
          <div className="border-2 border-dashed border-[rgba(255,255,255,0.12)] hover:border-[#2563EB]/50 bg-[#080D1A] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB]">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Upload New FIR Document (.PDF, .DOCX, Images)
              </h4>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Drag and drop your case file or click to browse local drive
              </p>
            </div>
            {uploadedFile && (
              <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-lg font-bold">
                ✓ Uploaded: {uploadedFile}
              </span>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-5 py-2 rounded-lg transition-all cursor-pointer shadow-md"
            >
              Browse FIR Document
            </button>
          </div>
        )}

        {/* Option B: Search Bar */}
        {activeTab === "search" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FIR ID or Case Number... (e.g. FIR 45/2026)"
                className="w-full bg-[#080D1A] border border-[rgba(255,255,255,0.1)] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#2563EB] font-mono"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="text-[10px] text-[#94A3B8]/70 uppercase font-bold">
                Select FIR:
              </span>
              {["FIR 45/2026", "FIR 88/2026", "FIR 102/2026"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setSelectedFir(chip);
                    setUploadedFile(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                    selectedFir === chip
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "bg-[#080D1A] text-[#94A3B8] hover:text-white border border-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAnalysis && (
        <>
          {/* SECTION 2: COMPACT AI SIMILARITY DISPLAY CARD */}
          <div className="bg-[#0B1220] border border-[#2563EB]/40 rounded-xl p-4.5 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="space-y-1 z-10">
              <span className="text-[9.5px] font-mono text-[#38BDF8] font-bold uppercase tracking-widest bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-3 py-0.5 rounded-full inline-block">
                Target FIR: {displayTarget}
              </span>

              <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-tight pt-1">
                This case is{" "}
                <span className="text-[#10B981] font-extrabold bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                  93% similar
                </span>{" "}
                to <span className="text-[#38BDF8]">Case #FIR 2024-119</span>
              </h2>
              <p className="text-[10.5px] font-mono text-[#94A3B8]">
                AI Pattern Similarity Engine • Matched against the secure case
                index
              </p>
            </div>
          </div>

          {/* SECTION 3: DISPLAY ONLY REQUIRED 5 PATTERN BREAKDOWNS */}
          <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Pattern Similarity Matches
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {matchedPatterns.map((item) => {
                const PatternIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-[#080D1A] border border-[rgba(255,255,255,0.04)] rounded-xl p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg border ${item.color}`}>
                        <PatternIcon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded">
                        {item.match} Match
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-mono text-[#94A3B8] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AICrimePatternSimilarityPage;
