import Lottie from 'lottie-react'
import handcuffsData from '../../assets/animations/handcuffs.json'

export default function HandcuffAnimation() {
  const isLottieValid = handcuffsData && Array.isArray(handcuffsData.layers) && handcuffsData.layers.length > 0

  if (!isLottieValid) {
    return (
      <div 
        className="relative flex items-center justify-center select-none" 
        style={{ width: '240px', height: '180px' }}
      >
        <svg
          viewBox="0 0 240 180"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Metallic steel chrome gradient */}
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="20%" stopColor="#cbd5e1" />
              <stop offset="40%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="80%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            
            {/* Subtle glow filter */}
            <filter id="steelGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Left Cuff Group with pivot animation */}
          <g className="animate-[leftCuff_4s_ease-in-out_infinite]" style={{ transformOrigin: '80px 90px' }}>
            {/* Left Hinge */}
            <circle cx="80" cy="90" r="8" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1" />
            
            {/* Left Cuff Outer Ring */}
            <path
              d="M 80,90 A 36,36 0 1,1 110,70"
              fill="none"
              stroke="url(#chromeGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#steelGlow)"
            />
            {/* Left Cuff Lock housing block */}
            <rect x="94" y="65" width="22" height="14" rx="3" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1" />
            <circle cx="105" cy="72" r="2.5" fill="#0f172a" />

            {/* Left Cuff Inner moving jaw */}
            <path
              d="M 80,90 A 30,30 0 1,1 106,73"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="4 2"
              className="animate-[jawLeft_4s_ease-in-out_infinite]"
              style={{ transformOrigin: '80px 90px' }}
            />
          </g>

          {/* Central Connecting Chain Links */}
          <g filter="url(#steelGlow)">
            {/* Left Link */}
            <rect x="86" y="86" width="22" height="8" rx="4" fill="none" stroke="url(#chromeGrad)" strokeWidth="4.5" />
            {/* Center Link (vertical/skewed) */}
            <rect x="109" y="83" width="22" height="14" rx="7" transform="rotate(30 120 90)" fill="none" stroke="url(#chromeGrad)" strokeWidth="4.5" />
            {/* Right Link */}
            <rect x="132" y="86" width="22" height="8" rx="4" fill="none" stroke="url(#chromeGrad)" strokeWidth="4.5" />
          </g>

          {/* Right Cuff Group with pivot animation */}
          <g className="animate-[rightCuff_4s_ease-in-out_infinite]" style={{ transformOrigin: '160px 90px' }}>
            {/* Right Hinge */}
            <circle cx="160" cy="90" r="8" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1" />
            
            {/* Right Cuff Outer Ring */}
            <path
              d="M 160,90 A 36,36 0 1,0 130,70"
              fill="none"
              stroke="url(#chromeGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#steelGlow)"
            />
            {/* Right Cuff Lock housing block */}
            <rect x="124" y="65" width="22" height="14" rx="3" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1" />
            <circle cx="135" cy="72" r="2.5" fill="#0f172a" />

            {/* Right Cuff Inner moving jaw */}
            <path
              d="M 160,90 A 30,30 0 1,0 134,73"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="4 2"
              className="animate-[jawRight_4s_ease-in-out_infinite]"
              style={{ transformOrigin: '160px 90px' }}
            />
          </g>
        </svg>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes leftCuff {
            0% { transform: rotate(0deg); }
            45% { transform: rotate(-8deg); }
            55% { transform: rotate(-8deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes rightCuff {
            0% { transform: rotate(0deg); }
            45% { transform: rotate(8deg); }
            55% { transform: rotate(8deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes jawLeft {
            0% { transform: rotate(0deg); }
            40% { transform: rotate(-24deg); }
            60% { transform: rotate(-24deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes jawRight {
            0% { transform: rotate(0deg); }
            40% { transform: rotate(24deg); }
            60% { transform: rotate(24deg); }
            100% { transform: rotate(0deg); }
          }
        ` }} />
      </div>
    )
  }

  return (
    <div style={{ width: '240px', height: '180px' }} className="flex items-center justify-center select-none">
      <Lottie
        animationData={handcuffsData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
