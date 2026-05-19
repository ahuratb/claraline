'use client'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-[301] w-[420px] max-w-full bg-[var(--obsidian)] border-l border-[rgba(201,169,110,0.15)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-[rgba(201,169,110,0.1)]">
          <div>
            <h2 className="text-[var(--champagne)] font-light tracking-[0.3em] uppercase text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Your Bag
            </h2>
            <p className="text-[var(--muted)] text-[10px] tracking-[0.2em] mt-0.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="text-[var(--muted)] hover:text-[var(--ivory)] transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <p className="text-[var(--muted)] italic text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Your bag is empty
              </p>
              <p className="text-[var(--muted)] text-xs tracking-widest" style={{ fontFamily: 'Cairo, sans-serif' }}>
                حقيبتكِ فارغة
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="text-[9px] tracking-[0.3em] uppercase text-[var(--champagne)] border border-[rgba(201,169,110,0.4)] px-6 py-3 hover:bg-[rgba(201,169,110,0.08)] transition-all"
              >
                Shop Collection
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.productId}-${item.shade}`} className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-24 bg-[var(--deep)] flex-shrink-0 relative overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.name_en} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[var(--champagne)] text-xs opacity-40">✦</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--ivory)] text-sm font-light leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {item.name_en}
                  </p>
                  <p className="text-[var(--muted)] text-[10px] mt-0.5" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
                    {item.name_ar}
                  </p>
                  {item.shade && (
                    <p className="text-[var(--muted)] text-[9px] tracking-widest uppercase mt-1">{item.shade}</p>
                  )}
                  <p className="text-[var(--champagne)] text-xs mt-2 tracking-wider">{formatPrice(item.price)}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.shade)}
                      className="w-6 h-6 border border-[rgba(201,169,110,0.3)] text-[var(--muted)] hover:text-[var(--champagne)] hover:border-[var(--champagne)] transition-all text-sm leading-none flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-[var(--ivory)] text-xs w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.shade)}
                      className="w-6 h-6 border border-[rgba(201,169,110,0.3)] text-[var(--muted)] hover:text-[var(--champagne)] hover:border-[var(--champagne)] transition-all text-sm leading-none flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.shade)}
                      className="ml-auto text-[var(--muted)] hover:text-[var(--rose)] text-[10px] tracking-widest uppercase transition-colors"
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
          <div className="px-8 py-6 border-t border-[rgba(201,169,110,0.1)] space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--muted)] text-xs tracking-widest uppercase" style={{ fontFamily: 'Cairo, sans-serif' }}>Subtotal</span>
              <span className="text-[var(--champagne)] text-lg font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="text-[var(--muted)] text-[10px] tracking-wider">Delivery calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 bg-[var(--champagne)] text-[var(--obsidian)] text-center text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-[var(--ivory)] transition-colors no-underline"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
