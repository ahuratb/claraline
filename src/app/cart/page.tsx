'use client'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  return (
    <div className="min-h-screen bg-[var(--obsidian)] pt-32 pb-20 px-14">
      <div className="max-w-3xl mx-auto">
        <p className="text-[var(--champagne)] text-[9px] tracking-[0.5em] uppercase mb-2 opacity-70" style={{ fontFamily: 'Cairo, sans-serif' }}>Your Selection</p>
        <h1 className="text-[var(--ivory)] text-4xl font-light mb-12" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Your Bag</h1>

        {items.length === 0 ? (
          <div className="py-24 text-center space-y-6">
            <p className="text-[var(--muted)] text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Your bag is empty</p>
            <Link href="/shop" className="inline-block text-[9px] tracking-[0.3em] uppercase text-[var(--champagne)] border border-[rgba(201,169,110,0.4)] px-8 py-4 hover:bg-[rgba(201,169,110,0.08)] transition-all no-underline" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {items.map(item => (
              <div key={`${item.productId}-${item.shade}`} className="flex gap-6 pb-8 border-b border-[rgba(201,169,110,0.1)]">
                <div className="w-24 h-32 bg-[var(--deep)] flex-shrink-0 relative overflow-hidden">
                  {item.image ? <Image src={item.image} alt={item.name_en} fill className="object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center"><span className="text-[var(--champagne)] opacity-30 text-2xl">✦</span></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-[var(--ivory)] text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{item.name_en}</h3>
                  <p className="text-[var(--muted)] text-xs mt-0.5" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>{item.name_ar}</p>
                  {item.shade && <p className="text-[var(--muted)] text-[9px] tracking-widest uppercase mt-1">{item.shade}</p>}
                  <p className="text-[var(--champagne)] tracking-wider mt-2">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-3 border border-[rgba(201,169,110,0.2)]">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.shade)} className="px-3 py-1 text-[var(--muted)] hover:text-[var(--champagne)] transition-colors">−</button>
                      <span className="text-[var(--ivory)] text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.shade)} className="px-3 py-1 text-[var(--muted)] hover:text-[var(--champagne)] transition-colors">+</button>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.shade)} className="text-[var(--muted)] hover:text-[var(--rose)] text-[10px] tracking-widest uppercase transition-colors" style={{ fontFamily: 'Cairo, sans-serif' }}>Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[var(--ivory)] font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-baseline pt-4">
              <span className="text-[var(--muted)] tracking-widest uppercase text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>Total</span>
              <span className="text-[var(--champagne)] text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{formatPrice(cartTotal)}</span>
            </div>

            <Link href="/checkout" className="block w-full py-5 bg-[var(--champagne)] text-[var(--obsidian)] text-center text-[10px] tracking-[0.4em] uppercase font-semibold hover:bg-[var(--ivory)] transition-colors no-underline mt-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
