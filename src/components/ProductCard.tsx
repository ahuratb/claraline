'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  index?: number
}

const COLLECTION_CRUMB: Record<string, { top: string; sub: string }> = {
  lip:  { top: 'Lip Care', sub: 'Lip Color'  },
  eye:  { top: 'Eye',      sub: 'Eye Makeup' },
  face: { top: 'Face',     sub: 'Complexion' },
  gift: { top: 'Gifts',    sub: 'Gift Sets'  },
}

// Soft light gradients — warm cream shelf tone
const COLLECTION_BG: Record<string, string> = {
  lip:  'radial-gradient(ellipse at 50% 40%, #FFF0EE 0%, #F5E6E2 100%)',
  eye:  'radial-gradient(ellipse at 50% 40%, #EEF0FF 0%, #E2E4F5 100%)',
  face: 'radial-gradient(ellipse at 50% 40%, #FFF8F0 0%, #F5EDE0 100%)',
  gift: 'radial-gradient(ellipse at 50% 40%, #F5F0FF 0%, #EBE2F5 100%)',
}

const BADGE_CONFIG: Record<string, { label: string; bg: string; fg: string }> = {
  new:        { label: 'New',         bg: '#C4827A', fg: '#fff'     },
  bestseller: { label: 'Best Seller', bg: '#8E6A36', fg: '#fff'     },
  limited:    { label: 'Limited',     bg: '#2a1f14', fg: '#C9A96E'  },
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const cardRef  = useRef<HTMLDivElement>(null)
  const [visible,  setVisible]  = useState(false)
  const [hovered,  setHovered]  = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const imageUrl = product.images?.[0] ?? null
  const badge    = product.badge ? BADGE_CONFIG[product.badge] : null
  const crumb    = COLLECTION_CRUMB[product.collection]
  const bg       = COLLECTION_BG[product.collection] ?? COLLECTION_BG.face
  const delay    = Math.min(index * 70, 600)

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
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        maxWidth:   '320px',
        width:      '100%',
        margin:     '0 auto',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/product/${product.slug.current}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        {/* ── White card ─────────────────────────────────────────── */}
        <div
          style={{
            background:   '#FFFFFF',
            borderRadius: '16px',
            overflow:     'hidden',
            border:       '1px solid rgba(142,106,54,0.1)',
            boxShadow:    hovered
              ? '0 12px 40px rgba(0,0,0,0.10)'
              : '0 2px 12px rgba(0,0,0,0.05)',
            transition:   'box-shadow 0.4s ease',
          }}
        >
          {/* ── Image area ─── */}
          <div
            style={{
              position:    'relative',
              aspectRatio: '3 / 4',
              overflow:    'hidden',
              background:  bg,
            }}
          >
            {imageUrl ? (
              <div
                style={{
                  position:   'absolute',
                  inset:      0,
                  transform:  hovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
              >
                <Image
                  src={imageUrl}
                  alt={product.name_en}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                  unoptimized
                />
              </div>
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(142,106,54,0.2)', fontSize: '42px',
              }}>✦</div>
            )}

            {/* Badge */}
            {badge && (
              <span style={{
                position:      'absolute',
                top:           '14px',
                left:          '14px',
                fontSize:      '8px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         badge.fg,
                background:    badge.bg,
                padding:       '4px 10px',
                fontFamily:    'Cairo, sans-serif',
                fontWeight:    600,
                borderRadius:  '2px',
              }}>
                {badge.label}
              </span>
            )}

            {/* Quick Add overlay */}
            <div style={{
              position:   'absolute',
              bottom:     0,
              left:       0,
              right:      0,
              padding:    '12px 16px',
              background: 'rgba(255,255,255,0.95)',
              borderTop:  '1px solid rgba(142,106,54,0.12)',
              display:    'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transform:  hovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
              backdropFilter: 'blur(8px)',
            }}>
              <span
                role="button"
                onClick={handleAddToCart}
                style={{
                  fontSize:      '9px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color:         '#8E6A36',
                  fontFamily:    'Cairo, sans-serif',
                  cursor:        'pointer',
                }}
              >
                Quick Add
              </span>
              <span
                onClick={handleAddToCart}
                style={{
                  fontSize:  '22px',
                  fontWeight: 300,
                  color:     '#8E6A36',
                  lineHeight: 1,
                  cursor:    'pointer',
                }}
              >+</span>
            </div>
          </div>

          {/* ── Info area ──────────────────────────────────────────── */}
          <div style={{ padding: '16px 18px 18px' }}>

            {/* Breadcrumb */}
            <div style={{
              display:     'flex',
              alignItems:  'center',
              gap:         '8px',
              marginBottom: '8px',
              flexWrap:    'wrap',
            }}>
              <span style={{
                fontSize:      '8px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color:         '#8E6A36',
                fontFamily:    'Cairo, sans-serif',
                fontWeight:    500,
              }}>Claraline</span>
              {crumb && (
                <>
                  <span style={{ color: 'rgba(142,106,54,0.3)', fontSize: '10px' }}>·</span>
                  <span style={{
                    fontSize:      '8.5px',
                    letterSpacing: '0.1em',
                    color:         '#7A6755',
                    fontFamily:    'Cairo, sans-serif',
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           '4px',
                  }}>
                    {crumb.top}
                    <span style={{ color: '#8E6A36', opacity: 0.5, fontSize: '10px' }}>›</span>
                    {crumb.sub}
                  </span>
                </>
              )}
            </div>

            {/* Name */}
            <h3 style={{
              fontSize:      '18px',
              fontWeight:    300,
              letterSpacing: '0.02em',
              marginBottom:  '3px',
              color:         hovered ? '#8E6A36' : '#1F1812',
              fontFamily:    "'Cormorant Garamond', serif",
              transition:    'color 0.3s',
              lineHeight:    1.2,
            }}>
              {product.name_en}
            </h3>

            {/* Arabic name */}
            <p style={{
              fontSize:     '11px',
              color:        '#7A6755',
              fontFamily:   "'Amiri', 'Cairo', serif",
              direction:    'rtl',
              marginBottom: '12px',
              lineHeight:   1.5,
            }}>
              {product.name_ar}
            </p>

            {/* Price + shades */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{
                fontSize:      '13px',
                color:         '#8E6A36',
                letterSpacing: '0.1em',
                fontFamily:    'Cairo, sans-serif',
                fontWeight:    500,
              }}>
                {formatPrice(product.price)}
              </p>
              {product.shades && product.shades.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {product.shades.slice(0, 4).map((s, i) => (
                    <span key={i} title={s.name_en} style={{
                      width:        '9px',
                      height:       '9px',
                      borderRadius: '50%',
                      background:   s.hex,
                      boxShadow:    '0 0 0 0.5px rgba(142,106,54,0.35)',
                      display:      'inline-block',
                    }} />
                  ))}
                  {product.shades.length > 4 && (
                    <span style={{
                      fontSize:   '8.5px',
                      color:      '#7A6755',
                      fontFamily: 'Cairo, sans-serif',
                      marginLeft: '3px',
                    }}>
                      +{product.shades.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
