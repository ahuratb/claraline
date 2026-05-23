'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
  name_en:   string
  name_ar?:  string
  price:     number
  quantity:  number
  shade?:    string
}

interface Order {
  _id:       string
  items:     OrderItem[]
  total:     number
  status:    'pending' | 'paid' | 'failed'
  createdAt: string
  customer?: { name: string; city?: string }
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  paid:    { bg: 'rgba(76,175,80,0.12)',     color: '#4CAF50' },
  pending: { bg: 'rgba(201,169,110,0.10)',   color: 'var(--champagne)' },
  failed:  { bg: 'rgba(196,130,122,0.12)',   color: 'var(--rose)' },
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router    = useRouter()
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState<'orders' | 'profile'>('orders')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(data.orders ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session])

  if (status === 'loading') return (
    <main style={{
      minHeight: '100vh', background: 'var(--obsidian)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '9px', letterSpacing: '0.4em', color: 'var(--champagne)', opacity: 0.6 }}>
        Loading…
      </p>
    </main>
  )

  if (!session) return null

  const TABS = [
    { key: 'orders',  en: 'Order History',  ar: 'سجل الطلبات' },
    { key: 'profile', en: 'Profile',        ar: 'الملف الشخصي' },
  ] as const

  return (
    <main style={{ minHeight: '100vh', background: 'var(--obsidian)', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 56px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            fontFamily: 'Cairo, sans-serif', fontSize: '9px',
            letterSpacing: '0.5em', color: 'var(--champagne)', opacity: 0.7,
            display: 'block', marginBottom: '10px',
          }}>
            <span className="en-only">My Account</span>
            <span className="ar-only">حسابي</span>
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: 300, color: 'var(--ivory)' }}>
            {session.user.name}
          </h1>
          <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
            {session.user.email}
          </p>
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: 'flex', borderBottom: '0.5px solid rgba(201,169,110,0.15)',
          marginBottom: '48px', gap: 0,
        }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding:       '12px 28px',
                fontFamily:    'Cairo, sans-serif',
                fontSize:      '9px',
                letterSpacing: '0.35em',
                background:    'transparent',
                border:        'none',
                borderBottom:  tab === t.key ? '1px solid var(--champagne)' : '1px solid transparent',
                color:         tab === t.key ? 'var(--champagne)' : 'rgba(154,138,122,0.6)',
                cursor:        'pointer',
                marginBottom:  '-0.5px',
                transition:    'color 0.2s',
              }}
            >
              <span className="en-only">{t.en}</span>
              <span className="ar-only">{t.ar}</span>
            </button>
          ))}
        </div>

        {/* ── Orders Tab ── */}
        {tab === 'orders' && (
          <div>
            {loading ? (
              <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '9px', letterSpacing: '0.4em', color: 'var(--muted)', opacity: 0.6 }}>
                Loading orders…
              </p>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300, color: 'rgba(250,245,238,0.2)', marginBottom: '8px' }}>
                  <span className="en-only">No orders yet</span>
                  <span className="ar-only">لا توجد طلبات</span>
                </p>
                <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '11px', letterSpacing: '0.3em', color: 'var(--muted)', marginBottom: '36px' }}>
                  <span className="en-only">Your order history will appear here</span>
                  <span className="ar-only">سيظهر سجل طلباتك هنا</span>
                </p>
                <Link href="/shop" style={{
                  display:       'inline-block',
                  padding:       '12px 32px',
                  border:        '0.5px solid rgba(201,169,110,0.4)',
                  color:         'var(--champagne)',
                  fontFamily:    'Cairo, sans-serif',
                  fontSize:      '9px',
                  letterSpacing: '0.3em',
                  textDecoration: 'none',
                  transition:    'border-color 0.2s',
                }}>
                  <span className="en-only">Start Shopping</span>
                  <span className="ar-only">ابدأ التسوق</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(order => {
                  const st = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending
                  return (
                    <div key={order._id} style={{
                      padding:    '24px',
                      border:     '0.5px solid rgba(201,169,110,0.12)',
                      background: 'rgba(201,169,110,0.02)',
                    }}>
                      {/* Order header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: '4px' }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '11px', color: 'rgba(154,138,122,0.6)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-KW', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <span style={{
                          padding:       '5px 14px',
                          fontSize:      '9px',
                          letterSpacing: '0.2em',
                          fontFamily:    'Cairo, sans-serif',
                          background:    st.bg,
                          color:         st.color,
                          border:        `0.5px solid ${st.color}`,
                          alignSelf:     'flex-start',
                        }}>
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ borderTop: '0.5px solid rgba(201,169,110,0.08)', paddingTop: '16px' }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{
                            display:        'flex',
                            justifyContent: 'space-between',
                            alignItems:     'center',
                            padding:        '8px 0',
                            borderBottom:   '0.5px solid rgba(201,169,110,0.06)',
                          }}>
                            <div>
                              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 300, color: 'var(--ivory)' }}>
                                <span className="en-only">{item.name_en}</span>
                                <span className="ar-only">{item.name_ar ?? item.name_en}</span>
                              </span>
                              {item.shade && (
                                <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '10px', color: 'var(--muted)', marginLeft: '8px', letterSpacing: '0.1em' }}>
                                  · {item.shade}
                                </span>
                              )}
                              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '10px', color: 'var(--muted)', marginLeft: '8px' }}>
                                × {item.quantity}
                              </span>
                            </div>
                            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '13px', color: 'var(--champagne)', whiteSpace: 'nowrap' }}>
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '0.5px solid rgba(201,169,110,0.15)' }}>
                        <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--muted)' }}>
                          <span className="en-only">Total</span>
                          <span className="ar-only">الإجمالي</span>
                        </span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, color: 'var(--champagne)' }}>
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Profile Tab ── */}
        {tab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '480px' }}>
            {[
              { label_en: 'Name', label_ar: 'الاسم', value: session.user.name ?? '' },
              { label_en: 'Email', label_ar: 'البريد', value: session.user.email ?? '' },
            ].map(({ label_en, label_ar, value }) => (
              <div key={label_en}>
                <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '9px', letterSpacing: '0.35em', color: 'var(--muted)', marginBottom: '8px' }}>
                  <span className="en-only">{label_en}</span>
                  <span className="ar-only">{label_ar}</span>
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 300, color: 'var(--ivory)', padding: '12px 16px', border: '0.5px solid rgba(201,169,110,0.12)', background: 'rgba(201,169,110,0.03)' }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Sign Out ── */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            marginTop:     '56px',
            padding:       '10px 24px',
            background:    'transparent',
            border:        '0.5px solid rgba(154,138,122,0.3)',
            color:         'var(--muted)',
            fontFamily:    'Cairo, sans-serif',
            fontSize:      '9px',
            letterSpacing: '0.3em',
            cursor:        'pointer',
            transition:    'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--rose)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--rose)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(154,138,122,0.3)' }}
        >
          <span className="en-only">Sign Out</span>
          <span className="ar-only">تسجيل الخروج</span>
        </button>

      </div>
    </main>
  )
}
