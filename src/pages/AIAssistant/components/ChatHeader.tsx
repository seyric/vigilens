import { Brain } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 flex items-center justify-between gap-4 select-none animate-fade-in">
      <div className="flex items-center gap-3">
        {/* Brain Icon */}
        <div className="h-10 w-10 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] shrink-0 animate-pulse">
          <Brain className="h-5.5 w-5.5 stroke-1.5" />
        </div>

        <div>
          <h2 className="text-sm font-extrabold tracking-tight text-white uppercase font-mono">
            AI Investigation Assistant
          </h2>
          <p className="text-[#94A3B8]/60 font-semibold text-[10px] mt-0.5 uppercase tracking-widest">
            Vigilens Intelligence Core
          </p>
        </div>
      </div>

      {/* Online Badge status */}
      <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] rounded-full text-[8px] font-mono tracking-widest font-extrabold uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shrink-0 animate-ping" />
        <span>System Online</span>
      </div>
    </div>
  );
}
export default ChatHeader;
