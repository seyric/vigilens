interface RiskIndicatorProps {
  score: number // 0 - 100
}

export function RiskIndicator({ score }: RiskIndicatorProps) {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center gap-4 select-none font-sans">
      {/* SVG Circular Progress */}
      <div className="relative h-18 w-18 flex items-center justify-center shrink-0">
        <svg className="h-full w-full transform -rotate-95">
          {/* Background circle */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            stroke="#EF4444"
            strokeWidth="5.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Core Score Text */}
        <div className="absolute text-center">
          <span className="text-white font-extrabold text-sm font-mono leading-none">{score}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-mono tracking-widest text-[#EF4444] font-bold uppercase">
          Threat Risk Index
        </span>
        <span className="text-[#94A3B8] text-[10px] mt-0.5 font-medium">
          Critical risk rating flag active
        </span>
      </div>

    </div>
  )
}
export default RiskIndicator
