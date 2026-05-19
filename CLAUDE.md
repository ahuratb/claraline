# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**claraline** — bilingual (Arabic/English) luxury makeup e-commerce for the Kuwaiti market.  
Stack: Next.js 14 App Router · TypeScript · Tailwind CSS · Sanity CMS · MyFatoorah payments · Resend email · Zustand cart.

## Commands

```bash
npm run dev          # start dev server at localhost:3000
npm run build        # production build
npm run lint         # ESLint
npx tsc --noEmit    # TypeScript type-check only
```

Sanity Studio: `localhost:3000/studio` (requires `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`)

Videos go in `public/videos/1.mp4` … `public/videos/7.mp4`.

## Architecture

### Routing (App Router)
| Route | Type | Notes |
|---|---|---|
| `/` | Server | Cinematic home — fetches featured + eye products |
| `/shop` | Server + Client | `page.tsx` fetches all products; `ShopClient.tsx` handles filter/sort |
| `/product/[slug]` | Server + Client | `page.tsx` is RSC; `AddToCartButton.tsx` is `'use client'` |
| `/cart` | Client | Pure client component, reads Zustand |
| `/checkout` | Client (`CheckoutForm`) | POSTs to `/api/payment/initiate`, redirects to MyFatoorah |
| `/order-success` | Server | Reads `?id=` from URL params |
| `/studio/[[...tool]]` | Client | Embedded Sanity Studio |
| `/api/payment/initiate` | Route Handler | Validates → calls MyFatoorah SendPayment |
| `/api/payment/callback` | Route Handler | GET from MyFatoorah → checks status → redirect |
| `/api/orders` | Route Handler | Persists order (stub — add DB in production) |

### Key libraries
- **Zustand** (`src/lib/store.ts`) — cart state, persisted to `localStorage` as `claraline-cart`
- **Sanity** (`src/lib/sanity.ts`) — `client`, `urlFor()`, typed fetch helpers
- **MyFatoorah** (`src/lib/myfatoorah.ts`) — `sendPayment()`, `getPaymentStatus()`
- **Resend** (`src/lib/resend.ts`) — `sendOrderConfirmation(order)`

### Design system
CSS variables in `globals.css`: `--obsidian` `--champagne` `--ivory` `--muted` `--rose` `--deep`.  
Fonts: `Cormorant Garamond` (display/body EN) · `Cairo` (Arabic + UI labels).  
Arabic text always needs `dir="rtl"` + `fontFamily: 'Cairo, sans-serif'`.  
Prices: always `price.toFixed(3)` + "KD" prefix — use `formatPrice()` from `lib/utils.ts`.

### `VideoScroll` component
Scroll-synced video: section height ≫ viewport, sticky inner div, video `currentTime` driven by scroll progress 0→1. Overlays appear/exit via CSS `opacity` + `translateY` based on `startPct`/`endPct` thresholds. Videos must stay paused — never add autoplay.

### Component conventions
- `'use client'` required for: hooks, event handlers, browser APIs
- Server Components fetch data directly (no `useEffect` for data fetching)
- `ProductCard` uses `IntersectionObserver` for `.reveal-target` stagger entrance
- All `next/image` usage requires Sanity images via `urlFor(source).width(n).url()`

## Environment variables (`.env.local`)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
MYFATOORAH_API_KEY=
MYFATOORAH_BASE_URL=https://apitest.myfatoorah.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=
RESEND_FROM_EMAIL=orders@claraline.com
```
Switch `MYFATOORAH_BASE_URL` to `https://api.myfatoorah.com` for production.

## Deployment
Vercel + Hostinger DNS:
```
A Record:     @ → 76.76.21.21
CNAME Record: www → cname.vercel-dns.com
```
