'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { signOut } from 'next-auth/react'
import type {
  SiteContent, VideoBlock, MarqueeItem, StatItem,
  FeatureCard, TestimonialItem, FooterLink, CategoryItem, SlideItem,
} from '@/lib/site-content'

/* ─────────────── reusable field components ─────────────── */

function Text({ label, value, onChange, ar, hint, placeholder }: {
  label: string; value?: string; onChange: (v: string) => void
  ar?: boolean; hint?: string; placeholder?: string
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        dir={ar ? 'rtl' : 'ltr'}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

function Area({ label, value, onChange, ar, hint }: {
  label: string; value?: string; onChange: (v: string) => void
  ar?: boolean; hint?: string
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea dir={ar ? 'rtl' : 'ltr'} value={value ?? ''} onChange={e => onChange(e.target.value)} />
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

function Num({ label, value, onChange, step = 0.05, placeholder }: {
  label: string; value?: number; onChange: (v: number | undefined) => void
  step?: number; placeholder?: string
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="number"
        step={step}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      />
    </div>
  )
}

/* ─────────────── image field — upload + preview ─────────────── */

function ImageField({ label, value, onChange, hint }: {
  label: string; value?: string; onChange: (url: string) => void; hint?: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setErr('That file is not an image'); return }
    setErr(''); setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }, [onChange])

  return (
    <div className="field">
      <label>{label}</label>
      <div
        className={`imgfield${drag ? ' drag' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files?.[0]) }}
      >
        {value
          // eslint-disable-next-line @next/next/no-img-element
          ? <img className="imgfield-thumb" src={value} alt="" />
          : <div className="imgfield-empty">Drag an image here<br />or use Upload</div>}
        <div className="imgfield-actions">
          <button className="btn btn-sm" type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          </button>
          {value && <button className="btn btn-sm btn-danger" type="button" onClick={() => onChange('')}>Clear</button>}
        </div>
        <input
          ref={inputRef} type="file" accept="image/*" hidden
          onChange={e => { upload(e.target.files?.[0]); e.target.value = '' }}
        />
      </div>
      <input
        className="imgfield-url"
        value={value ?? ''}
        placeholder="…or paste an image URL"
        onChange={e => onChange(e.target.value)}
      />
      {hint && <div className="hint">{hint}</div>}
      {err && <div className="hint" style={{ color: 'var(--a-danger)' }}>{err}</div>}
    </div>
  )
}

/* ─────────────── video block editor (hero + side videos) ─────────────── */

function VideoBlockEditor({ block, mutate, allowAddRemove }: {
  block: VideoBlock
  mutate: (fn: (b: VideoBlock) => void) => void
  allowAddRemove?: boolean
}) {
  return (
    <>
      <div className="card">
        <div className="card-head"><h3>Background media</h3></div>
        <div className="field">
          <label>Media type</label>
          <select
            className="select"
            value={block.mediaType === 'image' ? 'image' : 'video'}
            onChange={e => mutate(b => { b.mediaType = e.target.value === 'image' ? 'image' : 'video' })}
          >
            <option value="video">Video (scroll-synced)</option>
            <option value="image">Static image</option>
          </select>
        </div>

        {block.mediaType === 'image' ? (
          <>
            <ImageField label="Background image" value={block.image}
              onChange={v => mutate(b => { b.image = v })}
              hint="Shown instead of the video. Overlay text still appears on scroll." />
            <div className="field">
              <label>Backdrop</label>
              <select
                className="select"
                value={block.bg === 'light' ? 'light' : 'dark'}
                onChange={e => mutate(b => { b.bg = e.target.value === 'light' ? 'light' : 'dark' })}
              >
                <option value="dark">Dark (photo / video)</option>
                <option value="light">White (cut-out PNG, dark text)</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <Text label="Video URL" value={block.src} onChange={v => mutate(b => { b.src = v })} />
            <Num label="Max seconds" step={0.1} value={block.maxSeconds} onChange={v => mutate(b => { b.maxSeconds = v })} />
          </>
        )}

        <Text label="Scroll length" value={block.sectionHeight} placeholder="e.g. 500vh"
          hint="Taller = slower scroll. Leave blank for default." onChange={v => mutate(b => { b.sectionHeight = v || undefined })} />
      </div>

      {block.overlays.map((o, i) => (
        <div className="card" key={o.id}>
          <div className="card-head">
            <h3>Text Overlay {i + 1}</h3>
            {allowAddRemove && block.overlays.length > 1 && (
              <button className="btn btn-danger" onClick={() => mutate(b => { b.overlays.splice(i, 1) })}>Remove</button>
            )}
          </div>

          <div className="row2">
            <Text label="Eyebrow (EN)" value={o.eyebrow} onChange={v => mutate(b => { b.overlays[i].eyebrow = v })} />
            <Text label="Eyebrow (AR)" ar value={o.eyebrowAr} onChange={v => mutate(b => { b.overlays[i].eyebrowAr = v })} />
          </div>

          <Area label="Headline (EN)" value={o.headlineHtml}
            hint="HTML allowed — <em>word</em> for italic accent, <br/> for a line break."
            onChange={v => mutate(b => { b.overlays[i].headlineHtml = v })} />
          <Area label="Headline (AR)" ar value={o.headlineHtmlAr}
            onChange={v => mutate(b => { b.overlays[i].headlineHtmlAr = v })} />

          <div className="row2">
            <Text label="Subline (EN)" value={o.sublineEn} onChange={v => mutate(b => { b.overlays[i].sublineEn = v })} />
            <Text label="Subline (AR)" ar value={o.sublineAr} onChange={v => mutate(b => { b.overlays[i].sublineAr = v })} />
          </div>

          <div className="row3">
            <Num label="Appear at (0–1)" value={o.startPct} onChange={v => mutate(b => { b.overlays[i].startPct = v ?? 0 })} />
            <Num label="Disappear at (0–1)" value={o.endPct} onChange={v => mutate(b => { b.overlays[i].endPct = v ?? 1 })} />
            <Text label="Headline font size" value={o.headlineFontSize} placeholder="e.g. 44px"
              onChange={v => mutate(b => { b.overlays[i].headlineFontSize = v || undefined })} />
          </div>

          <div className="row3">
            <Text label="Button label (EN)" value={o.cta?.label}
              onChange={v => mutate(b => { b.overlays[i].cta = { ...(b.overlays[i].cta ?? {}), label: v } })} />
            <Text label="Button label (AR)" ar value={o.cta?.labelAr}
              onChange={v => mutate(b => { b.overlays[i].cta = { ...(b.overlays[i].cta ?? { label: '' }), labelAr: v } })} />
            <Text label="Button link" value={o.cta?.href} placeholder="/shop"
              onChange={v => mutate(b => { b.overlays[i].cta = { ...(b.overlays[i].cta ?? { label: '' }), href: v } })} />
          </div>
          <div className="hint" style={{ marginTop: 4 }}>Leave the button label empty to hide the button.</div>
        </div>
      ))}

      {allowAddRemove && (
        <button className="btn" onClick={() => mutate(b => {
          b.overlays.push({ id: 'o' + Date.now(), startPct: 0.1, endPct: 0.9, headlineHtml: 'New headline' })
        })}>+ Add text overlay</button>
      )}
    </>
  )
}

/* ─────────────── categories + slider editors ─────────────── */

function CategoriesEditor({ content, patch }: { content: SiteContent; patch: (fn: (d: SiteContent) => void) => void }) {
  return (
    <>
      <div className="card">
        <div className="card-head"><h3>Section heading</h3></div>
        <div className="row2">
          <Text label="Label (EN)" value={content.categoryLabelEn} onChange={v => patch(d => { d.categoryLabelEn = v })} />
          <Text label="Label (AR)" ar value={content.categoryLabelAr} onChange={v => patch(d => { d.categoryLabelAr = v })} />
        </div>
        <div className="row2">
          <Text label="Title (EN)" value={content.categoryTitleEn} hint="<em> allowed" onChange={v => patch(d => { d.categoryTitleEn = v })} />
          <Text label="Title (AR)" ar value={content.categoryTitleAr} onChange={v => patch(d => { d.categoryTitleAr = v })} />
        </div>
      </div>

      {content.categories.map((c, i) => (
        <div className="card" key={c.id}>
          <div className="card-head"><h3>Category {i + 1}</h3>
            <button className="btn btn-danger" onClick={() => patch(d => { d.categories.splice(i, 1) })}>Remove</button></div>
          <ImageField label="Image" value={c.image}
            onChange={v => patch(d => { d.categories[i].image = v })}
            hint="Square images look best (shown in a circle)." />
          <div className="row3">
            <Text label="Slug / id" value={c.id} hint="Used in the shop link" onChange={v => patch(d => { d.categories[i].id = v })} />
            <Text label="Name (EN)" value={c.nameEn} onChange={v => patch(d => { d.categories[i].nameEn = v })} />
            <Text label="Name (AR)" ar value={c.nameAr} onChange={v => patch(d => { d.categories[i].nameAr = v })} />
          </div>
        </div>
      ))}
      <button className="btn" onClick={() => patch(d => {
        d.categories.push({ id: 'cat-' + Date.now(), nameEn: 'New category', nameAr: '', image: '' })
      })}>+ Add category</button>
    </>
  )
}

function SliderEditor({ slides, patch }: { slides: SlideItem[]; patch: (fn: (d: SiteContent) => void) => void }) {
  return (
    <>
      {slides.map((s, i) => (
        <div className="card" key={s.id}>
          <div className="card-head"><h3>Slide {i + 1}</h3>
            <button className="btn btn-danger" onClick={() => patch(d => { d.slides.splice(i, 1) })}>Remove</button></div>
          <ImageField label="Model image" value={s.image}
            onChange={v => patch(d => { d.slides[i].image = v || undefined })}
            hint="Leave empty for a text-only slide." />
          <div className="row2">
            <Text label="Label (EN)" value={s.label} onChange={v => patch(d => { d.slides[i].label = v })} />
            <Text label="Label (AR)" ar value={s.labelAr} onChange={v => patch(d => { d.slides[i].labelAr = v })} />
          </div>
          <div className="row2">
            <Text label="Headline (EN)" value={s.headline} hint="<em> and <br/> allowed" onChange={v => patch(d => { d.slides[i].headline = v })} />
            <Text label="Headline (AR)" ar value={s.headlineAr} onChange={v => patch(d => { d.slides[i].headlineAr = v })} />
          </div>
          <div className="row2">
            <Text label="Sub (EN)" value={s.sub} onChange={v => patch(d => { d.slides[i].sub = v })} />
            <Text label="Sub (AR)" ar value={s.subAr} onChange={v => patch(d => { d.slides[i].subAr = v })} />
          </div>
          <div className="row3">
            <Text label="Button (EN)" value={s.cta} onChange={v => patch(d => { d.slides[i].cta = v })} />
            <Text label="Button (AR)" ar value={s.ctaAr} onChange={v => patch(d => { d.slides[i].ctaAr = v })} />
            <Text label="Button link" value={s.href} placeholder="/shop" onChange={v => patch(d => { d.slides[i].href = v })} />
          </div>
          <Text label="Background CSS" value={s.bg} hint="A CSS background value (gradients)." onChange={v => patch(d => { d.slides[i].bg = v })} />
        </div>
      ))}
      <button className="btn" onClick={() => patch(d => {
        d.slides.push({
          id: Date.now(), label: 'New slide', labelAr: '', headline: 'Headline', headlineAr: '',
          sub: '', subAr: '', cta: 'Shop Now', ctaAr: '', href: '/shop',
          bg: 'radial-gradient(ellipse at 40% 50%,#1a1008 0%,#080806 60%)',
        })
      })}>+ Add slide</button>
    </>
  )
}

/* ─────────────── tabs ─────────────── */

const TABS = [
  ['hero', 'Hero Banner'],
  ['side', 'Side Videos'],
  ['categories', 'Categories'],
  ['slider', 'Slider'],
  ['marquee', 'Scrolling Bars'],
  ['stats', 'Stats'],
  ['features', 'Features'],
  ['testimonials', 'Testimonials'],
  ['newsletter', 'Newsletter'],
  ['footer', 'Footer'],
] as const

type Tab = typeof TABS[number][0]

// Map a clicked content path (from the preview iframe) to the editor tab.
function tabForPath(path: string): Tab | null {
  const head = path.split('.')[0]
  if (head === 'hero') return 'hero'
  if (head === 'sideLeft' || head === 'sideRight') return 'side'
  if (head === 'categories' || head.startsWith('categoryLabel') || head.startsWith('categoryTitle')) return 'categories'
  if (head === 'slides') return 'slider'
  if (head === 'marqueeTop' || head === 'marqueeBottom') return 'marquee'
  if (head === 'stats') return 'stats'
  if (head === 'features') return 'features'
  if (head === 'testimonials') return 'testimonials'
  if (head === 'newsletter') return 'newsletter'
  if (head === 'footer') return 'footer'
  return null
}

// First content path of each section — used to scroll the preview to it.
const TAB_PREFIX: Record<Tab, string> = {
  hero: 'hero',
  side: 'sideLeft',
  categories: 'categor',
  slider: 'slides',
  marquee: 'marqueeTop',
  stats: 'stats',
  features: 'features',
  testimonials: 'testimonials',
  newsletter: 'newsletter',
  footer: 'footer',
}

const PAGES = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/cart', 'Cart'],
  ['/checkout', 'Checkout'],
  ['/account', 'Account'],
  ['/privacy', 'Privacy'],
  ['/terms', 'Terms'],
] as const

/* ─────────────── main component ─────────────── */

export default function AdminClient() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [tab, setTab] = useState<Tab>('hero')
  const [page, setPage] = useState<string>('/')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loadError, setLoadError] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pendingScroll = useRef<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load content')))
      .then(d => setContent(d.content))
      .catch(e => setLoadError(e.message))
  }, [])

  const postScroll = useCallback((prefix: string) => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'claraline:scrollto', prefix }, '*')
  }, [])

  // Listen for messages coming from the preview iframe.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // a content element was clicked inside the preview → open its tab
      if (e.data?.type === 'claraline:edit' && typeof e.data.path === 'string') {
        const t = tabForPath(e.data.path)
        if (t) setTab(t)
      }
      // preview (re)loaded → flush any queued scroll request
      if (e.data?.type === 'claraline:ready' && pendingScroll.current) {
        postScroll(pendingScroll.current)
        pendingScroll.current = null
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [postScroll])

  // Selecting a section: switch tab + scroll the preview to that section.
  // Sections live on the homepage, so jump the preview to "/" first if needed.
  const selectTab = useCallback((t: Tab) => {
    setTab(t)
    const prefix = TAB_PREFIX[t]
    if (page !== '/') {
      pendingScroll.current = prefix
      setPage('/')
    } else {
      pendingScroll.current = prefix   // in case the frame is still loading
      postScroll(prefix)
    }
  }, [page, postScroll])

  const patch = useCallback((fn: (d: SiteContent) => void) => {
    setStatus('idle')
    setContent(prev => {
      if (!prev) return prev
      const next: SiteContent = structuredClone(prev)
      fn(next)
      return next
    })
  }, [])

  const reloadPreview = useCallback(() => {
    const f = iframeRef.current
    if (f) f.src = `${page}${page.includes('?') ? '&' : '?'}preview=1&t=${Date.now()}`
  }, [page])

  async function save() {
    if (!content) return
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error()
      setStatus('saved')
      // show the freshly-saved content in the preview
      setTimeout(reloadPreview, 250)
    } catch {
      setStatus('error')
    }
  }

  if (loadError) {
    return <div className="admin-gate"><div><h2>Could not load content</h2><p>{loadError}</p></div></div>
  }
  if (!content) {
    return <div className="admin-root"><div className="admin-loading">Loading content…</div></div>
  }

  return (
    <div className="admin-root admin-split">
      {/* ── Live preview ── */}
      <section className="admin-preview">
        <div className="admin-preview-bar">
          <div className="page-switch">
            {PAGES.map(([href, label]) => (
              <button
                key={href}
                className={page === href ? 'active' : ''}
                onClick={() => setPage(href)}
              >{label}</button>
            ))}
          </div>
          <div className="admin-preview-tools">
            <button className="btn btn-sm" onClick={reloadPreview} title="Reload preview">↻</button>
            <a className="btn btn-sm" href={page} target="_blank" rel="noreferrer">Open ↗</a>
          </div>
        </div>
        <div className="admin-preview-frame">
          <iframe
            ref={iframeRef}
            key={page}
            src={`${page}${page.includes('?') ? '&' : '?'}preview=1`}
            title="Site preview"
          />
        </div>
        <div className="admin-preview-hint">Click any highlighted element to edit it →</div>
      </section>

      {/* ── Edit panel ── */}
      <aside className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <p className="admin-brand">Claraline</p>
            <p className="admin-brand-sub">Content Admin</p>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
        </div>

        <div className="admin-tabs">
          <select value={tab} onChange={e => selectTab(e.target.value as Tab)}>
            {TABS.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>

        <div className="admin-panel-body">
          {tab === 'hero' && (
            <>
              <div className="section-head"><h2>Hero Banner</h2><p>The full-screen scroll-synced video at the top.</p></div>
              <VideoBlockEditor block={content.hero} mutate={fn => patch(d => fn(d.hero))} allowAddRemove />
            </>
          )}

          {tab === 'side' && (
            <>
              <div className="section-head"><h2>Side Videos</h2><p>The two side-by-side scroll videos.</p></div>
              <div className="card-head" style={{ marginBottom: 12 }}><h3 className="tag">Left video</h3></div>
              <VideoBlockEditor block={content.sideLeft} mutate={fn => patch(d => fn(d.sideLeft))} allowAddRemove />
              <div className="card-head" style={{ margin: '28px 0 12px' }}><h3 className="tag">Right video</h3></div>
              <VideoBlockEditor block={content.sideRight} mutate={fn => patch(d => fn(d.sideRight))} allowAddRemove />
            </>
          )}

          {tab === 'categories' && (
            <>
              <div className="section-head"><h2>Categories</h2><p>The “Shop by Category” circles. Upload an image for each.</p></div>
              <CategoriesEditor content={content} patch={patch} />
            </>
          )}

          {tab === 'slider' && (
            <>
              <div className="section-head"><h2>Slider</h2><p>The full-screen rotating hero slider with model images.</p></div>
              <SliderEditor slides={content.slides} patch={patch} />
            </>
          )}

          {tab === 'marquee' && (
            <>
              <div className="section-head"><h2>Scrolling Bars</h2><p>The two horizontal scrolling text strips.</p></div>
              <MarqueeEditor title="Top bar" items={content.marqueeTop} mutate={fn => patch(d => fn(d.marqueeTop))} />
              <MarqueeEditor title="Bottom bar" items={content.marqueeBottom} mutate={fn => patch(d => fn(d.marqueeBottom))} />
            </>
          )}

          {tab === 'stats' && (
            <>
              <div className="section-head"><h2>Stats</h2><p>The four numbers strip.</p></div>
              {content.stats.map((s, i) => (
                <div className="card" key={i}>
                  <div className="card-head"><h3>Stat {i + 1}</h3>
                    <button className="btn btn-danger" onClick={() => patch(d => { d.stats.splice(i, 1) })}>Remove</button></div>
                  <div className="row3">
                    <Text label="Number" value={s.num} onChange={v => patch(d => { d.stats[i].num = v })} />
                    <Text label="Label (EN)" value={s.en} onChange={v => patch(d => { d.stats[i].en = v })} />
                    <Text label="Label (AR)" ar value={s.ar} onChange={v => patch(d => { d.stats[i].ar = v })} />
                  </div>
                </div>
              ))}
              <button className="btn" onClick={() => patch(d => { d.stats.push({ num: '0', en: 'New stat', ar: '' } as StatItem) })}>+ Add stat</button>
            </>
          )}

          {tab === 'features' && (
            <>
              <div className="section-head"><h2>Features</h2><p>The “Why Claraline” heading and cards.</p></div>
              <div className="card">
                <div className="card-head"><h3>Section heading</h3></div>
                <div className="row2">
                  <Text label="Label (EN)" value={content.features.labelEn} onChange={v => patch(d => { d.features.labelEn = v })} />
                  <Text label="Label (AR)" ar value={content.features.labelAr} onChange={v => patch(d => { d.features.labelAr = v })} />
                </div>
                <div className="row2">
                  <Text label="Title (EN)" value={content.features.titleEn} hint="<em> and <br/> allowed" onChange={v => patch(d => { d.features.titleEn = v })} />
                  <Text label="Title (AR)" ar value={content.features.titleAr} onChange={v => patch(d => { d.features.titleAr = v })} />
                </div>
              </div>
              {content.features.cards.map((c, i) => (
                <div className="card" key={i}>
                  <div className="card-head"><h3>Card {i + 1}</h3>
                    <button className="btn btn-danger" onClick={() => patch(d => { d.features.cards.splice(i, 1) })}>Remove</button></div>
                  <div className="row3">
                    <Text label="Icon" value={c.icon} hint="A symbol e.g. ✦ ◈ ◇" onChange={v => patch(d => { d.features.cards[i].icon = v })} />
                    <Text label="Title (EN)" value={c.en} onChange={v => patch(d => { d.features.cards[i].en = v })} />
                    <Text label="Title (AR)" ar value={c.ar} onChange={v => patch(d => { d.features.cards[i].ar = v })} />
                  </div>
                  <div className="row2">
                    <Area label="Body (EN)" value={c.bodyEn} onChange={v => patch(d => { d.features.cards[i].bodyEn = v })} />
                    <Area label="Body (AR)" ar value={c.bodyAr} onChange={v => patch(d => { d.features.cards[i].bodyAr = v })} />
                  </div>
                </div>
              ))}
              <button className="btn" onClick={() => patch(d => { d.features.cards.push({ icon: '✦', en: 'New feature', ar: '', bodyEn: '', bodyAr: '' } as FeatureCard) })}>+ Add feature card</button>
            </>
          )}

          {tab === 'testimonials' && (
            <>
              <div className="section-head"><h2>Testimonials</h2><p>Customer reviews on the homepage.</p></div>
              <div className="card">
                <div className="card-head"><h3>Section heading</h3></div>
                <div className="row2">
                  <Text label="Label (EN)" value={content.testimonials.labelEn} onChange={v => patch(d => { d.testimonials.labelEn = v })} />
                  <Text label="Label (AR)" ar value={content.testimonials.labelAr} onChange={v => patch(d => { d.testimonials.labelAr = v })} />
                </div>
                <div className="row2">
                  <Text label="Title (EN)" value={content.testimonials.titleEn} hint="<em> allowed" onChange={v => patch(d => { d.testimonials.titleEn = v })} />
                  <Text label="Title (AR)" ar value={content.testimonials.titleAr} onChange={v => patch(d => { d.testimonials.titleAr = v })} />
                </div>
              </div>
              {content.testimonials.items.map((t, i) => (
                <div className="card" key={i}>
                  <div className="card-head"><h3>Review {i + 1}</h3>
                    <button className="btn btn-danger" onClick={() => patch(d => { d.testimonials.items.splice(i, 1) })}>Remove</button></div>
                  <div className="row2">
                    <Area label="Quote (EN)" value={t.en} onChange={v => patch(d => { d.testimonials.items[i].en = v })} />
                    <Area label="Quote (AR)" ar value={t.ar} onChange={v => patch(d => { d.testimonials.items[i].ar = v })} />
                  </div>
                  <div className="row3">
                    <Text label="Avatar initials" value={t.initials} onChange={v => patch(d => { d.testimonials.items[i].initials = v })} />
                    <Text label="Name" value={t.name} onChange={v => patch(d => { d.testimonials.items[i].name = v })} />
                    <Text label="Location" value={t.loc} onChange={v => patch(d => { d.testimonials.items[i].loc = v })} />
                  </div>
                </div>
              ))}
              <button className="btn" onClick={() => patch(d => { d.testimonials.items.push({ en: '', ar: '', initials: '', name: '', loc: '' } as TestimonialItem) })}>+ Add review</button>
            </>
          )}

          {tab === 'newsletter' && (
            <>
              <div className="section-head"><h2>Newsletter</h2><p>The email sign-up block near the footer.</p></div>
              <div className="card">
                <div className="row2">
                  <Text label="Label (EN)" value={content.newsletter.labelEn} onChange={v => patch(d => { d.newsletter.labelEn = v })} />
                  <Text label="Label (AR)" ar value={content.newsletter.labelAr} onChange={v => patch(d => { d.newsletter.labelAr = v })} />
                </div>
                <div className="row2">
                  <Text label="Title (EN)" value={content.newsletter.titleEn} hint="<em> allowed" onChange={v => patch(d => { d.newsletter.titleEn = v })} />
                  <Text label="Title (AR)" ar value={content.newsletter.titleAr} onChange={v => patch(d => { d.newsletter.titleAr = v })} />
                </div>
                <div className="row2">
                  <Area label="Subtext (EN)" value={content.newsletter.subEn} onChange={v => patch(d => { d.newsletter.subEn = v })} />
                  <Area label="Subtext (AR)" ar value={content.newsletter.subAr} onChange={v => patch(d => { d.newsletter.subAr = v })} />
                </div>
                <ImageField label="Side banner image" value={content.newsletter.image}
                  onChange={v => patch(d => { d.newsletter.image = v || undefined })}
                  hint="Fills the right half of the newsletter block. Leave empty to center the form." />
              </div>
            </>
          )}

          {tab === 'footer' && (
            <>
              <div className="section-head"><h2>Footer</h2><p>Tagline, link columns and copyright.</p></div>
              <div className="card">
                <div className="card-head"><h3>Tagline</h3></div>
                <div className="row2">
                  <Text label="Tagline (EN)" value={content.footer.tagEn} onChange={v => patch(d => { d.footer.tagEn = v })} />
                  <Text label="Tagline (AR)" ar value={content.footer.tagAr} onChange={v => patch(d => { d.footer.tagAr = v })} />
                </div>
              </div>

              <FooterColumn
                title="Shop column" titleEn={content.footer.shopTitleEn} titleAr={content.footer.shopTitleAr}
                links={content.footer.shopLinks}
                onTitle={(en, ar) => patch(d => { if (en !== undefined) d.footer.shopTitleEn = en; if (ar !== undefined) d.footer.shopTitleAr = ar })}
                mutate={fn => patch(d => fn(d.footer.shopLinks))} />

              <FooterColumn
                title="Contact column" titleEn={content.footer.contactTitleEn} titleAr={content.footer.contactTitleAr}
                links={content.footer.contactLinks}
                onTitle={(en, ar) => patch(d => { if (en !== undefined) d.footer.contactTitleEn = en; if (ar !== undefined) d.footer.contactTitleAr = ar })}
                mutate={fn => patch(d => fn(d.footer.contactLinks))} />

              <FooterColumn
                title="Info column" titleEn={content.footer.infoTitleEn} titleAr={content.footer.infoTitleAr}
                links={content.footer.infoLinks}
                onTitle={(en, ar) => patch(d => { if (en !== undefined) d.footer.infoTitleEn = en; if (ar !== undefined) d.footer.infoTitleAr = ar })}
                mutate={fn => patch(d => fn(d.footer.infoLinks))} />

              <div className="card">
                <div className="card-head"><h3>Copyright</h3></div>
                <div className="row2">
                  <Text label="Copyright (EN)" value={content.footer.copyrightEn} onChange={v => patch(d => { d.footer.copyrightEn = v })} />
                  <Text label="Copyright (AR)" ar value={content.footer.copyrightAr} onChange={v => patch(d => { d.footer.copyrightAr = v })} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Save bar */}
        <div className="savebar">
          <span className={`status ${status === 'saved' ? 'ok' : status === 'error' ? 'err' : ''}`}>
            {status === 'saving' && 'Saving…'}
            {status === 'saved' && '✓ Saved — live on the site'}
            {status === 'error' && '✗ Save failed — try again'}
            {status === 'idle' && 'Unsaved changes'}
          </span>
          <button className="btn btn-primary" onClick={save} disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </aside>
    </div>
  )
}

/* ─────────────── marquee + footer column editors ─────────────── */

function MarqueeEditor({ title, items, mutate }: {
  title: string; items: MarqueeItem[]; mutate: (fn: (a: MarqueeItem[]) => void) => void
}) {
  return (
    <div className="card">
      <div className="card-head"><h3>{title}</h3>
        <button className="btn btn-sm" onClick={() => mutate(a => { a.push({ en: '', ar: '' }) })}>+ Add</button></div>
      {items.map((m, i) => (
        <div className="row2" key={i} style={{ alignItems: 'end', marginBottom: 10 }}>
          <Text label={`Item ${i + 1} (EN)`} value={m.en} onChange={v => mutate(a => { a[i].en = v })} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <Text label="(AR)" ar value={m.ar} onChange={v => mutate(a => { a[i].ar = v })} />
            </div>
            <button className="btn btn-danger" onClick={() => mutate(a => { a.splice(i, 1) })}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function FooterColumn({ title, titleEn, titleAr, links, onTitle, mutate }: {
  title: string; titleEn: string; titleAr: string; links: FooterLink[]
  onTitle: (en?: string, ar?: string) => void
  mutate: (fn: (a: FooterLink[]) => void) => void
}) {
  return (
    <div className="card">
      <div className="card-head"><h3>{title}</h3>
        <button className="btn btn-sm" onClick={() => mutate(a => { a.push({ en: '', ar: '' }) })}>+ Add link</button></div>
      <div className="row2">
        <Text label="Column title (EN)" value={titleEn} onChange={v => onTitle(v, undefined)} />
        <Text label="Column title (AR)" ar value={titleAr} onChange={v => onTitle(undefined, v)} />
      </div>
      {links.map((l, i) => (
        <div className="row2" key={i} style={{ alignItems: 'end', marginBottom: 10 }}>
          <Text label={`Link ${i + 1} (EN)`} value={l.en} onChange={v => mutate(a => { a[i].en = v })} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <Text label="(AR)" ar value={l.ar} onChange={v => mutate(a => { a[i].ar = v })} />
            </div>
            <button className="btn btn-danger" onClick={() => mutate(a => { a.splice(i, 1) })}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
