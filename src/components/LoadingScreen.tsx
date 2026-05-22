'use client'
import { useEffect, useRef, useState } from 'react'

const MIN_DISPLAY_MS = 1200
const MAX_DISPLAY_MS = 4000

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)   // displayed (smoothed)
  const [done, setDone]         = useState(false)
  const [hidden, setHidden]     = useState(false)
  const targetRef               = useRef(0)
  const startedAt               = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now())
  const rafRef                  = useRef<number | null>(null)

  // Smooth interpolation toward the target checkpoint.
  useEffect(() => {
    const tick = () => {
      setProgress(p => {
        const t = targetRef.current
        if (Math.abs(p - t) < 0.4) return t
        return p + (t - p) * 0.08
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // Real load checkpoints.
  useEffect(() => {
    // 0 -> 30% almost immediately
    const t1 = setTimeout(() => { targetRef.current = Math.max(targetRef.current, 30) }, 80)

    // Fonts ready -> 60%
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
    fonts?.ready?.then(() => { targetRef.current = Math.max(targetRef.current, 60) }).catch(() => {})

    // Window load -> 90%
    const onLoad = () => { targetRef.current = Math.max(targetRef.current, 90) }
    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    // Either: window.load + min time, or: hard cap at MAX_DISPLAY_MS.
    const completeWhenReady = () => {
      const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt.current
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed)
      setTimeout(() => { targetRef.current = 100 }, wait)
    }
    if (document.readyState === 'complete') completeWhenReady()
    else window.addEventListener('load', completeWhenReady, { once: true })

    const hardCap = setTimeout(() => { targetRef.current = 100 }, MAX_DISPLAY_MS)

    return () => {
      clearTimeout(t1)
      clearTimeout(hardCap)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('load', completeWhenReady)
    }
  }, [])

  // Fade out when 100%, then unmount-style.
  useEffect(() => {
    if (progress >= 99.5 && !done) setDone(true)
  }, [progress, done])

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setHidden(true), 700)
    return () => clearTimeout(t)
  }, [done])

  if (hidden) return null

  const pct = Math.round(progress)

  return (
    <div className={`loading-screen${done ? ' done' : ''}`} aria-hidden={done}>
      <div className="loading-inner">
        <div className="loading-logo-row">
          <span className="loading-star" aria-hidden>✦</span>
          <span className="loading-logo-text">Claraline</span>
          <span className="loading-star" aria-hidden>✦</span>
        </div>
        <p className="loading-tagline">Luxury · Kuwait</p>

        <div className="loading-bar">
          <div className="loading-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <p className="loading-pct">{pct}%</p>
      </div>
    </div>
  )
}
