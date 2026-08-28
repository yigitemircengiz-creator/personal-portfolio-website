'use client'

import { useEffect, useState } from 'react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Hero alanını geçip Skills / About bölgesine gelindiğinde göster
      const threshold = window.innerHeight * 0.7
      if (window.scrollY > threshold) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (typeof window !== 'undefined') {
      const lenis = (window as any).lenis
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { duration: 1.2, force: true })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      style={{ perspective: '700px' }}
    >
      <button
        onClick={scrollToTop}
        onPointerDown={scrollToTop}
        aria-label="Scroll to top"
        className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 p-[1.5px] shadow-[0_0_30px_-8px_rgba(217,70,239,0.6)] transition-all duration-500 ease-out [transform-style:preserve-3d] hover:shadow-[0_0_55px_-6px_rgba(217,70,239,0.85)] hover:[transform:rotateZ(-10deg)_rotateY(14deg)_rotateX(5deg)] active:scale-95 cursor-pointer select-none"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/30">
          <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </span>
      </button>
    </div>
  )
}
