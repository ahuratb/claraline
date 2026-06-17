/**
 * scripts/update-side-banners.ts — one-shot: set the hero + two side banners
 * to static images with the new overlay copy / layout.
 * Patches the live MongoDB siteContent doc (defaults already updated in code).
 * Run:  npx tsx scripts/update-side-banners.ts
 */
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config({ path: '.env.local' })

const hero = {
  src: '', mediaType: 'image', image: '/hero.png', bg: 'light', textPos: 'left', sectionHeight: '100vh',
  overlays: [{
    id: 't1a', startPct: 0.05, endPct: 0.95,
    eyebrow: 'Midnight Drama Volume Mascara', eyebrowAr: 'ماسكارا ميدنايت دراما',
    headlineHtml: 'Length, volume,<br/>drama all for<br/>your eyes',
    headlineHtmlAr: 'طول، كثافة،<br/>دراما لعيونچ',
    cta: { label: 'Discover Now', labelAr: 'اكتشفي الحين', href: '/shop' },
  }],
}

const sideLeft = {
  src: '', mediaType: 'image', image: '/banner-1.jpg', bg: 'light', fit: 'natural', textPos: 'top-left',
  overlays: [{
    id: 't2a', startPct: 0.1, endPct: 0.9,
    eyebrow: 'Cosmetics Collection', eyebrowAr: 'مجموعة مستحضرات التجميل',
    headlineHtml: 'Claraline is inspired<br/>by Clara Zetkin',
    headlineHtmlAr: 'كلارالاين مستوحاة<br/>من كلارا تسيتكن',
    cta: { label: 'Discover Now', labelAr: 'اكتشفي الحين', href: '/shop' },
  }],
}

const sideRight = {
  src: '', mediaType: 'image', image: '/banner-2.jpg', bg: 'light', fit: 'natural', textPos: 'top-left',
  overlays: [{
    id: 't5a', startPct: 0.1, endPct: 0.9,
    eyebrow: 'Cosmetics Collection', eyebrowAr: 'مجموعة مستحضرات التجميل',
    headlineHtml: 'Clear &amp; Soft<br/>Make Up Remover',
    headlineHtmlAr: 'كلير آند سوفت<br/>مزيل المكياج',
    cta: { label: 'Discover Now', labelAr: 'اكتشفي الحين', href: '/shop' },
  }],
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) { console.error('MONGODB_URI missing in .env.local'); process.exit(1) }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 25000 })
  await client.connect()
  try {
    const db = client.db('claraline')
    const res = await db.collection('siteContent').updateOne(
      { _id: 'homepage' as never },
      {
        $set: {
          'content.hero': hero, 'content.sideLeft': sideLeft, 'content.sideRight': sideRight,
          'content.newsletter.image': '/banner-2.jpg',
          updatedAt: new Date(),
        },
        // Drop stored categories/slides so the new code defaults take over
        // (more categories, light-theme slider).
        $unset: { 'content.categories': '', 'content.slides': '' },
      },
    )
    if (res.matchedCount === 0) {
      console.log('No saved siteContent doc — code defaults already carry the banners. Nothing to patch.')
    } else {
      console.log('OK — hero + side banners updated. modified:', res.modifiedCount)
    }
  } finally {
    await client.close()
  }
}

main().catch(err => { console.error('FAILED:', err.message); process.exit(1) })
