import { useRef } from 'react'
import { UploadCloud, FileUp, Camera, Paperclip } from 'lucide-react'

interface UploadCardProps {
  onUploadFIR: (file?: File) => void
  onCapture: () => void
  onUploadEvidence: (file?: File) => void
}

export function UploadCard({ onUploadFIR, onCapture, onUploadEvidence }: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const evidenceInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFIR(e.target.files[0])
    }
  }

  const handleEvidenceClick = () => {
    evidenceInputRef.current?.click()
  }

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadEvidence(e.target.files[0])
    }
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 shadow-sm space-y-6 select-none animate-fade-in">
      
      {/* Drag & Drop Visual Area */}
      <div 
        onClick={handleUploadClick}
        className="border-2 border-dashed border-[rgba(255,255,255,0.08)] hover:border-[#2563EB]/40 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all bg-[#0B1220]/40 group cursor-pointer"
      >
        <div className="h-14 w-14 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] mb-4 group-hover:scale-105 transition-transform shadow-inner">
          <UploadCloud className="h-7 w-7 stroke-1.2 animate-pulse" />
        </div>
        
        <h3 className="text-white font-extrabold text-sm tracking-wide">
          Upload FIR Documents
        </h3>
        
        <p className="text-[#94A3B8] text-xs mt-1.5 font-medium">
          Drag & Drop FIR documents or <span className="text-[#2563EB] hover:underline font-bold">click to browse</span>
        </p>
        
        <p className="text-[#94A3B8]/40 text-[10px] font-mono tracking-wider uppercase mt-3">
          Supported formats: PDF, JPG, PNG, JPEG
        </p>
      </div>

      {/* Button Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Button 1: Upload FIR */}
        <button
          onClick={handleUploadClick}
          className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[10px] tracking-widest uppercase py-3.5 rounded-lg transition-all duration-150 cursor-pointer outline-none hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
        >
          <FileUp className="h-4 w-4" />
          <span>Upload FIR</span>
        </button>

        {/* Button 2: Capture Image */}
        <button
          onClick={onCapture}
          className="flex items-center justify-center gap-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-white font-bold text-[10px] tracking-widest uppercase py-3.5 rounded-lg transition-all duration-150 cursor-pointer outline-none hover:bg-[#182235]/40"
        >
          <Camera className="h-4 w-4 text-[#2563EB]" />
          <span>Capture Image</span>
        </button>

        {/* Button 3: Upload Evidence */}
        <button
          onClick={handleEvidenceClick}
          className="flex items-center justify-center gap-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-white font-bold text-[10px] tracking-widest uppercase py-3.5 rounded-lg transition-all duration-150 cursor-pointer outline-none hover:bg-[#182235]/40"
        >
          <Paperclip className="h-4 w-4 text-[#2563EB]" />
          <span>Upload Evidence</span>
        </button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <input 
        type="file" 
        ref={evidenceInputRef} 
        onChange={handleEvidenceChange} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png,.mp4"
      />
    </div>
  )
}
export default UploadCard
