import { Search, ChevronDown, MonitorStop } from 'lucide-react'

// 1. Search Bar Component
interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function DatabaseSearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative flex-1 select-none">
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#94A3B8]">
        <Search className="h-4.5 w-4.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full pl-10.5 pr-4 py-2.5 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-xl text-xs font-semibold text-white placeholder-[#94A3B8]/50 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all duration-150 hover:border-[rgba(255,255,255,0.1)]"
      />
    </div>
  )
}

// 2. Filter Dropdown Component
interface FilterDropdownProps {
  label: string
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}

export function DatabaseFilterSelect({ label, value, onChange, options }: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full select-none">
      <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-all duration-150 appearance-none pr-9 relative"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111827] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#94A3B8]">
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}

// 3. Status Badge Component
export type CrimeStatusType = 'Under Investigation' | 'Active' | 'Pending' | 'Closed' | 'Solved'

export function DatabaseStatusBadge({ status }: { status: CrimeStatusType }) {
  const styles = {
    'Under Investigation': 'bg-[#2563EB]/10 border-[#2563EB]/25 text-[#2563EB]',
    'Active': 'bg-[#22C55E]/10 border-[#22C55E]/25 text-[#22C55E]',
    'Pending': 'bg-[#F97316]/10 border-[#F97316]/25 text-[#F97316]',
    'Closed': 'bg-gray-500/10 border-gray-500/25 text-[#94A3B8]',
    'Solved': 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]',
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-mono tracking-wider font-bold uppercase transition-colors duration-150 ${styles[status]}`}>
      {status}
    </span>
  )
}

// 4. Severity Badge Component
export type CrimeSeverityType = 'Low' | 'Medium' | 'High' | 'Critical'

export function DatabaseSeverityBadge({ severity }: { severity: CrimeSeverityType }) {
  const styles = {
    'Low': 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]',
    'Medium': 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]',
    'High': 'bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]',
    'Critical': 'bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]',
  }

  return (
    <span className={`px-2.5 py-0.5 rounded border text-[8px] font-mono tracking-wider font-bold uppercase transition-colors duration-150 ${styles[severity]}`}>
      {severity}
    </span>
  )
}

// 5. Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DatabasePagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = []
  
  // Custom mock pagination items
  for (let i = 1; i <= 5; i++) {
    if (i <= totalPages) pages.push(i)
  }
  
  return (
    <div className="flex items-center gap-1.5 select-none font-mono">
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2.5 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-xs text-[#94A3B8] hover:text-white hover:bg-[#182235] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#94A3B8] transition-all cursor-pointer"
      >
        &lt;
      </button>

      {/* Numerical buttons */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all cursor-pointer ${
            currentPage === p
              ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-[#2563EB]/25'
              : 'border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:bg-[#182235]'
          }`}
        >
          {p}
        </button>
      ))}

      {/* Ellipses & Final marker */}
      {totalPages > 5 && (
        <>
          <span className="text-[#94A3B8] text-xs px-1 select-none">...</span>
          <button
            onClick={() => onPageChange(20)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all cursor-pointer border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:bg-[#182235]`}
          >
            20
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2.5 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-xs text-[#94A3B8] hover:text-white hover:bg-[#182235] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#94A3B8] transition-all cursor-pointer"
      >
        &gt;
      </button>
    </div>
  )
}

// 6. Styled Empty State Page
export function DatabaseEmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl text-center select-none animate-fade-in">
      <div className="h-14 w-14 rounded-full bg-[#182235] border border-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#94A3B8] mb-5">
        <MonitorStop className="h-6 w-6 stroke-1.5" />
      </div>
      <h3 className="text-sm font-bold text-white tracking-wide">No crime records found.</h3>
      <p className="text-xs text-[#94A3B8] mt-1.5 max-w-[280px]">
        Try changing your filters or search keyword to match other system categories.
      </p>
      
      <button
        onClick={onClearFilters}
        className="mt-5 text-[10px] font-mono font-bold tracking-widest text-[#2563EB] hover:text-white hover:bg-[#2563EB] border border-[#2563EB]/30 bg-transparent px-4 py-2 rounded-lg transition-all duration-150 uppercase"
      >
        Reset Filters
      </button>
    </div>
  )
}
