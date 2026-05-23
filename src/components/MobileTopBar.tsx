'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { MENU_CATEGORIES } from '@/lib/menu-categories'
import ThemeToggle from './ThemeToggle'
import KuwaitFlag from './KuwaitFlag'
import USAFlag from './USAFlag'

const EXTRA_LINKS = [
  { href: '/#ritual',  en: 'Ritual',  ar: 'الطقس'    },
  { href: '/#about',   en: 'About',   ar: 'من نحن'   },
  { href: '/#contact', en: 'Contact', ar: 'تواصل'    },
]

export default function MobileTopBar() {
  const [lang, setLang]   = useState<'EN' | 'AR'>('EN')
  const [expanded, setExpanded] = useState<string | null>('lip') // which category is open
  const drawerRef = useRef<HTMLDivElement>(null)

  const isMenuOpen = useCartStore(s => s.isMenuOpen)
  const openMenu   = useCartStore(s => s.openMenu)
  const closeMenu  = useCartStore(s => s.closeMenu)
  const openCart   = useCartStore(s => s.openCart)
  const cartCount  = useCartStore(s => s.count())

  useEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('lang-ar')) {
      setLang('AR')
    }
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    if (!isMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isMenuOpen])

  // ESC closes
  useEffect(() => {
    if (!isMenuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMenuOpen, closeMenu])

  // Swipe-left to close
  useEffect(() => {
    const el = drawerRef.current
    if (!el || !isMenuOpen) return
    let startX = 0, startY = 0, dragging = false
    const SWIPE_THRESHOLD = 60
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX = e.touches[0].clientX; startY = e.touches[0].clientY
      dragging = true
      el.style.transition = 'none'
    }
    const onMove = (e: TouchEvent) => {
      if (!dragging || e.touches.length !== 1) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      if (Math.abs(dy) > Math.abs(dx)) { dragging = false; el.style.transform = ''; el.style.transition = ''; return }
      if (dx < 0) el.style.transform = `translateX(${dx}px)`
    }
    const onEnd = (e: TouchEvent) => {
      if (!dragging) return
      dragging = false
      const dx = (e.changedTouches[0]?.clientX ?? startX) - startX
      el.style.transition = ''
      el.style.transform = ''
      if (dx < -SWIPE_THRESHOLD) closeMenu()
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [isMenuOpen, closeMenu])

  const toggleLang = () => {
    const next = lang === 'EN' ? 'AR' : 'EN'
    setLang(next)
    document.documentElement.classList.toggle('lang-ar', next === 'AR')
    document.body.dir = next === 'AR' ? 'rtl' : 'ltr'
  }

  const toggleCategory = (slug: string) => {
    setExpanded(prev => prev === slug ? null : slug)
  }

  return (
    <>
      {/* ─── Top bar ─── */}
      <header className="mob-topbar">
        <button
          className={`mob-ham${isMenuOpen ? ' open' : ''}`}
          onClick={() => isMenuOpen ? closeMenu() : openMenu()}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <Link href="/" className="mob-topbar-logo" onClick={closeMenu} aria-label="Claraline home">
          <span className="claraline-logo" style={{ width: '120px', height: '30px' }} />
        </Link>

        <div className="mob-topbar-actions">
          <ThemeToggle size={36} iconSize={16} />

          <button
            type="button"
            onClick={toggleLang}
            className="mob-lang-pill"
            aria-label={lang === 'EN' ? 'Switch to Arabic' : 'Switch to English'}
          >
            {lang === 'EN' ? <KuwaitFlag width={16} height={11} /> : <USAFlag width={16} height={11} />}
            <span>{lang === 'EN' ? 'عربي' : 'EN'}</span>
          </button>

          <button className="mob-topbar-cart" onClick={openCart} aria-label="Open cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="mob-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* ─── Backdrop ─── */}
      <div
        onClick={closeMenu}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-hidden={!isMenuOpen}
      />

      {/* ─── Menu drawer ─── */}
      <aside
        ref={drawerRef}
        className="drawer-panel"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 9999,
          width: '380px', maxWidth: '90vw',
          background: 'var(--obsidian)',
          borderRight: '0.5px solid rgba(201,169,110,0.15)',
          display: 'flex', flexDirection: 'column',
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
          WebkitTapHighlightColor: 'transparent',
        }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Menu</h2>
            <p className="drawer-subtitle">القائمة</p>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body megamenu-body" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

          {/* COLLECTIONS label + category list — always expanded */}
          <p className="megamenu-collections-label">
            <span className="en-only">Collections — المجموعات</span>
            <span className="ar-only">المجموعات — Collections</span>
          </p>

          <ul className="megamenu-cats">
            {MENU_CATEGORIES.map(cat => {
              const open = expanded === cat.slug
              return (
                <li key={cat.slug} className={`megamenu-cat${open ? ' open' : ''}`}>
                  <button
                    type="button"
                    className="megamenu-cat-head"
                    onClick={() => toggleCategory(cat.slug)}
                    aria-expanded={open}
                  >
                    <span className="megamenu-cat-toggle" aria-hidden />
                    <span className="megamenu-cat-name en-only">{cat.name_en}</span>
                    <span className="megamenu-cat-name ar-only">{cat.name_ar}</span>
                    <span className="megamenu-cat-ar en-only">{cat.name_ar}</span>
                    <span className="megamenu-cat-ar ar-only">{cat.name_en}</span>
                    <span className="megamenu-cat-count">{cat.subcategories.length}</span>
                  </button>
                  <div className="megamenu-cat-body">
                    <div className="megamenu-cat-body-inner">
                      {cat.subcategories.length === 0 ? (
                        <Link
                          href={`/shop?collection=${cat.slug}`}
                          className="megamenu-sub"
                          onClick={closeMenu}
                        >
                          <span className="megamenu-sub-diamond">◇</span>
                          <span className="en-only">View all</span>
                          <span className="ar-only">عرض الكل</span>
                        </Link>
                      ) : (
                        cat.subcategories.map(sub => (
                          <Link
                            key={sub.slug}
                            href={`/shop?collection=${cat.slug}&type=${sub.slug}`}
                            className="megamenu-sub"
                            onClick={closeMenu}
                          >
                            <span className="megamenu-sub-diamond">◇</span>
                            <span className="en-only">{sub.name_en}</span>
                            <span className="ar-only">{sub.name_ar}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* View All Products */}
          <Link href="/shop" className="megamenu-viewall" onClick={closeMenu}>
            <span className="en-only">View All Products</span>
            <span className="ar-only">عرض جميع المنتجات</span>
            <span className="megamenu-viewall-arrow" aria-hidden>→</span>
          </Link>

          <div className="megamenu-divider" />

          {/* Static links (same level as Collections) */}
          <ul className="megamenu-extras">
            {EXTRA_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="megamenu-extra-link" onClick={closeMenu}>
                  <span className="en-only">{l.en}</span>
                  <span className="ar-only">{l.ar}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="megamenu-divider" />

          {/* Trust badges */}
          <div className="megamenu-trust">
            <p className="megamenu-trust-item">
              <span className="megamenu-trust-mark">✦</span>
              <span className="en-only">Free delivery KWD 20+</span>
              <span className="ar-only" dir="rtl">توصيل مجاني فوق ٢٠ د.ك</span>
            </p>
            <p className="megamenu-trust-item">
              <span className="megamenu-trust-mark">✦</span>
              <span className="en-only">Halal certified</span>
              <span className="ar-only" dir="rtl">حلال معتمد</span>
            </p>
            <p className="megamenu-trust-item">
              <span className="megamenu-trust-mark">✦</span>
              <span className="en-only">Cruelty free</span>
              <span className="ar-only" dir="rtl">خالٍ من القسوة</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
