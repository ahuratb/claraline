'use client'
import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [notice,   setNotice]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [gLoading, setGLoading] = useState(false)

  const router       = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('registered') === '1') setNotice('Account created — sign in to continue')
    const authError = searchParams.get('error')
    if (authError === 'OAuthAccountNotLinked') {
      setError('This email is already registered with a password. Please sign in with email instead.')
    } else if (authError) {
      setError('Sign-in failed. Please try again.')
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNotice('')

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/account')
    }
  }

  async function handleGoogle() {
    setGLoading(true)
    setError('')
    setNotice('')
    await signIn('google', { callbackUrl: '/account' })
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

        {/* ── Header ── */}
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
          <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
            <span className="en-only" dir="ltr">Your luxury account awaits</span>
            <span className="ar-only" dir="rtl">حسابك الفاخر بانتظارك</span>
          </p>
        </div>

        {/* ── Notice (registered) ── */}
        {notice && (
          <div style={{
            padding:      '12px 16px',
            background:   'rgba(201,169,110,0.07)',
            border:       '0.5px solid rgba(201,169,110,0.3)',
            color:        'var(--champagne)',
            fontFamily:   'Cairo, sans-serif',
            fontSize:     '12px',
            textAlign:    'center',
            marginBottom: '24px',
          }}>
            {notice}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{
            padding:      '12px 16px',
            background:   'rgba(196,130,122,0.1)',
            border:       '0.5px solid rgba(196,130,122,0.4)',
            color:        'var(--rose)',
            fontFamily:   'Cairo, sans-serif',
            fontSize:     '12px',
            textAlign:    'center',
            marginBottom: '24px',
          }}>
            {error}
          </div>
        )}

        {/* ── Google button ── */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={gLoading || loading}
          style={{
            width:          '100%',
            height:         '52px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '12px',
            background:     'rgba(255,255,255,0.05)',
            border:         '0.5px solid rgba(201,169,110,0.25)',
            color:          'var(--ivory)',
            fontFamily:     'Cairo, sans-serif',
            fontSize:       '11px',
            letterSpacing:  '0.2em',
            cursor:         gLoading || loading ? 'not-allowed' : 'pointer',
            opacity:        gLoading || loading ? 0.6 : 1,
            transition:     'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { if (!gLoading && !loading) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.6)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.25)' }}
        >
          {gLoading
            ? <span style={{ opacity: 0.7 }}>
                <span className="en-only">Connecting…</span>
                <span className="ar-only">جارٍ الاتصال…</span>
              </span>
            : <>
                <GoogleIcon />
                <span className="en-only">Continue with Google</span>
                <span className="ar-only">المتابعة عبر Google</span>
              </>
          }
        </button>

        {/* ── Divider ── */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '16px',
          margin:        '28px 0',
        }}>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,169,110,0.15)' }} />
          <span style={{
            fontFamily:    'Cairo, sans-serif',
            fontSize:      '9px',
            letterSpacing: '0.3em',
            color:         'rgba(154,138,122,0.5)',
          }}>
            <span className="en-only">OR</span>
            <span className="ar-only">أو</span>
          </span>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,169,110,0.15)' }} />
        </div>

        {/* ── Email / Password form ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

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
            disabled={loading || gLoading}
            style={{
              width:         '100%',
              height:        '52px',
              background:    loading ? 'rgba(201,169,110,0.5)' : 'var(--champagne)',
              color:         'var(--obsidian)',
              border:        'none',
              cursor:        loading || gLoading ? 'not-allowed' : 'pointer',
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

        {/* ── Register link ── */}
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
