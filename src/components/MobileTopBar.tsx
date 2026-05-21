'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'

type Theme = 'dark' | 'light'

const NAV_LINKS = [
  { href: '/shop',    en: 'Collection',  ar: 'المجموعة'  },
  { href: '/#ritual', en: 'Ritual',      ar: 'الطقس'     },
  { href: '/#about',  en: 'About',       ar: 'من نحن'    },
  { href: '/shop',    en: 'New Arrivals', ar: 'وصل حديثاً' },
]

export default function MobileTopBar() {
  const [open, setOpen]   = useState(false)
  const [lang, setLang]   = useState<'EN' | 'AR'>('EN')
  const [theme, setTheme] = useState<Theme>('dark')
  const { count, openCart } = useCartStore()
  const cartCount = count()

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('theme-light') ? 'light' : 'dark')
  }, [])

  const toggleLang = () => {
    const next = lang === 'EN' ? 'AR' : 'EN'
    setLang(next)
    document.documentElement.classList.toggle('lang-ar', next === 'AR')
    document.body.dir = next === 'AR' ? 'rtl' : 'ltr'
  }

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('theme-light', next === 'light')
    try { localStorage.setItem('claraline-theme', next) } catch {}
  }

  const close = () => setOpen(false)

  return (
    <>
      {/* ── Top bar ── */}
      <header className="mob-topbar">

        {/* Hamburger */}
        <button
          className={`mob-ham${open ? ' open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        {/* Logo — centered */}
        <Link href="/" className="mob-topbar-logo" onClick={close} aria-label="Claraline home">
          <span className="claraline-logo" style={{ width: '120px', height: '30px' }} />
        </Link>

        {/* Cart */}
        <button className="mob-topbar-cart" onClick={openCart} aria-label="Open cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && <span className="mob-cart-badge">{cartCount}</span>}
        </button>

      </header>

      {/* ── Backdrop ── */}
      <div
        className={`mob-menu-backdrop${open ? ' visible' : ''}`}
        onClick={close}
      />

      {/* ── Slide menu ── */}
      <nav className={`mob-menu${open ? ' open' : ''}`} aria-hidden={!open}>

        {/* Menu header */}
        <div className="mob-menu-head">
          <span
            className="claraline-logo"
            style={{ width: '120px', height: '28px', opacity: 0.9 }}
            aria-label="Claraline"
          />
          <button className="mob-menu-close" onClick={close} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mob-menu-divider" />

        {/* Nav links */}
        <ul className="mob-menu-links">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href + l.en} style={{ transitionDelay: open ? `${0.05 + i * 0.06}s` : '0s' }}>
              <Link href={l.href} className="mob-menu-link" onClick={close}>
                <span className="mob-link-num">0{i + 1}</span>
                <span className="mob-link-en en-only">{l.en}</span>
                <span className="mob-link-ar ar-only">{l.ar}</span>
                <svg className="mob-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mob-menu-divider" />

        {/* Bottom: theme + lang toggles */}
        <div className="mob-menu-foot">
          <span className="mob-menu-foot-label en-only">Theme</span>
          <span className="mob-menu-foot-label ar-only">السمة</span>
          <button className="mob-lang-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className={theme === 'dark' ? 'active' : ''}>Dark</span>
            <span className="mob-lang-sep">|</span>
            <span className={theme === 'light' ? 'active' : ''}>Light</span>
          </button>
        </div>

        <div className="mob-menu-foot">
          <span className="mob-menu-foot-label en-only">Language</span>
          <span className="mob-menu-foot-label ar-only">اللغة</span>
          <button className="mob-lang-toggle" onClick={toggleLang}>
            <span className={lang === 'EN' ? 'active' : ''}>EN</span>
            <span className="mob-lang-sep">|</span>
            <span className={lang === 'AR' ? 'active' : ''}>عربي</span>
          </button>
        </div>

      </nav>
    </>
  )
}
