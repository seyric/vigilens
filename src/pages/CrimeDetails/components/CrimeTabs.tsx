interface CrimeTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function CrimeTabs({ activeTab, setActiveTab }: CrimeTabsProps) {
  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Timeline', label: 'Timeline' },
    { id: 'Evidence', label: 'Evidence' },
    { id: 'Victims', label: 'Victims (1)' },
    { id: 'Accused', label: 'Accused (2)' },
    { id: 'Vehicles', label: 'Vehicles (1)' },
    { id: 'Related Cases', label: 'Related Cases (3)' }
  ]

  return (
    <div className="flex border-b border-[rgba(255,255,255,0.06)] overflow-x-auto select-none no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3.5 text-xs font-bold tracking-wide uppercase transition-all duration-200 border-b-2 outline-none cursor-pointer whitespace-nowrap ${
              isActive
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
export default CrimeTabs
