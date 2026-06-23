import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { Product } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

// Sanity project IDs: a-z, 0-9, dashes only — reject placeholder values
const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const isSanityConfigured = /^[a-z0-9-]+$/.test(rawProjectId)
const projectId = isSanityConfigured ? rawProjectId : 'placeholder'

export const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: isSanityConfigured,
})

const builder = createImageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)

async function safeFetch<T>(query: string, params?: Record<string, unknown>, fallback: T[] = []): Promise<T[]> {
  if (!isSanityConfigured) return fallback
  try {
    return await client.fetch<T[]>(query, params ?? {})
  } catch (e) {
    console.warn('[sanity] fetch failed, falling back to empty list:', (e as Error)?.message)
    return fallback
  }
}

export function getFeaturedProducts(): Promise<Product[]> {
  return safeFetch<Product>(`
    *[_type == "product" && featured == true && inStock != false] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, description_ar
    }
  `)
}

export function getProductsByCollection(collection: string): Promise<Product[]> {
  return safeFetch<Product>(
    `*[_type == "product" && collection == $collection && inStock != false] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, shades
    }`,
    { collection }
  )
}

export function getAllProducts(): Promise<Product[]> {
  return safeFetch<Product>(`
    *[_type == "product" && inStock != false] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, featured
    }
  `)
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id, name_en, name_ar, slug, price, images, collection,
      description_en, description_ar, ingredients_en, ingredients_ar,
      badge, inStock, shades
    }`,
    { slug }
  )
}

export async function getAllProductSlugs(): Promise<{ slug: { current: string } }[]> {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type == "product"] { slug }`)
}
