'use client'

import { useEffect } from 'react'

export function useMomentumScroll(lerpFactor = 0.09) {
  useEffect(() => {
    let target = window.scrollY
    let current = window.scrollY
    let rafId: number | null = null

    const maxScroll = () => document.body.scrollHeight - window.innerHeight

    const animate = () => {
      current += (target - current) * lerpFactor

      if (Math.abs(current - target) < 0.5) {
        current = target
        window.scrollTo(0, current)
        rafId = null
        return
      }

      window.scrollTo(0, current)
      rafId = requestAnimationFrame(animate)
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY))

      if (rafId === null) {
        rafId = requestAnimationFrame(animate)
      }
    }

    // Sync on programmatic / keyboard / touch scrolls
    const onScroll = () => {
      if (rafId === null) {
        target = window.scrollY
        current = window.scrollY
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [lerpFactor])
}
