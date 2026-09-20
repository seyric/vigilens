import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Languages } from 'lucide-react'

export default function GlobalContextMenu() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState('')

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const text = window.getSelection()?.toString().trim()
      
      if (text && text.length > 0) {
        // Prevent default browser menu
        e.preventDefault()
        
        setSelectedText(text)
        setIsVisible(true)
        
        // Keep the menu within viewport bounds
        const x = Math.min(e.clientX, window.innerWidth - 200)
        const y = Math.min(e.clientY, window.innerHeight - 100)
        
        setPosition({ x, y })
      } else {
        setIsVisible(false)
      }
    }

    const handleClick = () => {
      if (isVisible) setIsVisible(false)
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div 
      className="fixed z-[9999] bg-[#0B1220] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[200px]"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-1">
        <button
          onClick={() => {
            setIsVisible(false)
            navigate('/multilingual-ai', { state: { text: selectedText } })
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#E2E8F0] hover:bg-[#2563EB] hover:text-white rounded-lg transition-colors text-left"
        >
          <Languages className="w-4 h-4 text-[#7FB0FF]" />
          Translate Selection
        </button>
      </div>
    </div>
  )
}
