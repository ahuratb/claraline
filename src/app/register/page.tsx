'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width:         '100%',
  padding:       '14px 16px',
  background:    'rgba(255,255,255,0.04)',
  border:        '0.5px solid rgba(201,169,110,0.2)',
  color:         'var(--ivory)',
  fontFamily:    'Cairo, sans-serif',
  fontSize:      '14px',
  outline:       'none',
  transition:    'border-color 0.2s',
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

export default function RegisterPage() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Registration failed')
        setLoading(false)
        return
      }

      router.push('/login?registered=1')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
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
            <span className="en-only">Join Claraline</span>
            <span className="ar-only">انضم إلى كالرالاين</span>
          </span>
          <h1 style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      '42px',
            fontWeight:    300,
            color:         'var(--ivory)',
            letterSpacing: '0.03em',
          }}>
            <span className="en-only">Create Account</span>
            <span className="ar-only">إنشاء حساب</span>
          </h1>
          <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
            <span className="en-only" dir="ltr">Start your luxury beauty journey</span>
            <span className="ar-only" dir="rtl">ابدأ رحلتك في عالم الجمال الفاخر</span>
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
              <span className="en-only">Full Name</span>
              <span className="ar-only">الاسم الكامل</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Layla Al-Ahmad"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--champagne)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(201,169,110,0.2)')}
            />
          </div>

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
              autoComplete="new-password"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--champagne)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(201,169,110,0.2)')}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <span className="en-only">Confirm Password</span>
              <span className="ar-only">تأكيد كلمة المرور</span>
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
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
              ? <><span className="en-only">Creating account…</span><span className="ar-only">جارٍ الإنشاء…</span></>
              : <><span className="en-only">Create Account</span><span className="ar-only">إنشاء الحساب</span></>
            }
          </button>
        </form>

        <p style={{
          textAlign:  'center',
          marginTop:  '32px',
          fontFamily: 'Cairo, sans-serif',
          fontSize:   '12px',
          color:      'var(--muted)',
        }}>
          <span className="en-only">
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--champagne)', textDecoration: 'none', borderBottom: '0.5px solid var(--champagne)' }}>
              Sign In
            </Link>
          </span>
          <span className="ar-only">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" style={{ color: 'var(--champagne)', textDecoration: 'none', borderBottom: '0.5px solid var(--champagne)' }}>
              تسجيل الدخول
            </Link>
          </span>
        </p>

      </div>
    </main>
  )
}
