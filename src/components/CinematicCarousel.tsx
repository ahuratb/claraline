'use client'
import { useState, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { urlFor } from '@/lib/sanity'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

const CARD_W = 280 + 24

const BADGE_LABEL: Record<string, { label: string; isNew?: boolean }> = {
  new:        { label: 'New', isNew: true },
  bestseller: { label: 'Best Seller' },
  limited:    { label: 'Limited' },
}

const COLLECTION_BG: Record<string, string> = {
  lip:  'c1',
  eye:  'c2',
  face: 'c5',
  gift: 'c4',
}

function quickAdd(nameEn: string, nameAr: string) {
  const isAr = document.documentElement.classList.contains('lang-ar')
  toast.success(`${isAr ? nameAr : nameEn} — ${isAr ? 'أُضيف للحقيبة ✦' : 'added to bag ✦'}`)
}

/* ─── LIP CAROUSEL ─────────────────────────────────────────── */

function VelvetRougeSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 100 150" width={100} xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'lipFloat 4s ease-in-out infinite', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A96E"/>
          <stop offset="100%" stopColor="#8B5E3C"/>
        </linearGradient>
      </defs>
      <rect x="36" y="0" width="28" height="96" rx="3" fill="#1a0e08"/>
      <rect x="40" y="2" width="20" height="80" rx="2" fill="url(#g1)" opacity="0.92"/>
      <rect x="43" y="4" width="6" height="28" rx="1" fill="rgba(255,240,200,0.2)"/>
      <rect x="27" y="100" width="46" height="48" rx="3" fill="#120808"/>
      <text x="50" y="128" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="8" fill="#C9A96E" letterSpacing="2">VELVET</text>
      <text x="50" y="138" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="6" fill="rgba(201,169,110,0.45)" letterSpacing="1">ROUGE</text>
    </svg>
  )
}

function DesertDuskSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 100 140" width={110} xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'lipFloat 4s 0.8s ease-in-out infinite', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <rect x="10" y="12" width="80" height="116" rx="5" fill="#1e1530" stroke="rgba(201,169,110,0.2)" strokeWidth="0.5"/>
      <rect x="15" y="22" width="30" height="22" rx="2" fill="#8B4868"/>
      <rect x="55" y="22" width="30" height="22" rx="2" fill="#C4827A"/>
      <rect x="15" y="50" width="30" height="22" rx="2" fill="#D4A574"/>
      <rect x="55" y="50" width="30" height="22" rx="2" fill="#E8C9A0"/>
      <rect x="15" y="78" width="30" height="22" rx="2" fill="#6B4D7A"/>
      <rect x="55" y="78" width="30" height="22" rx="2" fill="#9A6B6B"/>
      <text x="50" y="118" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="7" fill="#C9A96E" letterSpacing="1.5">DESERT DUSK</text>
    </svg>
  )
}

function GoldenHourSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 80 160" width={90} xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'lipFloat 4s 1.6s ease-in-out infinite', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A96E"/>
          <stop offset="100%" stopColor="#6B4E22"/>
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="22" rx="22" ry="9" fill="#151a10"/>
      <path d="M22 26 Q18 68 16 112 Q16 128 40 128 Q64 128 64 112 Q62 68 58 26 Z" fill="#0e1208"/>
      <path d="M24 28 Q20 70 18 112 Q18 126 40 126 Q62 126 62 112 Q60 70 56 28 Z" fill="url(#g3)" opacity="0.9"/>
      <text x="40" y="148" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="6" fill="rgba(201,169,110,0.5)" letterSpacing="1">GOLDEN HOUR</text>
    </svg>
  )
}

function MidnightKohlSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 80 160" width={90} xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'lipFloat 4s 2.4s ease-in-out infinite', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <rect x="34" y="0" width="12" height="100" rx="2" fill="#1a1530"/>
      <rect x="30" y="98" width="20" height="60" rx="3" fill="#14101e"/>
      <rect x="32" y="100" width="16" height="56" rx="2" fill="#1e1830"/>
      <rect x="35" y="2" width="10" height="6" rx="1" fill="#C9A96E"/>
      <text x="40" y="135" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="5.5" fill="#C9A96E" letterSpacing="1">MIDNIGHT</text>
      <text x="40" y="145" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="5" fill="rgba(201,169,110,0.4)" letterSpacing="0.8">KOHL</text>
    </svg>
  )
}

function RoseRitualSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 100 140" width={110} xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'lipFloat 4s 3.2s ease-in-out infinite', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <circle cx="50" cy="60" r="38" fill="#1a1008" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5"/>
      <circle cx="50" cy="60" r="32" fill="#221408"/>
      <circle cx="50" cy="60" r="24" fill="#C4827A" opacity="0.8"/>
      <circle cx="50" cy="60" r="16" fill="#D4957A"/>
      <circle cx="50" cy="60" r="8"  fill="#E8B09A"/>
      <text x="50" y="118" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="7" fill="#C9A96E" letterSpacing="1.5">ROSE RITUAL</text>
      <text x="50" y="128" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="5.5" fill="rgba(201,169,110,0.4)">BLUSH</text>
    </svg>
  )
}

function SaffronGlowSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 100 150" width={100} xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'lipFloat 4s 4s ease-in-out infinite', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <defs>
        <linearGradient id="g6" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A96E"/>
          <stop offset="50%" stopColor="#E8C080"/>
          <stop offset="100%" stopColor="#A07040"/>
        </linearGradient>
      </defs>
      <rect x="10" y="50" width="80" height="40" rx="4" fill="#0a1010"/>
      <rect x="12" y="52" width="76" height="36" rx="3" fill="#0f1818"/>
      <rect x="20" y="58" width="12" height="24" rx="2" fill="#C9A96E" opacity="0.9"/>
      <rect x="38" y="58" width="12" height="24" rx="2" fill="#D4B080" opacity="0.85"/>
      <rect x="56" y="58" width="12" height="24" rx="2" fill="#A87040" opacity="0.9"/>
      <text x="50" y="110" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="7" fill="#C9A96E" letterSpacing="1.5">SAFFRON</text>
      <text x="50" y="120" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="5.5" fill="rgba(201,169,110,0.4)">GLOW TRIO</text>
    </svg>
  )
}

const LIP_CARDS = [
  { name: 'Velvet Rouge',  nameAr: 'أحمر شفاه مخملي',          price: 'KWD 18.500', stars: '★★★★★', badge: 'Best Seller', badgeNew: false, bg: 'c1', Svg: VelvetRougeSvg },
  { name: 'Desert Dusk',   nameAr: 'باليت غروب الصحراء',       price: 'KWD 34.000', stars: '★★★★★', badge: 'New',         badgeNew: true,  bg: 'c2', Svg: DesertDuskSvg },
  { name: 'Golden Hour',   nameAr: 'كونسيلر الساعة الذهبية',   price: 'KWD 22.000', stars: '★★★★☆', badge: '',            badgeNew: false, bg: 'c3', Svg: GoldenHourSvg },
  { name: 'Midnight Kohl', nameAr: 'كحل منتصف الليل',          price: 'KWD 16.000', stars: '★★★★★', badge: 'Limited',     badgeNew: false, bg: 'c4', Svg: MidnightKohlSvg },
  { name: 'Rose Ritual',   nameAr: 'بلاش وردي',                price: 'KWD 26.000', stars: '★★★★★', badge: 'New',         badgeNew: true,  bg: 'c5', Svg: RoseRitualSvg },
  { name: 'Saffron Glow',  nameAr: 'ثلاثية الزعفران',          price: 'KWD 38.000', stars: '★★★★★', badge: '',            badgeNew: false, bg: 'c6', Svg: SaffronGlowSvg },
]

/* ─── EYE CAROUSEL ─────────────────────────────────────────── */

function SmokyNightsSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 120 100" width={130} xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'lipFloat 4s ease-in-out infinite' }}>
      <rect x="5" y="10" width="110" height="80" rx="5" fill="#12101e" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5"/>
      <rect x="12" y="20" width="22" height="22" rx="2" fill="#1a1428"/>
      <rect x="40" y="20" width="22" height="22" rx="2" fill="#2a1030"/>
      <rect x="68" y="20" width="22" height="22" rx="2" fill="#3a1840"/>
      <rect x="96" y="20" width="16" height="22" rx="2" fill="#4a2050"/>
      <rect x="12" y="48" width="22" height="22" rx="2" fill="#6B4D7A" opacity="0.9"/>
      <rect x="40" y="48" width="22" height="22" rx="2" fill="#8B5D8A"/>
      <rect x="68" y="48" width="22" height="22" rx="2" fill="#C4827A"/>
      <rect x="96" y="48" width="16" height="22" rx="2" fill="#E8B09A"/>
      <text x="60" y="86" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="7" fill="#C9A96E" letterSpacing="1.5">SMOKY NIGHTS</text>
    </svg>
  )
}

function LashLuxeSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 80 160" width={85} xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'lipFloat 4s 1s ease-in-out infinite' }}>
      <rect x="32" y="0" width="16" height="10" rx="3" fill="#C9A96E"/>
      <rect x="34" y="8" width="12" height="100" rx="2" fill="#0a0808"/>
      <rect x="30" y="106" width="20" height="50" rx="3" fill="#1a1010"/>
      <rect x="32" y="108" width="16" height="46" rx="2" fill="#221818"/>
      <text x="40" y="130" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="5" fill="#C9A96E" letterSpacing="1">LASH</text>
      <text x="40" y="140" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="5" fill="#C9A96E" letterSpacing="1">LUXE</text>
    </svg>
  )
}

function ArabianKohlSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 100 140" width={110} xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'lipFloat 4s 2s ease-in-out infinite' }}>
      <ellipse cx="50" cy="65" rx="40" ry="8" fill="#1a0808"/>
      <ellipse cx="50" cy="65" rx="38" ry="6" fill="#0a0606"/>
      <rect x="46" y="12" width="8" height="55" rx="2" fill="#1a1010"/>
      <ellipse cx="50" cy="12" rx="8" ry="5" fill="#C9A96E"/>
      <text x="50" y="96" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="7" fill="#C9A96E" letterSpacing="1.5">ARABIAN</text>
      <text x="50" y="106" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="7" fill="rgba(201,169,110,0.5)" letterSpacing="1.5">KOHL</text>
    </svg>
  )
}

function BrowSculptSvg() {
  return (
    <svg className="p-card-svg" viewBox="0 0 100 140" width={110} xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'lipFloat 4s 3s ease-in-out infinite' }}>
      <rect x="15" y="30" width="70" height="80" rx="4" fill="#101808"/>
      <rect x="20" y="36" width="60" height="24" rx="2" fill="#1a2010"/>
      <path d="M22 46 Q50 38 78 46" stroke="#C9A96E" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="25" y="68" width="50" height="6" rx="1" fill="#C9A96E" opacity="0.6"/>
      <rect x="25" y="80" width="50" height="6" rx="1" fill="#A07840" opacity="0.5"/>
      <text x="50" y="122" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="6.5" fill="#C9A96E" letterSpacing="1.2">BROW SCULPT</text>
    </svg>
  )
}

const EYE_CARDS = [
  { name: 'Smoky Nights',  nameAr: 'باليت ليالي الدخان', price: 'KWD 28.000', stars: '★★★★★', badge: 'Best Seller', badgeNew: false, bg: 'c2', Svg: SmokyNightsSvg },
  { name: 'Lash Luxe',     nameAr: 'ماسكارا فاخرة',      price: 'KWD 19.500', stars: '★★★★★', badge: 'New',         badgeNew: true,  bg: 'c4', Svg: LashLuxeSvg },
  { name: 'Arabian Kohl',  nameAr: 'كحل عربي أصيل',      price: 'KWD 14.000', stars: '★★★★☆', badge: '',            badgeNew: false, bg: 'c1', Svg: ArabianKohlSvg },
  { name: 'Brow Sculpt',   nameAr: 'محدد الحواجب',        price: 'KWD 15.500', stars: '★★★★★', badge: 'Limited',     badgeNew: false, bg: 'c3', Svg: BrowSculptSvg },
]

/* ─── SHARED CAROUSEL COMPONENT ─────────────────────────────── */

interface CarouselProps {
  id: string
  labelEn: string
  labelAr: string
  titleEn: ReactNode
  titleAr: ReactNode
  descEn: string
  descAr: string
  cards?: typeof LIP_CARDS
  products?: Product[]
  viewAllHref?: string
}

function Carousel({ id, labelEn, labelAr, titleEn, titleAr, descEn, descAr, cards, products, viewAllHref }: CarouselProps) {
  const addItem = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.openCart)
  const useReal = !!(products && products.length > 0)
  const itemCount = useReal ? products!.length : (cards?.length ?? 0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const max = Math.max(0, (itemCount - 3) * CARD_W)

  function handleProductAdd(e: React.MouseEvent, p: Product) {
    e.preventDefault()
    e.stopPropagation()
    const image = p.images?.[0] ? urlFor(p.images[0]).width(640).height(854).url() : undefined
    addItem({
      productId: p._id,
      name_en:   p.name_en,
      name_ar:   p.name_ar,
      price:     p.price,
      quantity:  1,
      image,
    })
    const isAr = document.documentElement.classList.contains('lang-ar')
    toast.success(`${isAr ? p.name_ar : p.name_en} — ${isAr ? 'أُضيف للحقيبة ✦' : 'added to bag ✦'}`)
    openCart()
  }

  const touchStartX    = useRef(0)
  const touchStartOff  = useRef(0)
  const mouseStartX    = useRef(0)
  const mouseStartOff  = useRef(0)
  const isDragging     = useRef(false)

  function slide(dir: -1 | 1) {
    setOffset(prev => Math.max(0, Math.min(max, prev + dir * CARD_W)))
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current   = e.touches[0].clientX
    touchStartOff.current = offset
  }
  function onTouchMove(e: React.TouchEvent) {
    const dx = touchStartX.current - e.touches[0].clientX
    setOffset(Math.max(0, Math.min(max, touchStartOff.current + dx)))
  }
  function onTouchEnd() {
    const snapped = Math.round(offset / CARD_W) * CARD_W
    setOffset(Math.max(0, Math.min(max, snapped)))
  }

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current    = true
    mouseStartX.current   = e.clientX
    mouseStartOff.current = offset
    setDragging(true)
    e.preventDefault()
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return
    const dx = mouseStartX.current - e.clientX
    setOffset(Math.max(0, Math.min(max, mouseStartOff.current + dx)))
  }
  function onMouseUp() {
    if (!isDragging.current) return
    isDragging.current = false
    setDragging(false)
    const snapped = Math.round(offset / CARD_W) * CARD_W
    setOffset(Math.max(0, Math.min(max, snapped)))
  }

  /* ── Card renderers (shared between carousel + mobile grid) ── */

  function renderRealCard(p: Product) {
    const img = p.images?.[0] ? urlFor(p.images[0]).width(640).height(854).url() : null
    const badge = p.badge ? BADGE_LABEL[p.badge] : null
    const bg = COLLECTION_BG[p.collection] ?? 'c1'
    return (
      <Link key={p._id} href={`/product/${p.slug.current}`} className="p-card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="p-card-img">
          <div className={`p-card-img-bg ${bg}`} />
          {img && (
            <Image src={img} alt={p.name_en} fill sizes="280px" style={{ objectFit: 'cover' }} />
          )}
          {badge && (
            <span className={`p-badge${badge.isNew ? ' new' : ''}`}>{badge.label}</span>
          )}
          <div className="p-quick-add" onClick={(e) => handleProductAdd(e, p)}>
            <span className="en-only">Quick Add</span>
            <span className="ar-only">أضف للحقيبة</span>
            <span className="p-quick-add-plus">+</span>
          </div>
        </div>
        <div className="p-info">
          <div className="p-name en-only">{p.name_en}</div>
          <div className="p-name ar-only" style={{ fontFamily: "'Amiri', serif" }}>{p.name_ar}</div>
          <div className="p-price-row">
            <span className="p-price">{formatPrice(p.price)}</span>
          </div>
        </div>
      </Link>
    )
  }

  function renderDemoCard(card: typeof LIP_CARDS[0]) {
    const SvgComp = card.Svg
    return (
      <div key={card.name} className="p-card" onClick={() => quickAdd(card.name, card.nameAr)}>
        <div className="p-card-img">
          <div className={`p-card-img-bg ${card.bg}`} />
          <SvgComp />
          {card.badge && (
            <span className={`p-badge${card.badgeNew ? ' new' : ''}`}>{card.badge}</span>
          )}
          <div className="p-quick-add">
            <span className="en-only">Quick Add</span>
            <span className="ar-only">أضف للحقيبة</span>
            <span className="p-quick-add-plus">+</span>
          </div>
        </div>
        <div className="p-info">
          <div className="p-name en-only">{card.name}</div>
          <div className="p-name ar-only" style={{ fontFamily: "'Amiri', serif" }}>{card.nameAr}</div>
          <div className="p-price-row">
            <span className="p-price">{card.price}</span>
            <div className="p-stars"><span className="p-star">{card.stars}</span></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="carousel-section">
      {/* Header */}
      <div className="carousel-header reveal-target">
        <div>
          <div className="section-label en-only">{labelEn}</div>
          <div className="section-label ar-only">{labelAr}</div>
          <h2 className="section-title en-only">{titleEn}</h2>
          <h2 className="section-title ar-only">{titleAr}</h2>
          <p className="section-body-ar en-only" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{descEn}</p>
          <p className="section-body-ar ar-only">{descAr}</p>
        </div>
        {/* Arrows — desktop only */}
        <div className="carousel-nav carousel-nav-desktop">
          <button className="carousel-arrow" onClick={() => slide(-1)}>
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="carousel-arrow" onClick={() => slide(1)}>
            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Desktop / tablet horizontal carousel */}
      <div className="carousel-desktop">
        <div
          className="carousel-track-wrap"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onDragStart={(e) => e.preventDefault()}
          style={{ cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
        >
          <div
            className="carousel-track reveal-target"
            id={id}
            style={{ transform: `translateX(-${offset}px)`, transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)' }}
          >
            {useReal
              ? products!.map(renderRealCard)
              : (cards ?? []).map(renderDemoCard)
            }
          </div>
        </div>
      </div>

      {/* Mobile 2-col grid (hidden on desktop via CSS) */}
      <div className="carousel-mobile">
        {useReal
          ? products!.slice(0, 6).map(renderRealCard)
          : (cards ?? []).slice(0, 6).map(renderDemoCard)
        }
        {viewAllHref && (
          <Link href={viewAllHref} className="carousel-view-all">
            <span className="en-only">View All →</span>
            <span className="ar-only">← عرض الكل</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export function LipCarousel({ products }: { products?: Product[] }) {
  return (
    <Carousel
      id="c1"
      labelEn="The Collection"
      labelAr="المجموعة"
      titleEn={<>Lip <em>Rituals</em></>}
      titleAr={<>طقوس <em>الشفاه</em></>}
      descEn="The lipstick that tells your story"
      descAr="أحمر الشفاه الذي يروي قصتك"
      cards={LIP_CARDS}
      products={products}
      viewAllHref="/shop?collection=lip"
    />
  )
}

export function EyeCarousel({ products }: { products?: Product[] }) {
  return (
    <Carousel
      id="c2"
      labelEn="Eye Collection"
      labelAr="مجموعة العيون"
      titleEn={<>Eye <em>Rituals</em></>}
      titleAr={<>طقوس <em>العيون</em></>}
      descEn="Eyes that tell a thousand stories"
      descAr="عيون تحكي ألف قصة"
      cards={EYE_CARDS}
      products={products}
      viewAllHref="/shop?collection=eye"
    />
  )
}
