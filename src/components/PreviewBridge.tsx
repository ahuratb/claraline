'use client'

import { useEffect } from 'react'

/* ──────────────────────────────────────────────────────────────
   PreviewBridge — only does anything when the page is loaded with
   ?preview=1 (i.e. inside the /admin live-preview iframe).

   In preview mode it:
   • outlines any element marked with `data-edit="path"` on hover
   • shows the element's `data-edit-label` as a floating tag
   • on click, tells the parent admin window which content path was
     clicked  →  postMessage({ type:'claraline:edit', path, label })
   • swallows the click so links/buttons don't navigate
   • lets the parent ask it to flash-highlight a path
     (postMessage { type:'claraline:highlight', path })

   Outside preview mode it renders nothing and attaches no listeners.
   ────────────────────────────────────────────────────────────── */

const STYLE_ID = 'claraline-preview-style'

const CSS = `
  [data-edit]{ cursor:pointer !important; transition:outline-color .12s, background-color .12s; outline:2px solid transparent; outline-offset:2px; }
  [data-edit]:hover{ outline-color:#c9a96e !important; background-color:rgba(201,169,110,.10) !important; }
  [data-edit].claraline-flash{ outline-color:#c9a96e !important; animation:claraline-flash 1.1s ease; }
  @keyframes claraline-flash{ 0%,100%{ background-color:rgba(201,169,110,0); } 30%{ background-color:rgba(201,169,110,.30); } }
  /* let overlay text receive clicks even if normally pointer-events:none */
  .vid-overlay-group,[data-edit]{ pointer-events:auto !important; }
  #claraline-edit-tag{
    position:fixed; z-index:2147483647; pointer-events:none;
    background:#161310; color:#c9a96e; font:600 11px/1.4 system-ui,sans-serif;
    letter-spacing:.04em; padding:4px 8px; border-radius:6px;
    border:1px solid rgba(201,169,110,.4); transform:translateY(-100%);
    white-space:nowrap; opacity:0; transition:opacity .1s;
  }
`

export default function PreviewBridge() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('preview') !== '1') return

    document.documentElement.setAttribute('data-claraline-preview', '1')

    // inject styles
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }

    // floating label tag
    const tag = document.createElement('div')
    tag.id = 'claraline-edit-tag'
    document.body.appendChild(tag)

    const findTarget = (el: EventTarget | null): HTMLElement | null => {
      let node = el as HTMLElement | null
      while (node && node !== document.body) {
        if (node.dataset && node.dataset.edit) return node
        node = node.parentElement
      }
      return null
    }

    const onOver = (e: MouseEvent) => {
      const t = findTarget(e.target)
      if (!t) { tag.style.opacity = '0'; return }
      const label = t.dataset.editLabel || t.dataset.edit || ''
      tag.textContent = label
      const r = t.getBoundingClientRect()
      tag.style.left = `${Math.max(6, r.left)}px`
      tag.style.top = `${Math.max(20, r.top - 4)}px`
      tag.style.opacity = '1'
    }

    const onClick = (e: MouseEvent) => {
      const t = findTarget(e.target)
      if (!t) return
      e.preventDefault()
      e.stopPropagation()
      window.parent?.postMessage(
        { type: 'claraline:edit', path: t.dataset.edit, label: t.dataset.editLabel || '' },
        '*',
      )
    }

    const flash = (el: HTMLElement) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.remove('claraline-flash')
      void el.offsetWidth // restart animation
      el.classList.add('claraline-flash')
    }

    const onMessage = (e: MessageEvent) => {
      // exact-path highlight
      if (e.data?.type === 'claraline:highlight' && e.data.path) {
        const el = document.querySelector<HTMLElement>(`[data-edit="${e.data.path}"]`)
        if (el) flash(el)
      }
      // scroll to the first element of a section (prefix match)
      if (e.data?.type === 'claraline:scrollto' && e.data.prefix) {
        const prefix: string = e.data.prefix
        const el = Array.from(document.querySelectorAll<HTMLElement>('[data-edit]'))
          .find(n => (n.dataset.edit || '').startsWith(prefix))
        if (el) flash(el)
      }
    }

    document.addEventListener('mouseover', onOver, true)
    document.addEventListener('click', onClick, true)
    window.addEventListener('message', onMessage)

    // tell parent we're ready
    window.parent?.postMessage({ type: 'claraline:ready' }, '*')

    return () => {
      document.removeEventListener('mouseover', onOver, true)
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('message', onMessage)
      tag.remove()
    }
  }, [])

  return null
}
