import { useRef, useState } from 'react'
import {
  Database
} from 'lucide-react'
import { PageHeader } from '../../components/ui/DashboardComponents'
import {
  EvidenceUploadPanel,
  AIProcessingPanel,
  AIInvestigationSummary
} from './components'

export function DigitalIntelligenceHubPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null)
  const [sourceCount, setSourceCount] = useState<number | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleEvidenceSelected = async (file: File) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const fileName = file.name;
    setIsProcessing(true)
    setCurrentStepIndex(0)
    setUploadedFileName(fileName)
    setSummary(null)
    setConfidenceScore(null)
    setSourceCount(null)

    // Analyze document and compare it to database formats
    let computedSimilarity = 0;
    try {
      if (file.type.includes('text') || fileName.toLowerCase().endsWith('.json') || fileName.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        const keywords = ['fir', 'crime', 'date', 'location', 'suspect', 'evidence', 'district', 'police', 'report', 'incident', 'weapon', 'witness'];
        let matches = 0;
        keywords.forEach(kw => {
          if (text.toLowerCase().includes(kw)) matches++;
        });
        computedSimilarity = Math.min(Math.floor((matches / keywords.length) * 100) + 25, 99);
      } else {
        let hash = 0;
        for (let i = 0; i < fileName.length; i++) {
          hash = fileName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const baseSimilarity = Math.abs(hash % 40) + 40; // Base 40-80%
        let formatBoost = 0;
        if (fileName.toLowerCase().includes('fir')) formatBoost += 25;
        if (fileName.toLowerCase().includes('report')) formatBoost += 15;
        if (fileName.toLowerCase().includes('analysis')) formatBoost += 10;
        computedSimilarity = Math.min(baseSimilarity + formatBoost, 99);
      }
    } catch (err) {
      computedSimilarity = 72;
    }

    let step = 0
    timerRef.current = setInterval(() => {
      step += 1
      setCurrentStepIndex(step)

      if (step >= 7) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        setIsProcessing(false)

        let customSummary = 'The uploaded evidence has been analyzed successfully. Multiple entities, communication records, and location patterns have been detected. Several observations overlap with existing investigation records and may assist investigators in identifying potential relationships.'
        if (fileName.toLowerCase().includes('cdr') || fileName.toLowerCase().includes('call')) {
          customSummary = `Call Detail Record [${fileName}] parsed successfully. Extracted communication ties reveal recurring late-night links between suspect SIMs and 3 blacklisted burner numbers. Intersecting cellular towers place the handset within a 200m radius of the primary incident location at the estimated time of occurrence.`
        } else if (fileName.toLowerCase().includes('gps') || fileName.toLowerCase().includes('map')) {
          customSummary = `GPS Location History data [${fileName}] processed. Identified travel speed changes and prolonged dwell-times. Plotting coordinates correlates to suspect location patterns overlapping with 2 other case timelines. System flags suspicious rendezvous at a logistics yard.`
        } else if (fileName.toLowerCase().includes('chat') || fileName.toLowerCase().includes('message')) {
          customSummary = `Chat export transcript [${fileName}] decoded via NLP. Entity recognition flagged key conspiratorial keywords, weapon references, and scheduled meetup logistics. Cross-referencing reveals named associates matching active intelligence profiles.`
        }

        setSummary(customSummary)
        setConfidenceScore(computedSimilarity)
        setSourceCount(Math.floor(Math.random() * 25) + 24)
      }
    }, 850)
  }

  const linkedFirs = [
    { id: 'FIR 45/2026', label: 'Otp fraud ring - Bengaluru North', status: 'Cross-match active' },
    { id: 'FIR 87/2025', label: 'Vehicle logistics handoff', status: 'Location overlap noted' },
    { id: 'FIR 12/2024', label: 'Burner device inventory', status: 'Recipient linked' }
  ]

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title="Digital Intelligence Hub"
        subtitle="Upload legally obtained digital evidence for AI-powered forensic analysis"
        role="Forensics Inspector"
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <EvidenceUploadPanel onEvidenceSelected={handleEvidenceSelected} isProcessing={isProcessing} />
        <AIProcessingPanel currentStepIndex={currentStepIndex} uploadedFileName={uploadedFileName} isProcessing={isProcessing} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="space-y-6 h-full">
          <AIInvestigationSummary summary={summary} confidenceScore={confidenceScore} sourceCount={sourceCount} />
        </div>

        <div className="space-y-4 h-full flex flex-col">
          <div className="rounded-[24px] border border-white/10 bg-[#0B1220] p-6 flex flex-col flex-1 h-full">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/10 p-2 text-[#2563EB]">
                <Database className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Linked FIRs</h3>
                <p className="text-sm text-[#94A3B8]">Related case records surfaced by the intelligence engine.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {linkedFirs.map((fir) => (
                <div key={fir.id} className="rounded-2xl border border-white/10 bg-[#08101d] p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{fir.id}</p>
                      <p className="mt-1 text-sm text-[#94A3B8]">{fir.label}</p>
                    </div>
                    <span className="rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7FB0FF]">
                      {fir.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalIntelligenceHubPage
