'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Customer } from '@/types'
import toast from 'react-hot-toast'

const KUWAIT_CITIES = [
  { en: 'Kuwait City',    ar: 'مدينة الكويت' },
  { en: 'Salmiya',        ar: 'السالمية'     },
  { en: 'Hawalli',        ar: 'حولي'         },
  { en: 'Jabriya',        ar: 'الجابرية'     },
  { en: 'Shuwaikh',       ar: 'الشويخ'       },
  { en: 'Farwaniya',      ar: 'الفروانية'    },
  { en: 'Fahaheel',       ar: 'الفحاحيل'     },
  { en: 'Ahmadi',         ar: 'الأحمدي'      },
  { en: 'Sabah Al-Salem', ar: 'صباح السالم'  },
  { en: 'Abu Halifa',     ar: 'أبو حليفة'    },
]

export default function CheckoutForm() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const cartTotal = total()
  const [isAr, setIsAr] = useState(false)

  const [customer, setCustomer] = useState<Customer>({
    name: '', email: '', phone: '+965 ', address: '', city: 'Kuwait City', country: 'Kuwait',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsAr(document.documentElement.classList.contains('lang-ar'))
  }, [])

  function update(field: keyof Customer, value: string) {
    setCustomer(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return toast.error('Your cart is empty')

    setLoading(true)
    try {
      // Save order to MongoDB, get back a real orderId
      const orderRes = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items, total: cartTotal, customer }),
      })
      const orderData = await orderRes.json()
      if (!orderData.orderId) throw new Error('Order creation failed')
      const orderId = orderData.orderId

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

  function PayLabel() {
    if (loading) return (
      <>
        <span className="en-only">Redirecting…</span>
        <span className="ar-only">جارٍ التوجيه…</span>
      </>
    )
    return (
      <>
        <span className="en-only">Pay Now · {formatPrice(cartTotal)}</span>
        <span className="ar-only">ادفع الآن · {formatPrice(cartTotal)}</span>
      </>
    )
  }

  return (
    <main className="co-page">
      <div className="co-grid">

        {/* ── Form column ── */}
        <div className="co-form-col">
          <div className="co-header">
            <span className="co-eyebrow en-only">Delivery Details</span>
            <span className="co-eyebrow ar-only">تفاصيل التوصيل</span>
            <h1 className="co-title">
              <span className="en-only">Checkout</span>
              <span className="ar-only">الدفع</span>
            </h1>
          </div>

          <form id="co-checkout-form" className="co-form" onSubmit={handleSubmit}>

            <div className="co-row">
              <div className="co-field">
                <label className="co-label">
                  <span className="en-only">Full Name *</span>
                  <span className="ar-only">الاسم الكامل *</span>
                </label>
                <input
                  className="co-input"
                  value={customer.name}
                  onChange={e => update('name', e.target.value)}
                  required
                  placeholder={isAr ? 'ليلى الأحمد' : 'Layla Al-Ahmad'}
                />
              </div>
              <div className="co-field">
                <label className="co-label">
                  <span className="en-only">Email *</span>
                  <span className="ar-only">البريد الإلكتروني *</span>
                </label>
                <input
                  className="co-input"
                  type="email"
                  value={customer.email}
                  onChange={e => update('email', e.target.value)}
                  required
                  placeholder="layla@email.com"
                />
              </div>
            </div>

            <div className="co-field">
              <label className="co-label">
                <span className="en-only">Phone (Kuwait) *</span>
                <span className="ar-only">رقم الهاتف (الكويت) *</span>
              </label>
              <input
                className="co-input co-input-phone"
                value={customer.phone}
                onChange={e => update('phone', e.target.value)}
                required
                placeholder="+965 9999 9999"
                dir="ltr"
              />
            </div>

            <div className="co-field">
              <label className="co-label">
                <span className="en-only">Delivery Address *</span>
                <span className="ar-only">عنوان التوصيل *</span>
              </label>
              <input
                className="co-input"
                value={customer.address}
                onChange={e => update('address', e.target.value)}
                required
                placeholder={isAr ? 'قطعة ٥، شارع ١٢، منزل ٣٤' : 'Block 5, Street 12, House 34'}
              />
            </div>

            <div className="co-row">
              <div className="co-field">
                <label className="co-label">
                  <span className="en-only">City *</span>
                  <span className="ar-only">المدينة *</span>
                </label>
                <select
                  className="co-input co-select"
                  value={customer.city}
                  onChange={e => update('city', e.target.value)}
                >
                  {KUWAIT_CITIES.map(c => (
                    <option key={c.en} value={c.en}>{isAr ? c.ar : c.en}</option>
                  ))}
                </select>
              </div>
              <div className="co-field">
                <label className="co-label">
                  <span className="en-only">Country</span>
                  <span className="ar-only">الدولة</span>
                </label>
                <input
                  className="co-input"
                  value={isAr ? 'الكويت' : 'Kuwait'}
                  readOnly
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>

          </form>
        </div>

        {/* ── Order Summary ── */}
        <aside className="co-summary">
          <p className="co-summary-title">
            <span className="en-only">Order Summary</span>
            <span className="ar-only">ملخص الطلب</span>
          </p>

          <div className="co-items">
            {items.map(item => (
              <div key={`${item.productId}-${item.shade ?? ''}`} className="co-item">
                <div className="co-item-info">
                  <p className="co-item-name">
                    <span className="en-only">{item.name_en}</span>
                    <span className="ar-only">{item.name_ar}</span>
                  </p>
                  {item.shade && <p className="co-item-shade">{item.shade}</p>}
                  <p className="co-item-qty">× {item.quantity}</p>
                </div>
                <p className="co-item-price">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="co-totals">
            <div className="co-totals-row">
              <span className="co-totals-label">
                <span className="en-only">Subtotal</span>
                <span className="ar-only">المجموع الفرعي</span>
              </span>
              <span className="co-totals-value">{formatPrice(cartTotal)}</span>
            </div>
            <div className="co-totals-row">
              <span className="co-totals-label">
                <span className="en-only">Delivery</span>
                <span className="ar-only">التوصيل</span>
              </span>
              <span className="co-totals-delivery">
                <span className="en-only">Free over KWD 20</span>
                <span className="ar-only">مجاني فوق ٢٠ د.ك</span>
              </span>
            </div>
            <div className="co-totals-row co-totals-grand">
              <span className="co-totals-grand-label">
                <span className="en-only">Total</span>
                <span className="ar-only">الإجمالي</span>
              </span>
              <span className="co-totals-grand-value">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {/* Pay button — visible on desktop only */}
          <button
            type="submit"
            form="co-checkout-form"
            className="co-pay-btn co-pay-in-summary"
            disabled={loading || items.length === 0}
          >
            <PayLabel />
          </button>

          <p className="co-secure">
            <span className="en-only">Secured by MyFatoorah · KNET · Tabby · Visa · Mastercard</span>
            <span className="ar-only">مؤمّن بواسطة MyFatoorah · كي نت · تابي · فيزا · ماستركارد</span>
          </p>
        </aside>

      </div>

      {/* ── Fixed pay button — mobile & tablet only ── */}
      <div className="co-pay-fixed">
        <button
          type="submit"
          form="co-checkout-form"
          className="co-pay-btn"
          disabled={loading || items.length === 0}
        >
          <PayLabel />
        </button>
      </div>
    </main>
  )
}
