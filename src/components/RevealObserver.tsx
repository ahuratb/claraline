'use client'
import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    function reveal(el: Element) {
      el.classList.add('revealed')
    }

    // threshold:0 fires the moment ANY pixel enters the observation area.
    // rootMargin shrinks the bottom by 50px so elements reveal slightly before
    // they hit the very bottom edge, giving the callback time to run.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            reveal(e.target)
            observer.unobserve(e.target) // never watch again once revealed
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -50px 0px' }
    )

    function observeAll() {
      document.querySelectorAll('.reveal-target:not(.revealed)').forEach(el => {
        observer.observe(el)
      })
    }

    observeAll()

    // Catch elements added after initial mount (dynamic sections, lazy routes)
    const mutationObs = new MutationObserver(observeAll)
    mutationObs.observe(document.body, { childList: true, subtree: true })

    // Scroll fallback: if observer callback was delayed and missed the element,
    // a per-frame scroll check catches it. At most one RAF per frame.
    let rafScheduled = false
    const scrollCheck = () => {
      if (rafScheduled) return
      rafScheduled = true
      requestAnimationFrame(() => {
        rafScheduled = false
        const h = window.innerHeight
        document.querySelectorAll<Element>('.reveal-target:not(.revealed)').forEach(el => {
          const { top } = el.getBoundingClientRect()
          if (top < h - 40) reveal(el)
        })
      })
    }
    window.addEventListener('scroll', scrollCheck, { passive: true })

    // Timed insurance: reveal anything still hidden after 1s and 2.5s.
    // Covers slow connections, lazy images blocking layout, etc.
    const t1 = setTimeout(() => {
      document.querySelectorAll<Element>('.reveal-target:not(.revealed)').forEach(reveal)
    }, 1000)
    const t2 = setTimeout(() => {
      document.querySelectorAll<Element>('.reveal-target:not(.revealed)').forEach(reveal)
    }, 2500)

    return () => {
      observer.disconnect()
      mutationObs.disconnect()
      window.removeEventListener('scroll', scrollCheck)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
  return null
}
