import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Mic, ClipboardList, Brain, X } from 'lucide-react'

interface AssistantAction {
  id: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  route: string
}

const assistantActions: AssistantAction[] = [
  {
    id: 'voice-search',
    title: 'Voice Search',
    subtitle: 'Search using voice commands',
    icon: Mic,
    route: '/voice-search',
  },
  {
    id: 'investigation-diary',
    title: 'Officer Investigation Diary',
    subtitle: 'View and manage investigation notes',
    icon: ClipboardList,
    route: '/investigation-diary',
  },
  {
    id: 'officer-ai-assistant',
    title: 'Officer AI Assistant',
    subtitle: 'Ask AI for investigation insights',
    icon: Brain,
    route: '/ai-assistant',
  },
]

export default function FloatingQuickMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleNavigate = (route: string) => {
    navigate(route)
    setIsOpen(false)
  }

  return (
    <div
      ref={menuRef}
      className="fixed bottom-6 right-6 z-50 font-sans"
      aria-label="Officer Assistant"
    >
      <div className="flex flex-col items-end gap-3">
        {/* Expanded Actions */}
        <div className="flex flex-col items-end gap-3 mb-2">
          {assistantActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => handleNavigate(action.route)}
                className={`group flex items-center gap-3 transition-all duration-300 ease-out ${
                  isOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                {/* Action Label */}
                <div
                  className={`flex flex-col items-end transition-all duration-300 ${
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 50 + 100}ms` : '0ms',
                  }}
                >
                  <span className="text-xs font-semibold text-white whitespace-nowrap">
                    {action.title}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                    {action.subtitle}
                  </span>
                </div>

                {/* Circular Button */}
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-[#2563EB]/30 bg-[#0B1220]/95 shadow-[0_8px_32px_rgba(37,99,235,0.25)] transition-all duration-300 ease-out hover:scale-105 hover:border-[#2563EB]/50 hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-[#2563EB]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Icon className="h-5 w-5 text-[#60A5FA]" />
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Officer Badge Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-300 ease-out shadow-[0_12px_48px_rgba(37,99,235,0.3)] hover:scale-105 ${
            isOpen
              ? 'bg-[#1E293B] border-[#2563EB]/50 text-white shadow-[0_16px_56px_rgba(37,99,235,0.45)] rotate-45'
              : 'bg-gradient-to-br from-[#0F172A] to-[#0B1220] border-[#2563EB]/40 text-[#60A5FA] rotate-0'
          }`}
          aria-expanded={isOpen}
          aria-label="Toggle Officer Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-[#2563EB]/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
          {isOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <Shield className="h-7 w-7" />
          )}
        </button>
      </div>
    </div>
  )
}
