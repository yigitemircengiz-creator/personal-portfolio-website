'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const CARD_H = 560
const PEEK = 80

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error('Server returned an unexpected response. Did you restart the dev server and add your API key?');
      }
      
      if (!res.ok) throw new Error(data.error || 'Failed to send message.')
      
      setFormStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setFormStatus('idle'), 5000)
    } catch (err: any) {
      setFormStatus('error')
      setErrorMessage(err.message)
    }
  }

  const projectsData = useMemo(() => [
    { num: '01', name: t.projects.p1Name, desc: t.projects.p1Desc, stack: 'Next.js · Tailwind CSS · localStorage ORM · AI Chatbot', link: 'https://scente-ai-ecommerce.vercel.app/', github: 'https://github.com/yigitemircengiz-creator/scente-ai-ecommerce', images: ['/scente-1.jpg', '/scente-2.jpg', '/scente-3.jpg'] },
    { num: '02', name: t.projects.p2Name, desc: t.projects.p2Desc, stack: 'Python · Claude API · REST API · HTML/CSS/JS', link: '', github: 'https://github.com/yigitemircengiz-creator/trendshop-ai', images: ['/trendshop-1.jpg', '/trendshop-2.jpg', '/trendshop-3.jpg'] },
    { num: '03', name: t.projects.p3Name, desc: t.projects.p3Desc, stack: 'Django · HTML · CSS · JavaScript', link: 'https://ders-programi.onrender.com/', github: 'https://github.com/yigitemircengiz-creator/Turkish-lesson-tracking-system', images: ['/derstakip-1.jpg', '/derstakip-2.jpg', '/derstakip-3.png'] },
    { num: '04', name: t.projects.p4Name, desc: t.projects.p4Desc, stack: 'Next.js · React · Tailwind CSS · TypeScript', link: 'https://yigitemircengiz-creator.github.io/personal-portfolio-website/', github: 'https://github.com/yigitemircengiz-creator/personal-portfolio-website', images: ['/portfolio-1.png', '/portfolio-2.png', '/portfolio-3.png'] },
  ], [t.projects])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-card]'))

    // Başta 2-5. kartları ekranın tamamen altına göm
    cards.forEach((card, i) => {
      if (i === 0) return
      card.style.transform = 'translateY(110vh)'
    })

    const handleScroll = () => {
      const sRect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const sHeight = sRect.height
      const sectionProgress = Math.max(0, Math.min(1, -sRect.top / (sHeight - vh)))

      cards.forEach((card, i) => {
        if (i === 0) return

        const step = 0.2
        const triggerAt = 0.05 + (i - 1) * step
        const progress = Math.max(0, Math.min(1, (sectionProgress - triggerAt) / step))

        const ty = (1 - progress) * 110
        card.style.transform = `translateY(${ty}vh)`
      })
    }

    const contactInner = section.querySelector<HTMLElement>('[data-contact-inner]')

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // Contact animasyonu — son proje bittikten sonra gelsin
    const contactScroll = () => {
      if (!contactInner) return
      const sRect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const sHeight = section.offsetHeight
      const sectionProgress = Math.max(0, Math.min(1, -sRect.top / (sHeight - vh)))
      // Last card finishes at 0.05 + 2*0.2 + 0.2 = 0.65
      // Contact occupies 0.70 → 1.0
      const triggerAt = 0.70
      const progress = Math.max(0, Math.min(1, (sectionProgress - triggerAt) / 0.30))
      contactInner.style.transform = `translateY(${(1 - progress) * 105}vh)`
    }

    window.addEventListener('scroll', contactScroll, { passive: true })
    contactScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', contactScroll)
    }
  }, [])

  const totalScroll = CARD_H * projectsData.length * 1.5

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full"
      style={{ backgroundColor: '#0a0a0a', borderRadius: '24px', height: `${totalScroll * 1.1 + 50}px`, overflow: 'clip' }}
    >
      {/* PROJECTS yazısı */}
      <div className="flex items-center justify-center py-28 px-10 md:px-16 pointer-events-none select-none">
        <h2 className="font-extrabold leading-none tracking-tight whitespace-nowrap"
          style={{
            fontSize: 'clamp(3rem, 13vw, 11rem)', letterSpacing: '-0.02em',
            background: 'linear-gradient(100deg, #6b7280 0%, #9ca3af 30%, #e5e7eb 52%, #f9fafb 58%, #d1d5db 70%, #9ca3af 85%, #6b7280 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
          {t.projects.title}
        </h2>
      </div>

      {/* Sticky container — overflow: hidden ile kartlar dışarı çıkamaz */}
      <div style={{ position: 'sticky', top: 'calc(50vh - 450px)', height: `${CARD_H + (projectsData.length - 1) * PEEK}px`, paddingLeft: '2.5rem', paddingRight: '2.5rem' }} data-projects-sticky>
        {projectsData.map((project, i) => (
          <div
            key={project.num}
            data-card
            style={{
              position: 'absolute',
              top: `${i * PEEK}px`,
              left: 0, right: 0,
              height: `${CARD_H}px`,
              zIndex: i + 1,
              willChange: 'transform',
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#111', border: '1.5px solid rgba(255,255,255,0.22)', position: 'relative' }}>

              <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-4 px-6 py-4"
                style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
                <span className="font-extrabold text-white leading-none shrink-0"
                  style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', letterSpacing: '-0.03em' }}>
                  {project.num}
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white text-sm tracking-wide uppercase">{project.name}</p>
                    {project.stack && <p className="font-mono text-xs text-white">· {project.stack}</p>}
                  </div>
                  <p className="font-mono text-[10px] text-white/40 mt-0.5">{project.desc}</p>
                </div>
              </div>

              <div className="absolute top-4 right-5 z-10 flex items-center gap-2">
                {(project as any).github && (
                  <a href={(project as any).github} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/25 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                    title="GitHub">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-white/25 bg-black/40 px-5 py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:text-white">
                    Live Project
                  </a>
                )}
              </div>

              <div className="flex gap-2.5 p-3 h-full pt-16">
                <div className="flex-1 rounded-xl overflow-hidden bg-white/5 min-w-0">
                  {project.images[0]
                    ? <img src={project.images[0]} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="font-mono text-xs text-white/15">image 01</span></div>}
                </div>
                <div className="flex flex-col gap-2.5 w-[36%]">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="flex-1 rounded-xl overflow-hidden bg-white/5">
                      {project.images[idx]
                        ? <img src={project.images[idx]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><span className="font-mono text-xs text-white/15">image 0{idx + 1}</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 100, overflow: 'hidden', pointerEvents: 'none' }} data-contact-sticky>
        <div
          data-contact-inner
          className="absolute inset-0 flex items-center"
          style={{ backgroundColor: 'white', padding: '4rem 5rem', transform: 'translateY(105vh)', willChange: 'transform', gap: '5rem', borderRadius: '24px 24px 0 0', pointerEvents: 'auto' }}
        >
          {/* Sol */}
          <div className="flex flex-col gap-6" style={{ flex: '0 0 38%' }}>
            <h2 className="font-extrabold leading-none tracking-tight animate-gradient-shift"
              style={{
                fontSize: 'clamp(3.5rem, 8.5vw, 8.5rem)', letterSpacing: '-0.03em', lineHeight: 1.05,
                background: 'linear-gradient(90deg, #ec4899, #d946ef, #6366f1, #ec4899)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                whiteSpace: 'pre-line'
              }}>
              {t.projects.contactTitle}
            </h2>
            <a href="mailto:yigitemircengiz@gmail.com" className="font-mono text-sm text-neutral-500 hover:text-black transition-colors">
              yigitemircengiz@gmail.com
            </a>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/yi%C4%9Fit-emir-cengiz/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors">LinkedIn</a>
              <a href="https://github.com/yigitemircengiz-creator" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors">GitHub</a>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-300 mt-2">
              {t.projects.locationString}
            </p>
          </div>

          {/* Sağ: form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5" style={{ flex: 1 }}>
            <input type="text" placeholder={t.projects.namePlaceholder} required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="border-b border-neutral-200 py-3 text-sm font-mono text-black placeholder-neutral-300 outline-none focus:border-black transition-colors bg-transparent w-full" />
            <div className="flex gap-4">
              <input type="email" placeholder={t.projects.emailPlaceholder} required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="flex-1 border-b border-neutral-200 py-3 text-sm font-mono text-black placeholder-neutral-300 outline-none focus:border-black transition-colors bg-transparent" />
              <input type="tel" placeholder={t.projects.phonePlaceholder}
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                className="flex-1 border-b border-neutral-200 py-3 text-sm font-mono text-black placeholder-neutral-300 outline-none focus:border-black transition-colors bg-transparent" />
            </div>
            <textarea placeholder={t.projects.messagePlaceholder} rows={3} required
              value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              className="border-b border-neutral-200 py-3 text-sm font-mono text-black placeholder-neutral-300 outline-none focus:border-black transition-colors bg-transparent resize-none w-full" />
            
            <div className="flex items-center gap-4">
              <div style={{ perspective: '700px' }}>
                <button type="submit" disabled={formStatus === 'loading'}
                  className="group inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 p-[1.5px] shadow-[0_0_40px_-8px_rgba(217,70,239,0.6)] transition-all duration-500 ease-out [transform-style:preserve-3d] hover:shadow-[0_0_55px_-6px_rgba(217,70,239,0.85)] hover:[transform:rotateZ(-10deg)_rotateY(14deg)_rotateX(5deg)] disabled:opacity-50 disabled:pointer-events-none">
                  <span className="rounded-full bg-black/70 px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/30" style={{ display: 'block' }}>
                    {formStatus === 'loading' ? 'SENDING...' : t.projects.sendBtn}
                  </span>
                </button>
              </div>
              {formStatus === 'success' && <span className="text-xs text-green-600 font-mono">Message sent successfully!</span>}
              {formStatus === 'error' && <span className="text-xs text-red-600 font-mono">{errorMessage}</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}