'use client'

import dynamic from 'next/dynamic'
import { AboutSection } from '@/components/about-section'
import { SkillsSection } from '@/components/skills-section'
import { ProjectsSection } from '@/components/projects-section'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/translations'

const CharacterCanvas = dynamic(
  () => import('@/components/character-canvas').then((m) => m.CharacterCanvas),
  { ssr: false },
)

const NAV = ['About', 'Skills', 'Projects', 'Contact']

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  
  const languages: Language[] = ['eng', 'tur', 'ger']

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'contact') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const els = hero.querySelectorAll<HTMLElement>('[data-hero]')

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        els.forEach((el) => {
          el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
          el.style.opacity = '1'
          el.style.transform = 'translate(0,0) scale(1)'
        })
      })
    })

    const handleScroll = () => {
      const rect = hero.getBoundingClientRect()
      const vh = window.innerHeight
      const exitProgress = Math.max(0, -rect.top / vh)

      els.forEach((el) => {
        const dir = el.dataset.hero as string
        let tx = 0, ty = 0
        const dist = exitProgress * 140
        if (dir === 'up')   ty = -dist
        if (dir === 'down') ty = -dist * 0.7
        if (dir === 'left') tx = -dist
        if (dir === 'right') tx = dist
        let scale = 1
        if (dir === 'scale') scale = 1 - exitProgress * 0.1
        const opacity = Math.max(0, 1 - exitProgress * 2.2)
        el.style.transition = exitProgress > 0 ? 'none' : 'opacity 0.8s ease, transform 0.8s ease'
        el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
        el.style.opacity = String(opacity)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-black">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[140px]" />

      <header className="absolute inset-x-0 top-0 z-30 flex justify-center pt-6 px-4 md:px-8">
        <div data-hero="scale" className="w-full rounded-full bg-black/30 backdrop-blur-md px-6 md:px-8 py-4 border border-white/10 shadow-2xl" style={{ opacity: 0, transform: 'scale(0.95)' }}>
          <nav data-hero="up" className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-400" style={{ opacity: 0, transform: 'translateY(-20px)' }}>
          <div className="font-semibold whitespace-nowrap transition-colors duration-300 hover:text-white">
            {t.hero.name}
          </div>
          <div className="flex items-center gap-8 md:gap-12">
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="transition-colors duration-300 hover:text-white">{t.nav.about}</a>
              <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')} className="transition-colors duration-300 hover:text-white">{t.nav.skills}</a>
              <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="transition-colors duration-300 hover:text-white">{t.nav.projects}</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="transition-colors duration-300 hover:text-white">{t.nav.contact}</a>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)} 
                className="flex items-center gap-1 transition-colors hover:text-white"
              >
                <span className="uppercase tracking-[0.28em]">{lang}</span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`absolute right-0 top-full mt-4 flex flex-col items-end gap-3 rounded-lg bg-black/60 backdrop-blur-md p-4 shadow-xl border border-white/10 transition-all duration-300 ${langOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
              >
                {languages.filter(l => l !== lang).map((l) => (
                  <button 
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className="transition-colors hover:text-white uppercase tracking-[0.28em]"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 data-hero="up" aria-label="HI, I'M YİĞİT"
          className="pointer-events-none absolute left-1/2 top-[5%] z-10 -translate-x-1/2 select-none whitespace-nowrap text-center font-sans text-[15vw] font-extrabold leading-none tracking-tighter text-white uppercase"
          style={{ opacity: 0, transform: 'translateY(-40px)' }}>
          HI, I&apos;M YİĞİT
        </h1>

        <div data-hero="down" className="relative z-20 h-[78vh] w-full max-w-2xl" style={{ opacity: 0, transform: 'translateY(40px)' }}>
          <CharacterCanvas />
        </div>

        <p data-hero="left"
          className="absolute bottom-[26%] left-8 z-30 max-w-[15rem] text-pretty font-mono text-xs uppercase leading-relaxed tracking-wider text-neutral-300 md:left-14 md:max-w-xs md:text-sm"
          style={{ opacity: 0, transform: 'translateX(-40px)' }}>
          {t.hero.description}
        </p>

        <div data-hero="right" className="absolute bottom-[26%] right-8 z-30 md:right-14" style={{ opacity: 0, transform: 'translateX(40px)', perspective: '700px' }}>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 p-[1.5px] shadow-[0_0_40px_-8px_rgba(217,70,239,0.6)] transition-all duration-500 ease-out [transform-style:preserve-3d] hover:shadow-[0_0_55px_-6px_rgba(217,70,239,0.85)] hover:[transform:rotateZ(-10deg)_rotateY(14deg)_rotateX(5deg)]">
            <span className="flex items-center gap-2 rounded-full bg-black/70 px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/30">
              {t.hero.contactBtn}
            </span>
          </a>
        </div>
      </div>

      <div data-hero="down" className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0, transform: 'translateY(40px)' }}>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">{t.hero.scroll}</span>
        <svg className="w-4 h-4 text-neutral-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <main className="relative w-full bg-black">
      {/* Hero — siyah, en üstte */}
      <div style={{ borderRadius: '0 0 24px 24px', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
        <HeroSection />
      </div>

      {/* About — siyah, hero'nun üstüne biner */}
      <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', zIndex: 20, marginTop: '-24px' }}>
        <AboutSection />
      </div>

      {/* Skills — beyaz, altında kalır */}
      <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', zIndex: 15, marginTop: '-24px' }}>
        <SkillsSection />
      </div>

      {/* Projects — siyah, skills'in üstüne biner, overflow YOK sticky çalışsın */}
      <div style={{ position: 'relative', zIndex: 25, marginTop: '-24px', borderRadius: '24px' }}>
        <ProjectsSection />
      </div>


    </main>
  )
}