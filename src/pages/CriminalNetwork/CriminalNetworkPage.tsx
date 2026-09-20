import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles, X } from 'lucide-react'
import PageLoader from '../../components/ui/PageLoader'
import {
  GraphCanvas,
  NodeCard,
  InvestigationFilters,
  RelationshipTimeline
} from './components'
import { getSuspectNetwork } from '../../api/analytics.api'
import { mockNodes, mockLinks, mockEntityProfiles } from './data/MockGraphData'



function CriminalNetworkPage() {
  const navigate = useNavigate()

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCase, setSelectedCase] = useState('all')
  const [selectedCrimeType, setSelectedCrimeType] = useState('all')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [relationshipDepth, setRelationshipDepth] = useState('2')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Selected Entity State
  const [selectedNodeId, setSelectedNodeId] = useState<string>('Rahul Kumar')

  // Graph Canvas State
  const [nodes, setNodes] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string | null>(null)

  // Toolbar state triggers
  const [resetTrigger, setResetTrigger] = useState(0)
  const [centerTrigger, setCenterTrigger] = useState(0)
  const [expandTrigger, setExpandTrigger] = useState(0)

  useEffect(() => {
    const loadGraph = async () => {
      try {
        setError(null)
        setLoading(true)
        const data = await getSuspectNetwork()
        const rawNodes = Array.isArray(data?.nodes) ? data.nodes : []
        const rawEdges = Array.isArray(data?.edges) ? data.edges : []

        // Merge raw API nodes with our detailed mockNodes to ensure all forensic nodes exist
        const mergedNodesMap = new Map()
        
        // Load mock nodes first
        mockNodes.forEach(node => {
          mergedNodesMap.set(node.id.toLowerCase(), node)
        })

        // Merge API nodes
        rawNodes.forEach((node: any) => {
          const key = node.id.toLowerCase()
          if (!mergedNodesMap.has(key)) {
            // Coordinate mapping for new API nodes
            const numNodes = mergedNodesMap.size
            const angle = (numNodes * 0.4) * 2 * Math.PI
            const radius = 35
            const x = 50 + radius * Math.cos(angle)
            const y = 50 + radius * Math.sin(angle)

            mergedNodesMap.set(key, {
              id: node.id,
              label: node.label || node.id,
              type: node.type || 'suspect',
              x: Math.max(8, Math.min(92, x)),
              y: Math.max(8, Math.min(92, y)),
              isHighRisk: node.status === 'Active' || node.isHighRisk
            })
          }
        })

        const mergedLinksMap = new Map()
        mockLinks.forEach(link => {
          mergedLinksMap.set(`${link.source}->${link.target}`, link)
        })
        rawEdges.forEach((edge: any) => {
          const key = `${edge.source}->${edge.target}`
          if (!mergedLinksMap.has(key)) {
            mergedLinksMap.set(key, {
              source: edge.source,
              target: edge.target
            })
          }
        })

        setNodes(Array.from(mergedNodesMap.values()))
        setLinks(Array.from(mergedLinksMap.values()))

      } catch (err) {
        console.error(err)
        // Fallback gracefully to detailed mock nodes
        setNodes(mockNodes)
        setLinks(mockLinks)
      } finally {
        setLoading(false)
      }
    }
    loadGraph()
  }, [])

  // Retrieve active selected node profile details
  const activeProfile = useMemo(() => {
    const profile = mockEntityProfiles[selectedNodeId]
    if (profile) return profile

    // Fallback if node profile not explicitly defined
    const node = nodes.find(n => n.id === selectedNodeId)
    return {
      name: node?.label || selectedNodeId,
      type: node?.type ? node.type.charAt(0).toUpperCase() + node.type.slice(1) : 'Suspect',
      associatedCases: 'Burglary FIR-123456',
      aliases: 'N/A',
      linkedEvidence: 'N/A',
      riskLevel: node?.isHighRisk ? 'High' : 'Medium' as 'High' | 'Medium' | 'Low',
      status: 'Active',
      notes: 'Forensic relationship mapping record loaded in memory.'
    }
  }, [selectedNodeId, nodes])

  // Filter nodes & links dynamically for local UI visualization
  const filteredNodes = useMemo(() => {
    let result = nodes

    // Filter by case
    if (selectedCase !== 'all') {
      result = result.filter(n => {
        if (n.id === selectedCase) return true
        const p = mockEntityProfiles[n.id]
        return p?.associatedCases.includes(selectedCase)
      })
    }

    // Filter by crime type
    if (selectedCrimeType !== 'all') {
      result = result.filter(n => {
        if (n.type === 'crime' && n.id.toLowerCase().includes(selectedCrimeType.replace('_', ' '))) return true
        const p = mockEntityProfiles[n.id]
        return p?.associatedCases.toLowerCase().includes(selectedCrimeType.replace('_', ' '))
      })
    }

    // Filter by district location
    if (selectedDistrict !== 'all') {
      result = result.filter(n => {
        if (n.type === 'location' && n.id.toLowerCase() === selectedDistrict.toLowerCase()) return true
        const p = mockEntityProfiles[n.id]
        return p?.notes.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
               p?.associatedCases.toLowerCase().includes(selectedDistrict.toLowerCase())
      })
    }

    return result
  }, [nodes, selectedCase, selectedCrimeType, selectedDistrict])

  // Ensure links only connect active filtered nodes
  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id))
    return links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target))
  }, [links, filteredNodes])

  // Click Action Handlers
  const generateDossierPDF = async (profile: any) => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(22)
      doc.setTextColor(220, 38, 38)
      doc.text("CLASSIFIED DOSSIER", 105, 20, { align: "center" })

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text(`Target Name: ${profile.name}`, 20, 40)
      
      doc.setFontSize(12)
      doc.text(`Entity Type: ${profile.type}`, 20, 50)
      doc.text(`Aliases: ${profile.aliases}`, 20, 60)
      doc.text(`Associated Cases: ${profile.associatedCases}`, 20, 70)
      doc.text(`Linked Evidence: ${profile.linkedEvidence}`, 20, 80)
      doc.text(`Risk Level: ${profile.riskLevel}`, 20, 90)
      doc.text(`Status: ${profile.status}`, 20, 100)
      
      doc.text("Investigative Notes:", 20, 120)
      doc.setFontSize(10)
      const lines = doc.splitTextToSize(profile.notes, 170)
      doc.text(lines, 20, 130)

      doc.save(`dossier_${profile.name.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error(error)
      alert("Failed to generate dossier PDF.")
    }
  }

  const handleNodeAction = (actionName: string) => {
    if (actionName === 'Open Investigation Workspace') {
      navigate('/investigation')
    } else if (actionName === 'Compare Similar Crimes') {
      navigate('/crime-database')
    } else if (actionName === 'Generate Intelligence Report') {
      generateDossierPDF(activeProfile)
    } else {
      alert(`[OPERATION SUCCESS] Triggering action for ${activeProfile.name}:\n- Execution: ${actionName}\n- Secure credentials signed.`)
    }
  }

  const handleGraphReset = () => setResetTrigger(prev => prev + 1)
  const handleGraphCenter = () => setCenterTrigger(prev => prev + 1)
  const handleGraphExpand = () => setExpandTrigger(prev => prev + 1)

  if (loading) {
    return <PageLoader message="Loading suspect network..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[#EF4444] font-mono text-sm tracking-widest">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* 2. Top Investigation Filters Panel */}
      <InvestigationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCase={selectedCase}
        onCaseChange={setSelectedCase}
        selectedCrimeType={selectedCrimeType}
        onCrimeTypeChange={setSelectedCrimeType}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        relationshipDepth={relationshipDepth}
        onDepthChange={setRelationshipDepth}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
      />

      {/* 3. Graph Workspace Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        
        {/* Left column: Graph view (70% width on desktop -> col-span-7) */}
        <div className="col-span-1 lg:col-span-7 space-y-4 h-full">
          <div className="relative h-full">
            <GraphCanvas
              searchQuery={searchQuery}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onResetTrigger={resetTrigger}
              onCenterTrigger={centerTrigger}
              onExpandTrigger={expandTrigger}
              nodes={filteredNodes}
              links={filteredLinks}
            />

            {/* Canvas overlay utility toolbar */}
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                onClick={handleGraphReset}
                title="Reset Layout"
                className="p-2 bg-[#111827]/90 hover:bg-[#182235] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white rounded-lg transition-colors cursor-pointer outline-none"
              >
                Reset
              </button>
              <button
                onClick={handleGraphCenter}
                title="Center Graph"
                className="p-2 bg-[#111827]/90 hover:bg-[#182235] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white rounded-lg transition-colors cursor-pointer outline-none"
              >
                Center
              </button>
              <button
                onClick={handleGraphExpand}
                title="Expand Zoom"
                className="p-2 bg-[#111827]/90 hover:bg-[#182235] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white rounded-lg transition-colors cursor-pointer outline-none"
              >
                Zoom+
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Selected Node Details (30% width -> col-span-3) */}
        <div className="col-span-1 lg:col-span-3 h-full">
          <NodeCard
            profile={activeProfile}
            onAction={handleNodeAction}
          />
        </div>

      </div>

      {/* 4. Horizontal AI Insights Panel */}
      {aiInsight && (
        <div className="bg-[#111827] border border-[#2563EB]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(37,99,235,0.1)] animate-fade-in relative mt-6">
          <button 
            onClick={() => setAiInsight(null)}
            className="absolute top-4 right-4 text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
            <div className="h-10 w-10 rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-wide">
                AI Intelligence Brief
              </h3>
              <p className="text-[#94A3B8] text-xs font-mono uppercase tracking-widest mt-0.5">
                Target Profile: {activeProfile.name}
              </p>
            </div>
          </div>

          <div className="text-sm text-[#E2E8F0] leading-relaxed">
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[#F8FAFC] prose-headings:font-extrabold prose-a:text-[#2563EB] prose-strong:text-white prose-li:marker:text-[#2563EB]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiInsight || ''}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* 5. Horizontal Relationship Timeline (Full-Width Bottom) */}
      <RelationshipTimeline
        selectedEntityName={activeProfile.name}
        selectedEntityType={activeProfile.type}
      />

    </div>
  )
}

export default CriminalNetworkPage
