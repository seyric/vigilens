import { ChevronDown, Calendar, Shield, AlertTriangle, MapPin } from 'lucide-react'

interface FilterPanelProps {
  dateRange: string
  setDateRange: (val: string) => void

  crimeType: string
  setCrimeType: (val: string) => void

  severity: string
  setSeverity: (val: string) => void

  district: string
  setDistrict: (val: string) => void
  
  onApplyFilters: () => void
}

export function FilterPanel({
  dateRange,
  setDateRange,
  crimeType,
  setCrimeType,
  severity,
  setSeverity,
  district,
  setDistrict,
  onApplyFilters
}: FilterPanelProps) {
  
  const dateOptions = [
    { value: 'All Dates', label: 'All Dates' },
    { value: 'Last 7 Days', label: 'Last 7 Days' },
    { value: 'Last 30 Days', label: 'Last 30 Days' },
    { value: 'Year 2025', label: 'Year 2025' }
  ]

  const typeOptions = [
    { value: 'All Types', label: 'All Types' },
    { value: 'Theft', label: 'Theft' },
    { value: 'Cyber Crime', label: 'Cyber Crime' },
    { value: 'Robbery', label: 'Robbery' },
    { value: 'Burglary', label: 'Burglary' },
    { value: 'Kidnapping', label: 'Kidnapping' },
    { value: 'Fraud', label: 'Fraud' },
    { value: 'Assault', label: 'Assault' }
  ]

  const severityOptions = [
    { value: 'All', label: 'All Severities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ]

  const districtOptions = [
    { value: 'All Districts', label: 'All Districts' },
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Mysuru', label: 'Mysuru' },
    { value: 'Hubballi', label: 'Hubballi' },
    { value: 'Mangaluru', label: 'Mangaluru' },
    { value: 'Belagavi', label: 'Belagavi' },
    { value: 'Kalaburagi', label: 'Kalaburagi' },
    { value: 'Shivamogga', label: 'Shivamogga' },
    { value: 'Tumakuru', label: 'Tumakuru' }
  ]

  return (
    <div className="flex h-full min-h-0 flex-col select-none">
      <div className="text-[10px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase border-b border-[rgba(255,255,255,0.06)] pb-2 mb-3">
        Filters
      </div>

      <div className="space-y-4">
        {/* Dropdown 1: Date Range */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider font-bold text-[#94A3B8] uppercase">
            <Calendar className="h-3 w-3 text-[#2563EB]" />
            <span>Date Range</span>
          </div>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-all duration-150 appearance-none pr-9 text-left"
            >
              {dateOptions.map((opt) => (
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

        {/* Dropdown 2: Crime Type */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider font-bold text-[#94A3B8] uppercase">
            <Shield className="h-3 w-3 text-[#2563EB]" />
            <span>Crime Type</span>
          </div>
          <div className="relative">
            <select
              value={crimeType}
              onChange={(e) => setCrimeType(e.target.value)}
              className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-all duration-150 appearance-none pr-9 text-left"
            >
              {typeOptions.map((opt) => (
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

        {/* Dropdown 3: Severity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider font-bold text-[#94A3B8] uppercase">
            <AlertTriangle className="h-3 w-3 text-[#2563EB]" />
            <span>Severity</span>
          </div>
          <div className="relative">
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-all duration-150 appearance-none pr-9 text-left"
            >
              {severityOptions.map((opt) => (
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

        {/* Dropdown 4: District */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider font-bold text-[#94A3B8] uppercase">
            <MapPin className="h-3 w-3 text-[#2563EB]" />
            <span>District</span>
          </div>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-all duration-150 appearance-none pr-9 text-left"
            >
              {districtOptions.map((opt) => (
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

      </div>

      <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <button
          onClick={onApplyFilters}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[10px] tracking-widest uppercase py-3 rounded-lg transition-all duration-150 cursor-pointer outline-none focus:ring-1 focus:ring-[#2563EB] hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] select-none"
        >
          Apply Filters
        </button>
      </div>

    </div>
  )
}
export default FilterPanel
