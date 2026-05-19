/**
 * scripts/import-products.ts
 *
 * Reads public/products.xlsx and upserts products into Sanity CMS.
 *
 * Excel reality (discovered by inspection):
 *  - SKU column is entirely empty; BARCODE is the per-variant unique ID
 *  - " PRCE EN " has leading/trailing spaces in the header
 *  - "INgrEDIENTS EN" has inconsistent casing
 *  - "KEY BENEFITS/ FEATURES EN" actually contains ARABIC content (columns are swapped)
 *  - "KEY BENEFITS/ FEATURES AR" actually contains ENGLISH content (columns are swapped)
 *  - QTY EN is empty for all rows; defaults to inStock: true
 *  - 189 rows = 39 distinct base products × N shades each
 *
 * Strategy: group rows by "PRODUCT NAME EN" → one Sanity document per product
 * line, all its shade variants go into the document's shades[] array.
 *
 * Images: public/product-images/{BARCODE}_1.jpg  (_2, _3; .png/.webp OK)
 *
 * Usage:  npm run import
 */

import dotenv from 'dotenv'
import path   from 'path'
import fs     from 'fs'
import * as XLSX from 'xlsx'
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

// ── Types & constants ─────────────────────────────────────────────────────────

type Collection = 'lip' | 'eye' | 'face' | 'gift'

const COLLECTION_MAP: Record<string, Collection> = {
  'lip': 'lip', 'lips': 'lip', 'lip care': 'lip', 'lip liner': 'lip',
  'lip color': 'lip', 'lip colour': 'lip', 'lip multi-use': 'lip',
  'lipstick': 'lip', 'lip gloss': 'lip', 'lip oil': 'lip', 'lip balm': 'lip',
  'lipliner pencil': 'lip', 'lipgloss': 'lip',
  'eye': 'eye', 'eyes': 'eye', 'eyeliner': 'eye', 'eye liner': 'eye',
  'eye shadow': 'eye', 'eyeshadow': 'eye', 'mascara': 'eye',
  'kohl': 'eye', 'brow': 'eye', 'brows': 'eye', 'lash': 'eye',
  'dipliner': 'eye', 'eyebrow': 'eye',
  'face': 'face', 'foundation': 'face', 'primer': 'face', 'primers': 'face',
  'highlighter': 'face', 'concealer': 'face', 'blush': 'face',
  'contour': 'face', 'powder': 'face', 'compact': 'face', 'bb cream': 'face',
  'spray': 'face', 'remover': 'face',
  'gift': 'gift', 'gift set': 'gift', 'gift sets': 'gift', 'sets': 'gift',
}

const IMG_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png',  '.webp': 'image/webp',
}

// ── Exact Excel column names (do not change — matched to real file) ───────────

// NOTE: " PRCE EN " has a leading and trailing space in the Excel header.
const COL = {
  nameEn:       'PRODUCT NAME EN',
  nameAr:       'PRODUCT NAME AR',
  barcode:      'BARCODE',
  categoryEn:   'CATEGORY EN',
  descEn:       'DESCRIPTION EN',
  descAr:       'DESCRIPTION AR',
  // "INgrEDIENTS EN" is the literal header (mixed case) in the Excel file.
  ingrEn:       'INgrEDIENTS EN',
  ingrAr:       'INGREDIENTS AR',
  price:        ' PRCE EN ',         // has spaces in header
  qty:          'QTY EN',
  howToUseEn:   'HOW TO USE EN',
  howToUseAr:   'HOW TO USE AR',
  // KEY BENEFITS columns are SWAPPED in the Excel (data entry error):
  //   "KEY BENEFITS/ FEATURES AR" header → actually contains English text
  //   "KEY BENEFITS/ FEATURES EN" header → actually contains Arabic text
  benefitsEn:   'KEY BENEFITS/ FEATURES AR',
  benefitsAr:   'KEY BENEFITS/ FEATURES EN',
  // Shade-level columns (vary per row)
  shadeCode:    'Color Code EN',      // e.g. M10
  shadeName:    'COLOR CODE EN',      // e.g. LIGHT PINK
  shadeNameAr:  'COLOR CODE AR',      // e.g. لايت بينك
  shadeCodeAr:  'Color Code AR',
} as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function str(v: unknown): string { return String(v ?? '').trim() }

function num(v: unknown): number {
  return parseFloat(String(v ?? '0').replace(/[^\d.]/g, '')) || 0
}

function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    .replace(/--+/g, '-').replace(/^-+|-+$/g, '')
}

function toDocId(name: string): string {
  return 'product-' + slugify(name).replace(/-+/g, '-').slice(0, 80)
}

function mapCollection(raw: string): Collection {
  const key = raw.trim().toLowerCase()
  // Try direct match first, then substring match
  if (COLLECTION_MAP[key]) return COLLECTION_MAP[key]
  for (const [k, v] of Object.entries(COLLECTION_MAP)) {
    if (key.includes(k)) return v
  }
  return 'face'
}

async function uploadImage(filePath: string, barcode: string, idx: number) {
  const ext   = path.extname(filePath).toLowerCase()
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename:    path.basename(filePath),
    contentType: IMG_MIME[ext] ?? 'image/jpeg',
  })
  return {
    _key:  `${barcode.replace(/\s/g, '')}-${idx}`,
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
    alt:   `${barcode} image ${idx + 1}`,
  }
}

// ── Row interface ─────────────────────────────────────────────────────────────
type Row = Record<string, unknown>

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const xlsxPath  = path.resolve('public/products.xlsx')
  const imagesDir = path.resolve('public/product-images')

  if (!fs.existsSync(xlsxPath)) {
    console.error(`\n✗  Excel not found: ${xlsxPath}`)
    process.exit(1)
  }

  const wb      = XLSX.readFile(xlsxPath)
  const ws      = wb.Sheets[wb.SheetNames[0]]
  const allRows = XLSX.utils.sheet_to_json<Row>(ws, { defval: '' })
  const hasImgs = fs.existsSync(imagesDir)

  // ── Group rows by base product name ────────────────────────────────────────
  const groups = new Map<string, Row[]>()
  let skippedEmpty = 0

  for (const row of allRows) {
    const name = str(row[COL.nameEn])
    if (!name) { skippedEmpty++; continue }
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name)!.push(row)
  }

  console.log('\nClaraline · Product Import')
  console.log('──────────────────────────────────────────')
  console.log(`  Sheet         : ${wb.SheetNames[0]}`)
  console.log(`  Total rows    : ${allRows.length}`)
  console.log(`  Skipped empty : ${skippedEmpty}`)
  console.log(`  Products      : ${groups.size}`)
  console.log(`  Project       : ${projectId} (${dataset})`)
  console.log(`  Images dir    : ${hasImgs ? imagesDir : 'not found — skipping'}`)
  console.log('──────────────────────────────────────────\n')

  let created = 0, updated = 0, failed = 0

  for (const [productName, rows] of groups) {
    const first  = rows[0]
    const docId  = toDocId(productName)
    const barcode = str(first[COL.barcode]) || str(first['__EMPTY'])

    process.stdout.write(`  [${String(rows.length).padStart(2)}v] ${productName}`)

    try {
      // ── Images (use first variant's barcode for image filenames) ────────────
      const images: object[] = []
      if (hasImgs && barcode) {
        for (let n = 1; n <= 3; n++) {
          for (const ext of Object.keys(IMG_MIME)) {
            const p = path.join(imagesDir, `${barcode.replace(/\s+/g, '')}_${n}${ext}`)
            if (fs.existsSync(p)) {
              try { images.push(await uploadImage(p, barcode, n - 1)) } catch { /* skip */ }
              break
            }
          }
        }
      }

      // ── Shades array (one entry per row that has a shade code or name) ──────
      const shades = rows
        .filter(r => str(r[COL.shadeCode]) || str(r[COL.shadeName]))
        .map(r => {
          const code   = str(r[COL.shadeCode])   // e.g. "M10"
          const nameEn = str(r[COL.shadeName])    // e.g. "LIGHT PINK"
          const nameAr = str(r[COL.shadeNameAr])  // e.g. "لايت بينك"
          return {
            _key:    (str(r[COL.barcode]) || `${slugify(productName)}-${code}`).replace(/\s/g, ''),
            name_en: [code, nameEn].filter(Boolean).join(' — '),
            name_ar: [str(r[COL.shadeCodeAr]), nameAr].filter(Boolean).join(' — ') || nameAr,
            hex:     '',
          }
        })

      // ── inStock: true if any variant has QTY > 0, or default true if all blank
      const qtys   = rows.map(r => str(r[COL.qty])).filter(Boolean)
      const inStock = qtys.length === 0
        ? true
        : rows.some(r => num(r[COL.qty]) > 0)

      // ── Document ─────────────────────────────────────────────────────────────
      const doc = {
        _id:   docId,
        _type: 'product' as const,

        name_en:   productName,
        name_ar:   str(first[COL.nameAr]),
        slug:      { _type: 'slug' as const, current: slugify(productName) },
        price:     num(first[COL.price]),
        collection: mapCollection(str(first[COL.categoryEn])),

        description_en: str(first[COL.descEn])      || undefined,
        description_ar: str(first[COL.descAr])      || undefined,
        ingredients_en: str(first[COL.ingrEn])      || undefined,
        ingredients_ar: str(first[COL.ingrAr])      || undefined,
        howToUse_en:    str(first[COL.howToUseEn])  || undefined,
        howToUse_ar:    str(first[COL.howToUseAr])  || undefined,
        // Note: Excel KEY BENEFITS columns are swapped — AR header = EN content
        benefits_en:    str(first[COL.benefitsEn])  || undefined,
        benefits_ar:    str(first[COL.benefitsAr])  || undefined,

        sku:     barcode || undefined,
        inStock,

        ...(shades.length > 0 && { shades }),
        ...(images.length > 0 && { images }),
      }

      // ── Upsert ─────────────────────────────────────────────────────────────
      const exists = await client.getDocument(docId)
      await client.createOrReplace(doc)

      const shadesTag = shades.length ? ` ${shades.length}🎨` : ''
      const imgsTag   = images.length ? ` ${images.length}🖼` : ''
      if (exists) { process.stdout.write(` ✓${shadesTag}${imgsTag}\n`); updated++ }
      else        { process.stdout.write(` ✦${shadesTag}${imgsTag}\n`); created++ }

    } catch (err) {
      process.stdout.write(` ✗ ${err instanceof Error ? err.message : err}\n`)
      failed++
    }
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`  ✦  Created  ${created}`)
  console.log(`  ✓  Updated  ${updated}`)
  console.log(`  ✗  Failed   ${failed}`)
  console.log(`     Total    ${groups.size} products from ${allRows.length} rows`)
  console.log('──────────────────────────────────────────\n')

  process.exit(failed > 0 ? 1 : 0)
}

run().catch(err => {
  console.error('\nFatal:', err instanceof Error ? err.message : err)
  process.exit(1)
})
