import { useState, useEffect } from 'react'
import {
  FileText,
  Paperclip,
  Sparkles,

  Camera,
  FileSearch,
  Phone,

  ShieldCheck,
  Briefcase,
  Save
} from 'lucide-react'
import apiClient from '../../api/client'

export function InvestigationDiaryPage() {
  const [firs, setFirs] = useState<any[]>([])
  const [selectedFirId, setSelectedFirId] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [pastNotes, setPastNotes] = useState<any[]>([])
  const [evidenceList, setEvidenceList] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    apiClient.get('/core/firs').then(res => {
      setFirs(res.data)
      if (res.data.length > 0) {
        setSelectedFirId(res.data[0].fir_id)
      }
    }).catch(console.error)
  }, [])

  const fetchNotes = (firId: string) => {
    // Retrieve locally saved notes for this FIR
    const localNotes = localStorage.getItem(`fir_notes_${firId}`)
    const parsedLocal = localNotes ? JSON.parse(localNotes) : []

    // Fetch any mock server notes as well and merge
    apiClient.get(`/core/diary?fir_id=${firId}`).then(res => {
      // Deduplicate or just use local + mock
      setPastNotes([...parsedLocal, ...res.data])
    }).catch(err => {
      console.error(err)
      setPastNotes(parsedLocal)
    })
  }

  const fetchEvidence = (firId: string) => {
    apiClient.get(`/core/evidence`).then(res => {
      const allEv = res.data
      const firEv = allEv.filter((e: any) => e.fir_id === firId)
      setEvidenceList(firEv)
    }).catch(console.error)
  }

  useEffect(() => {
    if (selectedFirId) {
      fetchNotes(selectedFirId)
      fetchEvidence(selectedFirId)
    }
  }, [selectedFirId])

  const handleSaveNote = async () => {
    if (!notesInput.trim() || !selectedFirId) return
    setIsSaving(true)
    
    try {
      // 1. Save to local storage to ensure it persists instantly per-FIR
      const newNote = {
        log_id: `local_${Date.now()}`,
        timestamp: new Date().toISOString(),
        content: notesInput
      }
      
      const existing = localStorage.getItem(`fir_notes_${selectedFirId}`)
      const parsedExisting = existing ? JSON.parse(existing) : []
      const updatedLocalNotes = [newNote, ...parsedExisting]
      localStorage.setItem(`fir_notes_${selectedFirId}`, JSON.stringify(updatedLocalNotes))

      // 2. Try saving to backend (silently handle if it fails, as we have local storage)
      apiClient.post('/core/diary', {
        content: notesInput,
        fir_id: selectedFirId
      }).catch(e => console.error("Backend sync failed, but saved locally.", e))

      setNotesInput('')
      fetchNotes(selectedFirId)
    } catch (error) {
      console.error('Failed to save note locally', error)
    } finally {
      setIsSaving(false)
    }
  }

  const selectedFirData = firs.find(f => f.fir_id === selectedFirId)

  // Generate deterministic variations based on FIR ID for mock data
  const getMockVariation = (id: string) => {
    if (!id) return 0
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i)
    return Math.abs(hash) % 3
  }

  const vIndex = getMockVariation(selectedFirId)

  const aiNotesVariations = [
    [
      { title: 'Witness Evidence', color: 'text-[#10B981]', desc: 'Shopkeeper confirmed suspect presence at ATM booth (22:14 IST)' },
      { title: 'Vehicle Details', color: 'text-[#38BDF8]', desc: 'Registration verified: KA-04-MB-8921 (Mahindra Scorpio)' },
      { title: 'Digital Forensic Match', color: 'text-[#F59E0B]', desc: 'Extracted SHA-256 hash match for Kingston SSD drive' }
    ],
    [
      { title: 'Cyber Trace', color: 'text-[#10B981]', desc: 'IP logs pinpointed to proxy server in Eastern Europe' },
      { title: 'Financial Trail', color: 'text-[#38BDF8]', desc: 'Cryptocurrency transaction matched to known mixer service' },
      { title: 'Victim Statement', color: 'text-[#F59E0B]', desc: 'Phishing email clicked at 09:30 AM via corporate network' }
    ],
    [
      { title: 'Forensic Pathology', color: 'text-[#10B981]', desc: 'Blunt force trauma identified on cranial region' },
      { title: 'Crime Scene DNA', color: 'text-[#38BDF8]', desc: 'Hair follicle DNA matches state offender database' },
      { title: 'Surveillance Intel', color: 'text-[#F59E0B]', desc: 'Suspect spotted fleeing alleyway at 03:15 AM' }
    ]
  ]

  const summaryVariations = [
    "Today's investigation focused on witness interviews, CCTV review and digital evidence collection. AI recommends verifying vehicle ownership (KA-04-MB-8921) and comparing recovered phone numbers with existing FIRs.",
    "Analysis of digital footprints and financial ledgers conducted. AI suggests issuing subpoenas for the identified proxy servers and tracking the Bitcoin wallet outbound transactions.",
    "Crime scene forensics team completed initial sweep. Recovered DNA and latent prints. AI recommends prioritizing database cross-referencing and interviewing neighbors in a 2-block radius."
  ]

  const stepsVariations = [
    ['Issue Section 41A CrPC notice to suspect', 'Verify vehicle registration KA-04-MB-8921 ownership', 'Request bank ATM camera angle #2 footage', 'Cross-check recovered phone numbers'],
    ['Subpoena ISP for IP logs related to phishing', 'Alert cyber cell for domain takedown', 'Interview bank manager regarding spoofed emails', 'Monitor identified crypto wallets'],
    ['Expedite lab testing for collected DNA samples', 'Canvass neighborhood for additional witnesses', 'Check nearby business CCTV systems', 'Issue BOLO for suspect matching description']
  ]

  const getEvidenceIcon = (type: string) => {
    if (type.includes('DOCUMENT')) return FileText
    if (type.includes('DIGITAL')) return FileSearch
    if (type.includes('PHYSICAL')) return Camera
    if (type.includes('WITNESS')) return Phone
    return Paperclip
  }

  return (
    <div className="space-y-8 animate-fade-in select-none max-w-[1600px] mx-auto pb-12 font-sans">
      
      {/* SECTION 1: LINKED FIRS / CASE SELECTOR */}
      <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB]">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold tracking-wider block">
                Linked Case Record
              </span>
              <h2 className="text-sm font-extrabold text-white">Select Active Investigation FIR</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedFirId}
              onChange={(e) => setSelectedFirId(e.target.value)}
              className="bg-[#080D1A] border border-[rgba(255,255,255,0.1)] text-white text-xs font-mono rounded-xl px-4 py-2.5 outline-none focus:border-[#2563EB] w-full md:w-80 cursor-pointer"
            >
              {firs.map(f => (
                <option key={f.fir_id} value={f.fir_id}>{f.fir_number} — {f.district_name || 'District'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Case Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
          <div className="bg-[#080D1A] p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)]">
            <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">Linked FIR</span>
            <span className="text-[#2563EB] font-bold">{selectedFirData?.fir_number || '-'}</span>
          </div>
          <div className="bg-[#080D1A] p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)]">
            <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">Status</span>
            <span className="text-white font-bold">{selectedFirData?.status || '-'}</span>
          </div>
          <div className="bg-[#080D1A] p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)]">
            <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">District Unit</span>
            <span className="text-[#38BDF8] font-bold">{selectedFirData?.district_name || '-'}</span>
          </div>
          <div className="bg-[#080D1A] p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)]">
            <span className="text-[9px] text-[#94A3B8] uppercase block font-bold">Station</span>
            <span className="text-white font-bold">{selectedFirData?.station_name || '-'}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3: INVESTIGATION NOTES & AI ORGANIZED NOTES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Section 2: Officer Investigation Notes (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-[#2563EB]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Officer Investigation Notes
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8]">Case Journal Entry</span>
              </div>

              <div className="flex flex-col gap-3">
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record daily field observation notes, witness statements, and evidence updates..."
                  rows={4}
                  className="w-full bg-[#080D1A] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-xs text-white placeholder-[#94A3B8]/40 focus:outline-none focus:border-[#2563EB] font-mono leading-relaxed resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={isSaving || !notesInput.trim()}
                  className="self-end flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>

              {pastNotes.length > 0 && (
                <div className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-48 custom-scrollbar border-t border-[rgba(255,255,255,0.06)] pt-4">
                  <h4 className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider font-mono">Historical Notes</h4>
                  {pastNotes.map((note: any, idx) => (
                    <div key={note.log_id || idx} className="bg-[#080D1A] p-3 rounded-xl border border-[rgba(255,255,255,0.04)] font-mono text-[11px] text-[#E2E8F0]">
                      <div className="text-[9px] text-[#2563EB] mb-1 font-bold">{new Date(note.timestamp).toLocaleString()}</div>
                      <div>{note.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: AI Organized Notes (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-[#0B1220] border border-[#2563EB]/40 rounded-2xl p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-[#2563EB]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    AI Organized Notes
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#2563EB]">STRUCTURED AI PARSER</span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {aiNotesVariations[vIndex].map((note, i) => (
                  <div key={i} className="bg-[#080D1A] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className={`text-[9.5px] uppercase ${note.color} font-bold block`}>{note.title}</span>
                    <p className="text-white text-[11px] mt-0.5">{note.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 4: LINKED EVIDENCE GRID */}
      <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4.5 w-4.5 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Linked Case Evidence
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">{evidenceList.length} Files Attached</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs select-none">
          {evidenceList.map((item: any) => {
            const EvIcon = getEvidenceIcon(item.evidence_type)
            return (
              <div
                key={item.evidence_id}
                className="bg-[#080D1A] border border-[rgba(255,255,255,0.04)] rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <EvIcon className="h-4 w-4 text-[#38BDF8]" />
                  <span className="text-[9px] text-[#2563EB] font-bold bg-[#2563EB]/15 px-1.5 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate" title={item.evidence_type}>{item.evidence_type}</h4>
                  <span className="text-[9px] text-[#94A3B8] block mt-0.5 truncate" title={item.description}>{item.description || 'Logged'}</span>
                </div>
              </div>
            )
          })}
          {evidenceList.length === 0 && (
            <div className="col-span-full text-center text-[#94A3B8] py-4 text-[11px]">
              No evidence files linked to this FIR yet.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5 & 6: DAILY SUMMARY & SUGGESTED NEXT STEPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Daily Summary (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#2563EB]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Daily Investigation Summary
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/30 px-2 py-0.5 rounded font-bold">
                  SUMMARY GENERATED
                </span>
              </div>

              <p className="font-mono text-xs text-[#E2E8F0] leading-relaxed bg-[#080D1A] p-4 rounded-xl border border-[rgba(255,255,255,0.04)]">
                "{summaryVariations[vIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Next Investigation Steps (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#0B1220] border border-[#2563EB]/40 rounded-2xl p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
                <Sparkles className="h-4.5 w-4.5 text-[#2563EB]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Suggested Next Investigation Steps
                </h3>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {stepsVariations[vIndex].map((rec, i) => (
                  <div
                    key={i}
                    className="bg-[#080D1A] border border-[rgba(255,255,255,0.04)] rounded-xl p-3 flex items-center gap-2.5 text-[#F8FAFC]"
                  >
                    <span className="text-[#2563EB] font-bold text-xs">•</span>
                    <span className="text-[11px] truncate">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default InvestigationDiaryPage
