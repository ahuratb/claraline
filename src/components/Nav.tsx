'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store'
import MegaMenu from '@/components/MegaMenu'
import KuwaitFlag from '@/components/KuwaitFlag'
import USAFlag from '@/components/USAFlag'

type Theme = 'dark' | 'light'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState<'EN' | 'AR'>('EN')
  const [theme, setTheme] = useState<Theme>('dark')
  const [megaOpen, setMegaOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [navHeight, setNavHeight] = useState(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { count, isOpen, openCart, closeCart } = useCartStore()
  const { data: session } = useSession()
  const cartCount = count()
  const toggleCart = () => (isOpen ? closeCart() : openCart())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('theme-light') ? 'light' : 'dark')
  }, [])

  // Track the rendered nav height so the mega menu sits directly under it
  useEffect(() => {
    if (!navRef.current) return
    const update = () => {
      if (navRef.current) setNavHeight(navRef.current.getBoundingClientRect().height)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(navRef.current)
    window.addEventListener('resize', update)
    return () => { ro.disconnect(); window.removeEventListener('resize', update) }
  }, [scrolled])

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

  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null } }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setMegaOpen(false), 200)
  }
  const openMega = () => { cancelClose(); setMegaOpen(true) }
  const toggleMega = () => { cancelClose(); setMegaOpen(o => !o) }

  return (
    <>
      <nav
        ref={navRef}
        className={`main-nav fixed top-0 left-0 right-0 z-[200] flex justify-between items-center px-16 transition-all duration-500 ${
          scrolled
            ? 'py-5 backdrop-blur-md border-b border-[rgba(201,169,110,0.12)]'
            : 'py-7'
        }`}
        style={{
          fontFamily: 'Cairo, sans-serif',
          background: scrolled
            ? 'color-mix(in srgb, var(--obsidian) 80%, transparent)'
            : 'transparent',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="no-underline flex items-center"
          style={{ animation: 'fadeUp 1s 0.3s forwards', opacity: 0 }}
          aria-label="Claraline home"
        >
          <span
            className="claraline-logo"
            style={{ width: '180px', height: '44px' }}
          />
        </Link>

        {/* Links */}
        <ul
          className="flex gap-10 list-none"
          style={{ animation: 'fadeUp 1s 0.5s forwards', opacity: 0 }}
        >
          {/* Collection — opens mega menu */}
          <li
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              data-megamenu-trigger
              onClick={toggleMega}
              aria-haspopup="true"
              aria-expanded={megaOpen}
              className={`text-[11px] tracking-[0.32em] uppercase opacity-70 hover:opacity-100 transition-all duration-300 bg-transparent border-0 cursor-pointer ${megaOpen ? 'text-[var(--champagne)] opacity-100' : 'text-[var(--ivory)] hover:text-[var(--champagne)]'}`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              Collection
            </button>
          </li>
          {[
            { label: 'Ritual', href: '/#ritual' },
            { label: 'About', href: '/#about' },
          ].map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-[11px] tracking-[0.32em] uppercase text-[var(--ivory)] opacity-70 hover:opacity-100 hover:text-[var(--champagne)] transition-all duration-300 no-underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: theme + lang + cart */}
        <div
          className="flex items-center gap-5"
          style={{ animation: 'fadeUp 1s 0.6s forwards', opacity: 0 }}
        >
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-[40px] h-[40px] border border-[rgba(201,169,110,0.3)] flex items-center justify-center hover:border-[var(--champagne)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
            style={{ color: 'var(--champagne)' }}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleLang}
            className="nav-lang-pill"
            aria-label={lang === 'EN' ? 'Switch to Arabic' : 'Switch to English'}
          >
            {lang === 'EN' ? <KuwaitFlag width={20} height={14} /> : <USAFlag width={20} height={14} />}
            <span>{lang === 'EN' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Account icon */}
          <Link
            href={session ? '/account' : '/login'}
            className="w-[40px] h-[40px] border border-[rgba(201,169,110,0.3)] flex items-center justify-center hover:border-[var(--champagne)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
            aria-label={session ? 'My account' : 'Sign in'}
            style={{ color: session ? 'var(--champagne)' : 'var(--muted)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>

          <button
            onClick={toggleCart}
            className="relative w-[44px] h-[44px] border border-[rgba(201,169,110,0.3)] flex items-center justify-center hover:border-[var(--champagne)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
            aria-label="Toggle cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[var(--champagne)] rounded-full text-[9px] text-[var(--obsidian)] flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <MegaMenu
        open={megaOpen}
        onClose={() => setMegaOpen(false)}
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
        navOffsetPx={navHeight}
      />
    </>
  )
}
