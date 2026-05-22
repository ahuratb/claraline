'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { urlFor } from '@/lib/sanity'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  index?: number
}

const COLLECTION_CRUMB: Record<string, { top: string; sub: string }> = {
  lip:  { top: 'Lip Care', sub: 'Lip Color'   },
  eye:  { top: 'Eye',      sub: 'Eye Makeup'  },
  face: { top: 'Face',     sub: 'Complexion'  },
  gift: { top: 'Gifts',    sub: 'Gift Sets'   },
}

// Subtle grey radial gradients — neutral shelf tone behind product shots
const COLLECTION_BG: Record<string, string> = {
  lip:  'radial-gradient(ellipse at 40% 35%, #3a3735 0%, #1e1c1b 75%)',
  eye:  'radial-gradient(ellipse at 60% 40%, #353638 0%, #1c1d1e 75%)',
  face: 'radial-gradient(ellipse at 50% 45%, #38383a 0%, #1d1d1f 75%)',
  gift: 'radial-gradient(ellipse at 50% 40%, #3a3736 0%, #1e1c1c 75%)',
}

const BADGE_CONFIG: Record<string, { label: string; bg: string; fg: string }> = {
  new:        { label: 'New',         bg: '#C4827A',         fg: '#fff'          },
  bestseller: { label: 'Best Seller', bg: 'var(--champagne)', fg: 'var(--obsidian)' },
  limited:    { label: 'Limited',     bg: 'var(--deep)',       fg: 'var(--champagne)' },
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(640).height(854).url()
    : null

  const badge = product.badge ? BADGE_CONFIG[product.badge] : null
  const crumb = COLLECTION_CRUMB[product.collection]
  const bg    = COLLECTION_BG[product.collection] ?? COLLECTION_BG.lip
  const delay = Math.min(index * 70, 600)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product._id,
      name_en:   product.name_en,
      name_ar:   product.name_ar,
      price:     product.price,
      quantity:  1,
      image:     imageUrl ?? undefined,
    })
    toast.success(`${product.name_en} added ✦`)
    openCart()
  }

  return (
    <div
      ref={cardRef}
      className="pc-root"
      style={{
        opacity:        visible ? 1 : 0,
        transform:      visible ? 'translateY(0)' : 'translateY(40px)',
        transition:     `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        maxWidth:       '320px',
        width:          '100%',
        margin:         '0 auto',
        position:       'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug.current}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>

        {/* ── Image area ─── 3/4 portrait, soft grey shelf, rounded ─── */}
        <div
          style={{
            position:    'relative',
            aspectRatio: '3 / 4',
            overflow:    'hidden',
            background:  '#2a2a2e',
            borderRadius: '16px',
            border:       '0.5px solid rgba(255,255,255,0.04)',
          }}
        >
          {/* Gradient backdrop — visible behind transparent product shots & as fallback */}
          <div style={{ position: 'absolute', inset: 0, background: bg }} />

          {/* Product image */}
          {imageUrl ? (
            <div
              style={{
                position:  'absolute',
                inset:     0,
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            >
              <Image
                src={imageUrl}
                alt={product.name_en}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <span
              style={{
                position:  'absolute',
                top:       '50%',
                left:      '50%',
                transform: hovered ? 'translate(-50%, -55%)' : 'translate(-50%, -50%)',
                transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
                color:     'rgba(201,169,110,0.18)',
                fontSize:  '42px',
                lineHeight: 1,
              }}
            >
              ✦
            </span>
          )}

          {/* Subtle vignette top + bottom */}
          <div
            style={{
              position: 'absolute',
              inset:    0,
              background: 'linear-gradient(to bottom, rgba(10,8,6,0.28) 0%, transparent 18%, transparent 65%, rgba(10,8,6,0.45) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Badge */}
          {badge && (
            <span
              style={{
                position:    'absolute',
                top:         '18px',
                left:        '18px',
                fontSize:    '8px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:       badge.fg,
                background:  badge.bg,
                padding:     '5px 10px',
                fontFamily:  'Cairo, sans-serif',
                fontWeight:  600,
                ...(product.badge === 'limited' ? { border: '0.5px solid rgba(201,169,110,0.4)' } : {}),
              }}
            >
              {badge.label}
            </span>
          )}

          {/* Shade count */}
          {product.shades && product.shades.length > 1 && (
            <span
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                fontSize: '8px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--champagne)',
                background: 'rgba(10,8,6,0.55)',
                border: '0.5px solid rgba(201,169,110,0.25)',
                padding: '4px 8px',
                fontFamily: 'Cairo, sans-serif',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              {product.shades.length} Shades
            </span>
          )}

          {/* Quick Add overlay — slides up on hover */}
          <div
            style={{
              position:    'absolute',
              bottom:      0,
              left:        0,
              right:       0,
              padding:     '14px 20px',
              background:  'rgba(10,8,6,0.92)',
              borderTop:   '0.5px solid rgba(201,169,110,0.2)',
              display:     'flex',
              justifyContent: 'space-between',
              alignItems:  'center',
              transform:   hovered ? 'translateY(0)' : 'translateY(100%)',
              transition:  'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span
              role="button"
              onClick={handleAddToCart}
              style={{
                fontSize:      '9px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color:         'var(--champagne)',
                fontFamily:    'Cairo, sans-serif',
                cursor:        'pointer',
              }}
            >
              Quick Add
            </span>
            <span
              onClick={handleAddToCart}
              style={{
                fontSize:   '20px',
                fontWeight: 300,
                color:      'var(--champagne)',
                lineHeight: 1,
                cursor:     'pointer',
              }}
            >
              +
            </span>
          </div>
        </div>

        {/* ── Info area ─────────────────────────────────────────── */}
        <div style={{ padding: '20px 0 0' }}>

          {/* Brand + breadcrumb row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize:      '8px',
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color:         'var(--champagne)',
                fontFamily:    'Cairo, sans-serif',
                fontWeight:    500,
              }}
            >
              Claraline
            </span>
            <span style={{ color: 'rgba(201,169,110,0.25)', fontSize: '10px', lineHeight: 1 }}>·</span>
            {crumb && (
              <span
                style={{
                  fontSize:      '8.5px',
                  letterSpacing: '0.12em',
                  color:         'var(--muted)',
                  fontFamily:    'Cairo, sans-serif',
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           '5px',
                }}
              >
                {crumb.top}
                <span style={{ color: 'var(--champagne)', opacity: 0.45, fontSize: '10px', lineHeight: 1 }}>›</span>
                {crumb.sub}
              </span>
            )}
          </div>

          {/* Product name */}
          <h3
            className="pc-name"
            style={{
              fontSize:     '20px',
              fontWeight:   300,
              letterSpacing: '0.03em',
              marginBottom: '4px',
              color:        hovered ? 'var(--champagne)' : 'var(--ivory)',
              fontFamily:   "'Cormorant Garamond', serif",
              transition:   'color 0.3s',
              lineHeight:   1.2,
            }}
          >
            {product.name_en}
          </h3>

          {/* Arabic name */}
          <p
            className="pc-name-ar"
            style={{
              fontSize:    '11px',
              color:       'var(--muted)',
              fontFamily:  "'Amiri', 'Cairo', serif",
              direction:   'rtl',
              marginBottom: '12px',
              lineHeight:   1.5,
            }}
          >
            {product.name_ar}
          </p>

          {/* Price + shade swatches row */}
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              gap:            '12px',
            }}
          >
            <p
              className="pc-price"
              style={{
                fontSize:    '13px',
                color:       'var(--champagne)',
                letterSpacing: '0.1em',
                fontFamily:  'Cairo, sans-serif',
              }}
            >
              {formatPrice(product.price)}
            </p>
            {product.shades && product.shades.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {product.shades.slice(0, 4).map((s, i) => (
                  <span
                    key={i}
                    title={s.name_en}
                    style={{
                      width:      '9px',
                      height:     '9px',
                      borderRadius: '50%',
                      background: s.hex,
                      boxShadow:  '0 0 0 0.5px rgba(201,169,110,0.4)',
                      display:    'inline-block',
                    }}
                  />
                ))}
                {product.shades.length > 4 && (
                  <span style={{ fontSize: '8.5px', color: 'var(--muted)', fontFamily: 'Cairo, sans-serif', marginLeft: '3px', letterSpacing: '0.05em' }}>
                    +{product.shades.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
