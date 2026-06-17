import { getDb } from '@/lib/mongodb'

/* ──────────────────────────────────────────────────────────────
   Site content model
   ----------------------------------------------------------------
   The homepage content (banners, marquees, stats, features,
   testimonials, newsletter, footer) lives here as a typed object.
   `defaultSiteContent` mirrors the original hardcoded homepage and
   is used as a fallback when no document exists in MongoDB.
   The /admin panel edits this object and saves it back.
   ────────────────────────────────────────────────────────────── */

export interface OverlayContent {
  id: string
  startPct: number
  endPct: number
  eyebrow?: string
  eyebrowAr?: string
  headlineHtml: string
  headlineHtmlAr?: string
  headlineFontSize?: string
  sublineEn?: string
  sublineAr?: string
  cta?: { label: string; labelAr?: string; href?: string }
}

export interface VideoBlock {
  src: string
  /** 'video' (default) plays the scroll-synced clip; 'image' shows a still instead. */
  mediaType?: 'video' | 'image'
  /** Static image URL — used when mediaType === 'image'. */
  image?: string
  /** Backdrop treatment for image mode: 'dark' (default) or 'light' (white bg, dark text). */
  bg?: 'light' | 'dark'
  /** Image sizing: 'screen' (full-viewport, default) or 'natural' (section height = image height). */
  fit?: 'screen' | 'natural'
  /** Overlay text placement for image mode: 'center' (default), 'left', or 'top-left'. */
  textPos?: 'center' | 'left' | 'top-left'
  sectionHeight?: string
  maxSeconds?: number
  overlays: OverlayContent[]
}

export interface CategoryItem { id: string; nameEn: string; nameAr: string; image: string }

export interface SlideItem {
  id: number
  label: string; labelAr: string
  headline: string; headlineAr: string
  sub: string; subAr: string
  cta: string; ctaAr: string
  href: string
  bg: string
  image?: string
}

export interface MarqueeItem { en: string; ar: string }
export interface StatItem { num: string; en: string; ar: string }
export interface FeatureCard { icon: string; en: string; ar: string; bodyEn: string; bodyAr: string }
export interface TestimonialItem { en: string; ar: string; initials: string; name: string; loc: string }
export interface FooterLink { en: string; ar: string }

export interface SiteContent {
  categories: CategoryItem[]
  categoryLabelEn: string; categoryLabelAr: string
  categoryTitleEn: string; categoryTitleAr: string
  slides: SlideItem[]
  hero: VideoBlock
  sideLeft: VideoBlock
  sideRight: VideoBlock
  marqueeTop: MarqueeItem[]
  marqueeBottom: MarqueeItem[]
  stats: StatItem[]
  features: {
    labelEn: string; labelAr: string
    titleEn: string; titleAr: string
    cards: FeatureCard[]
  }
  testimonials: {
    labelEn: string; labelAr: string
    titleEn: string; titleAr: string
    items: TestimonialItem[]
  }
  newsletter: {
    labelEn: string; labelAr: string
    titleEn: string; titleAr: string
    subEn: string; subAr: string
  }
  footer: {
    tagEn: string; tagAr: string
    shopTitleEn: string; shopTitleAr: string; shopLinks: FooterLink[]
    contactTitleEn: string; contactTitleAr: string; contactLinks: FooterLink[]
    infoTitleEn: string; infoTitleAr: string; infoLinks: FooterLink[]
    copyrightEn: string; copyrightAr: string
  }
}

export const defaultSiteContent: SiteContent = {
  categoryLabelEn: 'Shop by Category',
  categoryLabelAr: 'تسوّقي حسب الفئة',
  categoryTitleEn: 'Find your <em>ritual</em>',
  categoryTitleAr: 'اعثري على <em>طقسكِ</em>',
  categories: [
    { id: 'lip-care',    nameEn: 'Lip Care',      nameAr: 'عناية بالشفاه',         image: '/lipcare.png' },
    { id: 'lip-liner',   nameEn: 'Lip Liner',     nameAr: 'محدد الشفاه',           image: '/lipliner.png' },
    { id: 'lip-multi',   nameEn: 'Lip Multi-Use', nameAr: 'شفاه متعدد الاستخدام', image: '/lipmultiuse.png' },
    { id: 'primers',     nameEn: 'Primers',       nameAr: 'البرايمر',              image: '/primers.png' },
    { id: 'highlighter', nameEn: 'Highlighter',   nameAr: 'الهايلايتر',            image: '/highlighter.png' },
    { id: 'concealer',   nameEn: 'Concealer',     nameAr: 'الكونسيلر',             image: '/concealer.png' },
  ],

  slides: [
    {
      id: 1,
      label: 'New Collection · 2024', labelAr: 'المجموعة الجديدة · 2024',
      headline: 'The Art<br/>of <em>Color</em>', headlineAr: 'فن<br/><em>الألوان</em>',
      sub: 'Luxury lip rituals crafted for you', subAr: 'طقوس شفاه فاخرة صُممت لكِ',
      cta: 'Discover Now', ctaAr: 'اكتشفي الآن', href: '/shop',
      bg: 'radial-gradient(ellipse at 30% 60%,#2a0608 0%,#0a0606 55%),radial-gradient(ellipse at 80% 20%,#1a0810 0%,transparent 60%)',
      image: '/slider-4.png',
    },
    {
      id: 2,
      label: 'Lip Collection', labelAr: 'مجموعة الشفاه',
      headline: 'Lips that<br/>speak <em>softly</em>', headlineAr: 'شفاه<br/><em>تهمس</em>',
      sub: 'Velvet finish, lasting comfort', subAr: 'لمسة مخملية تدوم بكل راحة',
      cta: 'Lip Collection', ctaAr: 'مجموعة الشفاه', href: '#products1',
      bg: 'radial-gradient(ellipse at 70% 40%,#0e1c2a 0%,#060a14 55%),radial-gradient(ellipse at 20% 80%,#1a0e12 0%,transparent 60%)',
      image: '/slider-2.png',
    },
    {
      id: 3,
      label: 'Radiant Skin', labelAr: 'بشرة مُشرقة',
      headline: 'Light that<br/><em>belongs</em> to you', headlineAr: 'إشراقة<br/><em>تليق</em> بكِ',
      sub: 'Powder finish, formulated for Gulf skin', subAr: 'بودرة مُصاغة خصيصاً لبشرة الخليج',
      cta: 'Our Story', ctaAr: 'قصتنا', href: '/#ritual',
      bg: 'radial-gradient(ellipse at 50% 30%,#0e1322 0%,#06080e 55%),radial-gradient(ellipse at 80% 70%,#1a1008 0%,transparent 60%)',
      image: '/slider-3.png',
    },
    {
      id: 4,
      label: 'The Ritual', labelAr: 'الطقس',
      headline: 'Your beauty<br/><em>ritual</em> awaits', headlineAr: 'طقس جمالكِ<br/><em>ينتظركِ</em>',
      sub: 'Join thousands of women across the Gulf', subAr: 'انضمي إلى آلاف النساء في أنحاء الخليج',
      cta: 'Shop Now', ctaAr: 'تسوقي الآن', href: '/shop',
      bg: 'radial-gradient(ellipse at 40% 50%,#0f1a10 0%,#080806 55%),radial-gradient(ellipse at 60% 20%,#1a1008 0%,transparent 60%)',
    },
  ],

  hero: {
    src: '',
    mediaType: 'image',
    image: '/hero.png',
    bg: 'light',
    textPos: 'left',
    sectionHeight: '100vh',
    overlays: [
      {
        id: 't1a',
        startPct: 0.05, endPct: 0.95,
        eyebrow: 'Midnight Drama Volume Mascara',
        eyebrowAr: 'ماسكارا ميدنايت دراما',
        headlineHtml: 'Length, volume,<br/>drama all for<br/>your eyes',
        headlineHtmlAr: 'طول، كثافة،<br/>دراما لعيونچ',
        cta: { label: 'Discover Now', labelAr: 'اكتشفي الحين', href: '/shop' },
      },
    ],
  },

  sideLeft: {
    src: '',
    mediaType: 'image',
    image: '/banner-1.jpg',
    bg: 'light',
    fit: 'natural',
    textPos: 'top-left',
    overlays: [
      {
        id: 't2a',
        startPct: 0.1, endPct: 0.9,
        eyebrow: 'Cosmetics Collection',
        eyebrowAr: 'مجموعة مستحضرات التجميل',
        headlineHtml: 'Claraline is inspired<br/>by Clara Zetkin',
        headlineHtmlAr: 'كلارالاين مستوحاة<br/>من كلارا تسيتكن',
        cta: { label: 'Discover Now', labelAr: 'اكتشفي الحين', href: '/shop' },
      },
    ],
  },

  sideRight: {
    src: '',
    mediaType: 'image',
    image: '/banner-2.jpg',
    bg: 'light',
    fit: 'natural',
    textPos: 'top-left',
    overlays: [
      {
        id: 't5a',
        startPct: 0.1, endPct: 0.9,
        eyebrow: 'Cosmetics Collection',
        eyebrowAr: 'مجموعة مستحضرات التجميل',
        headlineHtml: 'Clear &amp; Soft<br/>Make Up Remover',
        headlineHtmlAr: 'كلير آند سوفت<br/>مزيل المكياج',
        cta: { label: 'Discover Now', labelAr: 'اكتشفي الحين', href: '/shop' },
      },
    ],
  },

  marqueeTop: [
    { en: 'Luxury Makeup', ar: 'ميك أب فاخر' },
    { en: 'Kuwait City', ar: 'مدينة الكويت' },
    { en: 'Cruelty Free', ar: 'خالٍ من القسوة' },
    { en: 'GCC Delivery', ar: 'توصيل للخليج' },
  ],

  marqueeBottom: [
    { en: 'KNET Accepted', ar: 'KNET مقبول' },
    { en: 'Tabby — Buy Now Pay Later', ar: 'تابي — اشتري الآن' },
    { en: 'Free Delivery Over KWD 20', ar: 'توصيل مجاني فوق 20 د' },
    { en: 'Tamara Available', ar: 'تمارا متوفرة' },
    { en: 'GCC Shipping', ar: 'شحن للخليج' },
  ],

  stats: [
    { num: '12K+', en: 'Happy Clients', ar: 'عميلة سعيدة' },
    { num: '48', en: 'Unique Shades', ar: 'لون فريد' },
    { num: '6', en: 'GCC Countries', ar: 'دولة خليجية' },
    { num: '100%', en: 'Cruelty Free', ar: 'خالي من القسوة' },
  ],

  features: {
    labelEn: 'Why Claraline',
    labelAr: 'لماذا كالرالاين',
    titleEn: 'Crafted<br/>for <em>you</em>',
    titleAr: 'مُصنَّع<br/>من <em>أجلكِ</em>',
    cards: [
      { icon: '✦', en: 'Halal Certified', ar: 'معتمد حلال', bodyEn: 'All our products are officially halal certified', bodyAr: 'جميع منتجاتنا حلال ومعتمدة رسمياً' },
      { icon: '◈', en: 'Long Lasting', ar: 'يدوم طويلاً', bodyEn: 'Stays all day in the hot Gulf climate', bodyAr: 'تدوم طوال اليوم في أجواء الخليج الحارة' },
      { icon: '◇', en: 'Gulf Climate', ar: 'مناخ الخليج', bodyEn: 'Specially formulated for Gulf climate conditions', bodyAr: 'مُصمَّم خصيصاً لمناخ دول الخليج' },
      { icon: '✧', en: 'Cruelty Free', ar: 'خالٍ من القسوة', bodyEn: 'Never tested on animals — always and forever', bodyAr: 'لا اختبارات على الحيوانات أبداً' },
      { icon: '◉', en: 'Rich Pigment', ar: 'تغطية غنية', bodyEn: 'Full coverage formula with vibrant colors', bodyAr: 'تركيبة بتغطية كاملة وألوان نابضة' },
      { icon: '⟡', en: 'Kuwait Made', ar: 'صُنع في الكويت', bodyEn: 'Proudly crafted in the heart of Kuwait', bodyAr: 'مصنوع بفخر في قلب الكويت' },
    ],
  },

  testimonials: {
    labelEn: 'Real Reviews',
    labelAr: 'آراء حقيقية',
    titleEn: 'They <em>love</em> Claraline',
    titleAr: 'يحبّون <em>كالرالاين</em>',
    items: [
      { en: 'The Velvet Rouge stays on all day — even in Kuwait summer.', ar: '«يدوم طوال اليوم حتى في صيف الكويت الحار، لا مثيل له»', initials: 'نو', name: 'Noura Al-Rashidi', loc: 'Kuwait City' },
      { en: 'Desert Dusk is the palette I never knew I needed.', ar: '«باليت غروب الصحراء كان الناقص في حياتي، ألوان ساحرة»', initials: 'سا', name: 'Sara Al-Mutairi', loc: 'Salmiya, Kuwait' },
      { en: 'Finally a luxury brand that understands Gulf skin tones.', ar: '«أول علامة فاخرة تفهم درجات بشرة الخليج فعلاً»', initials: 'لي', name: 'Lina Al-Ahmad', loc: 'Hawalli, Kuwait' },
    ],
  },

  newsletter: {
    labelEn: 'Join the Ritual',
    labelAr: 'انضمي إلى الطقس',
    titleEn: 'Be the <em>first</em>',
    titleAr: 'كوني <em>الأولى</em>',
    subEn: 'Get exclusive offers and be the first to discover new arrivals',
    subAr: 'احصلي على العروض الحصرية وأحدث الإضافات',
  },

  footer: {
    tagEn: 'Beauty from Kuwait to the world',
    tagAr: 'جمالٌ من الكويت إلى العالم',
    shopTitleEn: 'Shop',
    shopTitleAr: 'تسوقي',
    shopLinks: [
      { en: 'Lip Collection', ar: 'مجموعة الشفاه' },
      { en: 'Eye Collection', ar: 'مجموعة العيون' },
      { en: 'Foundation', ar: 'الأساس' },
      { en: 'Gift Sets', ar: 'طقم الهدايا' },
      { en: 'New Arrivals', ar: 'وصل حديثاً' },
    ],
    contactTitleEn: 'Contact',
    contactTitleAr: 'تواصل معنا',
    contactLinks: [
      { en: 'Instagram', ar: 'إنستغرام' },
      { en: 'WhatsApp', ar: 'واتساب' },
      { en: 'Email Us', ar: 'البريد الإلكتروني' },
      { en: 'Kuwait — Shuwaikh', ar: 'الكويت — الشويخ' },
      { en: 'Return Policy', ar: 'سياسة الإرجاع' },
    ],
    infoTitleEn: 'Info',
    infoTitleAr: 'معلومات',
    infoLinks: [
      { en: 'About Us', ar: 'من نحن' },
      { en: 'Ingredients', ar: 'المكونات' },
      { en: 'Sustainability', ar: 'الاستدامة' },
      { en: 'Halal Certificate', ar: 'شهادة حلال' },
    ],
    copyrightEn: '© 2025 Claraline Kuwait. All rights reserved.',
    copyrightAr: '© 2025 كالرالاين الكويت. جميع الحقوق محفوظة.',
  },
}

const DOC_ID = 'homepage'

interface SiteContentDoc {
  _id: string
  content: SiteContent
  updatedAt?: Date
}

/** Fill any top-level keys missing from a stored doc with defaults.
    Lets older documents gain newly-added sections (logo, categories, slides). */
function withDefaults(stored: Partial<SiteContent>): SiteContent {
  return { ...defaultSiteContent, ...stored }
}

/** Read site content from MongoDB, falling back to defaults. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const db = await getDb()
    const doc = await db.collection<SiteContentDoc>('siteContent').findOne({ _id: DOC_ID })
    if (doc?.content) return withDefaults(doc.content)
  } catch (e) {
    console.warn('[site-content] read failed, using defaults:', (e as Error)?.message)
  }
  return defaultSiteContent
}

/** Persist site content to MongoDB (admin only — guard at the API layer). */
export async function saveSiteContent(content: SiteContent): Promise<void> {
  const db = await getDb()
  await db.collection<SiteContentDoc>('siteContent').updateOne(
    { _id: DOC_ID },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true },
  )
}
