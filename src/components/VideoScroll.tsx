'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Overlay {
  id: string
  startPct: number
  endPct: number
  eyebrow?: string
  eyebrowAr?: string
  headlineHtml: string
  headlineHtmlAr?: string
  headlineFontSize?: string
  sublineEn?: string
  sublineAr?: string
  cta?: { label: string; labelAr?: string; href?: string; scrollTo?: string }
  position?: React.CSSProperties
}

interface VideoScrollProps {
  src: string
  overlays: Overlay[]
  sectionHeight?: string
  maxSeconds?: number
}

export default function VideoScroll({ src, overlays, sectionHeight = '400vh', maxSeconds }: VideoScrollProps) {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video   = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    video.pause()
    video.currentTime = 0

    const keepPaused = () => setTimeout(() => video.pause(), 50)
    video.addEventListener('play', keepPaused)

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect    = section.getBoundingClientRect()
        const scrolled = -rect.top
        const total    = section.offsetHeight - window.innerHeight
        const p        = Math.max(0, Math.min(1, scrolled / total))

        if (progressRef.current) progressRef.current.style.width = `${p * 100}%`
        if (video.duration && !isNaN(video.duration)) {
          const span = maxSeconds ? Math.min(maxSeconds, video.duration) : video.duration
          const target = p * span
          if (Math.abs(video.currentTime - target) > 0.08) video.currentTime = target
        }
        setProgress(p)
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      video.removeEventListener('play', keepPaused)
    }
  }, [maxSeconds])

  const PAD = 0.06
  function cls(o: Overlay) {
    if (progress > o.startPct + PAD && progress < o.endPct - PAD) return 'vid-text visible'
    if (progress >= o.endPct - PAD) return 'vid-text exit'
    return 'vid-text'
  }

  return (
    <div ref={sectionRef} className="scroll-section" style={{ height: sectionHeight }}>
      <div className="video-sticky">
        <video
          ref={videoRef}
          src={src}
          className="hero-vid"
          muted
          playsInline
          preload="auto"
        />

        <div className="vid-overlay-group">
          {overlays.map(o => {
            const hasBothHeadlines = !!o.headlineHtmlAr
            const hasBothEyebrows  = !!o.eyebrowAr
            const hasBothSublines  = !!(o.sublineEn && o.sublineAr)

            return (
              <div key={o.id} className={cls(o)} style={o.position}>

                {/* Eyebrow */}
                {o.eyebrow && (
                  <span className={`eyebrow${hasBothEyebrows ? ' en-only' : ''}`}>
                    {o.eyebrow}
                  </span>
                )}
                {o.eyebrowAr && (
                  <span className="eyebrow ar-only">{o.eyebrowAr}</span>
                )}

                {/* Headline EN */}
                <div
                  className={`headline${hasBothHeadlines ? ' en-only' : ''}`}
                  style={o.headlineFontSize ? { fontSize: o.headlineFontSize } : undefined}
                  dangerouslySetInnerHTML={{ __html: o.headlineHtml }}
                />
                {/* Headline AR */}
                {o.headlineHtmlAr && (
                  <div
                    className="headline ar-only"
                    style={o.headlineFontSize ? { fontSize: o.headlineFontSize } : undefined}
                    dangerouslySetInnerHTML={{ __html: o.headlineHtmlAr }}
                  />
                )}

                {/* Subline */}
                {o.sublineEn && (
                  <p className={`subline${hasBothSublines ? ' en-only' : ''}`}>{o.sublineEn}</p>
                )}
                {o.sublineAr && (
                  <p className={`subline${hasBothSublines ? ' ar-only' : ''}`}>{o.sublineAr}</p>
                )}

                {/* CTA */}
                {o.cta && (o.cta.scrollTo ? (
                  <>
                    <button
                      className={`cta-btn${o.cta.labelAr ? ' en-only' : ''}`}
                      onClick={() => document.getElementById(o.cta!.scrollTo!)?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {o.cta.label}
                    </button>
                    {o.cta.labelAr && (
                      <button
                        className="cta-btn ar-only"
                        onClick={() => document.getElementById(o.cta!.scrollTo!)?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        {o.cta.labelAr}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <Link href={o.cta.href!} className={`cta-btn${o.cta.labelAr ? ' en-only' : ''}`}>
                      {o.cta.label}
                    </Link>
                    {o.cta.labelAr && (
                      <Link href={o.cta.href!} className="cta-btn ar-only">
                        {o.cta.labelAr}
                      </Link>
                    )}
                  </>
                ))}

              </div>
            )
          })}
        </div>

        <div className="vid-progress">
          <div ref={progressRef} className="vid-progress-fill" />
        </div>
      </div>
    </div>
  )
}
