import React, { useRef, useState } from "react";
import {
  UploadCloud,
  PhoneCall,
  MapPin,
  Globe,
  Smartphone,
  MessageSquare,
  Mail,
  Compass,
  Image,
  FileText,
} from "lucide-react";

interface EvidenceUploadPanelProps {
  onEvidenceSelected: (file: File) => void;
  isProcessing: boolean;
}

export function EvidenceUploadPanel({
  onEvidenceSelected,
  isProcessing,
}: EvidenceUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const evidenceTypes = [
    {
      label: "Call Detail Records",
      icon: PhoneCall,
      color: "text-[#2563EB]/90 bg-[#2563EB]/5 border-[#2563EB]/15",
    },
    {
      label: "GPS History",
      icon: MapPin,
      color: "text-[#10B981]/90 bg-[#10B981]/5 border-[#10B981]/15",
    },
    {
      label: "IP Logs",
      icon: Globe,
      color: "text-[#3B82F6]/90 bg-[#3B82F6]/5 border-[#3B82F6]/15",
    },
    {
      label: "Mobile Extraction Reports",
      icon: Smartphone,
      color: "text-[#8B5CF6]/90 bg-[#8B5CF6]/5 border-[#8B5CF6]/15",
    },
    {
      label: "Chat Exports",
      icon: MessageSquare,
      color: "text-[#EC4899]/90 bg-[#EC4899]/5 border-[#EC4899]/15",
    },
    {
      label: "Email Logs",
      icon: Mail,
      color: "text-[#F59E0B]/90 bg-[#F59E0B]/5 border-[#F59E0B]/15",
    },
    {
      label: "Browser History",
      icon: Compass,
      color: "text-[#14B8A6]/90 bg-[#14B8A6]/5 border-[#14B8A6]/15",
    },
    {
      label: "Screenshots",
      icon: Image,
      color: "text-[#E2E8F0]/90 bg-[#E2E8F0]/5 border-[#E2E8F0]/10",
    },
    {
      label: "Cyber Forensic Reports",
      icon: FileText,
      color: "text-[#EF4444]/90 bg-[#EF4444]/5 border-[#EF4444]/15",
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onEvidenceSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    if (e.target.files && e.target.files[0]) {
      onEvidenceSelected(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/10 bg-[#121826] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:border-[#2563EB]/25">
      <div>
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F8FAFC]">
              Upload evidence
            </h3>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
              Legally obtained forensic ingestion
            </p>
          </div>
          <div className="rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#7FB0FF]">
            Secure
          </div>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          className={`mt-5 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed p-8 text-center transition-all ${
            isDragActive
              ? "border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_18px_rgba(37,99,235,0.12)]"
              : "border-white/10 bg-[#0B1220]/70 hover:border-[#2563EB]/35"
          } ${isProcessing ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#2563EB] transition-transform group-hover:scale-105">
            <UploadCloud
              className={`h-6 w-6 ${isProcessing ? "animate-pulse" : ""}`}
            />
          </div>

          <h4 className="text-sm font-semibold text-white">
            {isProcessing
              ? "Processing forensic file..."
              : "Drag and drop evidence"}
          </h4>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {isProcessing
              ? "Vigilens is analyzing contents."
              : "or browse supported files from the secured evidence source."}
          </p>
          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]/70">
            Authorized personnel only • encrypted transit
          </p>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing}
        accept=".pdf,.csv,.xlsx,.txt,.log,.xml,.json,.zip,.tar,.db,.sqlite,.png,.jpg,.jpeg"
      />

      <div className="mt-6">
        <h5 className="mb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
          Supported formats & systems
        </h5>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {evidenceTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.label}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors hover:bg-white/[0.02] ${type.color}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span
                  className="text-[10px] font-medium leading-tight text-[#94A3B8]"
                  title={type.label}
                >
                  {type.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EvidenceUploadPanel;
