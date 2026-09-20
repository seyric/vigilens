import { Plus, Minus, RefreshCw } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 select-none">
      <button
        onClick={onZoomIn}
        title="Zoom In"
        className="h-8.5 w-8.5 bg-[#111827]/90 border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#182235] hover:border-[rgba(255,255,255,0.15)] transition-all duration-150 shadow-md font-bold"
      >
        <Plus className="h-4.5 w-4.5" />
      </button>
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        className="h-8.5 w-8.5 bg-[#111827]/90 border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#182235] hover:border-[rgba(255,255,255,0.15)] transition-all duration-150 shadow-md font-bold"
      >
        <Minus className="h-4.5 w-4.5" />
      </button>
      <button
        onClick={onReset}
        title="Recenter Map"
        className="h-8.5 w-8.5 bg-[#111827]/90 border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#182235] hover:border-[rgba(255,255,255,0.15)] transition-all duration-150 shadow-md font-bold"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  )
}
export default MapControls
