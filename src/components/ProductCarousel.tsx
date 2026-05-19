'use client'
import { useRef, useState } from 'react'
import { Product } from '@/types'
import ProductCard from './ProductCard'

interface ProductCarouselProps {
  products: Product[]
  label?: string
  title: string
  titleItalic?: string
  labelAr?: string
}

const CARD_W = 280 + 24  // card width + gap

export default function ProductCarousel({ products, label, title, titleItalic, labelAr }: ProductCarouselProps) {
  const [offset, setOffset] = useState(0)
  const maxOffset = Math.max(0, (products.length - 3) * CARD_W)

  function slide(dir: -1 | 1) {
    setOffset(prev => Math.max(0, Math.min(maxOffset, prev + dir * CARD_W)))
  }

  return (
    <section className="py-24 px-14 overflow-hidden bg-[var(--obsidian)]">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          {label && (
            <p className="text-[var(--champagne)] text-[9px] tracking-[0.5em] uppercase mb-3 opacity-70" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {label}
            </p>
          )}
          <h2 className="text-[var(--ivory)] text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {titleItalic && <em className="text-[var(--champagne)]">{titleItalic} </em>}
            {title}
          </h2>
          {labelAr && (
            <p className="text-[var(--muted)] text-sm mt-1" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
              {labelAr}
            </p>
          )}
        </div>

        {/* Arrows */}
        <div className="flex gap-3">
          <button
            onClick={() => slide(-1)}
            disabled={offset === 0}
            className="w-10 h-10 border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[var(--champagne)] hover:border-[var(--champagne)] hover:bg-[rgba(201,169,110,0.08)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ←
          </button>
          <button
            onClick={() => slide(1)}
            disabled={offset >= maxOffset}
            className="w-10 h-10 border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[var(--champagne)] hover:border-[var(--champagne)] hover:bg-[rgba(201,169,110,0.08)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            →
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6"
          style={{ transform: `translateX(-${offset}px)`, transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        >
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
