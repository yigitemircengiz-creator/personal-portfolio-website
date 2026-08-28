'use client'

import { useEffect, useRef, useState } from 'react'

interface LoadingScreenProps {
  onComplete?: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // Force scroll restoration to manual & scroll to top on page reload
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    }

    // Disable scroll while loading screen is active
    document.body.style.overflow = 'hidden'

    const startTime = Date.now()
    const duration = 3000 // 3 saniye

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(100, (elapsed / duration) * 100)
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsFinished(true)
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0)
        }
        document.body.style.overflow = ''
        if (onCompleteRef.current) onCompleteRef.current()
        setTimeout(() => setShouldRender(false), 700)
      }
    }, 16)

    return () => {
      clearInterval(interval)
      document.body.style.overflow = ''
    }
  }, [])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-out ${
        isFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-xs md:max-w-md px-6">
        {/* Progress Text */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
          <span>Loading</span>
          <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent font-extrabold tracking-widest text-sm">
            {Math.floor(progress)}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="relative w-full h-2.5 bg-neutral-950 rounded-full border border-white/15 overflow-visible shadow-inner">
          {/* Filled Progress Line with Gradient */}
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 rounded-full transition-all ease-out duration-75 shadow-[0_0_20px_rgba(217,70,239,0.8)] relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* White Wrapping Shimmer Beam */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-gradient-shift"
              style={{ backgroundSize: '200% 100%' }}
            />
          </div>

          {/* Avatar at the tip */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all ease-out duration-75"
            style={{ left: `${progress}%` }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Fuchsia/Pink Glow */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 blur-lg opacity-70 pointer-events-none" />

              {/* White Wrapping Ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white via-white/20 to-white animate-spin opacity-90 blur-[1px]" />

              {/* Gradient Border Frame */}
              <div className="p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 shadow-[0_0_25px_rgba(217,70,239,0.9)] relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/60 bg-black overflow-hidden relative">
                  <img
                    src="/avatar.png"
                    alt="Loading Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
