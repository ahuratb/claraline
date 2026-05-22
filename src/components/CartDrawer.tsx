'use client'
import { useEffect, useRef } from 'react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Escape closes
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  // Swipe-right to close (touch only)
  useEffect(() => {
    const el = drawerRef.current
    if (!el || !isOpen) return
    let startX = 0
    let startY = 0
    let dragging = false
    const SWIPE_THRESHOLD = 60

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      dragging = true
      el.style.transition = 'none'
    }
    const onMove = (e: TouchEvent) => {
      if (!dragging || e.touches.length !== 1) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      // Only horizontal — ignore if mostly vertical (item list scrolling)
      if (Math.abs(dy) > Math.abs(dx)) { dragging = false; el.style.transform = ''; el.style.transition = ''; return }
      if (dx > 0) el.style.transform = `translateX(${dx}px)`
    }
    const onEnd = (e: TouchEvent) => {
      if (!dragging) return
      dragging = false
      const dx = (e.changedTouches[0]?.clientX ?? startX) - startX
      el.style.transition = ''
      el.style.transform = ''
      if (dx > SWIPE_THRESHOLD) closeCart()
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [isOpen, closeCart])

  return (
    <>
      {/* Backdrop — covers everything including bottom-nav, click closes */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          zIndex: 9999,
          width: '420px', maxWidth: '100vw',
          background: 'var(--obsidian)',
          borderLeft: '0.5px solid rgba(201,169,110,0.15)',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
          WebkitTapHighlightColor: 'transparent',
        }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {/* Header — fixed 60px row with absolutely positioned close button */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Your Bag</h2>
            <p className="drawer-subtitle">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div
          className="drawer-body"
          style={{
            flex: 1, overflowY: 'auto',
            padding: '24px 24px',
            display: 'flex', flexDirection: 'column', gap: '24px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', textAlign: 'center', gap: '20px',
            }}>
              <p style={{
                color: 'var(--muted)', fontSize: '18px',
                fontFamily: 'Cormorant Garamond, serif',
              }}>
                Your bag is empty
              </p>
              <p style={{
                color: 'var(--muted)', fontSize: '11px',
                letterSpacing: '0.15em', fontFamily: 'Cairo, sans-serif',
              }}>
                حقيبتكِ فارغة
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                style={{
                  fontSize: '9px', letterSpacing: '0.3em',
                  textTransform: 'uppercase', color: 'var(--champagne)',
                  border: '0.5px solid rgba(201,169,110,0.4)',
                  padding: '12px 24px', textDecoration: 'none',
                  transition: 'background 0.3s',
                }}
              >
                Shop Collection
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.productId}-${item.shade}`} style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '76px', height: '92px',
                  background: '#2a2a2e', flexShrink: 0,
                  position: 'relative', overflow: 'hidden',
                  borderRadius: '8px',
                }}>
                  {item.image ? (
                    <Image src={item.image} alt={item.name_en} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ color: 'var(--champagne)', fontSize: '12px', opacity: 0.4 }}>✦</span>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: 'var(--ivory)', fontSize: '14px',
                    fontWeight: 300, lineHeight: 1.3,
                    fontFamily: 'Cormorant Garamond, serif',
                  }}>
                    {item.name_en}
                  </p>
                  <p style={{
                    color: 'var(--muted)', fontSize: '10px',
                    marginTop: '3px', fontFamily: 'Cairo, sans-serif', direction: 'rtl',
                  }}>
                    {item.name_ar}
                  </p>
                  {item.shade && (
                    <p style={{
                      color: 'var(--muted)', fontSize: '9px',
                      letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '5px',
                    }}>
                      {item.shade}
                    </p>
                  )}
                  <p style={{
                    color: 'var(--champagne)', fontSize: '12px',
                    marginTop: '8px', letterSpacing: '0.1em',
                    fontFamily: 'Cairo, sans-serif',
                  }}>
                    {formatPrice(item.price)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.shade)}
                      style={{
                        width: '28px', height: '28px',
                        border: '0.5px solid rgba(201,169,110,0.3)',
                        background: 'transparent', color: 'var(--muted)',
                        cursor: 'pointer', fontSize: '16px', lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >−</button>
                    <span style={{
                      color: 'var(--ivory)', fontSize: '12px',
                      width: '16px', textAlign: 'center',
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.shade)}
                      style={{
                        width: '28px', height: '28px',
                        border: '0.5px solid rgba(201,169,110,0.3)',
                        background: 'transparent', color: 'var(--muted)',
                        cursor: 'pointer', fontSize: '16px', lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >+</button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.shade)}
                      style={{
                        marginLeft: 'auto', background: 'none', border: 'none',
                        color: 'var(--muted)', fontSize: '9px',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '24px', flexShrink: 0,
            borderTop: '0.5px solid rgba(201,169,110,0.1)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: '6px',
            }}>
              <span style={{
                color: 'var(--muted)', fontSize: '9px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                fontFamily: 'Cairo, sans-serif',
              }}>
                Subtotal
              </span>
              <span style={{
                color: 'var(--champagne)', fontSize: '20px',
                fontWeight: 300, fontFamily: 'Cormorant Garamond, serif',
              }}>
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p style={{
              color: 'var(--muted)', fontSize: '10px',
              letterSpacing: '0.08em', marginBottom: '20px',
              fontFamily: 'Cairo, sans-serif',
            }}>
              Delivery calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'block', padding: '16px',
                background: 'var(--champagne)', color: 'var(--obsidian)',
                textAlign: 'center', fontSize: '9px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                fontWeight: 700, fontFamily: 'Cairo, sans-serif',
                textDecoration: 'none', borderRadius: '4px',
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
