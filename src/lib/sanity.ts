import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { Product } from '@/types'
import { centralDb } from './central-db'
import type { CentralProduct } from '@/types/central-product'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const isSanityConfigured = /^[a-z0-9-]+$/.test(rawProjectId)
const projectId = isSanityConfigured ? rawProjectId : 'placeholder'

export const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-12-01',
  useCdn: isSanityConfigured,
  token: process.env.SANITY_API_READ_TOKEN,
})

const builder = createImageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)

const BRAND = 'Claraline'
const STORAGE_BASE = 'https://ythwkmlvrogckondrggb.supabase.co/storage/v1/object/public/product-images'

function mapCategory(cat: string | null | undefined): string {
  const c = (cat ?? '').toLowerCase().trim()
  if (c.includes('eye'))  return 'eye'
  if (c.includes('lip'))  return 'lip'
  if (c.includes('face')) return 'face'
  if (c.includes('gift')) return 'gift'
  return c
}

function resolveImages(p: CentralProduct): string[] {
  const explicit = [p.image_1, p.image_2, p.image_3].flatMap(url => {
    if (!url || url === '0' || url.trim() === '') return []
    return [url.startsWith('http') ? url : `${STORAGE_BASE}/${url}`]
  })
  if (explicit.length) return explicit
  if (p.barcode) {
    const folder = encodeURIComponent(
      p.barcode.length >= 8 ? `${p.barcode.slice(0, 7)} ${p.barcode.slice(7)}` : p.barcode
    )
    return [`${STORAGE_BASE}/${folder}/image_1.png`]
  }
  return []
}

function mapProduct(p: CentralProduct): Product {
  return {
    _id: p.id,
    _type: 'product',
    name_en: p.product_name_en ?? p.name ?? '',
    name_ar: p.product_name_ar ?? p.name_ar ?? p.name ?? '',
    slug: { current: p.sku },
    price: p.price,
    compareAtPrice: undefined,
    images: resolveImages(p),
    collection: mapCategory(p.category),
    description_en: p.description_en ?? undefined,
    description_ar: p.description_ar ?? undefined,
    ingredients_en: p.ingredients_en ?? undefined,
    ingredients_ar: p.ingredients_ar ?? undefined,
    howToUse_en: p.how_to_use_en ?? undefined,
    howToUse_ar: p.how_to_use_ar ?? undefined,
    benefits_en: p.key_benefits_en ?? undefined,
    benefits_ar: p.key_benefits_ar ?? undefined,
    sku: p.sku,
    inStock: p.stock > 0,
    stockCount: p.stock,
    featured: false,
    badge: undefined,
    shades: undefined,
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await centralDb
    .from('products')
    .select('*')
    .ilike('brand_name_en', BRAND)
    .gt('stock', 0)
    .limit(8)
  if (error) { console.warn('[central-db] getFeatured:', error.message); return [] }
  return (data ?? []).map(mapProduct)
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await centralDb
    .from('products')
    .select('*')
    .ilike('brand_name_en', BRAND)
    .gt('stock', 0)
    .order('name')
  if (error) { console.warn('[central-db] getAllProducts:', error.message); return [] }
  return (data ?? []).map(mapProduct)
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const { data, error } = await centralDb
    .from('products')
    .select('*')
    .ilike('brand_name_en', BRAND)
    .ilike('category', collection)
    .gt('stock', 0)
    .order('name')
  if (error) { console.warn('[central-db] getProductsByCollection:', error.message); return [] }
  return (data ?? []).map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data, error } = await centralDb
    .from('products')
    .select('*')
    .eq('sku', slug)
    .single()
  if (error || !data) throw new Error(`Product not found: ${slug}`)
  return mapProduct(data as CentralProduct)
}

export async function getAllProductSlugs(): Promise<{ slug: { current: string } }[]> {
  const { data, error } = await centralDb
    .from('products')
    .select('sku')
    .ilike('brand_name_en', BRAND)
  if (error) return []
  return (data ?? []).map((p: { sku: string }) => ({ slug: { current: p.sku } }))
}
