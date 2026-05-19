'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { urlFor } from '@/lib/sanity'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  index?: number
}

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-[var(--rose)] text-white',
  bestseller: 'bg-[var(--champagne)] text-[var(--obsidian)]',
  limited: 'bg-[var(--deep)] text-[var(--champagne)] border border-[rgba(201,169,110,0.4)]',
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('revealed') },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(480).height(640).url()
    : null

  function handleAddToCart() {
    addItem({
      productId: product._id,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: product.price,
      quantity: 1,
      image: imageUrl ?? undefined,
    })
    toast.success(`${product.name_en} added ✦`)
    openCart()
  }

  return (
    <div
      ref={cardRef}
      className="reveal-target flex-shrink-0 w-[280px] group"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--deep)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name_en}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="280px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[var(--champagne)] text-4xl opacity-20">✦</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[8px] tracking-[0.25em] uppercase px-2 py-1 ${BADGE_STYLES[product.badge] ?? ''}`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {product.badge === 'bestseller' ? 'Best Seller' : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
          </span>
        )}

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 bg-[rgba(10,8,6,0.92)] border-t border-[rgba(201,169,110,0.2)]">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 text-[9px] tracking-[0.3em] uppercase text-[var(--champagne)] hover:text-[var(--ivory)] transition-colors"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 space-y-1">
        <Link href={`/product/${product.slug.current}`} className="no-underline">
          <h3 className="text-[var(--ivory)] text-lg font-light leading-tight hover:text-[var(--champagne)] transition-colors" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {product.name_en}
          </h3>
        </Link>
        <p className="text-[var(--muted)] text-[11px]" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
          {product.name_ar}
        </p>
        <p className="text-[var(--champagne)] text-sm tracking-wider pt-1">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}
