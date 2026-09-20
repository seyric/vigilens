interface SeverityBadgeProps {
  severity: string
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  // Orange badge styling for Medium
  const isCritical = severity.toLowerCase().includes('critical') || severity.toLowerCase().includes('high')
  const styles = isCritical
    ? 'bg-[#EF4444]/15 border-[#EF4444]/25 text-[#EF4444]'
    : 'bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]' // Medium/Orange

  return (
    <span className={`px-2.5 py-0.5 rounded border text-[9px] font-mono tracking-wider font-bold uppercase ${styles}`}>
      {severity}
    </span>
  )
}
export default SeverityBadge
