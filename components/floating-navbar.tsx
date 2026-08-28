'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/translations'
import { MobileNavDrawer } from './mobile-nav-drawer'

export function FloatingNavbar() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()

  const languages: Language[] = ['eng', 'tur', 'ger']

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null

    if (id === 'contact') {
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(document.body.scrollHeight, { duration: 1.2, force: true })
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }
      return
    }
    const el = document.getElementById(id)
    if (el) {
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(el, { duration: 1.2, force: true })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 0.7
      if (window.scrollY > heroThreshold) {
        setScrolledPastHero(true)
      } else {
        setScrolledPastHero(false)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 0.7) {
        // Fare ekranın üst 80px alanındaysa göster
        if (e.clientY <= 80) {
          setIsHovered(true)
        } else if (e.clientY > 130 && !langOpen && !mobileNavOpen) {
          // 130px aşağısındaysa ve dil/mobil menüsü açık değilse gizle
          setIsHovered(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [langOpen, mobileNavOpen])

  if (!scrolledPastHero) return null

  const isVisible = isHovered || langOpen || mobileNavOpen

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          if (!langOpen && !mobileNavOpen) setIsHovered(false)
        }}
        className={`fixed inset-x-0 top-0 z-40 flex justify-center pt-6 px-4 md:px-8 transition-all duration-500 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full rounded-full bg-black/30 backdrop-blur-md px-6 md:px-8 py-4 border border-white/10 shadow-2xl">
          <nav className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-400">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="font-semibold whitespace-nowrap transition-colors duration-300 hover:text-white"
            >
              {t.hero.name}
            </a>

            <div className="flex items-center gap-4 md:gap-12">
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#about"
                  onClick={(e) => scrollToSection(e, 'about')}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {t.nav.about}
                </a>
                <a
                  href="#skills"
                  onClick={(e) => scrollToSection(e, 'skills')}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {t.nav.skills}
                </a>
                <a
                  href="#projects"
                  onClick={(e) => scrollToSection(e, 'projects')}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {t.nav.projects}
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {t.nav.contact}
                </a>
              </div>

              <div className="hidden md:block relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 transition-colors hover:text-white"
                >
                  <span className="uppercase tracking-[0.28em]">{lang}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${
                      langOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 top-full mt-4 flex flex-col items-end gap-3 rounded-lg bg-black/90 backdrop-blur-md p-4 shadow-2xl border border-white/15 transition-all duration-300 ${
                    langOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {languages
                    .filter((l) => l !== lang)
                    .map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l)
                          setLangOpen(false)
                        }}
                        className="transition-colors hover:text-white uppercase tracking-[0.28em]"
                      >
                        {l}
                      </button>
                    ))}
                </div>
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open mobile menu"
                className="md:hidden flex items-center justify-center p-2 rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:border-white/50 active:scale-95 cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </div>

      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onNavigate={scrollToSection}
      />
    </>
  )
}
