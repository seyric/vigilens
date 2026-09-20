interface TabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function InvestigationTabs({ activeTab, setActiveTab }: TabsProps) {
  const tabsList = [
    'Case Overview',
    'Timeline',
    'Evidence',
    'Suspects',
    'Victims',
    'Vehicles',
    'Linked Cases',
    'AI Insights',
    'Investigation Diary'
  ]

  return (
    <div className="flex border-b border-[rgba(255,255,255,0.06)] overflow-x-auto select-none no-scrollbar">
      {tabsList.map((tab) => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3.5 text-xs font-bold tracking-wide uppercase transition-all duration-200 border-b-2 outline-none cursor-pointer whitespace-nowrap ${
              isActive
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
export default InvestigationTabs
