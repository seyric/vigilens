import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import {
  UploadCard,
  UploadedFilesList,
  PipelineCard,
  SupportedInputsCard,
  GuidelinesCard
} from './components'
import type { UploadedFileItem } from './components/UploadedFilesList'
import { parseImageOCR } from '../../api/ai.api'

function ReportsPage() {
  const navigate = useNavigate()
  const [errorToast, setErrorToast] = useState('')

  const showErrorAndNavigate = (msg: string, route?: string, stateObj?: any) => {
    setErrorToast(msg)
    setTimeout(() => {
      setErrorToast('')
      if (route) {
        if (stateObj) navigate(route, { state: stateObj })
        else navigate(route)
      }
    }, 2500)
  }
  // Mock files array state
  const [files, setFiles] = useState<UploadedFileItem[]>([
    { id: '1', name: 'FIR_1254.pdf', type: 'pdf', size: '1.2 MB', status: 'Processed' },
    { id: '2', name: 'CrimeScene.jpg', type: 'image', size: '3.4 MB', status: 'Processed' },
    { id: '3', name: 'WitnessStatement.pdf', type: 'pdf', size: '820 KB', status: 'Pending Review' },
    { id: '4', name: 'CCTV_Footage.mp4', type: 'video', size: '42.5 MB', status: 'Processing...' }
  ])

  // Delete file callback
  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  // Upload Actions
  const handleUploadFIR = async (file?: File) => {
    const fileName = file ? file.name : 'sample_fir.jpg'
    const imageUrl = file ? URL.createObjectURL(file) : undefined

    try {
      const res = await parseImageOCR({ image_path: "datasets/raw/images/sample_fir.jpg" })
      
      const newFile: UploadedFileItem = {
        id: `fir-${Date.now()}`,
        name: fileName,
        type: 'image',
        size: '1.8 MB',
        status: 'Processed'
      }
      setFiles(prev => [newFile, ...prev])
      
      navigate('/ocr-review', { state: { extractedText: res.extracted_text, fileName, imageUrl } })
    } catch (err) {
      console.error(err)
      showErrorAndNavigate('Failed to parse document text via OCR. Redirecting to review details.', '/ocr-review', { fileName, imageUrl })
    }
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleCapture = async () => {
    setShowCamera(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Camera access denied", err)
      setErrorToast("Camera access denied or unavailable.")
      setTimeout(() => setErrorToast(''), 3000)
      setShowCamera(false)
    }
  }

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const dataUrl = canvasRef.current.toDataURL('image/jpeg')
        const captureFileName = `live_capture_${new Date().getTime()}.jpg`
        // Simulate sending to OCR
        stopCamera()
        
        try {
          const res = await parseImageOCR({ image_path: "datasets/raw/images/sample_fir.jpg" })
          
          const newFile: UploadedFileItem = {
            id: `capture-${Date.now()}`,
            name: captureFileName,
            type: 'image',
            size: '2.4 MB',
            status: 'Processed'
          }
          setFiles(prev => [newFile, ...prev])
          navigate('/ocr-review', { state: { extractedText: res.extracted_text, fileName: captureFileName, imageUrl: dataUrl } })
        } catch (err) {
          showErrorAndNavigate('Failed to parse document text via OCR. Redirecting to review details.', '/ocr-review', { fileName: captureFileName, imageUrl: dataUrl })
        }
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setStream(null)
    setShowCamera(false)
  }

  const handleUploadEvidence = async (file?: File) => {
    const fileName = file ? file.name : `evidence_doc_${Math.floor(Math.random() * 1000)}.pdf`
    const imageUrl = file ? URL.createObjectURL(file) : undefined

    try {
      const res = await parseImageOCR({ image_path: "datasets/raw/images/sample_fir.jpg" })
      
      const newFile: UploadedFileItem = {
        id: `evidence-${Date.now()}`,
        name: fileName,
        type: 'pdf',
        size: '4.2 MB',
        status: 'Processed'
      }
      setFiles(prev => [newFile, ...prev])
      
      navigate('/ocr-review', { state: { extractedText: res.extracted_text, fileName, imageUrl } })
    } catch (err) {
      showErrorAndNavigate('Failed to parse document text via OCR. Redirecting to review details.', '/ocr-review', { fileName, imageUrl })
    }
  }



  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* 2. Responsive 70/30 Split Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* Left Column (approximately 70% -> col-span-7) */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <UploadCard
            onUploadFIR={handleUploadFIR}
            onCapture={handleCapture}
            onUploadEvidence={handleUploadEvidence}
          />
          
          <UploadedFilesList
            files={files}
            onDelete={handleDeleteFile}
          />

          <GuidelinesCard />
        </div>

        {/* Right Column (approximately 30% -> col-span-3) */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <PipelineCard />
          <SupportedInputsCard />
        </div>

      </div>

      {/* Camera Modal Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B1220] border border-[#2563EB]/40 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[#121826]/80 flex justify-between items-center">
              <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE DOCUMENT SCANNER
              </h3>
              <button onClick={stopCamera} className="text-[#94A3B8] hover:text-white cursor-pointer transition-colors p-1 rounded hover:bg-[#182235]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="relative bg-black aspect-video flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} width="1280" height="720" className="hidden" />
              
              {/* Scan Overlay UI */}
              <div className="absolute inset-0 border-[4px] border-dashed border-[#38BDF8]/40 m-8 rounded-lg pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[2px] bg-[#38BDF8]/60 shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            </div>
            
            <div className="p-5 border-t border-[rgba(255,255,255,0.08)] bg-[#121826]/90 flex justify-between items-center">
              <p className="text-[10px] text-[#94A3B8] font-mono tracking-widest uppercase">
                Align document within the dashed markers
              </p>
              <button 
                onClick={takePhoto}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold uppercase tracking-widest text-xs px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer outline-none"
              >
                Scan Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-[#121826]/95 backdrop-blur-md border border-[#EF4444]/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-xl p-4 flex items-start gap-4 min-w-[300px]">
            <div className="h-8 w-8 rounded-full bg-[#EF4444]/20 flex items-center justify-center shrink-0 border border-[#EF4444]/40">
              <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
            </div>
            <div className="flex-1 pt-0.5">
              <h4 className="text-[11px] font-bold text-white tracking-wide uppercase mb-1">System Error</h4>
              <p className="text-[10px] text-[#94A3B8] leading-relaxed font-mono">
                {errorToast}
              </p>
            </div>
            <button 
              onClick={() => setErrorToast('')}
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ReportsPage
