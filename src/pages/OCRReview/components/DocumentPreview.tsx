import { Eye, Download, FileText, Clock, FileCheck } from 'lucide-react'

interface PreviewProps {
  fileName: string
  uploadTime: string
  docType: string
  imageUrl?: string
  onView: () => void
  onDownload: () => void
}

export function DocumentPreview({ fileName, uploadTime, docType, imageUrl, onView, onDownload }: PreviewProps) {
  return (
    <div className="group flex h-full flex-col bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-3xl p-5 shadow-sm select-none animate-fade-in">
      <div className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#0F172A] border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-[0.18em] uppercase font-mono">
                Uploaded FIR Preview
              </h2>
              <p className="mt-1 text-[10px] text-[#94A3B8] uppercase tracking-widest">
                Review scanned FIR document before verification
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-[#94A3B8]/15 bg-white/5 px-3 py-1 text-[8px] font-mono uppercase tracking-widest text-[#94A3B8]">
            <span>Enterprise Scan</span>
          </span>
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-5 shadow-inner">
        {imageUrl ? (
          <div className="mx-auto flex h-[280px] w-full max-w-[280px] items-center justify-center rounded-3xl overflow-hidden shadow-lg border border-slate-700/50 bg-black">
            {fileName.toLowerCase().endsWith('.pdf') ? (
              <embed src={imageUrl} type="application/pdf" className="h-full w-full opacity-90" />
            ) : (
              <img src={imageUrl} alt={fileName} className="h-full w-full object-cover opacity-90" />
            )}
          </div>
        ) : (
          <div className="mx-auto flex h-[280px] max-w-[280px] flex-col justify-between rounded-3xl border border-slate-700/50 bg-slate-950 p-4 shadow-lg">
            <div className="space-y-2">
              <div className="h-1.5 w-14 rounded-full bg-slate-800" />
              <div className="h-1 w-20 rounded-full bg-slate-800" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-slate-800" />
              <div className="h-3 w-5/6 rounded-full bg-slate-800" />
              <div className="h-3 w-11/12 rounded-full bg-slate-800" />
              <div className="h-3 w-3/4 rounded-full bg-slate-800" />
              <div className="h-3 w-4/5 rounded-full bg-slate-800" />
            </div>

            <div className="flex items-center justify-between rounded-2xl border-t border-slate-800 pt-3 text-[10px] text-[#94A3B8]">
              <span className="inline-flex h-2.5 w-10 rounded-full bg-slate-800" />
              <span className="inline-flex h-2.5 w-8 rounded-full bg-[#2563EB]/40" />
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_28%)]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB]/15 text-[#FFFFFF] shadow-xl backdrop-blur-sm">
            <Eye className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-xs text-[#94A3B8]">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#2563EB]" />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-[#94A3B8]">File Name</p>
              <p className="text-sm font-semibold text-white">{fileName}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#F8FAFC]">Document</span>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#38BDF8]" />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-[#94A3B8]">Upload Time</p>
              <p className="text-sm font-semibold text-white">{uploadTime}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#F8FAFC]">Timestamp</span>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-[#10B981]" />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-[#94A3B8]">Document Type</p>
              <p className="text-sm font-semibold text-white">{docType}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#F8FAFC]">Verified</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={onView}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0B1220] px-4 text-[10px] font-bold uppercase tracking-widest text-white transition duration-150 hover:border-[#2563EB]/40 hover:bg-[#182235]"
        >
          <Eye className="h-4 w-4 text-[#2563EB]" />
          <span>View Full</span>
        </button>

        <button
          onClick={onDownload}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0B1220] px-4 text-[10px] font-bold uppercase tracking-widest text-white transition duration-150 hover:border-[#2563EB]/40 hover:bg-[#182235]"
        >
          <Download className="h-4 w-4 text-[#2563EB]" />
          <span>Download</span>
        </button>
      </div>
    </div>
  )
}
export default DocumentPreview
