'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const skillsData = useMemo(() => [
    { name: t.skills.python, tag: t.skills.pythonTag, tools: t.skills.pythonDesc },
    { name: t.skills.ml,     tag: t.skills.mlTag,     tools: t.skills.mlDesc },
    { name: t.skills.llm,    tag: t.skills.llmTag,    tools: t.skills.llmDesc },
    { name: t.skills.sql,    tag: t.skills.sqlTag,    tools: t.skills.sqlDesc },
    { name: t.skills.web,    tag: t.skills.webTag,    tools: t.skills.webDesc },
    { name: t.skills.api,    tag: t.skills.apiTag,    tools: t.skills.apiDesc },
    { name: t.skills.cpp,    tag: t.skills.cppTag,    tools: t.skills.cppDesc },
  ], [t.skills])

  useEffect(() => {
    const section = sectionRef.current
    const bg      = bgRef.current
    if (!section || !bg) return

    const rows  = section.querySelectorAll<HTMLElement>('[data-skill-row]')
    const title = section.querySelector<HTMLElement>('[data-skills-title]')

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh   = window.innerHeight
      const p    = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))

      const grey = Math.round(Math.min(1, p / 0.20) * 255)
      bg.style.backgroundColor = `rgb(${grey},${grey},${grey})`

      const textLight   = grey < 128
      const textColor   = textLight ? 'rgb(255,255,255)'       : 'rgb(0,0,0)'
      const subColor    = textLight ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)'
      const borderColor = textLight ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'

      if (title) {
        const centered = (p - 0.35) * 2
        // giriş: centered -1→-0.3 arası gelir, sonra hep görünür
        const enterProgress = Math.min(1, Math.max(0, (centered + 1) / 0.7))
        const op = enterProgress
        const ty = (1 - enterProgress) * -60
        title.style.opacity   = String(op)
        title.style.transform = `translateY(${ty}px)`
        title.style.color     = textColor
      }

      rows.forEach((row) => {
        const rRect    = row.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (vh - rRect.top) / (vh * 0.5)))
        const exitP    = Math.max(0, -rRect.bottom / (vh * 0.3))
        const op       = Math.max(0, progress - exitP * 2)
        const ty       = (1 - progress) * 50 - exitP * 40
        row.style.opacity     = String(op)
        row.style.transform   = `translateY(${ty}px)`
        row.style.borderColor = borderColor

        const num  = row.querySelector<HTMLElement>('[data-num]')
        const name = row.querySelector<HTMLElement>('[data-name]')
        const tag  = row.querySelector<HTMLElement>('[data-tag]')
        const tool = row.querySelector<HTMLElement>('[data-tools]')
        if (num)  num.style.color  = textColor
        if (name) name.style.color = textColor
        if (tag)  tag.style.color  = subColor
        if (tool) tool.style.color = subColor
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [skillsData])

  return (
    <section id="skills" ref={sectionRef} className="relative w-full">
      <div
        ref={bgRef}
        className="w-full px-8 md:px-16 pt-24 pb-32"
        style={{ backgroundColor: 'rgb(0,0,0)', minHeight: '100vh' }}
      >
        {/* SKILLS başlık */}
        <div className="flex justify-center mb-20">
          <h2
            data-skills-title
            className="font-extrabold leading-none tracking-tight select-none whitespace-nowrap"
            style={{ fontSize: 'clamp(4rem, 16vw, 13rem)', letterSpacing: '-0.02em', color: 'white', opacity: 0, willChange: 'transform, opacity' }}
          >
            {t.skills.title}
          </h2>
        </div>

        {/* Skill listesi */}
        <div className="flex flex-col">
          {skillsData.map((skill, i) => (
            <div
              key={i}
              data-skill-row
              className="flex items-start gap-8 py-10 border-b"
              style={{ opacity: 0, transform: 'translateY(50px)', willChange: 'transform, opacity', borderColor: 'rgba(255,255,255,0.12)' }}
            >
              {/* büyük numara — referanstaki gibi */}
              <span
                data-num
                className="font-extrabold leading-none shrink-0 select-none"
                style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', letterSpacing: '-0.04em', minWidth: '5rem', color: 'white', lineHeight: 1 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* sağ taraf: isim + açıklama */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-4">
                  <h3
                    data-name
                    className="font-extrabold leading-tight"
                    style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', letterSpacing: '-0.02em', color: 'white' }}
                  >
                    {skill.name}
                  </h3>
                  <span
                    data-tag
                    className="font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {skill.tag}
                  </span>
                </div>
                <p
                  data-tools
                  className="font-mono text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '600px' }}
                >
                  {skill.tools}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}