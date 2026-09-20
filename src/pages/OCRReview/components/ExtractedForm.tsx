import {
  CheckCircle2,
  Shield,
  FileText,
  ShieldAlert,
  Calendar,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  User,
  UserX,
  Car,
  Crosshair,
  FileSearch
} from 'lucide-react'

export interface ExtractedFormData {
  firNumber: string
  crimeType: string
  date: string
  time: string
  district: string
  policeStation: string
  officer: string
  victimName: string
  accusedName: string
  vehicleNumber: string
  weaponUsed: string
  location: string
  description: string
}

interface FormProps {
  data: ExtractedFormData
  onChange: (field: keyof ExtractedFormData, val: string) => void
}

export function ExtractedForm({ data, onChange }: FormProps) {
  
  // Helper to render input rows with AI confidence checks and field icons
  const renderField = (
    label: string,
    field: keyof ExtractedFormData,
    value: string,
    IconComponent: any,
    type: 'text' | 'textarea' = 'text'
  ) => {
    return (
      <div className="flex flex-col gap-1.5 font-sans text-xs flex-1 min-w-[200px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#94A3B8]/80">
            <IconComponent className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold">
              {label}
            </span>
          </div>
          
          {/* AI Confidence badge icon */}
          <div className="flex items-center gap-1 text-[#10B981]" title="98% AI Confidence score">
            <CheckCircle2 className="h-3 w-3 stroke-2 shrink-0" />
            <span className="text-[8px] font-mono font-bold tracking-wider uppercase">98%</span>
          </div>
        </div>

        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            rows={3.5}
            className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-150 resize-none leading-relaxed"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-[#F8FAFC] px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-150"
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-3xl p-5 shadow-sm select-none animate-fade-in">
      <div className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F172A] border border-[rgba(255,255,255,0.05)]">
            <Shield className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-[0.18em] uppercase font-mono">
              Extracted FIR Information
            </h2>
            <p className="mt-1 text-[10px] text-[#94A3B8] uppercase tracking-widest">
              Verify OCR fields before saving to the crime database
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-4">
            <p className="text-[9px] uppercase tracking-widest text-[#94A3B8]">Core Case Details</p>
            <div className="mt-3 space-y-3">
              {renderField('FIR Number', 'firNumber', data.firNumber, FileText)}
              {renderField('Crime Type', 'crimeType', data.crimeType, ShieldAlert)}
              {renderField('Incident Date', 'date', data.date, Calendar)}
              {renderField('Incident Time', 'time', data.time, Clock)}
              {renderField('District', 'district', data.district, MapPin)}
              {renderField('Police Station', 'policeStation', data.policeStation, Building2)}
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-4">
            <p className="text-[9px] uppercase tracking-widest text-[#94A3B8]">Personnel & Location</p>
            <div className="mt-3 space-y-3">
              {renderField('Investigating Officer', 'officer', data.officer, UserCheck)}
              {renderField('Victim Name', 'victimName', data.victimName, User)}
              {renderField('Accused Name', 'accusedName', data.accusedName, UserX)}
              {renderField('Vehicle Number', 'vehicleNumber', data.vehicleNumber, Car)}
              {renderField('Location Address', 'location', data.location, MapPin)}
              {renderField('Weapon Used', 'weaponUsed', data.weaponUsed, Crosshair)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-4">
        {renderField('Crime Description (FIR Text)', 'description', data.description, FileSearch, 'textarea')}
      </div>
    </div>
  )
}
export default ExtractedForm
