'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width:      '100%',
  padding:    '14px 16px',
  background: 'rgba(255,255,255,0.04)',
  border:     '0.5px solid rgba(201,169,110,0.2)',
  color:      'var(--ivory)',
  fontFamily: 'Cairo, sans-serif',
  fontSize:   '14px',
  outline:    'none',
  transition: 'border-color 0.2s',
  textTransform: 'none',
}

const labelStyle: React.CSSProperties = {
  display:       'block',
  fontFamily:    'Cairo, sans-serif',
  fontSize:      '9px',
  letterSpacing: '0.35em',
  color:         'var(--muted)',
  marginBottom:  '8px',
}

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/account')
    }
  }

  return (
    <main style={{
      minHeight:      '100vh',
      background:     'var(--obsidian)',
      paddingTop:     '120px',
      paddingBottom:  '80px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontFamily:    'Cairo, sans-serif',
            fontSize:      '9px',
            letterSpacing: '0.5em',
            color:         'rgba(201,169,110,0.6)',
            display:       'block',
            marginBottom:  '12px',
          }}>
            <span className="en-only">Welcome Back</span>
            <span className="ar-only">أهلاً بعودتك</span>
          </span>
          <h1 style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      '42px',
            fontWeight:    300,
            color:         'var(--ivory)',
            letterSpacing: '0.03em',
          }}>
            <span className="en-only">Sign In</span>
            <span className="ar-only">تسجيل الدخول</span>
          </h1>
          <p style={{
            fontFamily:  'Cairo, sans-serif',
            fontSize:    '13px',
            color:       'var(--muted)',
            marginTop:   '8px',
          }}>
            <span className="en-only" dir="ltr">Your luxury account awaits</span>
            <span className="ar-only" dir="rtl">حسابك الفاخر بانتظارك</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {error && (
            <div style={{
              padding:    '12px 16px',
              background: 'rgba(196,130,122,0.1)',
              border:     '0.5px solid rgba(196,130,122,0.4)',
              color:      'var(--rose)',
              fontFamily: 'Cairo, sans-serif',
              fontSize:   '12px',
              textAlign:  'center',
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>
              <span className="en-only">Email</span>
              <span className="ar-only">البريد الإلكتروني</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="layla@email.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--champagne)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(201,169,110,0.2)')}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <span className="en-only">Password</span>
              <span className="ar-only">كلمة المرور</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--champagne)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(201,169,110,0.2)')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width:         '100%',
              height:        '52px',
              background:    loading ? 'rgba(201,169,110,0.5)' : 'var(--champagne)',
              color:         'var(--obsidian)',
              border:        'none',
              cursor:        loading ? 'not-allowed' : 'pointer',
              fontFamily:    'Cairo, sans-serif',
              fontSize:      '10px',
              fontWeight:    700,
              letterSpacing: '0.3em',
              marginTop:     '8px',
              transition:    'background 0.2s',
            }}
          >
            {loading
              ? <><span className="en-only">Signing in…</span><span className="ar-only">جارٍ الدخول…</span></>
              : <><span className="en-only">Sign In</span><span className="ar-only">دخول</span></>
            }
          </button>
        </form>

        {/* Register link */}
        <p style={{
          textAlign:  'center',
          marginTop:  '32px',
          fontFamily: 'Cairo, sans-serif',
          fontSize:   '12px',
          color:      'var(--muted)',
        }}>
          <span className="en-only">
            New to Claraline?{' '}
            <Link href="/register" style={{ color: 'var(--champagne)', textDecoration: 'none', borderBottom: '0.5px solid var(--champagne)' }}>
              Create Account
            </Link>
          </span>
          <span className="ar-only">
            جديد هنا؟{' '}
            <Link href="/register" style={{ color: 'var(--champagne)', textDecoration: 'none', borderBottom: '0.5px solid var(--champagne)' }}>
              إنشاء حساب
            </Link>
          </span>
        </p>

      </div>
    </main>
  )
}
