import { useState } from "react";
import { Search, Paperclip, Mic, Send } from "lucide-react";

interface InputProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSend, placeholder }: InputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleAttachment = () => {
    alert(
      "[SYSTEM SECURE FILE] Evidence attach portal active. Select documents, images, or media files to upload...",
    );
  };

  const handleMic = () => {
    alert(
      "[SYSTEM AUDIO] Voice intelligence module initialized. Recording search logs...",
    );
  };

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 flex items-center gap-3 select-none">
      {/* Left Search Icon */}
      <div className="text-[#94A3B8] shrink-0 pl-1">
        <Search className="h-4.5 w-4.5" />
      </div>

      {/* Input box */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          placeholder || "Ask about FIRs, suspects, vehicles, locations..."
        }
        className="flex-1 bg-[#0B1220] border border-[rgba(255,255,255,0.04)] rounded-lg text-xs font-semibold text-white placeholder-[#94A3B8]/55 px-3.5 py-[18px] outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-150"
      />

      {/* Right control buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Attach File */}
        <button
          onClick={handleAttachment}
          title="Attach Evidence"
          className="h-8.5 w-8.5 bg-[#0B1220] hover:bg-[#182235]/40 border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 outline-none"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {/* Voice Search */}
        <button
          onClick={handleMic}
          title="Voice Command"
          className="h-8.5 w-8.5 bg-[#0B1220] hover:bg-[#182235]/40 border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 outline-none"
        >
          <Mic className="h-4 w-4" />
        </button>

        {/* Send message */}
        <button
          onClick={handleSend}
          title="Send Query"
          className="h-8.5 w-8.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg flex items-center justify-center cursor-pointer hover:shadow-[0_2px_12px_rgba(37,99,235,0.25)] transition-all duration-150 outline-none"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
export default ChatInput;
