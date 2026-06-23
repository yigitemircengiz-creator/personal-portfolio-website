'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

const EMOJIS = [
  { src: '/emoji-heart.png',  alt: 'heart',  side: 'left',  top: '30%', delay: 0,    rotate: -25 },
  { src: '/emoji-fire.png',   alt: 'fire',   side: 'right', top: '22%', delay: 0.08, rotate: 20  },
  { src: '/emoji-flower.png', alt: 'flower', side: 'right', top: '60%', delay: 0.16, rotate: -18 },
  { src: '/emoji-dice.png',   alt: 'dice',   side: 'left',  top: '58%', delay: 0.24, rotate: 22  },
]


const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/yigitemircengiz-creator' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yi%C4%9Fit-emir-cengiz/' },
]



export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleWords, setVisibleWords] = useState(0)
  const { t } = useLanguage()

  const words = useMemo(() => t.about.fullText.split(' '), [t.about.fullText])

  const cardsData = useMemo(() => [
    { label: t.about.university, value: t.about.universityValue, sub: t.about.universitySub },
    { label: t.about.degree,     value: t.about.degreeValue,     sub: t.about.degreeSub },
    { label: t.about.role,       value: t.about.roleValue,       sub: t.about.roleSub },
    { label: t.about.location,   value: t.about.locationValue,   sub: '' },
  ], [t.about])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const emojis  = Array.from(section.querySelectorAll<HTMLElement>('[data-emoji]'))
    const title   = section.querySelector<HTMLElement>('[data-about="title"]')
    const cards   = section.querySelectorAll<HTMLElement>('[data-card]')
    const actions = section.querySelector<HTMLElement>('[data-actions]')

    // Mouse-follow effect for emojis — only on hover
    const emojiTargets = new Map<HTMLElement, { x: number; y: number }>()
    emojis.forEach(el => emojiTargets.set(el, { x: 0, y: 0 }))

    const emojiMoveHandlers = new Map<HTMLElement, (e: MouseEvent) => void>()
    const emojiLeaveHandlers = new Map<HTMLElement, () => void>()

    emojis.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) * 0.12
        const dy = (e.clientY - cy) * 0.12
        emojiTargets.set(el, { x: dx, y: dy })
      }
      const onLeave = () => {
        emojiTargets.set(el, { x: 0, y: 0 })
      }
      emojiMoveHandlers.set(el, onMove)
      emojiLeaveHandlers.set(el, onLeave)
      el.style.pointerEvents = 'auto'
      el.style.cursor = 'default'
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
    })

    let emojiRaf: number
    const animateEmojis = () => {
      emojis.forEach((el) => {
        const target = emojiTargets.get(el)!
        const d = el.dataset as any
        const cx = parseFloat(d._mx || '0')
        const cy = parseFloat(d._my || '0')
        const nx = cx + (target.x - cx) * 0.08
        const ny = cy + (target.y - cy) * 0.08
        d._mx = String(nx)
        d._my = String(ny)
        const base = d._baseTransform || ''
        el.style.transform = `${base} translate(${nx}px, ${ny}px)`
      })
      emojiRaf = requestAnimationFrame(animateEmojis)
    }
    emojiRaf = requestAnimationFrame(animateEmojis)

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh - rect.top) / (vh + rect.height)
      const centered = (progress - 0.5) * 2  // -1 giriyor, 0 orta, +1 çıkıyor

      // Emojiler
      emojis.forEach((el) => {
        const side = el.dataset.side as 'left' | 'right'
        const delay = parseFloat(el.dataset.delay || '0')
        const rotate = parseFloat(el.dataset.rotate || '0')
        const p = Math.max(-1, Math.min(1, centered - delay))
        const offscreen = side === 'left' ? -280 : 280
        const tx = p < 0 ? offscreen * (-p) : offscreen * p
        const opacity = 1 - Math.abs(p) * 1.2
        const baseTransform = `translateX(${tx}px) rotate(${rotate}deg)`
        ;(el.dataset as any)._baseTransform = baseTransform
        const mx = parseFloat((el.dataset as any)._mx || '0')
        const my = parseFloat((el.dataset as any)._my || '0')
        el.style.transform = `${baseTransform} translate(${mx}px, ${my}px)`
        el.style.opacity = String(Math.max(0, opacity))
      })

      // Başlık
      if (title) {
        const op = 1 - Math.abs(centered) * 1.4
        title.style.opacity = String(Math.max(0, op))
      }

      // Kartlar
      cards.forEach((card, i) => {
        const delay = 0
        const p = centered - delay
        const absP = Math.abs(p)
        const ty = absP > 0.05 ? (absP - 0.05) * 70 : 0
        const op = 1 - absP * 1.3
        card.style.transform = `translateY(${ty}px)`
        card.style.opacity = String(Math.max(0, op))
      })

      // Aksiyonlar
      if (actions) {
        const op = 1 - Math.abs(centered + 0.15) * 1.8
        const ty = centered < 0 ? Math.max(0, (-centered - 0.15) * 40) : centered * 40
        actions.style.transform = `translateY(${ty}px)`
        actions.style.opacity = String(Math.max(0, op))
      }

      // Yazı — scroll pozisyonuna direkt bağlı
      // centered: -0.7 → gelmeye başlar, 0 → tam görünür, +0.3 → silinmeye başlar
      const showStart = -0.85   // buradan itibaren kelimeler gelmeye başlar
      const showFull  = -0.2   // burada tüm kelimeler görünür
      const hideStart =  0.25  // buradan itibaren silinmeye başlar
      const hideEnd   =  0.75  // tamamen silinmiş

      let targetWords = 0

      if (centered <= showStart) {
        targetWords = 0
      } else if (centered <= showFull) {
        // giriş: scroll ilerledikçe kelimeler artar
        const ratio = (centered - showStart) / (showFull - showStart)
        targetWords = Math.round(ratio * words.length)
      } else if (centered <= hideStart) {
        // tam görünür bölge
        targetWords = words.length
      } else if (centered <= hideEnd) {
        // çıkış: scroll ilerledikçe kelimeler azalır
        const ratio = 1 - (centered - hideStart) / (hideEnd - hideStart)
        targetWords = Math.round(ratio * words.length)
      } else {
        targetWords = 0
      }

      setVisibleWords(targetWords)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(emojiRaf)
      emojis.forEach((el) => {
        const onMove = emojiMoveHandlers.get(el)
        const onLeave = emojiLeaveHandlers.get(el)
        if (onMove) el.removeEventListener('mousemove', onMove)
        if (onLeave) el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [words.length])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black"
      style={{ overflow: 'clip' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-900/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-64 w-96 bg-gradient-to-l from-white/10 via-white/4 to-transparent blur-2xl" />

      {EMOJIS.map((e) => (
        <div key={e.alt} data-emoji data-side={e.side} data-delay={e.delay} data-rotate={e.rotate}
          style={{ position: 'absolute', top: e.top, ...(e.side === 'left' ? { left: '7%' } : { right: '7%' }), willChange: 'transform, opacity', opacity: 0, zIndex: 5 }}>
          <Image src={e.src} alt={e.alt} width={280} height={280} className="select-none drop-shadow-2xl" draggable={false} />
        </div>
      ))}

      <h2 data-about="title"
        className="absolute top-[6%] left-0 right-0 text-center font-extrabold leading-none tracking-tight whitespace-nowrap z-10 pointer-events-none select-none"
        style={{
          fontSize: 'clamp(4rem, 16vw, 13rem)', letterSpacing: '-0.02em',
          background: 'linear-gradient(100deg, #6b7280 0%, #9ca3af 30%, #e5e7eb 52%, #f9fafb 58%, #d1d5db 70%, #9ca3af 85%, #6b7280 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          opacity: 0, willChange: 'opacity',
        }}>
        {t.about.title}
      </h2>

      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '26%', right: '26%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        paddingTop: '18vh', gap: '1.6rem', zIndex: 10, pointerEvents: 'none',
      }}>
        <p className="font-medium text-neutral-200 text-center w-full"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.15rem)', lineHeight: '1.9', overflowWrap: 'break-word' }}>
          {words.map((word, i) => (
            <span key={i} style={{
              opacity: i < visibleWords ? 1 : 0,
              transition: 'opacity 0.12s ease',
              marginRight: '0.28em',
              display: 'inline',
            }}>
              {word}
            </span>
          ))}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full" style={{ pointerEvents: 'auto' }}>
          {cardsData.map((card) => (
            <div key={card.label} data-card
              className="group relative rounded-xl border border-neutral-800 bg-black/60 backdrop-blur-sm px-4 py-4 cursor-default transition-all duration-300 hover:border-transparent"
              style={{ opacity: 0, willChange: 'transform, opacity', height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7, #6366f1)', padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.07), rgba(168,85,247,0.07), rgba(99,102,241,0.07))' }} />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1 relative z-10">{card.label}</p>
              <p className="font-mono text-xs text-neutral-100 font-semibold relative z-10">{card.value}</p>
              {card.sub && <p className="font-mono text-[10px] text-neutral-500 mt-0.5 relative z-10">{card.sub}</p>}
            </div>
          ))}
        </div>

        <div data-actions className="flex items-center gap-3 flex-wrap justify-center" style={{ opacity: 0, willChange: 'transform, opacity', pointerEvents: 'auto' }}>
          <div style={{ perspective: '700px' }}>
            <a href="/cv.pdf" target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 p-[1.5px] shadow-[0_0_30px_-8px_rgba(217,70,239,0.5)] transition-all duration-500 ease-out [transform-style:preserve-3d] hover:shadow-[0_0_55px_-6px_rgba(217,70,239,0.85)] hover:[transform:rotateZ(-10deg)_rotateY(14deg)_rotateX(5deg)]">
              <span className="rounded-full bg-black/70 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/30">{t.about.downloadCV}</span>
            </a>
          </div>
          {SOCIALS.map((s) => (
            <div key={s.label} style={{ perspective: '700px' }}>
              <a href={s.href} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 p-[1.5px] shadow-[0_0_20px_-8px_rgba(217,70,239,0.4)] transition-all duration-500 ease-out [transform-style:preserve-3d] hover:shadow-[0_0_40px_-6px_rgba(217,70,239,0.7)] hover:[transform:rotateZ(-10deg)_rotateY(14deg)_rotateX(5deg)]">
                <span className="rounded-full bg-black/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/30">{s.label}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}