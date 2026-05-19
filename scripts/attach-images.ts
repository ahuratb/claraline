/**
 * scripts/attach-images.ts
 *
 * Matches .jpeg images in public/pics/ to Sanity products by barcode,
 * uploads each to Sanity assets, and appends it to the product's images[].
 *
 * Filename convention : {BARCODE}.jpeg  (spaces allowed, e.g. "8692229 093943.jpeg")
 * Matching strategy   : normalize barcode (strip spaces) → compare against
 *                         product.sku  (stored with spaces → normalize)
 *                       OR
 *                         product.shades[]._key  (stored without spaces)
 * Idempotent          : skips images already present in product.images[]
 * Non-barcode files   : reported as "✗ No product" (e.g. image71.jpeg)
 *
 * Usage: npm run attach-images
 */

import dotenv from 'dotenv'
import path   from 'path'
import fs     from 'fs'
import { createClient } from '@sanity/client'

// ── Env ──────────────────────────────────────────────────────────────────────
dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('\n✗  Missing env vars in .env.local:')
  if (!projectId) console.error('   NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!token)     console.error('   SANITY_API_TOKEN  (needs write permission)')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip all whitespace for barcode comparison */
function norm(s: string): string {
  return s.replace(/\s+/g, '')
}

interface Product {
  _id:          string
  name_en:      string
  sku:          string | null
  attachedKeys: string[]   // images[]._key already on the document
  shadeKeys:    string[]   // shades[]._key (each is a per-variant barcode)
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const picsDir = path.resolve('public/pics')

  if (!fs.existsSync(picsDir)) {
    console.error(`\n✗  Directory not found: ${picsDir}`)
    process.exit(1)
  }

  // ── Fetch all products with the fields we need ────────────────────────────
  process.stdout.write('Fetching products from Sanity … ')
  const products: Product[] = await client.fetch(`
    *[_type == "product"] {
      _id,
      name_en,
      sku,
      "attachedKeys": images[]._key,
      "shadeKeys":    shades[]._key
    }
  `)
  console.log(`${products.length} found\n`)

  // ── Build normalised barcode → product lookup ─────────────────────────────
  // A product can be matched by:
  //   its sku field  (first variant's barcode, may have spaces)
  //   any shade _key (per-variant barcode, stored without spaces)
  const lookup = new Map<string, Product>()

  for (const p of products) {
    if (p.sku) lookup.set(norm(p.sku), p)
    for (const key of p.shadeKeys ?? []) lookup.set(norm(key), p)
  }

  // ── Read .jpeg / .jpg files ───────────────────────────────────────────────
  const files = fs.readdirSync(picsDir)
    .filter(f => /\.(jpe?g)$/i.test(f))
    .sort()

  if (files.length === 0) {
    console.error(`✗  No .jpeg files found in ${picsDir}`)
    process.exit(1)
  }

  console.log('Claraline · Attach Images')
  console.log('──────────────────────────────────────────')
  console.log(`  Source   : ${picsDir}`)
  console.log(`  Files    : ${files.length} jpeg`)
  console.log(`  Products : ${products.length} in Sanity`)
  console.log('──────────────────────────────────────────\n')

  let attached = 0
  let skipped  = 0
  let failed   = 0
  let noMatch  = 0

  for (const file of files) {
    // Extract barcode: full filename stem (keeps spaces for display)
    const barcode    = path.parse(file).name          // e.g. "8692229 093943"
    const barcodeKey = norm(barcode)                  // e.g. "8692229093943"
    const product    = lookup.get(barcodeKey)

    // ── No matching product ──────────────────────────────────────────────────
    if (!product) {
      console.log(`  ✗  No product for barcode: ${barcode}`)
      noMatch++
      continue
    }

    // ── Already attached (idempotency) ───────────────────────────────────────
    const alreadyHere = (product.attachedKeys ?? []).some(k => norm(k) === barcodeKey)
    if (alreadyHere) {
      console.log(`  ~  Already attached  : ${product.name_en}`)
      skipped++
      continue
    }

    // ── Upload + patch ────────────────────────────────────────────────────────
    const filePath = path.join(picsDir, file)
    try {
      // 1. Upload image to Sanity media library
      const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
        filename:    file,
        contentType: 'image/jpeg',
      })

      // 2. Append to product's images[] using barcode as _key
      await client
        .patch(product._id)
        .setIfMissing({ images: [] })
        .append('images', [{
          _key:  barcodeKey,
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt:   `${product.name_en} — ${barcode}`,
        }])
        .commit({ autoGenerateArrayKeys: false })

      // Update local cache so a second image matching the same product
      // doesn't try to set the same _key again in this run
      product.attachedKeys = [...(product.attachedKeys ?? []), barcodeKey]

      console.log(`  ✓  ${product.name_en.padEnd(40)} ← ${barcode}`)
      attached++
    } catch (err) {
      console.error(`  ✗  Upload failed [${barcode}]: ${err instanceof Error ? err.message : err}`)
      failed++
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n──────────────────────────────────────────')
  console.log(`  Total processed  : ${files.length}`)
  console.log(`  ✓  Attached      : ${attached}`)
  console.log(`  ~  Already done  : ${skipped}`)
  console.log(`  ✗  No match      : ${noMatch}`)
  if (failed > 0)
    console.log(`  ✗  Upload errors : ${failed}`)
  console.log('──────────────────────────────────────────\n')

  process.exit(noMatch + failed > 0 ? 1 : 0)
}

run().catch(err => {
  console.error('\nFatal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
