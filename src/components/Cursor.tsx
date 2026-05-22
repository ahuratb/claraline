'use client'
import { useEffect, useState } from 'react'

function detectTouch(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export default function Cursor() {
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(true)

  useEffect(() => {
    setIsTouch(detectTouch())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isTouch) return
    const cur = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    if (!cur || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let raf = 0
    function onMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY
      cur!.style.left = mx + 'px'
      cur!.style.top = my + 'px'
    }
    function tick() {
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      ring!.style.left = rx + 'px'
      ring!.style.top = ry + 'px'
      raf = requestAnimationFrame(tick)
    }
    document.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [mounted, isTouch])

  if (!mounted || isTouch) return null

  return (
    <>
      <div id="cursor" aria-hidden="true" />
      <div id="cursor-ring" aria-hidden="true" />
    </>
  )
}
