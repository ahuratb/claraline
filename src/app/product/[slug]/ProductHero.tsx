'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { urlFor } from '@/lib/sanity'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

interface Props {
  product: Product
  ingredientCopy: { en: string; ar?: string }[]
  howToUseEn: string[]
  howToUseAr: string[]
}

type Tab = 'description' | 'ingredients' | 'howto' | ''

export default function ProductHero({ product, ingredientCopy, howToUseEn, howToUseAr }: Props) {
  const images = product.images?.length ? product.images : []
  const imageUrls = images.map(img => urlFor(img).width(960).height(1152).url())

  const [activeImg, setActiveImg] = useState(0)
  const [shade, setShade] = useState(product.shades?.[0]?.name_en ?? '')
  const [shadeAr, setShadeAr] = useState(product.shades?.[0]?.name_ar ?? '')
  const [qty, setQty] = useState(1)
  const [openTab, setOpenTab] = useState<Tab>('description')

  const heroRef = useRef<HTMLDivElement>(null)
  const [stickyVisible, setStickyVisible] = useState(false)

  const addItem = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.openCart)

  useEffect(() => {
    const target = heroRef.current
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: '-120px 0px 0px 0px', threshold: 0 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const inStock = product.inStock !== false
  const installment = (product.price / 4)

  function handleAdd() {
    const image = product.images?.[0] ? urlFor(product.images[0]).width(400).url() : undefined
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product._id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        price: product.price,
        quantity: 1,
        image,
        shade: shade || undefined,
      })
    }
    toast.success(`${product.name_en} added ✦`)
    openCart()
  }

  function handleShare() {
    if (typeof window === 'undefined') return
    const nav = window.navigator as Navigator & { share?: (data: { title?: string; url?: string }) => Promise<void> }
    if (typeof nav.share === 'function') {
      nav.share({ title: product.name_en, url: window.location.href }).catch(() => {})
    } else if (nav.clipboard) {
      nav.clipboard.writeText(window.location.href).then(() => toast.success('Link copied ✦'))
    }
  }

  function toggleTab(t: Tab) {
    setOpenTab(prev => (prev === t ? '' : t))
  }

  return (
    <>
      <div className="pdp-hero" ref={heroRef}>
        {/* ─── LEFT — Gallery (sticky) ─── */}
        <div className="pdp-gallery">
          <div className="pdp-gallery-frame">
            {imageUrls.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,169,110,0.18)', fontSize: '64px' }}>✦</div>
            )}
            {imageUrls.map((url, i) => (
              <div key={i} className={`pdp-gallery-img${i === activeImg ? ' active' : ''}`}>
                <Image
                  src={url}
                  alt={product.name_en}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
            {product.badge && (
              <span
                className="pdp-gallery-badge"
                style={{
                  background: product.badge === 'new' ? 'var(--rose)' : 'var(--champagne)',
                  color: product.badge === 'new' ? '#fff' : 'var(--obsidian)',
                  fontWeight: 600,
                }}
              >
                {product.badge}
              </span>
            )}
          </div>
          {imageUrls.length > 1 && (
            <div className="pdp-dots">
              {imageUrls.map((_, i) => (
                <button
                  key={i}
                  className={`pdp-dot${i === activeImg ? ' active' : ''}`}
                  aria-label={`Image ${i + 1}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT — Info ─── */}
        <div className="pdp-info">
          <span className="pdp-brandline">Claraline</span>
          <h1 className="pdp-title">{product.name_en}</h1>
          <p className="pdp-title-ar" lang="ar">{product.name_ar}</p>

          <div className="pdp-rating">
            <span className="pdp-stars" aria-hidden>★★★★★</span>
            <span className="pdp-rating-text en-only">4.8 · 248 reviews</span>
            <span className="pdp-rating-text ar-only" dir="rtl">4.8 · 248 مراجعة</span>
          </div>

          <div className="pdp-price-block">
            <div className="pdp-price">{formatPrice(product.price)}</div>
            <p className="pdp-installment en-only">or 4 payments of {formatPrice(installment)} with Tabby / Tamara</p>
            <p className="pdp-installment ar-only" dir="rtl">أو ٤ دفعات بقيمة {formatPrice(installment)} مع تابي / تمارا</p>
          </div>

          <div className="pdp-divider" />

          {product.description_en && (
            <p className="pdp-tagline en-only">{product.description_en}</p>
          )}
          {product.description_ar && (
            <p className="pdp-tagline-ar ar-only" dir="rtl">{product.description_ar}</p>
          )}

          {product.shades && product.shades.length > 0 && (
            <div className="pdp-shades">
              <div className="pdp-shades-head">
                <span className="pdp-shades-label en-only">Shade — اللون</span>
                <span className="pdp-shades-label ar-only" dir="rtl">اللون — Shade</span>
                <span className="pdp-shades-selected en-only">{shade}</span>
                <span className="pdp-shades-selected ar-only" dir="rtl">{shadeAr}</span>
              </div>
              <div className="pdp-shade-row">
                {product.shades.map(s => (
                  <button
                    key={s.hex + s.name_en}
                    className={`pdp-shade-swatch${shade === s.name_en ? ' selected' : ''}`}
                    style={{ background: s.hex }}
                    aria-label={s.name_en}
                    title={s.name_en}
                    onClick={() => { setShade(s.name_en); setShadeAr(s.name_ar) }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pdp-buy-row">
            <div className="pdp-qty" role="group" aria-label="Quantity">
              <button aria-label="Decrease" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="pdp-qty-num">{qty}</span>
              <button aria-label="Increase" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="pdp-cta" onClick={handleAdd} disabled={!inStock}>
              <span className="en-only">{inStock ? `Add to bag — ${formatPrice(product.price * qty)}` : 'Out of stock'}</span>
              <span className="ar-only">{inStock ? `أضيفي للحقيبة — ${formatPrice(product.price * qty)}` : 'غير متوفر'}</span>
            </button>
          </div>

          <div className="pdp-secondary">
            <button className="pdp-ghost" type="button" onClick={() => toast.success('Saved ✦')}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l9.84-9.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="en-only">Save</span>
              <span className="ar-only">احفظي</span>
            </button>
            <button className="pdp-ghost" type="button" onClick={handleShare}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span className="en-only">Share</span>
              <span className="ar-only">شاركي</span>
            </button>
          </div>

          <div className="pdp-trust">
            <span className="pdp-trust-item">
              <span className="pdp-trust-mark">✦</span>
              <span className="en-only">Free delivery KWD 20+</span>
              <span className="ar-only" dir="rtl">توصيل مجاني فوق ٢٠ د.ك</span>
            </span>
            <span className="pdp-trust-item">
              <span className="pdp-trust-mark">✦</span>
              <span className="en-only">Halal certified</span>
              <span className="ar-only" dir="rtl">حلال معتمد</span>
            </span>
            <span className="pdp-trust-item">
              <span className="pdp-trust-mark">✦</span>
              <span className="en-only">Cruelty free</span>
              <span className="ar-only" dir="rtl">خالٍ من القسوة</span>
            </span>
          </div>

          {/* ─── ACCORDION ─── */}
          <div className="pdp-accordion">
            <AccordionItem
              labelEn="Description"
              labelAr="الوصف"
              open={openTab === 'description'}
              onToggle={() => toggleTab('description')}
            >
              {product.description_en && <p className="en-only">{product.description_en}</p>}
              {product.description_ar && <p className="ar-only" dir="rtl">{product.description_ar}</p>}
              {!product.description_en && (
                <p className="en-only">A signature Claraline ritual, crafted in Kuwait for the woman who values quiet luxury and lasting comfort.</p>
              )}
              {product.benefits_en && (
                <p className="en-only" style={{ marginTop: '16px', color: 'var(--muted)' }}>{product.benefits_en}</p>
              )}
              {product.benefits_ar && (
                <p className="ar-only" dir="rtl" style={{ marginTop: '16px' }}>{product.benefits_ar}</p>
              )}
            </AccordionItem>

            <AccordionItem
              labelEn="Ingredients"
              labelAr="المكونات"
              open={openTab === 'ingredients'}
              onToggle={() => toggleTab('ingredients')}
            >
              <ul className="pdp-ing-list">
                {ingredientCopy.map(ing => (
                  <li key={ing.en}>
                    <span className="pdp-ing-dot" />
                    <div>
                      <div className="pdp-ing-name">{ing.en}</div>
                      {ing.ar && <div className="pdp-ing-note">{ing.ar}</div>}
                    </div>
                  </li>
                ))}
              </ul>
              {product.ingredients_en && (
                <p className="en-only" style={{ marginTop: '20px', color: 'var(--muted)', fontSize: '11px', lineHeight: 1.8, letterSpacing: '0.04em' }}>
                  {product.ingredients_en}
                </p>
              )}
              {product.ingredients_ar && (
                <p className="ar-only" dir="rtl" style={{ marginTop: '20px', color: 'var(--muted)', fontSize: '11px', lineHeight: 1.95, letterSpacing: '0.02em' }}>
                  {product.ingredients_ar}
                </p>
              )}
            </AccordionItem>

            <AccordionItem
              labelEn="How to use"
              labelAr="طريقة الاستخدام"
              open={openTab === 'howto'}
              onToggle={() => toggleTab('howto')}
            >
              <ol className="pdp-steps en-only">
                {howToUseEn.map((step, i) => (
                  <li key={i}>
                    <span className="pdp-step-num">0{i + 1}</span>
                    <span className="pdp-step-body">{step}</span>
                  </li>
                ))}
              </ol>
              <ol className="pdp-steps ar-only" dir="rtl">
                {howToUseAr.map((step, i) => (
                  <li key={i}>
                    <span className="pdp-step-num">0{i + 1}</span>
                    <span className="pdp-step-body">{step}</span>
                  </li>
                ))}
              </ol>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* ─── Mobile sticky add-to-bag ─── */}
      <div className={`pdp-sticky-buy${stickyVisible ? ' visible' : ''}`}>
        <div className="pdp-sticky-buy-inner">
          <div className="pdp-sticky-info">
            <div className="pdp-sticky-name">{product.name_en}</div>
            <div className="pdp-sticky-price">{formatPrice(product.price * qty)}</div>
          </div>
          <button className="pdp-sticky-cta" onClick={handleAdd} disabled={!inStock}>
            <span className="en-only">{inStock ? 'Add to bag' : 'Sold out'}</span>
            <span className="ar-only">{inStock ? 'للحقيبة' : 'انتهى'}</span>
          </button>
        </div>
      </div>
    </>
  )
}

function AccordionItem({
  labelEn, labelAr, open, onToggle, children,
}: {
  labelEn: string; labelAr: string; open: boolean
  onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className={`pdp-acc-item${open ? ' open' : ''}`}>
      <button className="pdp-acc-header" onClick={onToggle} aria-expanded={open}>
        <span>
          <span className="pdp-acc-title-en en-only">{labelEn}</span>
          <span className="pdp-acc-title-en ar-only" dir="rtl">{labelAr}</span>
          <span className="pdp-acc-title-ar en-only" dir="rtl">{labelAr}</span>
          <span className="pdp-acc-title-ar ar-only">{labelEn}</span>
        </span>
        <span className="pdp-acc-toggle" aria-hidden />
      </button>
      <div className="pdp-acc-body">
        <div className="pdp-acc-body-inner">
          {children}
        </div>
      </div>
    </div>
  )
}
