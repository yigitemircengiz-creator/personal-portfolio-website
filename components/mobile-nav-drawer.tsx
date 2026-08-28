'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/translations'

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void
}

export function MobileNavDrawer({ isOpen, onClose, onNavigate }: MobileNavDrawerProps) {
  const { lang, setLang, t } = useLanguage()
  const languages: Language[] = ['eng', 'tur', 'ger']

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-xl transition-all duration-300 animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content sliding from bottom */}
      <div className="relative z-10 w-full bg-neutral-950 border-t border-white/15 rounded-t-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom duration-300">
        {/* Top handle bar */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-2" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-neutral-400">
            Navigation
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 py-2">
          {[
            { id: 'about', label: t.nav.about },
            { id: 'skills', label: t.nav.skills },
            { id: 'projects', label: t.nav.projects },
            { id: 'contact', label: t.nav.contact },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                onNavigate(e, item.id)
                onClose()
              }}
              className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-200 hover:text-white py-3 border-b border-white/5 transition-colors flex items-center justify-between group"
            >
              <span>{item.label}</span>
              <svg className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </nav>

        {/* Language selector footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
            Language
          </span>
          <div className="flex items-center gap-2">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l)
                }}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all ${
                  lang === l
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold shadow-md'
                    : 'bg-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
