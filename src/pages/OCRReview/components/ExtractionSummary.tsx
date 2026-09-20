import { ListTodo, Clock, Award } from 'lucide-react'

export function ExtractionSummary() {
  const stats = [
    { label: 'Fields Extracted', value: '14 / 14', icon: ListTodo, color: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20' },
    { label: 'Confidence Score', value: '98%', icon: Award, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' },
    { label: 'Processing Time', value: '3.2 seconds', icon: Clock, color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' }
  ]

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-3xl p-5 shadow-sm select-none animate-fade-in w-full">
      <div className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F172A] border border-[rgba(255,255,255,0.05)]">
            <ListTodo className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-[0.18em] uppercase font-mono">
              Verification Summary
            </h2>
            <p className="mt-1 text-[10px] text-[#94A3B8] uppercase tracking-widest">
              Confidence and completeness of extracted FIR fields
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] p-4 flex items-center gap-3 shadow-sm ${stat.color}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/15 border border-[rgba(255,255,255,0.06)]">
                <Icon className="h-4.5 w-4.5" />
              </div>

              <div>
                <span className="text-[9px] font-mono tracking-wider font-bold uppercase text-[#94A3B8] block">
                  {stat.label}
                </span>
                <span className="text-white font-extrabold text-sm tracking-wide block mt-1">
                  {stat.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ExtractionSummary
