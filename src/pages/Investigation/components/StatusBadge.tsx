interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Gold badge styling for Under Investigation
  const isGold = status.toLowerCase().includes('investigation') || status.toLowerCase().includes('pending')
  const styles = isGold
    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]'
    : 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]'

  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono tracking-wider font-bold uppercase ${styles}`}>
      {status}
    </span>
  )
}
export default StatusBadge
