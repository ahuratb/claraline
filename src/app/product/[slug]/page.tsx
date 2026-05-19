import { getProductBySlug, getAllProductSlugs, getProductsByCollection, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductCarousel from '@/components/ProductCarousel'
import AddToCartButton from './AddToCartButton'
import { formatPrice } from '@/lib/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs().catch(() => [])
  return slugs.map(s => ({ slug: s.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
  if (!product) return {}
  return {
    title: `${product.name_en} — claraline`,
    description: product.description_en,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
  if (!product) notFound()

  const related = await getProductsByCollection(product.collection).catch(() => [])
  const relatedFiltered = related.filter(p => p._id !== product._id).slice(0, 6)

  const images = product.images ?? []
  const mainImageUrl = images[0] ? urlFor(images[0]).width(800).height(1067).url() : null

  return (
    <div className="min-h-screen bg-[var(--obsidian)] pt-28">
      {/* Hero */}
      <div className="px-14 grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-[var(--deep)] overflow-hidden">
            {mainImageUrl ? (
              <Image src={mainImageUrl} alt={product.name_en} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--champagne)] text-6xl opacity-20">✦</span>
              </div>
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[var(--champagne)] text-[var(--obsidian)] text-[8px] tracking-[0.3em] uppercase" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {product.badge}
              </span>
            )}
          </div>
          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative w-20 h-24 bg-[var(--deep)] overflow-hidden flex-shrink-0">
                  <Image src={urlFor(img).width(160).height(213).url()} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="py-4 space-y-6">
          <div>
            <p className="text-[var(--champagne)] text-[9px] tracking-[0.5em] uppercase opacity-70 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {product.collection.charAt(0).toUpperCase() + product.collection.slice(1)} Collection
            </p>
            <h1 className="text-[var(--ivory)] text-4xl font-light leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {product.name_en}
            </h1>
            <p className="text-[var(--muted)] text-sm mt-1" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
              {product.name_ar}
            </p>
          </div>

          <p className="text-[var(--champagne)] text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {formatPrice(product.price)}
          </p>

          {/* Shades */}
          {product.shades && product.shades.length > 0 && (
            <div>
              <p className="text-[var(--muted)] text-[9px] tracking-[0.3em] uppercase mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>Select Shade</p>
              <div className="flex flex-wrap gap-2">
                {product.shades.map(s => (
                  <div
                    key={s.hex}
                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-[var(--champagne)] cursor-pointer transition-all"
                    style={{ backgroundColor: s.hex }}
                    title={s.name_en}
                  />
                ))}
              </div>
            </div>
          )}

          <AddToCartButton product={product} />

          {/* Description tabs */}
          <div className="pt-6 border-t border-[rgba(201,169,110,0.1)] space-y-4">
            {product.description_en && (
              <div>
                <p className="text-[var(--muted)] text-[9px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Description</p>
                <p className="text-[var(--ivory)] text-base leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {product.description_en}
                </p>
              </div>
            )}
            {product.description_ar && (
              <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
                {product.description_ar}
              </p>
            )}
            {product.ingredients_en && (
              <details className="group">
                <summary className="text-[var(--muted)] text-[9px] tracking-[0.3em] uppercase cursor-pointer hover:text-[var(--champagne)] transition-colors list-none" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Ingredients ▾
                </summary>
                <p className="text-[var(--muted)] text-xs leading-relaxed mt-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {product.ingredients_en}
                </p>
              </details>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedFiltered.length > 0 && (
        <ProductCarousel
          products={relatedFiltered}
          label="You may also like"
          title="Related"
          titleItalic="Products"
          labelAr="قد يعجبكِ أيضًا"
        />
      )}
    </div>
  )
}
