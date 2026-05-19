# claraline — MASTER PROMPT FOR CLAUDE CODE
# کپی کامل این فایل را در Claude Code paste کن

---

You are building **claraline** — a bilingual (Arabic/English) luxury makeup e-commerce website for the Kuwaiti market. This is a production-ready project. Build everything step by step, test each phase before moving to the next, and ask me before making major architectural decisions.

---

## PHASE 0 — PROJECT SETUP

```bash
mkdir claraline && cd claraline
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install gsap @gsap/react zustand @sanity/client sanity next-sanity @portabletext/react
npm install resend zod react-hot-toast
npm install -D @types/node
```

Create this exact folder structure:

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    ← cinematic home
│   ├── shop/page.tsx               ← full catalog
│   ├── product/[slug]/page.tsx     ← single product
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── order-success/page.tsx
│   └── api/
│       ├── payment/initiate/route.ts
│       ├── payment/callback/route.ts
│       └── orders/route.ts
├── components/
│   ├── Nav.tsx
│   ├── VideoScroll.tsx
│   ├── ProductCarousel.tsx
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx
│   ├── CheckoutForm.tsx
│   └── RitualSection.tsx
├── lib/
│   ├── sanity.ts
│   ├── myfatoorah.ts
│   ├── store.ts
│   ├── resend.ts
│   └── utils.ts
├── sanity/
│   ├── sanity.config.ts
│   └── schemas/
│       ├── index.ts
│       ├── product.ts
│       └── collection.ts
└── types/
    └── index.ts
```

---

## PHASE 1 — DESIGN SYSTEM

### CSS Variables — add to `src/app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cairo:wght@300;400;600&display=swap');

:root {
  --obsidian: #0a0806;
  --champagne: #C9A96E;
  --ivory: #FAF5EE;
  --muted: #9a8a7a;
  --rose: #C4827A;
  --deep: #1a1208;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: auto; }
body {
  background: var(--obsidian);
  color: var(--ivory);
  font-family: 'Cormorant Garamond', serif;
  overflow-x: hidden;
  cursor: none;
}
```

### Typography rules:
- Display/Headlines: `Cormorant Garamond` — weight 300, italic for accent words
- Arabic text: `Cairo` — weight 300/400/600, always `direction: rtl`
- UI labels: `Cairo` — 9-11px, `letter-spacing: 0.3em`, `text-transform: uppercase`
- Body: `Cormorant Garamond` 14-16px, line-height 1.9

---

## PHASE 2 — TYPES

Create `src/types/index.ts`:

```typescript
export interface Product {
  _id: string
  _type: 'product'
  name_en: string
  name_ar: string
  slug: { current: string }
  price: number
  images: SanityImage[]
  collection: 'lip' | 'eye' | 'face' | 'gift'
  description_en: string
  description_ar: string
  ingredients_en?: string
  ingredients_ar?: string
  inStock: boolean
  badge?: 'new' | 'bestseller' | 'limited'
  featured: boolean
  shades?: Shade[]
}

export interface Shade {
  name_en: string
  name_ar: string
  hex: string
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
}

export interface CartItem {
  productId: string
  name_en: string
  name_ar: string
  price: number
  quantity: number
  image?: string
  shade?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customer: Customer
  status: 'pending' | 'paid' | 'failed'
  paymentId?: string
  createdAt: string
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
}

export interface MyFatoorahResponse {
  IsSuccess: boolean
  Message: string
  Data: {
    InvoiceURL?: string
    InvoiceId?: number
    PaymentMethods?: PaymentMethod[]
  }
}

export interface PaymentMethod {
  PaymentMethodId: number
  PaymentMethodEn: string
  PaymentMethodAr: string
  PaymentMethodCode: string
  IsDirectPayment: boolean
  ServiceCharge: number
  TotalAmount: number
  CurrencyIso: string
  ImageUrl: string
}
```

---

## PHASE 3 — ENVIRONMENT VARIABLES

Create `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token

# MyFatoorah
MYFATOORAH_API_KEY=your_api_key
MYFATOORAH_BASE_URL=https://apitest.myfatoorah.com
# production: https://api.myfatoorah.com

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Resend
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=orders@claraline.com
```

---

## PHASE 4 — SANITY SETUP

### `src/sanity/schemas/product.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name_en', title: 'Name (English)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'name_ar', title: 'الاسم بالعربية', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name_en', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'price', title: 'Price (KD)', type: 'number', validation: r => r.required().positive() }),
    defineField({
      name: 'images', title: 'Product Images', type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }]
    }),
    defineField({
      name: 'collection', title: 'Collection', type: 'string',
      options: { list: [
        { title: 'Lip', value: 'lip' },
        { title: 'Eye', value: 'eye' },
        { title: 'Face', value: 'face' },
        { title: 'Gift Sets', value: 'gift' }
      ]},
      validation: r => r.required()
    }),
    defineField({ name: 'description_en', title: 'Description (English)', type: 'text' }),
    defineField({ name: 'description_ar', title: 'الوصف بالعربية', type: 'text' }),
    defineField({ name: 'ingredients_en', title: 'Ingredients (English)', type: 'text' }),
    defineField({ name: 'ingredients_ar', title: 'المكونات بالعربية', type: 'text' }),
    defineField({ name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({
      name: 'badge', title: 'Badge', type: 'string',
      options: { list: ['new', 'bestseller', 'limited'] }
    }),
    defineField({
      name: 'shades', title: 'Shades', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name_en', type: 'string', title: 'Shade Name (EN)' },
          { name: 'name_ar', type: 'string', title: 'اسم اللون' },
          { name: 'hex', type: 'string', title: 'Hex Color' }
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'name_en', subtitle: 'price', media: 'images.0' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: `KD ${subtitle}`, media }
    }
  }
})
```

### `src/sanity/schemas/index.ts`

```typescript
import product from './product'
export const schemaTypes = [product]
```

### `src/sanity/sanity.config.ts`

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'claraline',
  title: 'claraline CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

### `src/lib/sanity.ts`

```typescript
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { Product } from '@/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

export async function getFeaturedProducts(): Promise<Product[]> {
  return client.fetch(`
    *[_type == "product" && featured == true && inStock == true] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, description_ar
    }
  `)
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  return client.fetch(`
    *[_type == "product" && collection == $collection && inStock == true] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, shades
    }
  `, { collection })
}

export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(`
    *[_type == "product" && inStock == true] | order(_createdAt desc) {
      _id, name_en, name_ar, slug, price, images, collection, badge, featured
    }
  `)
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id, name_en, name_ar, slug, price, images, collection,
      description_en, description_ar, ingredients_en, ingredients_ar,
      badge, inStock, shades
    }
  `, { slug })
}
```

---

## PHASE 5 — CART STATE (ZUSTAND)

### `src/lib/store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set(state => {
        const existing = state.items.find(i => i.productId === item.productId && i.shade === item.shade)
        if (existing) {
          return { items: state.items.map(i =>
            i.productId === item.productId && i.shade === item.shade
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )}
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),
      removeItem: (productId) => set(state => ({
        items: state.items.filter(i => i.productId !== productId)
      })),
      updateQuantity: (productId, quantity) => set(state => ({
        items: quantity === 0
          ? state.items.filter(i => i.productId !== productId)
          : state.items.map(i => i.productId === productId ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'claraline-cart' }
  )
)
```

---

## PHASE 6 — MYFATOORAH INTEGRATION

### `src/lib/myfatoorah.ts`

```typescript
const BASE_URL = process.env.MYFATOORAH_BASE_URL!
const API_KEY = process.env.MYFATOORAH_API_KEY!

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}

export async function initiatePayment(amount: number, currency = 'KWD') {
  const res = await fetch(`${BASE_URL}/v2/InitiatePayment`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ InvoiceAmount: amount, CurrencyIso: currency }),
  })
  return res.json()
}

export async function sendPayment(params: {
  amount: number
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  successUrl: string
  failUrl: string
  callBackUrl: string
  language?: 'AR' | 'EN'
}) {
  const body = {
    PaymentMethodId: 0,         // 0 = show all methods
    CustomerName: params.customerName,
    CustomerEmail: params.customerEmail,
    CustomerMobile: params.customerPhone,
    InvoiceValue: params.amount,
    DisplayCurrencyIso: 'KWD',
    CallBackUrl: params.callBackUrl,
    ErrorUrl: params.failUrl,
    Language: params.language ?? 'AR',
    CustomerReference: params.orderId,
    UserDefinedField: params.orderId,
    ExpireDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    InvoiceItems: [{ ItemName: 'claraline Order', Quantity: 1, UnitPrice: params.amount }],
  }
  const res = await fetch(`${BASE_URL}/v2/SendPayment`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function getPaymentStatus(paymentId: string) {
  const res = await fetch(`${BASE_URL}/v2/GetPaymentStatus`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ Key: paymentId, KeyType: 'PaymentId' }),
  })
  return res.json()
}
```

### `src/app/api/payment/initiate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendPayment } from '@/lib/myfatoorah'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().positive(),
  orderId: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  lang: z.enum(['AR', 'EN']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const base = process.env.NEXT_PUBLIC_BASE_URL

    const result = await sendPayment({
      amount: body.amount,
      orderId: body.orderId,
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      successUrl: `${base}/order-success?id=${body.orderId}`,
      failUrl: `${base}/checkout?error=payment_failed`,
      callBackUrl: `${base}/api/payment/callback`,
      language: body.lang ?? 'AR',
    })

    if (!result.IsSuccess) {
      return NextResponse.json({ error: result.Message }, { status: 400 })
    }

    return NextResponse.json({ url: result.Data.InvoiceURL })
  } catch (err) {
    console.error('[payment/initiate]', err)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
```

### `src/app/api/payment/callback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/myfatoorah'
import { sendOrderConfirmation } from '@/lib/resend'

export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get('paymentId')
  if (!paymentId) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=missing_id`)

  const status = await getPaymentStatus(paymentId)
  const isPaid = status?.Data?.InvoiceStatus === 'Paid'
  const orderId = status?.Data?.CustomerReference

  if (isPaid && orderId) {
    // TODO: update order status in your DB/Sanity
    // await updateOrderStatus(orderId, 'paid', paymentId)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?id=${orderId}`)
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=payment_failed`)
}
```

---

## PHASE 7 — EMAIL (RESEND)

### `src/lib/resend.ts`

```typescript
import { Resend } from 'resend'
import { Order } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(order: Order) {
  const itemsHtml = order.items.map(i =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #2a1a0a">${i.name_en}</td>
      <td style="padding:8px;border-bottom:1px solid #2a1a0a;text-align:center">${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #2a1a0a;text-align:right">KD ${(i.price * i.quantity).toFixed(3)}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customer.email,
    subject: `✦ Order Confirmed — claraline #${order.id}`,
    html: `
      <div style="background:#0a0806;color:#FAF5EE;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:48px 32px;">
        <h1 style="font-size:32px;font-weight:300;letter-spacing:0.3em;color:#C9A96E;text-align:center;margin-bottom:8px">claraline</h1>
        <p style="text-align:center;color:#9a8a7a;font-size:12px;letter-spacing:0.3em;margin-bottom:40px">LUXURY MAKEUP · KUWAIT</p>
        <h2 style="font-size:22px;font-weight:300;margin-bottom:24px">Order Confirmed ✦</h2>
        <p style="color:#9a8a7a;margin-bottom:32px">Thank you, ${order.customer.name}. Your order <strong style="color:#C9A96E">#${order.id}</strong> has been received.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
          <thead><tr style="border-bottom:1px solid #C9A96E">
            <th style="padding:8px;text-align:left;font-size:10px;letter-spacing:0.2em">ITEM</th>
            <th style="padding:8px;text-align:center;font-size:10px;letter-spacing:0.2em">QTY</th>
            <th style="padding:8px;text-align:right;font-size:10px;letter-spacing:0.2em">TOTAL</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;font-size:18px;color:#C9A96E;margin-bottom:40px">
          Total: KD ${order.total.toFixed(3)}
        </div>
        <p style="color:#9a8a7a;font-size:12px;text-align:center">Questions? WhatsApp us · claraline.com</p>
      </div>
    `,
  })
}
```

---

## PHASE 8 — COMPONENTS

### `src/components/Nav.tsx`

Build a fixed navigation bar with:
- Logo: "claraline" — `Cormorant Garamond`, weight 300, letter-spacing 0.4em, color `#C9A96E`
- Links: Collection, Ritual, About, عربي — `Cairo` 9px, uppercase, opacity 0.6
- Right: Language toggle (EN/AR), Cart icon with item count badge
- On scroll > 60px: add `backdrop-blur-md` + `bg-black/80` + `border-b border-champagne/10`
- Cart icon click: opens `CartDrawer`
- Fade-in on mount with `animation-delay` stagger

### `src/components/CartDrawer.tsx`

Build a slide-in drawer from the right:
- Overlay: `bg-black/60` blur
- Drawer: `w-[420px]`, `bg-[#0a0806]`, `border-l border-champagne/15`
- Header: "Your Bag" + item count + close button
- Items list: product name EN + AR, price, quantity controls (+/-), remove
- Footer: subtotal + "Proceed to Checkout" button → `/checkout`
- Empty state: italic message "Your bag is empty" + CTA to shop
- Use `useCartStore` from Zustand

### `src/components/VideoScroll.tsx`

```typescript
'use client'
import { useEffect, useRef } from 'react'

interface VideoScrollProps {
  src: string
  chapter: string
  chapterNum: string
  overlays: Array<{
    id: string
    startPct: number
    endPct: number
    eyebrow?: string
    headline: string
    headlineItalic?: string
    sublineAr?: string
    cta?: { label: string; href: string }
  }>
  sectionHeight?: string  // default '500vh', subsequent '400vh'
}

export default function VideoScroll({ src, chapter, chapterNum, overlays, sectionHeight = '400vh' }: VideoScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    video.pause()
    video.currentTime = 0

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const scrolled = -rect.top
      const total = section.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / total))

      if (progressRef.current) {
        progressRef.current.style.width = `${progress * 100}%`
      }

      if (video.duration && !isNaN(video.duration)) {
        const target = progress * video.duration
        if (Math.abs(video.currentTime - target) > 0.08) {
          video.currentTime = target
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={sectionRef} style={{ height: sectionHeight }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-obsidian">
        {/* Chapter badge */}
        <div className="absolute top-10 left-14 z-10 text-champagne/60 font-cairo text-[9px] tracking-[0.5em] uppercase">
          Chapter <span className="text-champagne">{chapterNum}</span> — {chapter}
        </div>

        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          muted playsInline preload="auto"
        />

        {/* Overlays rendered per scroll progress — implement with state */}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne/10">
          <div ref={progressRef} className="h-full bg-champagne transition-[width_50ms_linear]" style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  )
}
```

### `src/components/ProductCard.tsx`

```typescript
interface ProductCardProps {
  product: Product
  index?: number
}
```

Build with:
- Aspect ratio 3/4 card
- Image from Sanity with `urlFor()` — fallback to decorative SVG if no image
- Hover: image scale 1.06 + Quick Add overlay slides up from bottom
- Badge: "New" (rose), "Best Seller" (champagne), "Limited" (dark)
- Name EN (Cormorant 20px) + Name AR (Cairo 11px, RTL)
- Price in KD format: `KD ${price.toFixed(3)}`
- Star rating display
- onClick: add to cart via `useCartStore`
- Stagger animation on scroll reveal

### `src/components/ProductCarousel.tsx`

Build a horizontal scrolling carousel with:
- Header: section label + title + Arabic subtitle + prev/next arrows
- Track: flexbox, gap 24px, smooth transform transition
- Arrow navigation with bounds checking
- Receives `products: Product[]` and `title`, `titleItalic`, `labelAr` props

---

## PHASE 9 — PAGES

### `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import CartDrawer from '@/components/CartDrawer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'claraline — Luxury Makeup Kuwait',
  description: 'كالرالاين — ميك أب فاخر من الكويت',
  keywords: ['makeup', 'luxury', 'kuwait', 'كالرالاين', 'ميكاب'],
  openGraph: {
    title: 'claraline',
    description: 'Luxury Makeup from Kuwait',
    locale: 'ar_KW',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <CartDrawer />
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1a1208',
            color: '#FAF5EE',
            border: '0.5px solid rgba(201,169,110,0.4)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '12px',
          }
        }} />
      </body>
    </html>
  )
}
```

### `src/app/page.tsx` — CINEMATIC HOME

Structure (in order):
1. `<VideoScroll>` — video `1.mp4`, height `500vh`, overlays at 5-35%, 45-72%, 80-100%
2. Marquee strip (bilingual)
3. `<ProductCarousel>` — `getFeaturedProducts()` filtered by `collection === 'lip'`
4. `<VideoScroll>` — video `2.mp4`, height `400vh`
5. Ritual section (2-col: text left, decorative SVG right)
6. `<VideoScroll>` — video `3.mp4`
7. Stats strip (4 columns: 12K+, 48 shades, 6 GCC, 100% cruelty free)
8. `<VideoScroll>` — video `4.mp4`
9. Features grid (6 cards: Halal, Long Lasting, Gulf Climate, Cruelty Free, Rich Pigment, Kuwait Made)
10. `<VideoScroll>` — video `5.mp4`
11. `<ProductCarousel>` — collection `eye`
12. `<VideoScroll>` — video `6.mp4`
13. Testimonials (3 cards — bilingual quotes)
14. `<VideoScroll>` — video `7.mp4`
15. Newsletter signup
16. Footer (4 columns + payment logos)

### `src/app/shop/page.tsx`

- All products grid with filter tabs: All / Lip / Eye / Face / Gift
- Filter state with `useState`
- Products from `getAllProducts()`
- Masonry-style or uniform grid, 3 columns desktop / 2 tablet / 1 mobile
- Sort: Featured, Price Low-High, New

### `src/app/product/[slug]/page.tsx`

- `generateStaticParams` from all product slugs
- Hero: large image + product name EN/AR, price, shade selector
- Add to cart button
- Description tabs: Description / Ingredients — bilingual
- Related products carousel

### `src/app/checkout/page.tsx`

Form fields:
- Full Name (required)
- Email (required, validated)
- Phone (Kuwait format: +965 XXXX XXXX)
- Delivery Address
- City (dropdown: Kuwait City, Salmiya, Hawalli, etc.)
- Country (default: Kuwait)
- Order summary on the right (items, subtotal, delivery, total)
- "Pay Now" button → POST `/api/payment/initiate` → redirect to MyFatoorah URL

### `src/app/order-success/page.tsx`

- Check order ID from URL params
- Display order confirmation with champagne color accents
- Order number, items summary, next steps
- Call `sendOrderConfirmation` if not already sent
- CTA: "Continue Shopping"

---

## PHASE 10 — VIDEO HANDLING

Place video files in `public/videos/`:
```
public/videos/1.mp4
public/videos/2.mp4
...
public/videos/7.mp4
```

Update all `src` paths to `/videos/1.mp4` etc.

For production, compress each video:
```bash
ffmpeg -y -i original.mp4 -an \
  -vf "scale=1600:-2" \
  -c:v libx264 -crf 26 -preset slow \
  -x264-params "keyint=2:min-keyint=2:scenecut=0" \
  -movflags +faststart public/videos/1.mp4
```

Target: each video under 25MB, total under 150MB.

---

## PHASE 11 — DEPLOYMENT

### `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
}

export default config
```

### Deploy steps:
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "initial: claraline launch"
git branch -M main
git remote add origin https://github.com/USERNAME/claraline.git
git push -u origin main

# 2. Vercel: import repo, add all env vars from .env.local

# 3. Hostinger DNS → Vercel
# A Record:     @ → 76.76.21.21
# CNAME Record: www → cname.vercel-dns.com

# 4. Switch MyFatoorah to production URL
# MYFATOORAH_BASE_URL=https://api.myfatoorah.com
```

---

## BUILD ORDER FOR CLAUDE CODE

Execute in this exact order:

```
1.  Create folder structure
2.  Install dependencies
3.  Setup globals.css + design tokens
4.  Create types/index.ts
5.  Setup .env.local (remind user to fill values)
6.  Build Sanity schemas + sanity.config.ts
7.  Build lib/sanity.ts
8.  Build lib/store.ts (Zustand)
9.  Build lib/myfatoorah.ts
10. Build lib/resend.ts
11. Build API routes (payment)
12. Build Nav component
13. Build CartDrawer component
14. Build ProductCard component
15. Build ProductCarousel component
16. Build VideoScroll component
17. Build app/layout.tsx
18. Build app/page.tsx (home)
19. Build app/shop/page.tsx
20. Build app/product/[slug]/page.tsx
21. Build app/checkout/page.tsx
22. Build app/order-success/page.tsx
23. Setup next.config.ts
24. Test: npm run dev
25. Fix any TypeScript errors
26. Build: npm run build
27. Deploy to Vercel
```

---

## IMPORTANT NOTES FOR CLAUDE CODE

- Always use `'use client'` for components with hooks or event handlers
- Server Components fetch data directly (no useEffect for data)
- Arabic text: always `dir="rtl"` + `font-family: Cairo`
- All prices: `price.toFixed(3)` + "KD" prefix
- Images: always use `next/image` with `urlFor()` from Sanity
- Videos: `muted playsInline preload="auto"` — never autoplay
- MyFatoorah test key works on `apitest.myfatoorah.com` only
- Keep Sanity Studio accessible at `/studio` route for content management
- Mobile: test on real iPhone (Safari has video restrictions)

---

## SANITY STUDIO ROUTE

Add `src/app/studio/[[...tool]]/page.tsx`:

```typescript
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

Access at: `localhost:3000/studio` (or `claraline.com/studio` in production)

---

START NOW. Begin with Phase 0 (project setup) and work through each phase sequentially. After each phase, run `npm run dev` to verify no errors before proceeding. Ask me if you need clarification on any business logic (pricing, delivery zones, payment methods).
