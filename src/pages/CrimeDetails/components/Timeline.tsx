import { Clock, FileText, Search, UserCheck, ShieldAlert } from 'lucide-react'

interface TimelineEvent {
  title: string
  date: string
  status: 'completed' | 'current' | 'future'
  icon: 'file' | 'search' | 'clock' | 'user' | 'shield'
}

export function Timeline() {
  const events: TimelineEvent[] = [
    { title: 'FIR Filed', date: '12 May 14:30', status: 'completed', icon: 'file' },
    { title: 'Investigation Started', date: '12 May 16:00', status: 'completed', icon: 'search' },
    { title: 'Evidence Collected', date: '13 May 10:30', status: 'current', icon: 'clock' },
    { title: 'Suspect Identified', date: 'Pending', status: 'future', icon: 'user' },
    { title: 'Case Closed', date: 'Pending', status: 'future', icon: 'shield' }
  ]

  const getEventStyles = (status: 'completed' | 'current' | 'future') => {
    switch (status) {
      case 'completed':
        return {
          iconClass: 'bg-[#2563EB]/15 border-[#2563EB] text-[#2563EB]',
          lineClass: 'bg-[#2563EB]',
          textClass: 'text-white',
          subtitleClass: 'text-[#2563EB]'
        }
      case 'current':
        return {
          iconClass: 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B] animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.25)]',
          lineClass: 'bg-[rgba(255,255,255,0.06)]',
          textClass: 'text-[#F59E0B] font-extrabold',
          subtitleClass: 'text-[#F59E0B]'
        }
      case 'future':
        return {
          iconClass: 'bg-[#0B1220] border-[rgba(255,255,255,0.06)] text-[#94A3B8]/40',
          lineClass: 'bg-[rgba(255,255,255,0.06)]',
          textClass: 'text-[#94A3B8]/50',
          subtitleClass: 'text-[#94A3B8]/30 font-mono'
        }
    }
  }

  const renderIcon = (iconName: string, iconClass: string) => {
    const props = { className: 'h-4.5 w-4.5 stroke-1.5' }
    switch (iconName) {
      case 'file': return <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${iconClass}`}><FileText {...props} /></div>
      case 'search': return <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${iconClass}`}><Search {...props} /></div>
      case 'clock': return <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${iconClass}`}><Clock {...props} /></div>
      case 'user': return <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${iconClass}`}><UserCheck {...props} /></div>
      default: return <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${iconClass}`}><ShieldAlert {...props} /></div>
    }
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-5 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <Clock className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Investigation Timeline
        </h2>
      </div>

      {/* Horizontal Steps Canvas */}
      <div className="relative pt-2 pb-4">
        {/* Horizontal Line background for large screens */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-[rgba(255,255,255,0.06)] hidden md:block z-0" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
          {events.map((ev, index) => {
            const styles = getEventStyles(ev.status)
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                
                {/* Node icon wrapper */}
                <div className="mb-3.5 relative">
                  {/* Left partial connector line */}
                  {index > 0 && ev.status === 'completed' && (
                    <div className="absolute top-4 right-1/2 w-full h-0.5 bg-[#2563EB] hidden md:block z-[-1]" />
                  )}
                  {renderIcon(ev.icon, styles.iconClass)}
                </div>

                {/* Event Text detail */}
                <span className={`text-[11.5px] font-extrabold tracking-wide font-sans transition-colors duration-150 ${styles.textClass}`}>
                  {ev.title}
                </span>
                
                <span className={`text-[9px] font-mono tracking-wider font-bold mt-1 uppercase ${styles.subtitleClass}`}>
                  {ev.date}
                </span>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
export default Timeline
