import {
  User,
  Brain,
  FileText,
  Camera,
  Video,
  Volume2,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import type { ChatMessageData } from "../data/MockConversation";

interface MessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: MessageProps) {
  const isUser = message.sender === "user";

  const getEvidenceIcon = (type: "image" | "video" | "document" | "audio") => {
    const props = { className: "h-3.5 w-3.5 text-[#10B981]" };
    switch (type) {
      case "image":
        return <Camera {...props} />;
      case "video":
        return <Video {...props} className="text-[#8B5CF6]" />;
      case "document":
        return <FileText {...props} className="text-[#F97316]" />;
      default:
        return <Volume2 {...props} />;
    }
  };

  return (
    <div
      className={`flex gap-4 w-full select-none font-sans text-xs animate-fade-in my-5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI icon avatar */}
      {!isUser && (
        <div className="h-9 w-9 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center shrink-0 mt-1">
          <Brain className="h-5 w-5 stroke-1.5 animate-pulse" />
        </div>
      )}

      {/* Message bubble card */}
      <div
        className={`rounded-2xl border shadow-sm transition-all duration-150 ${
          isUser
            ? "max-w-[65%] p-5 bg-[#172554]/75 border-[#2563EB]/30 text-white"
            : "w-full max-w-4xl p-6 bg-[#111827] border-[rgba(255,255,255,0.06)] text-[#F8FAFC]"
        }`}
      >
        {/* Name and time details */}
        <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-[#94A3B8]/60 uppercase font-extrabold">
          <span>{isUser ? "Operator" : "Vigilens Intelligence"}</span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Header Divider (for AI responses) */}
        {!isUser && (
          <div className="border-b border-[rgba(255,255,255,0.08)] my-3" />
        )}

        {/* Narrative text block */}
        <p
          className={`leading-relaxed tracking-wide text-xs ${
            isUser
              ? "text-white/90 mt-2 font-medium"
              : "text-[#E2E8F0] font-semibold mt-1"
          }`}
        >
          {message.text}
        </p>

        {/* Redesigned AI Intelligence sections inside one elegant card */}
        {!isUser && message.intelligenceData && (
          <div className="space-y-5 border-t border-[rgba(255,255,255,0.06)] pt-5 mt-5">
            {/* 1. Investigation Summary */}
            <div className="space-y-1.5">
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#2563EB]" />
                <span>{message.intelligenceData.summaryTitle}</span>
              </h4>
              <p className="text-[#94A3B8] leading-relaxed text-[11px] font-sans font-medium pl-6">
                {message.intelligenceData.summaryText}
              </p>
            </div>

            {/* 2. Common Observations */}
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-2">
                <Brain className="h-4 w-4 text-[#F97316]" />
                <span>Common Observations</span>
              </h4>
              <ul className="space-y-2 pl-6">
                {message.intelligenceData.observations.map((obs, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[#94A3B8] text-[11px] font-medium leading-relaxed"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
                    <span className="text-[#E2E8F0]">{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Related Evidence */}
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#10B981]" />
                <span>Related Evidence</span>
              </h4>
              <ul className="space-y-2 pl-6">
                {message.intelligenceData.evidence.map((ev, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 text-[#E2E8F0] text-[11px] font-semibold cursor-pointer hover:text-[#2563EB] transition-colors"
                  >
                    {getEvidenceIcon(ev.type)}
                    <span>{ev.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Suggested Next Steps */}
            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-2">
                <Navigation className="h-4 w-4 text-[#8B5CF6]" />
                <span>Suggested Next Steps</span>
              </h4>
              <ul className="space-y-2 pl-6">
                {message.intelligenceData.nextSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[#94A3B8] text-[11px] font-medium leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span className="text-[#E2E8F0]">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* User icon avatar */}
      {isUser && (
        <div className="h-9 w-9 rounded-xl bg-[#0B1220] border border-[rgba(255,255,255,0.06)] text-[#94A3B8] flex items-center justify-center shrink-0 mt-1">
          <User className="h-5 w-5 stroke-1.5" />
        </div>
      )}
    </div>
  );
}
export default ChatMessage;
