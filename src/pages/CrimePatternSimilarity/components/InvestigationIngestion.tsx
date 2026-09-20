import React, { useRef, useState } from 'react'
import { Upload, Database } from 'lucide-react'

interface InvestigationIngestionProps {
  onCaseSelected: (caseId: string, isUploaded?: boolean) => void
  isAnalyzing: boolean
}

export function InvestigationIngestion({ onCaseSelected, isAnalyzing }: InvestigationIngestionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const activeCasesList = [
    { id: 'FIR-2024-119', desc: 'Burglary at J.C. Nagar Sector 4 (Rahul Kumar case)' },
    { id: 'FIR-2024-204', desc: 'Highway Robbery Bypass intercept (Amit Singh case)' },
    { id: 'FIR-2024-305', desc: 'Mysuru Logistics Warehouse robbery' },
    { id: 'FIR-2024-411', desc: 'Phishing Campaign targeting JC Bank (Kiran Gowda case)' }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (isAnalyzing) return

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      onCaseSelected(file as any, true)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAnalyzing) return
    if (e.target.files && e.target.files[0]) {
      onCaseSelected(e.target.files[0] as any, true)
    }
  }

  const triggerBrowse = () => {
    if (isAnalyzing) return
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] select-none">
      
      {/* Title */}
      <div className="flex justify-between items-start mb-5 border-b border-[rgba(255,255,255,0.04)] pb-3">
        <div>
          <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">Upload or Select Investigation</h3>
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] mt-1">Provide target case to execute comparison search</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Upload FIR */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all min-h-[140px] cursor-pointer group ${
            isDragActive
              ? 'border-[#2563EB] bg-[#2563EB]/5 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
              : 'border-[rgba(255,255,255,0.08)] hover:border-[#2563EB]/40 bg-[#0B1220]/40'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] mb-2.5 group-hover:scale-105 transition-transform">
            <Upload className="h-5 w-5" />
          </div>

          <h4 className="text-white font-bold text-xs">Drag & Drop FIR Document</h4>
          <p className="text-[#94A3B8] text-[9.5px] mt-1">
            or <span className="text-[#2563EB] hover:underline font-bold">browse local files</span> (PDF, DOCX, TXT, Scanned FIR)
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isAnalyzing}
            className="hidden"
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          />
        </div>

        {/* Panel 2: Select Existing Investigation */}
        <div className="border border-[rgba(255,255,255,0.06)] rounded-xl p-6 bg-[#0B1220]/20 flex flex-col justify-between min-h-[140px]">
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
              <Database className="h-4 w-4 text-[#2563EB]" />
              <span>Select Active KSP Case File</span>
            </h4>
            <p className="text-[#94A3B8]/60 text-[9px] leading-relaxed">
              Compare an existing, registered FIR in the database against the historical crime repositories.
            </p>
          </div>

          <div className="relative mt-4">
            <select
              disabled={isAnalyzing}
              onChange={(e) => {
                if (e.target.value) onCaseSelected(e.target.value, false)
              }}
              defaultValue=""
              className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs font-semibold text-white px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-all"
            >
              <option value="" disabled className="text-[#94A3B8]/40">-- Choose case index target --</option>
              {activeCasesList.map((item) => (
                <option key={item.id} value={item.id} className="bg-[#111827] text-white">
                  {item.id} • {item.desc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

    </div>
  )
}

export default InvestigationIngestion
