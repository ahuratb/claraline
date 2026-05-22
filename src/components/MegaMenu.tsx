'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MENU_CATEGORIES, MenuCategory } from '@/lib/menu-categories'

interface Props {
  open: boolean
  onClose: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  navOffsetPx?: number
}

const CategoryIcon = ({ slug }: { slug: string }) => {
  const common = {
    width: 60, height: 60, viewBox: '0 0 60 60',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.5,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (slug) {
    case 'lip':
      return (
        <svg {...common}>
          <path d="M10 30 Q15 20 22 22 Q26 18 30 22 Q34 18 38 22 Q45 20 50 30 Q45 38 30 40 Q15 38 10 30 Z" />
          <path d="M10 30 Q30 32 50 30" />
          <circle cx="30" cy="50" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...common}>
          <path d="M8 30 Q30 12 52 30 Q30 48 8 30 Z" />
          <circle cx="30" cy="30" r="8" />
          <circle cx="30" cy="30" r="3" fill="currentColor" stroke="none" />
          <path d="M10 22 L6 18 M50 22 L54 18 M10 38 L6 42 M50 38 L54 42" />
        </svg>
      )
    case 'face':
      return (
        <svg {...common}>
          <ellipse cx="30" cy="32" rx="18" ry="22" />
          <circle cx="23" cy="28" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="37" cy="28" r="1.5" fill="currentColor" stroke="none" />
          <path d="M25 38 Q30 42 35 38" />
          <path d="M18 20 Q22 14 30 14 Q38 14 42 20" />
        </svg>
      )
    case 'gift':
      return (
        <svg {...common}>
          <rect x="12" y="22" width="36" height="28" rx="1" />
          <path d="M8 22 L52 22 L52 28 L8 28 Z" />
          <path d="M30 22 L30 50" />
          <path d="M30 22 C26 14 18 14 18 18 C18 22 26 22 30 22 C34 14 42 14 42 18 C42 22 34 22 30 22 Z" />
        </svg>
      )
    default:
      return null
  }
}

function Column({ cat }: { cat: MenuCategory }) {
  const hasSubs = cat.subcategories.length > 0
  return (
    <div className="megamenu-col">
      <div className="megamenu-col-icon"><CategoryIcon slug={cat.slug} /></div>
      <h3 className="megamenu-col-title">
        <span className="en-only">{cat.name_en}</span>
        <span className="ar-only">{cat.name_ar}</span>
      </h3>
      <p className="megamenu-col-title-sub">
        <span className="en-only">{cat.name_ar}</span>
        <span className="ar-only">{cat.name_en}</span>
      </p>
      <div className="megamenu-col-divider" />
      {hasSubs && (
        <ul className="megamenu-col-list">
          {cat.subcategories.map(sub => (
            <li key={sub.slug}>
              <Link
                href={`/shop?collection=${cat.slug}&type=${sub.slug}`}
                className="megamenu-col-link"
              >
                <span className="en-only">{sub.name_en}</span>
                <span className="ar-only">{sub.name_ar}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`/shop?collection=${cat.slug}`}
        className="megamenu-col-viewall"
      >
        <span className="en-only">View All</span>
        <span className="ar-only">عرض الكل</span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  )
}

export default function MegaMenu({ open, onClose, onMouseEnter, onMouseLeave, navOffsetPx = 0 }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  // ESC closes
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Click outside closes
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const el = panelRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) {
        // Ignore clicks on the trigger button itself (the nav link)
        const triggerEl = (e.target as HTMLElement)?.closest('[data-megamenu-trigger]')
        if (!triggerEl) onClose()
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, onClose])

  return (
    <div
      ref={panelRef}
      className={`megamenu-panel${open ? ' open' : ''}`}
      style={{ top: navOffsetPx }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="dialog"
      aria-modal="false"
      aria-hidden={!open}
    >
      <div className="megamenu-glow" aria-hidden />
      <div className="megamenu-grid">
        {MENU_CATEGORIES.map(cat => (
          <Column key={cat.slug} cat={cat} />
        ))}
      </div>
    </div>
  )
}
