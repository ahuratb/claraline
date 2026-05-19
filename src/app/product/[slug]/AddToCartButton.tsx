'use client'
import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { urlFor } from '@/lib/sanity'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AddToCartButton({ product }: { product: Product }) {
  const [selectedShade, setSelectedShade] = useState<string | undefined>(
    product.shades?.[0]?.name_en
  )
  const { addItem, openCart } = useCartStore()

  function handleAdd() {
    const imageUrl = product.images?.[0] ? urlFor(product.images[0]).width(400).url() : undefined
    addItem({
      productId: product._id,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: product.price,
      quantity: 1,
      image: imageUrl,
      shade: selectedShade,
    })
    toast.success(`${product.name_en} added to bag ✦`)
    openCart()
  }

  if (product.shades && product.shades.length > 0) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-[var(--muted)] text-[9px] tracking-[0.3em] uppercase mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Shade: <span className="text-[var(--champagne)]">{selectedShade}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.shades.map(s => (
              <button
                key={s.hex}
                onClick={() => setSelectedShade(s.name_en)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedShade === s.name_en ? 'border-[var(--champagne)] scale-110' : 'border-transparent hover:border-[var(--champagne)]'
                }`}
                style={{ backgroundColor: s.hex }}
                title={s.name_en}
              />
            ))}
          </div>
        </div>
        <AddButton price={formatPrice(product.price)} onAdd={handleAdd} inStock={product.inStock} />
      </div>
    )
  }

  return <AddButton price={formatPrice(product.price)} onAdd={handleAdd} inStock={product.inStock} />
}

function AddButton({ price, onAdd, inStock }: { price: string; onAdd: () => void; inStock: boolean }) {
  return (
    <button
      onClick={onAdd}
      disabled={!inStock}
      className="w-full py-5 bg-[var(--champagne)] text-[var(--obsidian)] text-[10px] tracking-[0.4em] uppercase font-semibold hover:bg-[var(--ivory)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      {inStock ? `Add to Bag · ${price}` : 'Out of Stock'}
    </button>
  )
}
