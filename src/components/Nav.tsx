'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState<'EN' | 'AR'>('EN')
  const { count, openCart } = useCartStore()
  const cartCount = count()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLang = () => {
    const next = lang === 'EN' ? 'AR' : 'EN'
    setLang(next)
    document.documentElement.classList.toggle('lang-ar', next === 'AR')
    document.body.dir = next === 'AR' ? 'rtl' : 'ltr'
  }

  return (
    <nav
      className={`main-nav fixed top-0 left-0 right-0 z-[200] flex justify-between items-center px-14 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-black/80 backdrop-blur-md border-b border-[rgba(201,169,110,0.12)]'
          : 'py-6 bg-transparent'
      }`}
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="no-underline flex items-center"
        style={{ animation: 'fadeUp 1s 0.3s forwards', opacity: 0 }}
      >
        <Image
          src="/logo.png"
          alt="Claraline"
          width={140}
          height={40}
          style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          priority
        />
      </Link>

      {/* Links */}
      <ul
        className="flex gap-8 list-none"
        style={{ animation: 'fadeUp 1s 0.5s forwards', opacity: 0 }}
      >
        {[
          { label: 'Collection', href: '/shop' },
          { label: 'Ritual', href: '/#ritual' },
          { label: 'About', href: '/#about' },
        ].map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-[9px] tracking-[0.3em] uppercase text-[var(--ivory)] opacity-60 hover:opacity-100 hover:text-[var(--champagne)] transition-all duration-300 no-underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right: lang toggle + cart */}
      <div
        className="flex items-center gap-5"
        style={{ animation: 'fadeUp 1s 0.6s forwards', opacity: 0 }}
      >
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          className="text-[9px] tracking-[0.25em] uppercase text-[var(--champagne)] opacity-70 hover:opacity-100 transition-opacity"
        >
          {lang === 'EN' ? 'عربي' : 'EN'}
        </button>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative w-[38px] h-[38px] border border-[rgba(201,169,110,0.3)] flex items-center justify-center hover:border-[var(--champagne)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          aria-label="Open cart"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--champagne)] rounded-full text-[8px] text-[var(--obsidian)] flex items-center justify-center font-semibold">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
