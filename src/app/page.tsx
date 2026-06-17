import Link from 'next/link'
import VideoScroll from '@/components/VideoScroll'
import { LipCarousel, EyeCarousel } from '@/components/CinematicCarousel'
import NewsletterForm from '@/components/NewsletterForm'
import CategoryGrid from '@/components/CategoryGrid'
import LuxurySlider from '@/components/LuxurySlider'
import { getProductsByCollection } from '@/lib/sanity'
import { getSiteContent, type VideoBlock, type MarqueeItem } from '@/lib/site-content'

export const revalidate = 3600

// Drop CTAs with no label so empty buttons never render.
function clean(block: VideoBlock): VideoBlock {
  return {
    ...block,
    overlays: block.overlays.map(o =>
      o.cta && !o.cta.label ? { ...o, cta: undefined } : o
    ),
  }
}

function Marquee({ items, reverse, editPath }: { items: MarqueeItem[]; reverse?: boolean; editPath?: string }) {
  return (
    <div className="marquee" data-edit={editPath} data-edit-label="Scrolling bar">
      <div className={`marquee-track${reverse ? ' rev' : ''}`}>
        {[...items, ...items].map((item, i) => (
          <span key={i}>
            <span className="m-item en-only">{item.en}</span>
            <span className="m-item ar-only">{item.ar}</span>
            <span className="m-dot"> ✦ </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default async function HomePage() {
  const [lipProducts, eyeProducts, content] = await Promise.all([
    getProductsByCollection('lip'),
    getProductsByCollection('eye'),
    getSiteContent(),
  ])

  return (
    <main className="home-page">

      {/* ══════════════════ VIDEO 1 — HERO ══════════════════ */}
      <VideoScroll
        src={content.hero.src}
        sectionHeight={content.hero.sectionHeight ?? '500vh'}
        maxSeconds={content.hero.maxSeconds}
        overlays={clean(content.hero).overlays}
        mediaType={content.hero.mediaType}
        image={content.hero.image}
        bg={content.hero.bg}
        fit={content.hero.fit}
        textPos={content.hero.textPos}
        editPrefix="hero"
      />

      {/* ══════════════════ LIP CAROUSEL ══════════════════ */}
      <div className="fixed-section" id="products1">
        <div className="sep"></div>
        <LipCarousel products={lipProducts} />
        <div className="sep"></div>
      </div>

      {/* ══════════════════ PRODUCT CATEGORIES ══════════════════ */}
      <CategoryGrid
        categories={content.categories}
        labelEn={content.categoryLabelEn}
        labelAr={content.categoryLabelAr}
        titleEn={content.categoryTitleEn}
        titleAr={content.categoryTitleAr}
      />

      {/* ══════════════════ FULL-SCREEN LUXURY SLIDER ══════════════════ */}
      <LuxurySlider slides={content.slides} />

      {/* ══════════════════ VIDEOS 2 + 5 — SIDE BY SIDE ══════════════════ */}
      <div className="video-row-pair">
        <div className="video-row-half">
          <VideoScroll
            src={content.sideLeft.src}
            sectionHeight={content.sideLeft.sectionHeight}
            maxSeconds={content.sideLeft.maxSeconds}
            overlays={clean(content.sideLeft).overlays}
            mediaType={content.sideLeft.mediaType}
            image={content.sideLeft.image}
            bg={content.sideLeft.bg}
            fit={content.sideLeft.fit}
            textPos={content.sideLeft.textPos}
            editPrefix="sideLeft"
          />
        </div>
        <div className="video-row-half">
          <VideoScroll
            src={content.sideRight.src}
            sectionHeight={content.sideRight.sectionHeight}
            maxSeconds={content.sideRight.maxSeconds}
            overlays={clean(content.sideRight).overlays}
            mediaType={content.sideRight.mediaType}
            image={content.sideRight.image}
            bg={content.sideRight.bg}
            fit={content.sideRight.fit}
            textPos={content.sideRight.textPos}
            editPrefix="sideRight"
          />
        </div>
      </div>

      {/* ══════════════════ MARQUEE + STATS ══════════════════ */}
      <div className="fixed-section">
        <Marquee items={content.marqueeTop} editPath="marqueeTop" />

        <div className="stats-strip reveal-target">
          {content.stats.map((s, i) => (
            <div key={s.num + s.en} className="stat-item" data-edit={`stats.${i}`} data-edit-label={`Stat ${i + 1}`}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label en-only">{s.en}</div>
              <div className="stat-ar ar-only">{s.ar}</div>
            </div>
          ))}
        </div>

        <div className="sep"></div>
      </div>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <div className="fixed-section">
        <div className="sep"></div>
        <div className="story-strip reveal-target" id="features">
          <div className="story-cols">
            <div className="story-col-left" data-edit="features" data-edit-label="Features heading">
              <span className="sc-label en-only">{content.features.labelEn}</span>
              <span className="sc-label ar-only">{content.features.labelAr}</span>
              <h2 className="sc-title en-only" dangerouslySetInnerHTML={{ __html: content.features.titleEn }} />
              <h2 className="sc-title ar-only" dangerouslySetInnerHTML={{ __html: content.features.titleAr }} />
            </div>
            <div className="story-col-right reveal-target">
              {content.features.cards.map((f, i) => (
                <div key={f.en} className="feature-card" data-edit={`features.cards.${i}`} data-edit-label={`Feature ${i + 1}`}>
                  <span className="fc-icon">{f.icon}</span>
                  <div className="fc-title en-only">{f.en}</div>
                  <div className="fc-title ar-only">{f.ar}</div>
                  <div className="fc-body en-only" style={{ fontFamily: "'Cormorant Garamond', serif", direction: 'ltr' }}>{f.bodyEn}</div>
                  <div className="fc-body ar-only">{f.bodyAr}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sep"></div>
      </div>

      {/* ══════════════════ EYE CAROUSEL ══════════════════ */}
      <div className="fixed-section" id="products2">
        <div className="sep"></div>
        <EyeCarousel products={eyeProducts} />
        <div className="sep"></div>
      </div>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <div className="fixed-section">
        <div className="testimonials reveal-target" id="testimonials">
          <div className="test-header" data-edit="testimonials" data-edit-label="Testimonials heading">
            <span className="t-label en-only">{content.testimonials.labelEn}</span>
            <span className="t-label ar-only">{content.testimonials.labelAr}</span>
            <h2 className="t-title">
              <span className="en-only" dangerouslySetInnerHTML={{ __html: content.testimonials.titleEn }} />
              <span className="ar-only" dangerouslySetInnerHTML={{ __html: content.testimonials.titleAr }} />
            </h2>
          </div>
          <div className="test-grid">
            {content.testimonials.items.map((t, i) => (
              <div key={t.name} className="test-card" data-edit={`testimonials.items.${i}`} data-edit-label={`Review ${i + 1}`}>
                <p className="test-quote en-only">&ldquo;{t.en.replace(/^"|"$/g, '')}&rdquo;</p>
                <p className="test-quote-ar ar-only">{t.ar}</p>
                <div className="test-author">
                  <div className="test-avatar">{t.initials}</div>
                  <div>
                    <div className="test-name">{t.name}</div>
                    <div className="test-loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sep"></div>
      </div>

      {/* ══════════════════ NEWSLETTER + FOOTER ══════════════════ */}
      <div className="fixed-section">
        <div className="sep"></div>

        <div className="newsletter" data-edit="newsletter" data-edit-label="Newsletter">
          <span className="nl-label en-only">{content.newsletter.labelEn}</span>
          <span className="nl-label ar-only">{content.newsletter.labelAr}</span>
          <h2 className="nl-title">
            <span className="en-only" dangerouslySetInnerHTML={{ __html: content.newsletter.titleEn }} />
            <span className="ar-only" dangerouslySetInnerHTML={{ __html: content.newsletter.titleAr }} />
          </h2>
          <p className="nl-sub en-only" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{content.newsletter.subEn}</p>
          <p className="nl-sub ar-only">{content.newsletter.subAr}</p>
          <NewsletterForm />
        </div>

        {/* Marquee 2 */}
        <Marquee items={content.marqueeBottom} reverse editPath="marqueeBottom" />

        {/* Footer */}
        <footer data-edit="footer" data-edit-label="Footer">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <span className="claraline-logo" style={{ width: '180px', height: '44px' }} aria-label="Claraline" />
              </div>
              <p className="footer-tag en-only" style={{ fontFamily: "'Cormorant Garamond', serif", direction: 'ltr' }}>{content.footer.tagEn}</p>
              <p className="footer-tag ar-only">{content.footer.tagAr}</p>
              <div className="footer-socials">
                {['ig', 'tt', 'wa', 'sc'].map(s => (
                  <div key={s} className="footer-social">{s}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="footer-col-title en-only">{content.footer.shopTitleEn}</div>
              <div className="footer-col-title ar-only">{content.footer.shopTitleAr}</div>
              <ul className="footer-links en-only">
                {content.footer.shopLinks.map(l => <li key={l.en}>{l.en}</li>)}
              </ul>
              <ul className="footer-links ar-only">
                {content.footer.shopLinks.map(l => <li key={l.ar}>{l.ar}</li>)}
              </ul>
            </div>
            <div>
              <div className="footer-col-title en-only">{content.footer.contactTitleEn}</div>
              <div className="footer-col-title ar-only">{content.footer.contactTitleAr}</div>
              <ul className="footer-links en-only">
                {content.footer.contactLinks.map(l => <li key={l.en}>{l.en}</li>)}
              </ul>
              <ul className="footer-links ar-only">
                {content.footer.contactLinks.map(l => <li key={l.ar}>{l.ar}</li>)}
              </ul>
            </div>
            <div>
              <div className="footer-col-title en-only">{content.footer.infoTitleEn}</div>
              <div className="footer-col-title ar-only">{content.footer.infoTitleAr}</div>
              <ul className="footer-links en-only">
                {content.footer.infoLinks.map(l => <li key={l.en}>{l.en}</li>)}
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms &amp; Conditions</Link></li>
              </ul>
              <ul className="footer-links ar-only">
                {content.footer.infoLinks.map(l => <li key={l.ar}>{l.ar}</li>)}
                <li><Link href="/privacy">سياسة الخصوصية</Link></li>
                <li><Link href="/terms">الشروط والأحكام</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy en-only">{content.footer.copyrightEn}</span>
            <span className="footer-copy ar-only">{content.footer.copyrightAr}</span>
            <span className="footer-copy en-only" style={{ display: 'flex', gap: '16px' }}>
              <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>Privacy</Link>
              <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>Terms</Link>
            </span>
            <span className="footer-copy ar-only" style={{ display: 'flex', gap: '16px', direction: 'rtl' }}>
              <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>الخصوصية</Link>
              <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>الشروط</Link>
            </span>
            <span className="footer-copy">KNET · Tap Pay · Visa · Mastercard · Apple Pay</span>
          </div>

          {/* ZoeyBloom credit */}
          <div style={{
            borderTop: '1px solid rgba(201,169,110,0.08)',
            padding: '24px 40px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <p className="en-only" style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>
              Powered by{' '}
              <strong style={{ color: 'var(--champagne)', letterSpacing: '2px' }}>ZoeyBloom</strong>
            </p>
            <p className="ar-only" style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '1px', direction: 'rtl', textAlign: 'right', margin: 0 }}>
              مُطوَّر بواسطة{' '}
              <strong style={{ color: 'var(--champagne)', letterSpacing: '1px' }}>ZoeyBloom</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
              <a href="tel:+96541119050" style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '1px', textDecoration: 'none', textTransform: 'none' }}>
                +965 4111 9050
              </a>
              <a href="mailto:info@zoeybloom.me" style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '1px', textDecoration: 'none', textTransform: 'none' }}>
                info@zoeybloom.me
              </a>
              <span style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'none' }}>
                The 8 Mall, Floor −1, Office 17, Salem AlMubarak St., Al Salmiya, Kuwait
              </span>
            </div>
          </div>
        </footer>
      </div>

    </main>
  )
}
