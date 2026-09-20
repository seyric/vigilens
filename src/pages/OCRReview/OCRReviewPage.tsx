import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Database, X } from 'lucide-react'
import {
  DocumentPreview,
  ExtractedForm
} from './components'
import type { ExtractedFormData } from './components'

function OCRReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const stateData = location.state as { extractedText?: string; fileName?: string; imageUrl?: string } | null
  
  // Standard sleek mock document for when they go directly to this page
  const MOCK_FIR_IMAGE = "/final_report_FIR_2026_55243.pdf"

  // Form fields state
  const [formData, setFormData] = useState<ExtractedFormData>({
    firNumber: 'FIR123456',
    crimeType: 'Theft',
    date: '12 May 2025',
    time: '14:30',
    district: 'Bengaluru Urban',
    policeStation: 'JC Nagar',
    officer: 'Inspector Ramesh',
    victimName: 'Suresh Babu',
    accusedName: 'Ravi Kumar',
    vehicleNumber: 'KA01AB1234',
    weaponUsed: 'Iron Rod',
    location: '12th Cross, JC Nagar',
    description: stateData?.extractedText || 'A residential burglary was reported at JC Nagar. Rear entry was forced. Cash and jewellery worth 4.5 Lakhs were stolen. CCTV footage is under analysis.'
  })

  // Handle individual field edits
  const handleFieldChange = (field: keyof ExtractedFormData, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val
    }))
  }

  // Document action triggers
  const [showFullView, setShowFullView] = useState(false)

  const handleViewDocument = () => {
    setShowFullView(true)
  }

  const handleDownloadCopy = () => {
    const link = document.createElement('a')
    link.href = stateData?.imageUrl || MOCK_FIR_IMAGE
    link.download = stateData?.fileName || "FIR_1254.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const handleDialogClose = () => {
    setShowSaveDialog(false)
    navigate('/crime-database')
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* 2. Responsive 40/60 Split Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        
        {/* Left Column (approximately 40% -> col-span-4) */}
        <div className="col-span-1 lg:col-span-4">
          <DocumentPreview
            fileName={stateData?.fileName || "FIR_1254.pdf"}
            imageUrl={stateData?.imageUrl || MOCK_FIR_IMAGE}
            uploadTime="13 May 2025, 10:45 AM"
            docType="FIR Report (PDF)"
            onView={handleViewDocument}
            onDownload={handleDownloadCopy}
          />
        </div>

        {/* Right Column (approximately 60% -> col-span-6) */}
        <div className="col-span-1 lg:col-span-6 space-y-6">
          <ExtractedForm
            data={formData}
            onChange={handleFieldChange}
          />
        </div>

      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.1)] rounded-xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
              <Database className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Saved Successfully</h3>
            <p className="text-sm text-[#94A3B8] mb-6">
              FIR {formData.firNumber} has been successfully parsed and saved into the Crime Database.
            </p>
            <button
              onClick={handleDialogClose}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Continue to Database
            </button>
          </div>
        </div>
      )}

      {/* Full Screen Image View */}
      {showFullView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-[#0B1220] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)]">
            <div className="flex justify-between items-center p-4 border-b border-[rgba(255,255,255,0.06)] bg-[#121826]/80 shrink-0">
              <h3 className="text-white font-mono uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Document Viewer - {stateData?.fileName || "FIR_1254.pdf"}
              </h3>
              <button onClick={() => setShowFullView(false)} className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/10 outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4">
              {(stateData?.fileName || "FIR_1254.pdf").toLowerCase().endsWith('.pdf') ? (
                <embed src={stateData?.imageUrl || MOCK_FIR_IMAGE} type="application/pdf" className="w-full h-full rounded-xl bg-white/5" />
              ) : (
                <img src={stateData?.imageUrl || MOCK_FIR_IMAGE} alt="Document View" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default OCRReviewPage
