import { getProductBySlug, getAllProductSlugs, getProductsByCollection, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import ProductHero from './ProductHero'

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
    title: `${product.name_en} — Claraline`,
    description: product.description_en,
  }
}

const COLLECTION_LABEL: Record<string, { en: string; ar: string }> = {
  lip:  { en: 'Lip Collection',  ar: 'مجموعة الشفاه' },
  eye:  { en: 'Eye Collection',  ar: 'مجموعة العيون' },
  face: { en: 'Face Collection', ar: 'مجموعة الوجه'  },
  gift: { en: 'Gift Sets',       ar: 'طقم الهدايا'   },
}

const SPOTLIGHT: Record<string, Array<{ name: string; nameAr: string; origin: string; originAr: string; body: string; bodyAr: string; icon: 'leaf' | 'drop' | 'sun' | 'star' | 'moon' | 'gem' }>> = {
  lip: [
    { name: 'Jojoba Oil',  nameAr: 'زيت الجوجوبا', origin: 'Morocco',     originAr: 'المغرب',     body: 'Locks in moisture for all-day comfort and conditions the lips with a velvet softness.', bodyAr: 'يحبس الرطوبة طوال اليوم ويمنح الشفاه نعومة مخملية لا تُنسى.', icon: 'drop' },
    { name: 'Shea Butter', nameAr: 'زبدة الشيا',   origin: 'West Africa', originAr: 'غرب أفريقيا', body: 'Smooths and replenishes — leaving the lips supple, plush, and quietly luminous.',     bodyAr: 'تُنعّم وتغذّي الشفاه لتبدو ممتلئة بإشراقةٍ هادئة.',          icon: 'leaf' },
    { name: 'Vitamin E',   nameAr: 'فيتامين E',    origin: 'Mediterranean', originAr: 'المتوسط',  body: 'Antioxidant-rich nourishment that protects color and softens fine lip lines.',         bodyAr: 'تغذية غنية بمضادات الأكسدة تحمي اللون وتنعّم الخطوط الدقيقة.', icon: 'sun' },
  ],
  eye: [
    { name: 'Argan Oil',   nameAr: 'زيت الأرغان', origin: 'Morocco',     originAr: 'المغرب',     body: 'Strengthens lashes naturally while conditioning the delicate skin around the eye.',   bodyAr: 'يُقوّي الرموش بشكلٍ طبيعي ويغذّي البشرة الرقيقة حول العين.',  icon: 'leaf' },
    { name: 'Castor Oil',  nameAr: 'زيت الخروع',  origin: 'India',        originAr: 'الهند',     body: 'Promotes lash density and shine — a quiet ritual carried through generations.',      bodyAr: 'يعزّز كثافة الرموش ولمعانها — طقسٌ هادئ توارثته الأجيال.',  icon: 'drop' },
    { name: 'Vitamin B5',  nameAr: 'فيتامين B5',  origin: 'Switzerland',  originAr: 'سويسرا',    body: 'Soothes and softens, calming the eye area through long Gulf days.',                   bodyAr: 'يُلطّف ويُنعّم محيط العين خلال أيام الخليج الطويلة.',         icon: 'moon' },
  ],
  face: [
    { name: 'Hyaluronic Acid', nameAr: 'حمض الهيالورونيك', origin: 'Lab — Switzerland', originAr: 'مختبر — سويسرا', body: 'Plumping hydration drawn deep into the skin without any weight.', bodyAr: 'ترطيب عميق يملأ البشرة دون أي شعور بالثقل.',          icon: 'drop' },
    { name: 'Niacinamide',     nameAr: 'نياسيناميد',        origin: 'Lab — Korea',        originAr: 'مختبر — كوريا',  body: 'Refines texture, brightens, and quiets uneven tone over time.', bodyAr: 'يُحسّن الملمس ويوحّد لون البشرة ويهدّئها مع مرور الوقت.', icon: 'star' },
    { name: 'Squalane',        nameAr: 'سكوالين',            origin: 'Olive — Spain',      originAr: 'الزيتون — إسبانيا', body: 'Replenishes the moisture barrier with a weightless second-skin finish.', bodyAr: 'يُجدّد حاجز الرطوبة بلمسةٍ خفيفة كالبشرة الثانية.',  icon: 'leaf' },
  ],
  gift: [
    { name: 'Curated Edit',    nameAr: 'تشكيلة منتقاة',  origin: 'Kuwait',         originAr: 'الكويت',           body: 'A hand-picked Claraline ritual — chosen for the moments that matter most.', bodyAr: 'طقسٌ من كالرالاين انتُقي بعناية للحظاتٍ تستحق.',     icon: 'gem' },
    { name: 'Signature Pouch', nameAr: 'حقيبة التوقيع',  origin: 'Made in Kuwait', originAr: 'صُنع في الكويت',   body: 'Wrapped in our champagne-stitched cotton pouch — ready to be gifted.',       bodyAr: 'مغلّفة بحقيبتنا القطنية بخياطة الشمبانيا، جاهزةً للإهداء.', icon: 'star' },
    { name: 'Hand-Finished',   nameAr: 'لمسة يدويّة',     origin: 'The Atelier',    originAr: 'الورشة',           body: 'Each set is sealed by hand with the Claraline insignia.',                     bodyAr: 'كلّ علبةٍ تُختم يدويًا بشعار كالرالاين.',                  icon: 'sun' },
  ],
}

const HOWTO: Record<string, { en: string[]; ar: string[] }> = {
  lip: {
    en: [
      'Prepare the lips with a soft exfoliation for a clean canvas.',
      'Apply lightly from the centre outwards, layering for richer colour.',
      'Press the lips together to set, finish with a touch of balm if you like.',
    ],
    ar: [
      'هيّئي الشفاه بتقشير لطيف للحصول على سطحٍ ناعم.',
      'طبّقي اللون من الوسط نحو الأطراف، وكرّري الطبقة لشدّة اللون.',
      'اضغطي الشفتين برفق لتثبيت اللون، ثم أنهي بلمسةٍ من المرطب.',
    ],
  },
  eye: {
    en: [
      'Start at the lash root and sweep gently outwards in short strokes.',
      'Layer a second pass through the tips for added length and definition.',
      'Let it set for a moment — never rub. Remove softly with oil cleanser.',
    ],
    ar: [
      'ابدئي من جذور الرموش وامسحي برفقٍ نحو الخارج بضرباتٍ قصيرة.',
      'كرّري الطبقة على الأطراف للحصول على طولٍ وتحديدٍ إضافي.',
      'اتركيها لتجف لحظات — دون فرك. أزيليها بلطفٍ بمنظّفٍ زيتي.',
    ],
  },
  face: {
    en: [
      'Press a small amount onto cleansed skin, working from the centre out.',
      'Layer under or over makeup for a soft second-skin glow.',
      'Use morning and evening — a quiet ritual that builds over time.',
    ],
    ar: [
      'وزّعي كميةً صغيرةً على بشرةٍ نظيفة من الوسط نحو الأطراف.',
      'طبّقيها تحت أو فوق المكياج لإشراقةٍ ناعمةٍ كالبشرة الثانية.',
      'استخدميها صباحًا ومساءً — طقسٌ هادئ تتراكم نتائجه مع الوقت.',
    ],
  },
  gift: {
    en: [
      'Unwrap the signature pouch and reveal each piece in turn.',
      'Begin with the lightest layer and finish with the moment of colour.',
      'Keep the pouch — it travels well, on the vanity or in the bag.',
    ],
    ar: [
      'افتحي حقيبة التوقيع واكشفي كلّ قطعةٍ على حدة.',
      'ابدئي بالأخفّ ثم انتقلي إلى لحظة اللون.',
      'احتفظي بالحقيبة — رفيقةٌ أنيقة في رحلتكِ أو في المنزل.',
    ],
  },
}

const PLACEHOLDER_REVIEWS = [
  { stars: 5, en: 'It lasted through dinner, dessert, and a long walk along the Corniche. The finish stayed velvet to the very last sip of coffee.', ar: '«صمدَ طوال العشاء والحلوى ونزهةٍ طويلة على الكورنيش، وبقي الملمس مخمليًا حتى آخر رشفةٍ من القهوة».', name: 'Noura A.', loc: 'Kuwait City', date: 'April 2026', verified: true },
  { stars: 5, en: 'The colour is exactly as photographed — and the formula feels luxurious, not heavy. Quietly the best I have owned.',              ar: '«اللون مطابقٌ تمامًا للصور، والتركيبة فاخرة دون أي شعورٍ بالثقل. الأفضل بهدوء».',            name: 'Lina K.',  loc: 'Salmiya',     date: 'March 2026', verified: true },
  { stars: 5, en: 'I gifted one to my sister and she immediately ordered three more. The packaging alone deserves a place on the vanity.',          ar: '«أهديتُ واحدة لأختي فطلبت ثلاثًا في يومها. التغليف وحده يستحق مكانةً على الطاولة».',     name: 'Hessa M.', loc: 'Hawalli',     date: 'March 2026', verified: true },
  { stars: 4, en: 'Beautiful pigment and comfortable wear. I would love a deeper berry shade added to the collection next.',                         ar: '«تركيز ألوان رائع وراحةٌ في الارتداء. أتمنى إضافة درجة توت أعمق إلى المجموعة».',          name: 'Mona R.',  loc: 'Jabriya',     date: 'February 2026', verified: false },
]

function SpotlightIcon({ kind }: { kind: 'leaf' | 'drop' | 'sun' | 'star' | 'moon' | 'gem' }) {
  const common = { width: 48, height: 48, viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'leaf':  return <svg {...common}><path d="M12 36c12 0 24-10 24-24 0 0-12 0-18 6s-6 18-6 18z" /><path d="M12 36 24 24" /></svg>
    case 'drop':  return <svg {...common}><path d="M24 8c6 9 10 14 10 20a10 10 0 1 1-20 0c0-6 4-11 10-20z" /></svg>
    case 'sun':   return <svg {...common}><circle cx="24" cy="24" r="7" /><path d="M24 10v4M24 34v4M10 24h4M34 24h4M14 14l2.8 2.8M31.2 31.2l2.8 2.8M14 34l2.8-2.8M31.2 16.8 34 14" /></svg>
    case 'star':  return <svg {...common}><path d="M24 8l4.2 9.5L38 19l-7 6.5L33 36l-9-5-9 5 2-10.5L10 19l9.8-1.5z" /></svg>
    case 'moon':  return <svg {...common}><path d="M34 26a12 12 0 1 1-12-16 9 9 0 0 0 12 16z" /></svg>
    case 'gem':   return <svg {...common}><path d="M12 18l6-8h12l6 8-12 20z" /><path d="M12 18h24M18 10l6 8 6-8M18 10l6 28M30 10l-6 28" /></svg>
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
  if (!product) notFound()

  const collectionProducts = await getProductsByCollection(product.collection).catch(() => [])
  const related = collectionProducts.filter(p => p._id !== product._id).slice(0, 4)

  // Prev / Next siblings — wrap around the collection
  const idx = collectionProducts.findIndex(p => p._id === product._id)
  const len = collectionProducts.length
  const prevP = len > 1 && idx >= 0 ? collectionProducts[(idx - 1 + len) % len] : null
  const nextP = len > 1 && idx >= 0 ? collectionProducts[(idx + 1) % len] : null

  const labels = COLLECTION_LABEL[product.collection] ?? { en: 'Collection', ar: 'المجموعة' }
  const spotlight = SPOTLIGHT[product.collection] ?? SPOTLIGHT.lip
  const howto = HOWTO[product.collection] ?? HOWTO.lip
  const momentImageUrl = product.images?.[1]
    ? urlFor(product.images[1]).width(1920).height(1080).url()
    : product.images?.[0]
      ? urlFor(product.images[0]).width(1920).height(1080).url()
      : null

  const ingredientCopy = spotlight.map(s => ({ en: s.name, ar: s.body }))

  return (
    <div className="pdp-root">
      {/* ─── BREADCRUMB ────────────────────────────────── */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <div className="pdp-crumb-trail">
          <span className="pdp-crumb"><Link href="/">Home</Link></span>
          <span className="pdp-crumb-sep">›</span>
          <span className="pdp-crumb">
            <Link href="/shop" className="en-only">{labels.en}</Link>
            <Link href="/shop" className="ar-only" dir="rtl">{labels.ar}</Link>
          </span>
          <span className="pdp-crumb-sep">›</span>
          <span className="pdp-crumb-current">{product.name_en}</span>
        </div>
        <div className="pdp-crumb-nav">
          {prevP
            ? <Link href={`/product/${prevP.slug.current}`} className="pdp-crumb-arrow" aria-label="Previous product">
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </Link>
            : <span className="pdp-crumb-arrow disabled" aria-hidden>
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </span>
          }
          {nextP
            ? <Link href={`/product/${nextP.slug.current}`} className="pdp-crumb-arrow" aria-label="Next product">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            : <span className="pdp-crumb-arrow disabled" aria-hidden>
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </span>
          }
        </div>
      </nav>

      {/* ─── HERO (gallery + buy + accordion) ──────────── */}
      <ProductHero
        product={product}
        ingredientCopy={ingredientCopy}
        howToUseEn={howto.en}
        howToUseAr={howto.ar}
      />

      {/* ─── VIDEO MOMENT ──────────────────────────────── */}
      <section className="pdp-moment" aria-label="Brand moment">
        {momentImageUrl && (
          <div className="pdp-moment-img">
            <Image src={momentImageUrl} alt="" fill priority={false} sizes="100vw" style={{ objectFit: 'cover' }} />
          </div>
        )}
        <div className="pdp-moment-text">
          <span className="pdp-moment-eyebrow en-only">The Ritual</span>
          <span className="pdp-moment-eyebrow ar-only">الطقس</span>
          <h2 className="pdp-moment-headline en-only">Crafted for your <em>ritual</em></h2>
          <h2 className="pdp-moment-headline ar-only" dir="rtl">صُنع لطقسكِ <em>الخاص</em></h2>
          <p className="pdp-moment-ar en-only">A moment of beauty, made in Kuwait.</p>
          <p className="pdp-moment-ar ar-only" dir="rtl">لحظةُ جمالٍ، صُنعت في الكويت.</p>
        </div>
      </section>

      {/* ─── INGREDIENT SPOTLIGHT ──────────────────────── */}
      <section className="pdp-spotlight" aria-label="Ingredient spotlight">
        {spotlight.map(item => (
          <div className="pdp-spotlight-col" key={item.name}>
            <div className="pdp-spotlight-icon"><SpotlightIcon kind={item.icon} /></div>
            <h3 className="pdp-spotlight-name en-only">{item.name}</h3>
            <h3 className="pdp-spotlight-name ar-only" dir="rtl">{item.nameAr}</h3>
            <span className="pdp-spotlight-origin en-only">{item.origin}</span>
            <span className="pdp-spotlight-origin ar-only" dir="rtl">{item.originAr}</span>
            <p className="pdp-spotlight-body en-only">{item.body}</p>
            <p className="pdp-spotlight-body ar-only" dir="rtl">{item.bodyAr}</p>
          </div>
        ))}
      </section>

      {/* ─── REVIEWS ───────────────────────────────────── */}
      <section className="pdp-reviews" id="reviews">
        <div className="pdp-reviews-head">
          <h2 className="pdp-reviews-title en-only">What <em>she said</em></h2>
          <h2 className="pdp-reviews-title ar-only" dir="rtl">ماذا <em>قالت</em></h2>
          <p className="pdp-reviews-sub en-only">Real reviews from the Gulf community.</p>
          <p className="pdp-reviews-sub ar-only" dir="rtl">آراء حقيقية من مجتمع الخليج.</p>
          <div className="pdp-reviews-stats">
            <span><strong>4.8</strong><span className="en-only">★ average</span><span className="ar-only" dir="rtl">★ المتوسط</span></span>
            <span><strong>248</strong><span className="en-only">reviews</span><span className="ar-only" dir="rtl">مراجعة</span></span>
            <span><strong>96%</strong><span className="en-only">recommend</span><span className="ar-only" dir="rtl">يوصين به</span></span>
          </div>
          <div className="pdp-review-chips" role="tablist" aria-label="Filter reviews">
            <button className="pdp-review-chip active" type="button">All</button>
            <button className="pdp-review-chip" type="button">5 ★</button>
            <button className="pdp-review-chip" type="button">4 ★</button>
            <button className="pdp-review-chip" type="button">With Photos</button>
          </div>
        </div>

        <div className="pdp-review-grid">
          {PLACEHOLDER_REVIEWS.map(r => (
            <article className="pdp-review-card" key={r.name + r.date}>
              <div className="pdp-review-stars" aria-label={`${r.stars} stars`}>
                {'★'.repeat(r.stars) + '☆'.repeat(5 - r.stars)}
              </div>
              <p className="pdp-review-quote en-only">&ldquo;{r.en}&rdquo;</p>
              <p className="pdp-review-quote ar-only" dir="rtl">{r.ar}</p>
              <div className="pdp-review-meta">
                <span className="pdp-review-author">
                  {r.name}
                  {r.verified && <span className="pdp-review-verified">Verified</span>}
                </span>
                <span className="pdp-review-date">{r.date}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="pdp-reviews-cta">
          <button type="button">
            <span className="en-only">View All Reviews</span>
            <span className="ar-only">جميع المراجعات</span>
          </button>
        </div>
        <p className="pdp-reviews-note en-only">Sample data — reviews schema pending</p>
        <p className="pdp-reviews-note ar-only" dir="rtl">بياناتٌ تجريبية — مخطط المراجعات قيد التطوير</p>
      </section>

      {/* ─── COMPLETE THE LOOK ─────────────────────────── */}
      {related.length > 0 && (
        <section className="pdp-pair" aria-label="Pair with">
          <div className="pdp-pair-head">
            <h2 className="pdp-pair-title en-only">Pair it <em>with</em></h2>
            <h2 className="pdp-pair-title ar-only" dir="rtl">رفّقيها <em>مع</em></h2>
            <p className="pdp-pair-sub en-only">Complete your Claraline ritual.</p>
            <p className="pdp-pair-sub ar-only" dir="rtl">أكملي طقس كالرالاين الخاص بكِ.</p>
          </div>
          <div className="pdp-pair-grid">
            {related.map(p => {
              const img = p.images?.[0] ? urlFor(p.images[0]).width(480).height(640).url() : null
              return (
                <Link href={`/product/${p.slug.current}`} className="pdp-pair-card" key={p._id}>
                  <div className="pdp-pair-card-img">
                    {img && <Image src={img} alt={p.name_en} fill sizes="(max-width: 768px) 50vw, 240px" style={{ objectFit: 'cover' }} />}
                  </div>
                  <div className="pdp-pair-info">
                    <div className="pdp-pair-name">{p.name_en}</div>
                    <div className="pdp-pair-name-ar" dir="rtl">{p.name_ar}</div>
                    <div className="pdp-pair-price">{formatPrice(p.price)}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── HELP ──────────────────────────────────────── */}
      <section className="pdp-help">
        <h2 className="pdp-help-title en-only">Need help <em>choosing</em>?</h2>
        <h2 className="pdp-help-title ar-only" dir="rtl">هل تحتاجين <em>مساعدة</em>؟</h2>
        <p className="pdp-help-body en-only">Our beauty advisors are here to help you find your shade and answer any question — quickly and quietly.</p>
        <p className="pdp-help-body ar-only" dir="rtl">مستشاراتنا الجماليّات يساعدنك على اختيار درجتكِ والإجابة عن أسئلتكِ بسرعةٍ وهدوء.</p>
        <div className="pdp-help-row">
          <a className="pdp-help-btn" href="https://wa.me/96500000000" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /></svg>
            <span>WhatsApp</span>
          </a>
          <a className="pdp-help-btn" href="mailto:hello@claraline.com">
            <svg viewBox="0 0 24 24" aria-hidden><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>
            <span>Email Us</span>
          </a>
        </div>
      </section>
    </div>
  )
}
