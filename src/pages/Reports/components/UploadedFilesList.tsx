import { FileText, Camera, Video, Trash2 } from 'lucide-react'

export interface UploadedFileItem {
  id: string
  name: string
  type: 'pdf' | 'image' | 'video'
  size: string
  status: 'Processed' | 'Pending Review' | 'Processing...'
}

interface FilesListProps {
  files: UploadedFileItem[]
  onDelete: (id: string) => void
}

export function UploadedFilesList({ files, onDelete }: FilesListProps) {
  const getFileIcon = (type: 'pdf' | 'image' | 'video') => {
    const props = { className: 'h-4 w-4 stroke-1.5' }
    switch (type) {
      case 'image':
        return <div className="h-8.5 w-8.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] flex items-center justify-center shrink-0"><Camera {...props} /></div>
      case 'video':
        return <div className="h-8.5 w-8.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 text-[#8B5CF6] flex items-center justify-center shrink-0"><Video {...props} /></div>
      default:
        return <div className="h-8.5 w-8.5 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center shrink-0"><FileText {...props} /></div>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Processed':
        return (
          <span className="px-2.5 py-0.5 border border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981] text-[8px] font-mono tracking-wider font-extrabold rounded-full uppercase">
            {status}
          </span>
        )
      case 'Pending Review':
        return (
          <span className="px-2.5 py-0.5 border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B] text-[8px] font-mono tracking-wider font-extrabold rounded-full uppercase animate-pulse">
            {status}
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-0.5 border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#2563EB] text-[8px] font-mono tracking-wider font-extrabold rounded-full uppercase">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="border-b border-[rgba(255,255,255,0.06)] pb-3">
        <h2 className="text-xs font-extrabold text-white tracking-widest uppercase font-mono">
          Uploaded Files
        </h2>
      </div>

      {/* Files Rows list container */}
      <div className="space-y-2.5">
        {files.length === 0 ? (
          <p className="text-[#94A3B8]/60 text-xs italic py-4 text-center">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2.5 bg-[#0B1220] hover:bg-[#182235]/40 border border-[rgba(255,255,255,0.04)] hover:border-white/10 rounded-xl transition-all duration-150 group shadow-inner"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div className="font-sans">
                  <span className="text-white font-extrabold text-[11.5px] block truncate max-w-[170px] sm:max-w-xs">{file.name}</span>
                  <span className="text-[#94A3B8]/50 text-[9px] font-mono uppercase tracking-wider block mt-0.5">{file.size}</span>
                </div>
              </div>

              {/* Status Badge & Delete Control */}
              <div className="flex items-center gap-4">
                {getStatusBadge(file.status)}
                
                <button
                  onClick={() => onDelete(file.id)}
                  title="Remove file"
                  className="h-7 w-7 rounded bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] hover:bg-[#EF4444] hover:text-white flex items-center justify-center cursor-pointer transition-all outline-none"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
export default UploadedFilesList
