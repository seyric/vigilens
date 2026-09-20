import { useState, useEffect, useMemo } from 'react'
import {
  User,
  FileText,
  Car,
  Phone,
  MapPin,
  AlertTriangle,
  Users,
  Building,
  ShieldAlert,
  Shield,
  ClipboardCheck
} from 'lucide-react'
import { mockNodes, mockLinks } from '../data/MockGraphData'
import type { GraphNode, GraphLink } from '../data/MockGraphData'
import GraphLegend from './GraphLegend'

interface GraphCanvasProps {
  searchQuery: string
  selectedNodeId: string
  onSelectNode: (id: string) => void
  onResetTrigger: number
  onCenterTrigger: number
  onExpandTrigger: number
  nodes?: GraphNode[]
  links?: GraphLink[]
}

export function GraphCanvas({
  searchQuery,
  selectedNodeId,
  onSelectNode,
  onResetTrigger,
  onCenterTrigger,
  onExpandTrigger,
  nodes = mockNodes,
  links = mockLinks
}: GraphCanvasProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  
  // Basic translation & scale states to support toolbar interactions
  const [zoom, setZoom] = useState(1.0)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  // Sync toolbar actions
  useEffect(() => {
    if (onResetTrigger > 0) {
      setZoom(1.0)
      setTranslateX(0)
      setTranslateY(0)
    }
  }, [onResetTrigger])

  useEffect(() => {
    if (onCenterTrigger > 0) {
      setTranslateX(0)
      setTranslateY(0)
    }
  }, [onCenterTrigger])

  useEffect(() => {
    if (onExpandTrigger > 0) {
      setZoom((prev) => Math.min(prev + 0.25, 2.0))
    }
  }, [onExpandTrigger])

  // Get matching node color
  const getNodeColor = (node: GraphNode) => {
    if (node.isHighRisk) return 'bg-[#EF4444] border-[#EF4444]/40 shadow-[0_0_14px_rgba(239,68,68,0.35)]'
    if (node.id === selectedNodeId) return 'bg-[#2563EB] border-white shadow-[0_0_14px_rgba(37,99,235,0.45)]'
    
    switch (node.type) {
      case 'suspect': return 'bg-[#2563EB] border-[#2563EB]/40' // Blue
      case 'associate': return 'bg-[#3b82f6] border-[#3b82f6]/40' // Light blue
      case 'crime': return 'bg-[#F97316] border-[#F97316]/40' // Orange
      case 'vehicle': return 'bg-[#10B981] border-[#10B981]/40' // Green
      case 'phone': return 'bg-[#8B5CF6] border-[#8B5CF6]/40' // Purple
      case 'officer': return 'bg-[#EC4899] border-[#EC4899]/40' // Pink
      case 'evidence': return 'bg-[#14B8A6] border-[#14B8A6]/40' // Teal
      case 'location': return 'bg-[#64748B] border-[#64748B]/40' // Gray
      default: return 'bg-[#64748B] border-[#64748B]/40' // Gray
    }
  }

  // Get node Lucide icon
  const getNodeIcon = (type: string) => {
    const props = { className: 'h-3.5 w-3.5 text-white' }
    switch (type) {
      case 'suspect': return <User {...props} />
      case 'associate': return <Users {...props} />
      case 'crime': return <FileText {...props} />
      case 'vehicle': return <Car {...props} />
      case 'phone': return <Phone {...props} />
      case 'location': return <MapPin {...props} />
      case 'weapon': return <ShieldAlert {...props} />
      case 'station': return <Building {...props} />
      case 'officer': return <Shield {...props} />
      case 'evidence': return <ClipboardCheck {...props} />
      default: return <AlertTriangle {...props} />
    }
  }

  // Highlight based on hover OR locked selection
  const activeNodeId = hoveredNodeId || selectedNodeId

  // Calculate connected nodes set
  const connectedNodeIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>()
    const set = new Set<string>([activeNodeId])
    links.forEach((link) => {
      if (link.source === activeNodeId) set.add(link.target)
      if (link.target === activeNodeId) set.add(link.source)
    })
    return set
  }, [activeNodeId, links])

  // Check if link is highlighted
  const isLinkHighlighted = (link: GraphLink) => {
    if (!activeNodeId) return false
    return link.source === activeNodeId || link.target === activeNodeId
  }

  return (
    <div id="graph-canvas-container" className="relative w-full h-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden select-none animate-fade-in group shadow-inner">
      
      {/* Background grids */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_100%)] pointer-events-none" />
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
      />

      {/* Network Canvas layout */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300"
        style={{
          transform: `scale(${zoom}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: 'center center'
        }}
      >
        <div className="relative w-full h-full shrink-0">
          
          {/* 1. SVG connection paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link, idx) => {
              const sourceNode = nodes.find((n) => n.id === link.source)
              const targetNode = nodes.find((n) => n.id === link.target)
              if (!sourceNode || !targetNode) return null

              const isHighlighted = isLinkHighlighted(link)
              const isDimmed = activeNodeId !== null && !isHighlighted

              return (
                <line
                  key={`link-${idx}`}
                  x1={`${sourceNode.x}%`}
                  y1={`${sourceNode.y}%`}
                  x2={`${targetNode.x}%`}
                  y2={`${targetNode.y}%`}
                  stroke={isHighlighted ? '#2563EB' : 'rgba(255,255,255,0.08)'}
                  strokeWidth={isHighlighted ? '2' : '0.85'}
                  strokeDasharray={isHighlighted ? 'none' : '3 3'}
                  className="transition-all duration-200"
                  style={{
                    opacity: isDimmed ? 0.12 : 1.0
                  }}
                />
              )
            })}
          </svg>

          {/* 2. Nodes Layer */}
          {nodes.map((node) => {
            const isHovered = hoveredNodeId === node.id
            const isSelected = selectedNodeId === node.id
            const isConnected = activeNodeId === null || connectedNodeIds.has(node.id)
            const isSearchMatch = searchQuery.trim() !== '' && node.label.toLowerCase().includes(searchQuery.toLowerCase())
            const colorClass = getNodeColor(node)

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => onSelectNode(node.id)}
                className={`absolute shrink-0 flex flex-col items-center cursor-pointer select-none transition-all duration-200 z-10 ${
                  isConnected ? 'opacity-100 scale-100' : 'opacity-25 scale-90'
                }`}
                style={{
                  top: `${node.y}%`,
                  left: `${node.x}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Visual node sphere */}
                <div
                  className={`h-8.5 w-8.5 rounded-full border-2 flex items-center justify-center transition-all ${colorClass} ${
                    isHovered || isSelected ? 'ring-4 ring-[#2563EB]/35 scale-110 border-white' : 'border-white/10'
                  } ${
                    isSearchMatch ? 'ring-4 ring-[#EF4444]/65 animate-pulse border-[#EF4444]' : ''
                  }`}
                >
                  {getNodeIcon(node.type)}
                </div>

                {/* Node Label tag */}
                <span className={`mt-1 text-[8.5px] font-mono font-bold tracking-wide bg-[#111827]/90 px-1.5 py-0.5 rounded border shadow-md max-w-[110px] truncate text-center transition-colors ${
                  isSelected ? 'text-white border-[#2563EB]' : 'text-[#94A3B8] border-white/5'
                }`}>
                  {node.label}
                </span>
              </div>
            )
          })}

        </div>
      </div>

      {/* Floating graph status tags */}
      <div className="absolute top-4 right-4 text-[8px] font-mono uppercase tracking-widest text-[#2563EB] bg-[#111827]/80 border border-white/5 px-2.5 py-1 rounded">
        MAP MATRIX // {nodes.length} NODES MAPPED
      </div>

      {/* Embedded Bottom Left Legend */}
      <GraphLegend />

    </div>
  )
}

export default GraphCanvas
