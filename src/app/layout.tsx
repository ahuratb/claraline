import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import CartDrawer from '@/components/CartDrawer'
import RevealObserver from '@/components/RevealObserver'
import BottomNav from '@/components/BottomNav'
import MobileTopBar from '@/components/MobileTopBar'
import Cursor from '@/components/Cursor'
import LoadingScreen from '@/components/LoadingScreen'
import WhatsAppButton from '@/components/WhatsAppButton'
import SessionProvider from '@/components/SessionProvider'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'claraline — Luxury Makeup Kuwait',
  description: 'كالرالاين — ميك أب فاخر من الكويت',
  keywords: ['makeup', 'luxury', 'kuwait', 'كالرالاين', 'ميكاب', 'lipstick', 'beauty'],
  openGraph: {
    title: 'claraline',
    description: 'Luxury Makeup from Kuwait',
    locale: 'ar_KW',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Restore saved theme before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('claraline-theme');
                if (t === 'light') document.documentElement.classList.add('theme-light');
              } catch(e) {}
            })()`
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        {/* Satoshi (Fontshare) — English; Noto Sans Arabic (Google) — Arabic */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <SessionProvider>
        <LoadingScreen />
        <Cursor />

        <RevealObserver />
        <Nav />
        <MobileTopBar />
        <CartDrawer />
        <BottomNav />
        {children}

        <WhatsAppButton />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--deep)',
              color: 'var(--ivory)',
              border: '0.5px solid rgba(201,169,110,0.4)',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.05em',
            },
          }}
        />
        </SessionProvider>
      </body>
    </html>
  )
}
