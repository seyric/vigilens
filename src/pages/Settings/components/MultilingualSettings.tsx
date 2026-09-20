import { useState } from 'react'
import {
  Globe,
  Languages,
  CheckCircle2,
  Sparkles,
  Download,
  RefreshCw,
  Check,
  Loader2
} from 'lucide-react'

interface LanguageOption {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface SupportLanguageItem {
  name: string
  script: string
  status: string
  support: string
}

export function MultilingualSettings() {
  const [selectedLang, setSelectedLang] = useState<string>('en')
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [showTranslatedText, setShowTranslatedText] = useState(true)

  // AI translation settings states
  const [toggles, setToggles] = useState({
    autoDetect: true,
    translateFirs: true,
    translateStatements: true,
    translateReports: true,
    translateDashboard: false
  })

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' }
  ]

  const supportedLanguages: SupportLanguageItem[] = [
    { name: 'Kannada', script: 'Kannada', status: 'Fully Automatic', support: 'Stable v1.8' },
    { name: 'English', script: 'Latin', status: 'Native System', support: 'Stable v2.0' },
    { name: 'Hindi', script: 'Devanagari', status: 'Auto-Translate', support: 'Stable v1.5' },
    { name: 'Tamil', script: 'Tamil', status: 'Auto-Translate', support: 'Beta Support' },
    { name: 'Telugu', script: 'Telugu', status: 'Auto-Translate', support: 'Beta Support' }
  ]

  const capabilities = [
    { title: 'Understand Regional Police Terminology', desc: 'Preserves vital regional legal concepts like "Mahazar", "Khata", and "Faryad" in translations.' },
    { title: 'Translate Investigation Reports', desc: 'Converts complex summaries and timelines into readable formats.' },
    { title: 'Translate FIR Documents', desc: 'Ingests local regional handwriting and formats it into standardized English profiles.' },
    { title: 'Translate Witness Statements', desc: 'Translates conversational and local dialect statements with legal context.' },
    { title: 'Preserve Legal Terminology', desc: 'Maintains alignment with criminal law and local legal frameworks.' },
    { title: 'AI-assisted Multilingual Investigation', desc: 'Executes cross-lingual semantic pattern searches automatically.' }
  ]

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePreviewTranslation = () => {
    setIsPreviewing(true)
    setShowTranslatedText(false)
    setTimeout(() => {
      setIsPreviewing(false)
      setShowTranslatedText(true)
    }, 1100)
  }

  const handleSaveSettings = () => {
    alert(`[SETTINGS SUCCESS] Multilingual preferences saved.\nSystem language configured: ${languages.find(l => l.code === selectedLang)?.name}.\nTranslation rules registered.`)
  }

  const handleResetSettings = () => {
    setSelectedLang('en')
    setToggles({
      autoDetect: true,
      translateFirs: true,
      translateStatements: true,
      translateReports: true,
      translateDashboard: false
    })
    setShowTranslatedText(true)
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Languages className="h-5 w-5 text-[#2563EB]" />
          <span>Multilingual AI</span>
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1 font-medium">
          Configure language preferences and AI-powered translation settings for state-wide policing.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-stretch">
        
        {/* Left Side: Lang card select, Toggles & Info (col-span-6) */}
        <div className="col-span-1 xl:col-span-6 space-y-6">
          
          {/* Section 1: Preferred System Language */}
          <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC] mb-4">Preferred System Language</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 select-none font-sans text-xs">
              {languages.map((lang) => {
                const isSelected = selectedLang === lang.code
                return (
                  <div
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`border rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]/5 shadow-[0_0_12px_rgba(37,99,235,0.15)] text-white'
                        : 'border-[rgba(255,255,255,0.06)] hover:border-white/10 bg-[#0B1220]/40 text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span className="text-xl mb-1.5 filter grayscale-[20%]">{lang.flag}</span>
                    <span className="font-extrabold text-[11px] tracking-wide block">{lang.nativeName}</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[#94A3B8]/50 mt-0.5 block">{lang.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 2: AI Translation Settings */}
          <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC] border-b border-[rgba(255,255,255,0.04)] pb-2.5">
              AI Translation Settings
            </h3>
            
            <div className="space-y-4 text-xs font-sans">
              {/* Toggle 1: Auto Detect */}
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-0.5">
                  <span className="text-white font-extrabold block">Detect Document Language Automatically</span>
                  <span className="text-[#94A3B8]/60 text-[9.5px] block leading-tight">Identify raw source languages automatically on ingestion folders.</span>
                </div>
                <button
                  onClick={() => handleToggle('autoDetect')}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer outline-none shrink-0 ${
                    toggles.autoDetect ? 'bg-[#2563EB]' : 'bg-gray-800'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    toggles.autoDetect ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 2: Translate FIRs */}
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-0.5">
                  <span className="text-white font-extrabold block">Translate Uploaded FIRs</span>
                  <span className="text-[#94A3B8]/60 text-[9.5px] block leading-tight">Translate local Kannada FIR templates into English logs.</span>
                </div>
                <button
                  onClick={() => handleToggle('translateFirs')}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer outline-none shrink-0 ${
                    toggles.translateFirs ? 'bg-[#2563EB]' : 'bg-gray-800'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    toggles.translateFirs ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 3: Translate Statements */}
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-0.5">
                  <span className="text-white font-extrabold block">Translate Witness Statements</span>
                  <span className="text-[#94A3B8]/60 text-[9.5px] block leading-tight">Apply translation mappings to conversational witness testimony.</span>
                </div>
                <button
                  onClick={() => handleToggle('translateStatements')}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer outline-none shrink-0 ${
                    toggles.translateStatements ? 'bg-[#2563EB]' : 'bg-gray-800'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    toggles.translateStatements ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 4: Translate AI Reports */}
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-0.5">
                  <span className="text-white font-extrabold block">Translate AI Investigation Reports</span>
                  <span className="text-[#94A3B8]/60 text-[9.5px] block leading-tight">Compile reports and summaries in target language dockets.</span>
                </div>
                <button
                  onClick={() => handleToggle('translateReports')}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer outline-none shrink-0 ${
                    toggles.translateReports ? 'bg-[#2563EB]' : 'bg-gray-800'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    toggles.translateReports ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 5: Translate Dashboard Content */}
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-0.5">
                  <span className="text-white font-extrabold block">Translate Dashboard Content</span>
                  <span className="text-[#94A3B8]/60 text-[9.5px] block leading-tight">Switch entire main menus, graphs, maps and charts.</span>
                </div>
                <button
                  onClick={() => handleToggle('translateDashboard')}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer outline-none shrink-0 ${
                    toggles.translateDashboard ? 'bg-[#2563EB]' : 'bg-gray-800'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    toggles.translateDashboard ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Supported Investigation Languages */}
          <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC] mb-4">Supported Investigation Languages</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] select-none font-sans">
              {supportedLanguages.map((lang) => (
                <div
                  key={lang.name}
                  className="bg-[#0B1220]/40 border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-[rgba(37,99,235,0.12)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs">{lang.name}</span>
                    <span className="px-2 py-0.5 border bg-white/5 rounded text-[7.5px] font-mono text-[#94A3B8]/60 uppercase border-white/5">{lang.script} Script</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.03)] text-[8.5px]">
                    <span className="text-[#94A3B8]/50 uppercase font-mono">Translation: {lang.status}</span>
                    <span className="text-[#10B981] font-bold">{lang.support}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Detection Panel, Previews & Capabilities (col-span-4) */}
        <div className="col-span-1 xl:col-span-4 space-y-6">
          
          {/* Section 5: AI Language Detection Status Panel */}
          <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC] border-b border-[rgba(255,255,255,0.04)] pb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#2563EB]" />
              <span>AI Language Detection</span>
            </h3>
            
            <div className="space-y-2.5 text-[10px] select-none font-sans">
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] font-semibold">Detected Language:</span>
                <span className="text-[#2563EB] font-bold">Kannada</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] font-semibold">Confidence Score:</span>
                <span className="text-[#10B981] font-bold">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] font-semibold">Translation Status:</span>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-bold uppercase text-[7.5px] border border-[#10B981]/30">Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] font-semibold">Document Ingest Type:</span>
                <span className="text-white font-medium">FIR (First Information Report)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Translation Preview Panel */}
          <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-sm space-y-4 flex flex-col justify-between min-h-[340px]">
            <div>
              <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC] border-b border-[rgba(255,255,255,0.04)] pb-2.5 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-[#2563EB]" />
                <span>Translation Preview Block</span>
              </h3>

              <div className="space-y-3.5 mt-3 select-none text-[9.5px] font-sans">
                {/* Kannada text */}
                <div className="bg-[#0B1220]/60 border border-[rgba(255,255,255,0.04)] rounded-xl p-3 space-y-1">
                  <span className="text-[7.5px] font-mono text-[#94A3B8]/30 uppercase tracking-widest block">Original Excerpt (Kannada)</span>
                  <p className="text-[#94A3B8] leading-relaxed font-normal">
                    "ಆರೋಪಿಯು ರಾತ್ರಿ 11:30 ರ ಸುಮಾರಿಗೆ ಜೆ.ಸಿ. ನಗರದ ಮನೆಯ ಹಿಂಬಾಗಿಲಿನ ಬೀಗವನ್ನು ಮುರಿದು ಒಳನುಗ್ಗಿದ್ದಾನೆ. ಮನೆಯಲ್ಲಿದ್ದ ಚಿನ್ನದ ಒಡವೆಗಳು ಮತ್ತು ನಗದು ಹಣವನ್ನು ಕಳವು ಮಾಡಿಕೊಂಡು ಓಡಿಹೋಗಿದ್ದಾನೆ."
                  </p>
                </div>

                {/* English translation */}
                <div className="bg-[#0B1220]/60 border border-[rgba(255,255,255,0.04)] rounded-xl p-3 space-y-1 min-h-[90px] flex flex-col justify-between">
                  <span className="text-[7.5px] font-mono text-[#94A3B8]/30 uppercase tracking-widest block">Translated Excerpt (English)</span>
                  
                  {isPreviewing ? (
                    <div className="flex items-center justify-center py-5">
                      <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
                    </div>
                  ) : showTranslatedText ? (
                    <p className="text-white leading-relaxed font-normal">
                      "The accused broke the lock of the back door of the house in J.C. Nagar and entered at around 11:30 PM. He stole the gold ornaments and cash in the house and fled."
                    </p>
                  ) : (
                    <span className="text-[#94A3B8]/30 italic py-2">Click Preview Translation below to compile preview...</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.03)] pt-3.5 mt-4 text-[8px] font-mono text-[#94A3B8]/40">
              <span>MAPPING: KANNADA ➔ ENGLISH (BEHAVIOURAL DECODED)</span>
            </div>
          </div>

          {/* Section 6: Regional Intelligence Support Capability Cards */}
          <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC] border-b border-[rgba(255,255,255,0.04)] pb-2.5">
              Regional Intelligence Capabilities
            </h3>
            
            <div className="grid grid-cols-1 gap-3.5 font-sans text-xs">
              {capabilities.slice(0, 3).map((cap) => (
                <div key={cap.title} className="flex items-start gap-2.5 bg-[#0B1220]/30 border border-white/5 rounded-lg p-3">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-white font-extrabold text-[10.5px] leading-tight block">{cap.title}</span>
                    <p className="text-[#94A3B8]/60 text-[9.5px] leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Section 7: Quick Actions buttons row */}
      <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-sm select-none">
        <div className="flex flex-wrap gap-4 uppercase font-bold text-[10px] tracking-wider">
          {/* Action 1: Save Preferences */}
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg transition-colors cursor-pointer outline-none"
          >
            <Check className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>

          {/* Action 2: Reset to Default */}
          <button
            onClick={handleResetSettings}
            className="flex items-center gap-1.5 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white px-5 py-2.5 rounded-lg transition-colors cursor-pointer outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>

          {/* Action 3: Preview Translation */}
          <button
            onClick={handlePreviewTranslation}
            className="flex items-center gap-1.5 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white px-5 py-2.5 rounded-lg transition-colors cursor-pointer outline-none"
          >
            <Globe className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Preview Translation</span>
          </button>

          {/* Action 4: Download Translated Report */}
          <button
            onClick={() => alert('[DOWNLOAD SUCCESS] Translated case report dossier saved to local downloads folder.')}
            className="flex items-center gap-1.5 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white px-5 py-2.5 rounded-lg transition-colors cursor-pointer outline-none"
          >
            <Download className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Download Translated Report</span>
          </button>
        </div>
      </div>

    </div>
  )
}

export default MultilingualSettings
