'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/store'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const CollectionIcon = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const BagIcon = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)

const RitualIcon = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.51 5.06-1.39"/>
    <path d="M12 6v6l4 2"/>
    <path d="M19.07 7.5A8.006 8.006 0 0122 12"/>
  </svg>
)

const TABS = [
  { href: '/',       labelAr: 'الرئيسية', labelEn: 'Home',       Icon: HomeIcon,       scrollTo: null },
  { href: '/shop',   labelAr: 'المجموعة', labelEn: 'Collection', Icon: CollectionIcon, scrollTo: null },
  { href: null,      labelAr: 'حقيبتي',   labelEn: 'Bag',        Icon: BagIcon,        scrollTo: null, isCart: true },
  { href: '/#ritual',labelAr: 'الطقس',    labelEn: 'Ritual',     Icon: RitualIcon,     scrollTo: null },
] as const

export default function BottomNav() {
  const pathname  = usePathname()
  const cartCount = useCartStore(s => s.count())
  const openCart  = useCartStore(s => s.openCart)
  const isAnyDrawerOpen = useCartStore(s => s.isOpen || s.isMenuOpen)

  return (
    <nav
      className={`bottom-nav${isAnyDrawerOpen ? ' hidden' : ''}`}
      aria-label="Mobile navigation"
      aria-hidden={isAnyDrawerOpen}
    >
      <div className="bottom-nav-inner">
        {TABS.map((tab, i) => {
          const isActive = tab.href === '/' ? pathname === '/' : tab.href ? pathname.startsWith(tab.href.split('#')[0]) : false

          if ('isCart' in tab && tab.isCart) {
            return (
              <button
                key={i}
                onClick={openCart}
                className="bottom-nav-tab"
                aria-label="Open cart"
              >
                {cartCount > 0 && (
                  <span className="bottom-nav-badge">{cartCount}</span>
                )}
                <BagIcon />
                <span className="bottom-tab-label">
                  <span className="en-only">{tab.labelEn}</span>
                  <span className="ar-only">{tab.labelAr}</span>
                </span>
              </button>
            )
          }

          return (
            <Link
              key={i}
              href={tab.href as string}
              className={`bottom-nav-tab${isActive ? ' active' : ''}`}
            >
              <tab.Icon />
              <span className="bottom-tab-label">
                <span className="en-only">{tab.labelEn}</span>
                <span className="ar-only">{tab.labelAr}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
