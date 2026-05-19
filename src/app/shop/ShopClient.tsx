'use client'
import { useState, useMemo } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

type Filter = 'all' | 'lip' | 'eye' | 'face' | 'gift'
type Sort = 'featured' | 'price-asc' | 'price-desc' | 'new'

const FILTERS: { value: Filter; label: string; labelAr: string }[] = [
  { value: 'all',  label: 'All',      labelAr: 'الكل' },
  { value: 'lip',  label: 'Lip',      labelAr: 'الشفاه' },
  { value: 'eye',  label: 'Eye',      labelAr: 'العيون' },
  { value: 'face', label: 'Face',     labelAr: 'الوجه' },
  { value: 'gift', label: 'Gift Sets', labelAr: 'هدايا' },
]

export default function ShopClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('featured')

  const displayed = useMemo(() => {
    let list = filter === 'all' ? products : products.filter(p => p.collection === filter)
    switch (sort) {
      case 'price-asc':  list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'new':        list = [...list].sort((a, b) => (b._id > a._id ? 1 : -1)); break
      default:           list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return list
  }, [products, filter, sort])

  return (
    <div className="min-h-screen bg-[var(--obsidian)] pt-32 pb-20">
      {/* Header */}
      <div className="px-14 mb-12">
        <p className="text-[var(--champagne)] text-[9px] tracking-[0.5em] uppercase mb-2 opacity-70" style={{ fontFamily: 'Cairo, sans-serif' }}>
          All Products
        </p>
        <h1 className="text-[var(--ivory)] text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          The <em className="text-[var(--champagne)]">Collection</em>
        </h1>
      </div>

      {/* Filter + Sort bar */}
      <div className="px-14 mb-10 flex flex-wrap justify-between items-center gap-4 border-b border-[rgba(201,169,110,0.1)] pb-6">
        {/* Filters */}
        <div className="flex gap-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 text-[9px] tracking-[0.25em] uppercase transition-all ${
                filter === f.value
                  ? 'bg-[var(--champagne)] text-[var(--obsidian)]'
                  : 'text-[var(--muted)] border border-[rgba(201,169,110,0.2)] hover:border-[var(--champagne)] hover:text-[var(--champagne)]'
              }`}
            >
              {f.label}
              <span className="ml-1 opacity-60 normal-case">{f.labelAr}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as Sort)}
          className="bg-[var(--deep)] border border-[rgba(201,169,110,0.2)] text-[var(--muted)] px-4 py-2 text-[10px] tracking-widest focus:outline-none focus:border-[var(--champagne)] cursor-pointer"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="new">Newest</option>
        </select>
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div className="px-14 py-24 text-center">
          <p className="text-[var(--muted)] text-lg italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>No products found</p>
          <p className="text-[var(--muted)] text-sm mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Connect Sanity to add products</p>
        </div>
      ) : (
        <div className="px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {displayed.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
