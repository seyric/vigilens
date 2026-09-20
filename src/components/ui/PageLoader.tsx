import type { FC } from 'react'

interface PageLoaderProps {
  message?: string
}

const PageLoader: FC<PageLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full text-[#94A3B8] font-mono text-sm tracking-widest">
      {message}
    </div>
  )
}

export default PageLoader
