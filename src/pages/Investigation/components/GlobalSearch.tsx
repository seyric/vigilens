import { Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface GlobalSearchProps {
  value: string
  onChange: (query: string) => void
  placeholder?: string
  suggestions?: any[]
  onSelect?: (item: any) => void
}

export function GlobalSearch({ value, onChange, placeholder, suggestions = [], onSelect }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSuggestions = suggestions.filter(s => 
    s.fir_number?.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 10)

  return (
    <div ref={wrapperRef} className="relative w-full select-none z-50">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#94A3B8]">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder || 'Search by FIR Number...'}
        className="w-full pl-12 pr-4 py-3 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-xl text-sm font-semibold text-white placeholder-[#94A3B8]/40 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all duration-150"
      />
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
          {filteredSuggestions.map((item, idx) => (
            <div 
              key={idx}
              className="px-4 py-3 hover:bg-[#2563EB]/20 cursor-pointer flex justify-between items-center border-b border-[rgba(255,255,255,0.02)] last:border-0"
              onClick={() => {
                onChange(item.fir_number)
                if (onSelect) onSelect(item)
                setIsOpen(false)
              }}
            >
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold font-mono">{item.fir_number}</span>
                <span className="text-[#94A3B8] text-xs mt-0.5">{item.complainant_name || 'Complainant'} • {item.station_name || 'Station'}</span>
              </div>
              <span className="text-[10px] bg-[#2563EB]/20 text-[#38BDF8] px-2 py-1 rounded font-mono uppercase tracking-widest">{item.status || 'Active'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default GlobalSearch
