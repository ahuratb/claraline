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

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch(`
    *[_type == "product" && featured == true && inStock == true] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, description_ar
    }
  `)
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "product" && collection == $collection && inStock == true] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, shades
    }`,
    { collection }
  )
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch(`
    *[_type == "product" && inStock == true] | order(_createdAt desc) {
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
