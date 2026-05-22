'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { formatPrice } from '@/lib/utils'

type Collection  = 'all' | 'lip' | 'eye' | 'face' | 'gift'
type BadgeFilter = 'new' | 'bestseller' | 'limited'
type Sort        = 'featured' | 'price-asc' | 'price-desc' | 'new'

interface Filters {
  collection:  Collection
  badges:      BadgeFilter[]
  maxPrice:    number
  shadesOnly:  boolean
  inStockOnly: boolean
}

const COLLECTIONS: { value: Collection; label: string; labelAr: string }[] = [
  { value: 'all',  label: 'All Products', labelAr: 'الكل'      },
  { value: 'lip',  label: 'Lip',           labelAr: 'الشفاه'    },
  { value: 'eye',  label: 'Eye',           labelAr: 'العيون'    },
  { value: 'face', label: 'Face',          labelAr: 'الوجه'     },
  { value: 'gift', label: 'Gift Sets',     labelAr: 'هدايا'     },
]

const BADGE_LABELS: Record<BadgeFilter, string> = {
  new:        'New Arrivals',
  bestseller: 'Best Sellers',
  limited:    'Limited Edition',
}

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'featured',   label: 'Featured'          },
  { value: 'price-asc',  label: 'Price · Low to High' },
  { value: 'price-desc', label: 'Price · High to Low' },
  { value: 'new',        label: 'Newest First'        },
]

// ── styled atoms ──────────────────────────────────────────────────────────────
const LABEL_STYLE: React.CSSProperties = {
  fontSize:      '9px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color:         'var(--champagne)',
  fontFamily:    'Cairo, sans-serif',
  fontWeight:    300,
}

export default function ShopClient({ products }: { products: Product[] }) {
  const priceMax = useMemo(() => {
    const m = Math.max(...products.map(p => p.price), 50)
    return Math.ceil(m / 10) * 10
  }, [products])

  const [filters, setFilters] = useState<Filters>({
    collection: 'all', badges: [], maxPrice: priceMax, shadesOnly: false, inStockOnly: false,
  })
  const [sort,       setSort]       = useState<Sort>('featured')
  const [search,     setSearch]     = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [gridKey,    setGridKey]    = useState(0)
  const prevKey = useRef('')

  // Keep maxPrice in sync with actual product range
  useEffect(() => { setFilters(f => ({ ...f, maxPrice: priceMax })) }, [priceMax])

  // Re-trigger card reveals on discrete filter changes (not on price slider drag)
  const discreteKey = `${filters.collection}|${filters.badges.join(',')}|${sort}|${search.trim()}|${filters.shadesOnly}|${filters.inStockOnly}`
  useEffect(() => {
    if (prevKey.current && prevKey.current !== discreteKey) setGridKey(k => k + 1)
    prevKey.current = discreteKey
  }, [discreteKey])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length }
    products.forEach(p => { c[p.collection] = (c[p.collection] || 0) + 1 })
    return c
  }, [products])

  const displayed = useMemo(() => {
    let list = [...products]
    if (filters.collection !== 'all') list = list.filter(p => p.collection === filters.collection)
    if (filters.badges.length > 0)    list = list.filter(p => p.badge && (filters.badges as string[]).includes(p.badge))
    if (filters.shadesOnly)           list = list.filter(p => p.shades && p.shades.length > 0)
    if (filters.inStockOnly)          list = list.filter(p => p.inStock)
    list = list.filter(p => p.price <= filters.maxPrice)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name_en.toLowerCase().includes(q) ||
        p.name_ar.includes(q) ||
        (p.description_en?.toLowerCase().includes(q) ?? false),
      )
    }
    switch (sort) {
      case 'price-asc':  return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'new':        return [...list].sort((a, b) => (b._id > a._id ? 1 : -1))
      default:           return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }, [products, filters, sort, search])

  const activeCount =
    (filters.collection !== 'all' ? 1 : 0) +
    filters.badges.length +
    (filters.shadesOnly  ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < priceMax ? 1 : 0) +
    (search.trim() ? 1 : 0)

  function resetFilters() {
    setFilters({ collection: 'all', badges: [], maxPrice: priceMax, shadesOnly: false, inStockOnly: false })
    setSearch('')
  }

  function toggleBadge(b: BadgeFilter) {
    setFilters(f => ({
      ...f,
      badges: f.badges.includes(b) ? f.badges.filter(x => x !== b) : [...f.badges, b],
    }))
  }

  // ── Sidebar (used by desktop + mobile drawer) ─────────────────────────────
  const Sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

      {/* Collections */}
      <div>
        <p style={{ ...LABEL_STYLE, marginBottom: '18px' }}>Categories</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {COLLECTIONS.map(c => {
            const active = filters.collection === c.value
            return (
              <button
                key={c.value}
                onClick={() => setFilters(f => ({ ...f, collection: c.value }))}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  padding:        '10px 0',
                  background:     'transparent',
                  border:         'none',
                  borderBottom:   '0.5px solid rgba(201,169,110,0.06)',
                  cursor:         'pointer',
                  transition:     'color 0.3s',
                }}
              >
                <span style={{
                  fontSize:    active ? '14px' : '13px',
                  fontFamily:  "'Cormorant Garamond', serif",
                  fontWeight:  300,
                  color:       active ? 'var(--champagne)' : 'var(--ivory)',
                  letterSpacing: '0.02em',
                  transition:  'all 0.3s',
                }}>
                  {c.label}
                </span>
                <span style={{
                  fontSize:    '10px',
                  color:       active ? 'var(--champagne)' : 'rgba(154,138,122,0.5)',
                  fontFamily:  'Cairo, sans-serif',
                  letterSpacing: '0.05em',
                }}>
                  {String(counts[c.value] ?? 0).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p style={{ ...LABEL_STYLE, marginBottom: '18px' }}>Tags</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(Object.entries(BADGE_LABELS) as [BadgeFilter, string][]).map(([value, label]) => {
            const on = filters.badges.includes(value)
            return (
              <label
                key={value}
                onClick={() => toggleBadge(value)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
              >
                <span
                  style={{
                    width: '12px', height: '12px',
                    flexShrink: 0,
                    border: `0.5px solid ${on ? 'var(--champagne)' : 'rgba(201,169,110,0.3)'}`,
                    background: on ? 'var(--champagne)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s',
                  }}
                >
                  {on && (
                    <span style={{ color: 'var(--obsidian)', fontSize: '8px', lineHeight: 1, fontWeight: 700 }}>✓</span>
                  )}
                </span>
                <span style={{
                  fontSize:    '11px',
                  letterSpacing: '0.08em',
                  color:       on ? 'var(--champagne)' : 'var(--muted)',
                  fontFamily:  'Cairo, sans-serif',
                  transition:  'color 0.3s',
                }}>
                  {label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <p style={{ ...LABEL_STYLE, marginBottom: '18px' }}>Price Range</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'Cairo, sans-serif', letterSpacing: '0.1em' }}>
            KD 0.000
          </span>
          <span style={{
            fontSize:    '10px',
            color:       filters.maxPrice < priceMax ? 'var(--champagne)' : 'var(--muted)',
            fontFamily:  'Cairo, sans-serif',
            letterSpacing: '0.1em',
            transition:  'color 0.3s',
          }}>
            {formatPrice(filters.maxPrice)}
          </span>
        </div>
        <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '1px',
            background: 'rgba(201,169,110,0.15)',
          }} />
          <div style={{
            position: 'absolute', left: 0,
            width: `${(filters.maxPrice / priceMax) * 100}%`,
            height: '1px', background: 'var(--champagne)',
            transition: 'width 0.15s ease',
          }} />
          <input
            type="range"
            min={0}
            max={priceMax}
            step={1}
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
            style={{
              width: '100%', appearance: 'none', background: 'transparent',
              accentColor: 'var(--champagne)', cursor: 'pointer', height: '20px',
              margin: 0, position: 'relative', zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* Extras */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {([
          { key: 'shadesOnly'  as const, label: 'Has Color Shades' },
          { key: 'inStockOnly' as const, label: 'In Stock Only'    },
        ] as const).map(({ key, label }) => {
          const on = filters[key]
          return (
            <label
              key={key}
              onClick={() => setFilters(f => ({ ...f, [key]: !f[key] }))}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
            >
              <span style={{
                width: '12px', height: '12px',
                flexShrink: 0,
                border: `0.5px solid ${on ? 'var(--champagne)' : 'rgba(201,169,110,0.3)'}`,
                background: on ? 'var(--champagne)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s',
              }}>
                {on && <span style={{ color: 'var(--obsidian)', fontSize: '8px', lineHeight: 1, fontWeight: 700 }}>✓</span>}
              </span>
              <span style={{
                fontSize:    '11px',
                letterSpacing: '0.08em',
                color:       on ? 'var(--champagne)' : 'var(--muted)',
                fontFamily:  'Cairo, sans-serif',
                transition:  'color 0.3s',
              }}>
                {label}
              </span>
            </label>
          )
        })}
      </div>

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={resetFilters}
          style={{
            padding:       '12px 0',
            background:    'transparent',
            border:        '0.5px solid rgba(201,169,110,0.25)',
            color:         'var(--champagne)',
            fontSize:      '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontFamily:    'Cairo, sans-serif',
            cursor:        'pointer',
            transition:    'background 0.3s, border-color 0.3s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--champagne)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.25)' }}
        >
          Clear All · {activeCount}
        </button>
      )}
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--obsidian)', minHeight: '100vh', position: 'relative' }}>

      {/* ════ Header ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '160px 56px 0', position: 'relative' }}>
        <span
          style={{
            fontSize:    '9px',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color:       'var(--champagne)',
            fontFamily:  'Cairo, sans-serif',
            fontWeight:  300,
            marginBottom: '18px',
            display:     'block',
          }}
        >
          Kuwait Luxury Beauty · Est. 2024
        </span>
        <h1
          style={{
            fontSize:    'clamp(40px, 6vw, 64px)',
            fontWeight:  300,
            lineHeight:  1.05,
            color:       'var(--ivory)',
            fontFamily:  "'Cormorant Garamond', serif",
            letterSpacing: '-0.01em',
          }}
        >
          The <em style={{ color: 'var(--champagne)' }}>Collection</em>
        </h1>
        <p
          style={{
            fontSize:    '13px',
            color:       'var(--muted)',
            fontFamily:  "'Amiri', 'Cairo', serif",
            direction:   'rtl',
            marginTop:   '14px',
            maxWidth:    '280px',
            lineHeight:  1.9,
          }}
        >
          المجموعة الكاملة — جمالٌ يُروى بكلِّ تفصيل
        </p>
      </section>

      <div style={{ marginTop: '60px' }} className="sep" />

      {/* ════ Search bar ════════════════════════════════════════════════════ */}
      <section style={{ padding: '40px 56px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '640px' }}>
          <span style={{
            position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--champagne)', opacity: 0.5, pointerEvents: 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, ingredient, finish…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width:         '100%',
              padding:       '16px 50px 16px 52px',
              background:    'transparent',
              border:        '0.5px solid rgba(201,169,110,0.22)',
              color:         'var(--ivory)',
              fontFamily:    'Cairo, sans-serif',
              fontSize:      '12px',
              letterSpacing: '0.1em',
              outline:       'none',
              transition:    'border-color 0.3s, background 0.3s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--champagne)'; e.target.style.background = 'rgba(201,169,110,0.03)' }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(201,169,110,0.22)'; e.target.style.background = 'transparent' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                padding: '4px', transition: 'color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--champagne)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      <div className="sep" />

      {/* ════ Body — sidebar + grid ════════════════════════════════════════ */}
      <section style={{ padding: '48px 56px 120px', display: 'flex', gap: '48px', alignItems: 'flex-start', position: 'relative' }}>

        {/* Desktop sidebar */}
        <aside
          className="shop-sidebar"
          style={{
            width:      '240px',
            flexShrink: 0,
            position:   'sticky',
            top:        '120px',
            alignSelf:  'flex-start',
          }}
        >
          {Sidebar}
        </aside>

        {/* Main area */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Top bar */}
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              gap:            '16px',
              flexWrap:       'wrap',
              paddingBottom:  '20px',
              marginBottom:   '24px',
              borderBottom:   '0.5px solid rgba(201,169,110,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Mobile filter button */}
              <button
                className="shop-mobile-filter"
                onClick={() => setDrawerOpen(true)}
                style={{
                  display:      'none',
                  alignItems:   'center',
                  gap:          '8px',
                  padding:      '8px 14px',
                  background:   'transparent',
                  border:       '0.5px solid rgba(201,169,110,0.3)',
                  color:        'var(--muted)',
                  fontFamily:   'Cairo, sans-serif',
                  fontSize:     '9px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  cursor:       'pointer',
                  position:     'relative',
                }}
              >
                <svg width="11" height="9" viewBox="0 0 12 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M0 1h12M2.5 4.5h7M5 8h2" />
                </svg>
                Filter
                {activeCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: 'var(--champagne)', color: 'var(--obsidian)',
                    fontSize: '8px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {activeCount}
                  </span>
                )}
              </button>

              <p style={{
                fontSize:    '11px',
                color:       'var(--muted)',
                fontFamily:  'Cairo, sans-serif',
                letterSpacing: '0.1em',
              }}>
                <span style={{ color: 'var(--champagne)', fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', marginRight: '4px' }}>
                  {displayed.length}
                </span>
                product{displayed.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value as Sort)}
              style={{
                padding:       '8px 16px',
                background:    'transparent',
                border:        '0.5px solid rgba(201,169,110,0.22)',
                color:         'var(--muted)',
                fontFamily:    'Cairo, sans-serif',
                fontSize:      '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                outline:       'none',
                cursor:        'pointer',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: 'var(--deep)' }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {filters.collection !== 'all' && (
                <Chip label={COLLECTIONS.find(c => c.value === filters.collection)?.label ?? ''} onRemove={() => setFilters(f => ({ ...f, collection: 'all' }))} />
              )}
              {filters.badges.map(b => (
                <Chip key={b} label={BADGE_LABELS[b]} onRemove={() => toggleBadge(b)} />
              ))}
              {filters.shadesOnly  && <Chip label="Has Shades"  onRemove={() => setFilters(f => ({ ...f, shadesOnly: false }))}  />}
              {filters.inStockOnly && <Chip label="In Stock"    onRemove={() => setFilters(f => ({ ...f, inStockOnly: false }))} />}
              {filters.maxPrice < priceMax && (
                <Chip label={`≤ ${formatPrice(filters.maxPrice)}`} onRemove={() => setFilters(f => ({ ...f, maxPrice: priceMax }))} />
              )}
              {search.trim() && <Chip label={`"${search.trim()}"`} onRemove={() => setSearch('')} />}
            </div>
          )}

          {/* Grid */}
          {displayed.length === 0 ? (
            <div style={{ padding: '120px 0', textAlign: 'center' }}>
              <p style={{
                fontSize:    '44px',
                fontWeight:  300,
                color:       'rgba(250,245,238,0.12)',
                fontFamily:  "'Cormorant Garamond', serif",
                marginBottom: '12px',
              }}>
                Nothing here
              </p>
              <p style={{
                fontSize:    '11px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color:       'var(--muted)',
                fontFamily:  'Cairo, sans-serif',
                marginBottom: '36px',
              }}>
                لم يتم العثور على منتجات
              </p>
              <button
                onClick={resetFilters}
                style={{
                  background:    'transparent',
                  border:        'none',
                  borderBottom:  '0.5px solid rgba(201,169,110,0.4)',
                  color:         'var(--champagne)',
                  fontSize:      '10px',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  fontFamily:    'Cairo, sans-serif',
                  cursor:        'pointer',
                  paddingBottom: '3px',
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              key={gridKey}
              className="shop-grid"
            >
              {displayed.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ Mobile drawer ═══════════════════════════════════════════════ */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            onTouchEnd={(e) => { e.preventDefault(); setDrawerOpen(false) }}
            style={{
              position: 'fixed', inset: 0, zIndex: 480,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
              cursor: 'pointer',
            }}
          />
          <div
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 481,
              width: 'min(320px, 86vw)', overflow: 'auto',
              background: 'var(--deep)',
              borderRight: '0.5px solid rgba(201,169,110,0.15)',
              padding: '32px 24px',
              boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <span style={{ ...LABEL_STYLE }}>Filter Products</span>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {Sidebar}
          </div>
        </>
      )}

      {/* ════ Scoped grid + responsive rules ═══════════════════════════════ */}
      <style jsx>{`
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
          .shop-sidebar { display: none; }
          .shop-mobile-filter { display: inline-flex !important; }
          section { padding-left: 32px !important; padding-right: 32px !important; }
        }
        @media (max-width: 640px) {
          .shop-grid { grid-template-columns: 1fr; gap: 28px; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  )
}

// ── Chip helper ──────────────────────────────────────────────────────────────
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           '8px',
        padding:       '6px 12px',
        background:    'rgba(201,169,110,0.04)',
        border:        '0.5px solid rgba(201,169,110,0.22)',
        color:         'var(--champagne)',
        fontFamily:    'Cairo, sans-serif',
        fontSize:      '10px',
        letterSpacing: '0.12em',
        cursor:        'pointer',
        transition:    'border-color 0.3s, background 0.3s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--champagne)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.22)' }}
    >
      {label}
      <span style={{ fontSize: '13px', lineHeight: 1, color: 'rgba(201,169,110,0.5)' }}>×</span>
    </button>
  )
}
