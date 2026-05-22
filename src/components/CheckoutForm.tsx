'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { formatPrice, generateOrderId } from '@/lib/utils'
import { Customer } from '@/types'
import toast from 'react-hot-toast'

const KUWAIT_CITIES = ['Kuwait City', 'Salmiya', 'Hawalli', 'Jabriya', 'Shuwaikh', 'Farwaniya', 'Fahaheel', 'Ahmadi', 'Sabah Al-Salem', 'Abu Halifa']

export default function CheckoutForm() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const cartTotal = total()

  const [customer, setCustomer] = useState<Customer>({
    name: '', email: '', phone: '+965 ', address: '', city: 'Kuwait City', country: 'Kuwait',
  })
  const [loading, setLoading] = useState(false)

  function update(field: keyof Customer, value: string) {
    setCustomer(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return toast.error('Your cart is empty')

    setLoading(true)
    try {
      const orderId = generateOrderId()

      // Save order
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, items, total: cartTotal, customer, status: 'pending' }),
      })

      // Initiate payment
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          orderId,
          customer: { name: customer.name, email: customer.email, phone: customer.phone },
        }),
      })

      const data = await res.json()
      if (data.url) {
        clearCart()
        router.push(data.url)
      } else {
        toast.error(data.error ?? 'Payment failed. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[var(--deep)] border border-[rgba(201,169,110,0.2)] text-[var(--ivory)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--champagne)] transition-colors placeholder-[var(--muted)]"

  return (
    <div className="min-h-screen bg-[var(--obsidian)] pt-32 pb-20 px-14">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-[var(--champagne)] text-[9px] tracking-[0.5em] uppercase mb-2 opacity-70" style={{ fontFamily: 'Cairo, sans-serif' }}>Delivery Details</p>
            <h1 className="text-[var(--ivory)] text-3xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Checkout</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--muted)] text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Full Name *</label>
              <input
                className={inputClass}
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                value={customer.name}
                onChange={e => update('name', e.target.value)}
                required placeholder="Layla Al-Ahmad"
              />
            </div>
            <div>
              <label className="block text-[var(--muted)] text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Email *</label>
              <input
                className={inputClass}
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                type="email" value={customer.email}
                onChange={e => update('email', e.target.value)}
                required placeholder="layla@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--muted)] text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Phone (Kuwait) *</label>
            <input
              className={inputClass}
              style={{ fontFamily: 'Cairo, sans-serif' }}
              value={customer.phone}
              onChange={e => update('phone', e.target.value)}
              required placeholder="+965 9999 9999"
            />
          </div>

          <div>
            <label className="block text-[var(--muted)] text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Delivery Address *</label>
            <input
              className={inputClass}
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              value={customer.address}
              onChange={e => update('address', e.target.value)}
              required placeholder="Block 5, Street 12, House 34"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--muted)] text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>City *</label>
              <select
                className={`${inputClass} cursor-pointer`}
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                value={customer.city}
                onChange={e => update('city', e.target.value)}
              >
                {KUWAIT_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[var(--muted)] text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Country</label>
              <input className={inputClass} value="Kuwait" readOnly style={{ fontFamily: 'Cormorant Garamond, serif', opacity: 0.6 }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full py-5 bg-[var(--champagne)] text-[var(--obsidian)] text-[10px] tracking-[0.4em] uppercase font-semibold hover:bg-[var(--ivory)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {loading ? 'Redirecting to payment...' : `Pay Now · ${formatPrice(cartTotal)}`}
          </button>

          <p className="text-[var(--muted)] text-xs text-center tracking-wider" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Secured by MyFatoorah · KNET · Tabby · Visa · Mastercard
          </p>
        </form>

        {/* Order Summary */}
        <aside className="space-y-6">
          <h2 className="text-[var(--champagne)] text-[9px] tracking-[0.5em] uppercase opacity-70" style={{ fontFamily: 'Cairo, sans-serif' }}>Order Summary</h2>

          <div className="space-y-4">
            {items.map(item => (
              <div key={`${item.productId}-${item.shade}`} className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className="text-[var(--ivory)] text-sm font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{item.name_en}</p>
                  {item.shade && <p className="text-[var(--muted)] text-[10px] tracking-widest">{item.shade}</p>}
                  <p className="text-[var(--muted)] text-[10px]">× {item.quantity}</p>
                </div>
                <p className="text-[var(--ivory)] text-sm flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[rgba(201,169,110,0.15)] pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]" style={{ fontFamily: 'Cairo, sans-serif' }}>Subtotal</span>
              <span className="text-[var(--ivory)]">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]" style={{ fontFamily: 'Cairo, sans-serif' }}>Delivery</span>
              <span className="text-[var(--champagne)] text-xs">Free over KWD 20</span>
            </div>
            <div className="flex justify-between text-lg font-light border-t border-[rgba(201,169,110,0.15)] pt-3 mt-2">
              <span className="text-[var(--ivory)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Total</span>
              <span className="text-[var(--champagne)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
