'use client'
import { useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  // Escape key closes
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  // Body scroll lock while open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop — z-index 400, above bottom-nav (300), below drawer (401).
          Hidden on mobile (≤768px) via the .cart-backdrop class so taps on
          underlying page items remain functional with the cart open. */}
      <div
        className="cart-backdrop"
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
        aria-hidden={!isOpen}
      />

      {/* Drawer — z-index 401, top of stacking. Bottom is responsive (sees .cart-drawer-root) */}
      <div
        className="cart-drawer-root"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', top: 0, right: 0, zIndex: 401,
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
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '24px 32px',
          borderBottom: '0.5px solid rgba(201,169,110,0.1)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              color: 'var(--champagne)', fontWeight: 300,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              fontSize: '13px', fontFamily: 'Cormorant Garamond, serif',
            }}>
              Your Bag
            </h2>
            <p style={{
              color: 'var(--muted)', fontSize: '10px',
              letterSpacing: '0.2em', marginTop: '4px',
              fontFamily: 'Cairo, sans-serif',
            }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: '28px', lineHeight: 1,
              padding: '8px 12px', transition: 'color 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ivory)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '24px 32px',
          display: 'flex', flexDirection: 'column', gap: '24px',
          WebkitOverflowScrolling: 'touch',
        }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', textAlign: 'center', gap: '20px',
            }}>
              <p style={{
                color: 'var(--muted)', fontStyle: 'italic', fontSize: '18px',
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
                  background: 'var(--deep)', flexShrink: 0,
                  position: 'relative', overflow: 'hidden',
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
                        width: '26px', height: '26px',
                        border: '0.5px solid rgba(201,169,110,0.3)',
                        background: 'transparent', color: 'var(--muted)',
                        cursor: 'pointer', fontSize: '16px', lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.2s, color 0.2s',
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
                        width: '26px', height: '26px',
                        border: '0.5px solid rgba(201,169,110,0.3)',
                        background: 'transparent', color: 'var(--muted)',
                        cursor: 'pointer', fontSize: '16px', lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.2s, color 0.2s',
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
                        cursor: 'pointer', transition: 'color 0.2s',
                        fontFamily: 'Cairo, sans-serif',
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
            padding: '24px 32px', flexShrink: 0,
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
                textDecoration: 'none', transition: 'background 0.3s',
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
