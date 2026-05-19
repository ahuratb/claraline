'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    id: 1,
    label: 'New Collection · 2024',
    labelAr: 'المجموعة الجديدة · 2024',
    headline: 'The Art<br/>of <em>Color</em>',
    headlineAr: 'فن<br/><em>الألوان</em>',
    sub: 'Luxury lip rituals crafted for you',
    subAr: 'طقوس شفاه فاخرة صُممت لكِ',
    cta: 'Discover Now',
    ctaAr: 'اكتشفي الآن',
    href: '/shop',
    bg: 'radial-gradient(ellipse at 30% 60%,#2a1208 0%,#0a0806 55%),radial-gradient(ellipse at 80% 20%,#1a0e18 0%,transparent 60%)',
  },
  {
    id: 2,
    label: 'Eye Collection',
    labelAr: 'مجموعة العيون',
    headline: 'Eyes that<br/>speak <em>volumes</em>',
    headlineAr: 'عيون<br/>تتحدث <em>بصمت</em>',
    sub: 'Smoky nights, defined lashes, arabian kohl',
    subAr: 'ليالٍ دخانية، رموش محددة، كحل عربي',
    cta: 'Eye Collection',
    ctaAr: 'مجموعة العيون',
    href: '#products2',
    bg: 'radial-gradient(ellipse at 70% 40%,#1a1230 0%,#080810 55%),radial-gradient(ellipse at 20% 80%,#1a0a18 0%,transparent 60%)',
  },
  {
    id: 3,
    label: 'Desert Gold',
    labelAr: 'ذهب الصحراء',
    headline: 'Born from<br/><em>Kuwait</em>',
    headlineAr: 'وُلد في قلب<br/><em>الكويت</em>',
    sub: 'Formulated for Gulf skin, inspired by the desert',
    subAr: 'مُصاغ لبشرة الخليج، مستلهم من الصحراء',
    cta: 'Our Story',
    ctaAr: 'قصتنا',
    href: '/#ritual',
    bg: 'radial-gradient(ellipse at 50% 30%,#1a1208 0%,#0a0806 55%),radial-gradient(ellipse at 80% 70%,#1a0e08 0%,transparent 60%)',
  },
  {
    id: 4,
    label: 'The Ritual',
    labelAr: 'الطقس',
    headline: 'Your beauty<br/><em>ritual</em> awaits',
    headlineAr: 'طقس جمالكِ<br/><em>ينتظركِ</em>',
    sub: 'Join thousands of women across the Gulf',
    subAr: 'انضمي إلى آلاف النساء في أنحاء الخليج',
    cta: 'Shop Now',
    ctaAr: 'تسوقي الآن',
    href: '/shop',
    bg: 'radial-gradient(ellipse at 40% 50%,#0f1a10 0%,#080806 55%),radial-gradient(ellipse at 60% 20%,#1a1008 0%,transparent 60%)',
  },
]

export default function LuxurySlider() {
  const [current, setCurrent] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setCurrent(c => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const goTo = (i: number) => setCurrent(i)
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  const slide = SLIDES[current]

  return (
    <div
      className="luxury-slider"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {/* Crossfading backgrounds */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="ls-bg"
          style={{ background: s.bg, opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Corner frame decoration */}
      <div className="ls-frame" aria-hidden="true">
        <div className="ls-frame-tl" />
        <div className="ls-frame-tr" />
        <div className="ls-frame-bl" />
        <div className="ls-frame-br" />
      </div>

      {/* Crosshair lines */}
      <div className="ls-crosshair" aria-hidden="true">
        <div className="ls-cross-v" />
        <div className="ls-cross-h" />
      </div>

      {/* Animated content — key remounts on slide change, firing CSS animation */}
      <div key={current} className="ls-content">
        <span className="ls-label en-only">{slide.label}</span>
        <span className="ls-label ar-only">{slide.labelAr}</span>
        <h2 className="ls-headline en-only" dangerouslySetInnerHTML={{ __html: slide.headline }} />
        <h2 className="ls-headline ar-only" dangerouslySetInnerHTML={{ __html: slide.headlineAr }} />
        <p className="ls-sub en-only">{slide.sub}</p>
        <p className="ls-sub ar-only">{slide.subAr}</p>
        <Link href={slide.href} className="ls-cta">
          <span className="en-only">{slide.cta}</span>
          <span className="ar-only">{slide.ctaAr}</span>
        </Link>
      </div>

      {/* Arrows */}
      <button className="ls-arrow ls-prev" onClick={prev} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="ls-arrow ls-next" onClick={next} aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot navigation */}
      <div className="ls-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`ls-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="ls-counter">
        <span className="ls-counter-cur">{String(current + 1).padStart(2, '0')}</span>
        <span className="ls-counter-sep"> / </span>
        <span className="ls-counter-tot">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* Auto-advance progress bar — key restarts animation per slide */}
      <div className="ls-progress-bar">
        <div key={current} className="ls-progress-fill" />
      </div>
    </div>
  )
}
