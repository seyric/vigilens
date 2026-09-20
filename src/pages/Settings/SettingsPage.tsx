import { useState } from 'react'
import { MultilingualSettings } from './components'
import { Shield, Key, Languages, Info } from 'lucide-react'

type SettingsTab = 'general' | 'security' | 'multilingual'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('multilingual')

  const sidebarItems = [
    { id: 'general', label: 'General Preferences', icon: Shield, disabled: true },
    { id: 'security', label: 'Security & Access Control', icon: Key, disabled: true },
    { id: 'multilingual', label: 'Multilingual AI Options', icon: Languages, disabled: false }
  ]

  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* 2. Side-by-Side Flex Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch min-h-[500px]">
        
        {/* Left column Settings Sidebar (col-span-3) */}
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-4.5 space-y-2 h-full flex flex-col justify-between select-none">
            
            <div className="space-y-1.5 font-sans text-xs">
              <span className="text-[8.5px] font-mono tracking-widest text-[#94A3B8]/40 font-bold uppercase block px-3.5 mb-2.5">
                Settings Categories
              </span>
              
              {sidebarItems.map((item) => {
                const IconComponent = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    disabled={item.disabled}
                    onClick={() => setActiveTab(item.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left font-bold transition-all outline-none ${
                      isActive
                        ? 'bg-[#2563EB] text-[#F8FAFC]'
                        : item.disabled
                        ? 'opacity-40 text-[#94A3B8]/50 cursor-not-allowed hover:bg-transparent'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#182235]/40 cursor-pointer'
                    }`}
                  >
                    <IconComponent className={`h-4.5 w-4.5 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#2563EB]'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Version footprint */}
            <div className="border-t border-[rgba(255,255,255,0.04)] pt-3.5 mt-5">
              <div className="flex items-start gap-2.5 bg-[#0B1220]/60 border border-white/5 rounded-lg p-3 text-[9px] leading-relaxed">
                <Info className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[#94A3B8]/50 font-mono uppercase tracking-widest block font-bold">KSP CORE v2.4</span>
                  <p className="text-[#94A3B8] font-normal leading-relaxed">
                    Multilingual modules are calibrated for state judicial and local police translation rules.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right column Active Workspace (col-span-7) */}
        <div className="col-span-1 lg:col-span-7">
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-6.5 h-full">
            {activeTab === 'multilingual' && <MultilingualSettings />}
          </div>
        </div>

      </div>

    </div>
  )
}

export default SettingsPage
