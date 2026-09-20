import { Sparkles, ArrowRight } from 'lucide-react'

interface SuggestionsProps {
  onSelectSuggestion: (text: string) => void
}

export function SuggestionCards({ onSelectSuggestion }: SuggestionsProps) {
  const suggestions = [
    'Find burglary cases involving white vehicles.',
    'Show repeat offenders in Bengaluru.',
    'Generate investigation summary for FIR123456.',
    'Identify suspects connected to multiple crimes.'
  ]

  return (
    <div className="space-y-4 select-none font-sans text-xs pt-4 max-w-2xl mx-auto text-center">
      
      {/* Greeting Title */}
      <div>
        <h3 className="text-white font-extrabold text-lg tracking-wide">
          How can I assist your investigation today?
        </h3>
        <p className="text-[#94A3B8]/60 text-[10.5px] mt-1 uppercase tracking-wider font-mono">
          Select a prompt query below or enter dynamic parameters to start
        </p>
      </div>

      {/* Grid List of suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {suggestions.map((text, idx) => (
          <div
            key={idx}
            onClick={() => onSelectSuggestion(text)}
            className="p-3.5 bg-[#0B1220] hover:bg-[#182235]/40 border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 rounded-xl text-left cursor-pointer transition-all duration-150 group flex items-center justify-between gap-3 shadow-sm hover:shadow-[0_0_12px_rgba(37,99,235,0.08)]"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-3.5 w-3.5 text-[#2563EB] shrink-0 group-hover:scale-105 transition-transform" />
              <span className="text-[#94A3B8] group-hover:text-white font-bold tracking-wide text-[10.5px] transition-colors leading-relaxed">
                {text}
              </span>
            </div>
            
            <div className="h-6 w-6 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
export default SuggestionCards
