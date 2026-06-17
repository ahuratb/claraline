'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { SlideItem } from '@/lib/site-content'

export default function LuxurySlider({ slides }: { slides: SlideItem[] }) {
  const SLIDES = slides
  const [current, setCurrent] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setCurrent(c => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [SLIDES.length])

  const goTo = (i: number) => setCurrent(i)
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  if (SLIDES.length === 0) return null
  const slide = SLIDES[current]

  const hasImage = !!slide.image

  return (
    <div
      className={`luxury-slider${hasImage ? ' ls-split' : ''}`}
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

      {/* Crossfading model images */}
      {SLIDES.map((s, i) => (
        s.image ? (
          <div
            key={`img-${s.id}`}
            className={`ls-image${i === current ? ' active' : ''}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" />
          </div>
        ) : null
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
      <div
        key={current}
        className={`ls-content${hasImage ? ' ls-content-left' : ''}`}
        data-edit={`slides.${current}`}
        data-edit-label={`Slide ${current + 1}`}
      >
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
