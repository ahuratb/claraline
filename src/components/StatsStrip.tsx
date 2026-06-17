'use client'

import { useEffect, useRef, useState } from 'react'
import type { StatItem } from '@/lib/site-content'

/* Counts a numeric stat up from 0 → target once it scrolls into view.
   Keeps any non-numeric prefix/suffix (e.g. "12K+", "100%"). */
function Counter({ value, run }: { value: string; run: boolean }) {
  const m = value.match(/^(\D*)([\d.]+)(.*)$/)
  const prefix = m?.[1] ?? ''
  const target = m ? parseFloat(m[2]) : NaN
  const suffix = m?.[3] ?? ''
  const decimals = m && m[2].includes('.') ? (m[2].split('.')[1]?.length ?? 0) : 0
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!run || isNaN(target)) return
    const dur = 1600
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target])

  if (isNaN(target)) return <>{value}</>
  return <>{prefix}{n.toFixed(decimals)}{suffix}</>
}

export default function StatsStrip({ stats }: { stats: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect() } },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="stats-strip reveal-target">
      {stats.map((s, i) => (
        <div key={s.num + s.en} className="stat-item" data-edit={`stats.${i}`} data-edit-label={`Stat ${i + 1}`}>
          <div className="stat-num"><Counter value={s.num} run={show} /></div>
          <div className="stat-label en-only">{s.en}</div>
          <div className="stat-ar ar-only">{s.ar}</div>
        </div>
      ))}
    </div>
  )
}
