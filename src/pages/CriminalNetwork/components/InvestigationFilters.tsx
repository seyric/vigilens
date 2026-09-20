import { Search, SlidersHorizontal, Calendar, Database, Shield } from 'lucide-react'

interface InvestigationFiltersProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  selectedCase: string
  onCaseChange: (val: string) => void
  selectedCrimeType: string
  onCrimeTypeChange: (val: string) => void
  selectedDistrict: string
  onDistrictChange: (val: string) => void
  relationshipDepth: string
  onDepthChange: (val: string) => void
  startDate: string
  onStartDateChange: (val: string) => void
  endDate: string
  onEndDateChange: (val: string) => void
}

export function InvestigationFilters({
  searchQuery,
  onSearchChange,
  selectedCase,
  onCaseChange,
  selectedCrimeType,
  onCrimeTypeChange,
  selectedDistrict,
  onDistrictChange,
  relationshipDepth,
  onDepthChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange
}: InvestigationFiltersProps) {

  const caseOptions = [
    { value: 'all', label: 'All Cases' },
    { value: 'Burglary FIR-123456', label: 'Burglary FIR-123456' },
    { value: 'Robbery FIR-123777', label: 'Robbery FIR-123777' },
    { value: 'Theft FIR-123890', label: 'Theft FIR-123890' },
    { value: 'Cyber Fraud FIR-123999', label: 'Cyber Fraud FIR-123999' }
  ]

  const crimeTypeOptions = [
    { value: 'all', label: 'All Crime Types' },
    { value: 'burglary', label: 'Burglary' },
    { value: 'robbery', label: 'Robbery' },
    { value: 'theft', label: 'Theft' },
    { value: 'cyber_fraud', label: 'Cyber Fraud' }
  ]

  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    { value: 'Bengaluru Urban', label: 'Bengaluru Urban' },
    { value: 'Hubballi', label: 'Hubballi' },
    { value: 'Mysuru', label: 'Mysuru' }
  ]

  const depthOptions = [
    { value: '1', label: '1st Degree Link' },
    { value: '2', label: '2nd Degree Link' },
    { value: '3', label: '3rd Degree Link' },
    { value: 'max', label: 'Maximum Depth' }
  ]

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.04)] pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" />
          <span className="text-xs font-bold tracking-widest text-white uppercase font-mono">
            Investigation Filters
          </span>
        </div>
        <span className="text-[8px] font-mono text-[#94A3B8]/40 uppercase tracking-widest leading-none">
          NEO4J LINK PARAMETERS
        </span>
      </div>

      {/* Primary Row: Case Selection & Entity Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Case Selection */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase flex items-center gap-1">
            <Database className="h-3 w-3 text-[#2563EB]/85" />
            <span>Active Case Scope</span>
          </span>
          <div className="relative">
            <select
              value={selectedCase}
              onChange={(e) => onCaseChange(e.target.value)}
              className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer hover:border-[rgba(255,255,255,0.1)] transition-all duration-150 appearance-none pr-9"
            >
              {caseOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#111827] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Entity */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase flex items-center gap-1">
            <Search className="h-3 w-3 text-[#2563EB]/85" />
            <span>Search Entity Target</span>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Suspect Name, FIR Number, Vehicle Plate, Phone..."
            className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white placeholder-[#94A3B8]/35 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all duration-150 hover:border-[rgba(255,255,255,0.1)]"
          />
        </div>
      </div>

      {/* Secondary Row: Dropdowns & Ranges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* Crime Type */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[8.5px] font-mono tracking-widest text-[#94A3B8]/70 font-bold uppercase">Crime Type</span>
          <select
            value={selectedCrimeType}
            onChange={(e) => onCrimeTypeChange(e.target.value)}
            className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer"
          >
            {crimeTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#111827] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[8.5px] font-mono tracking-widest text-[#94A3B8]/70 font-bold uppercase">District</span>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer"
          >
            {districtOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#111827] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Relationship Depth */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[8.5px] font-mono tracking-widest text-[#94A3B8]/70 font-bold uppercase flex items-center gap-1">
            <Shield className="h-3 w-3 text-[#2563EB]/70" />
            <span>Link Depth</span>
          </span>
          <select
            value={relationshipDepth}
            onChange={(e) => onDepthChange(e.target.value)}
            className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] cursor-pointer"
          >
            {depthOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#111827] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range: Start */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[8.5px] font-mono tracking-widest text-[#94A3B8]/70 font-bold uppercase flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#2563EB]/70" />
            <span>Start Date</span>
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3 py-2 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] hover:border-[rgba(255,255,255,0.1)] cursor-pointer"
          />
        </div>

        {/* Date Range: End */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[8.5px] font-mono tracking-widest text-[#94A3B8]/70 font-bold uppercase flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#2563EB]/70" />
            <span>End Date</span>
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3 py-2 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] hover:border-[rgba(255,255,255,0.1)] cursor-pointer"
          />
        </div>
      </div>

    </div>
  )
}

export default InvestigationFilters
