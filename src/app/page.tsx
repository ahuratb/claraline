import Image from 'next/image'
import VideoScroll from '@/components/VideoScroll'
import { LipCarousel, EyeCarousel } from '@/components/CinematicCarousel'
import RitualSection from '@/components/RitualSection'
import NewsletterForm from '@/components/NewsletterForm'
import CategoryGrid from '@/components/CategoryGrid'
import LuxurySlider from '@/components/LuxurySlider'

export const revalidate = 3600

export default function HomePage() {
  return (
    <main>

      {/* ══════════════════ VIDEO 1 — HERO ══════════════════ */}
      <VideoScroll
        src="/videos/1.mp4"
        sectionHeight="500vh"
        overlays={[
          {
            id: 't1a',
            startPct: 0.05, endPct: 0.35,
            eyebrow: 'Kuwait Luxury Beauty · Est. 2024',
            eyebrowAr: 'جمال الكويت الفاخر · تأسست 2024',
            headlineHtml: '<img src="/logo.png" alt="Claraline" style="height:56px;width:auto;display:block;margin:0 auto 12px;object-fit:contain" /><em>Unveiled</em>',
            headlineHtmlAr: '<img src="/logo.png" alt="Claraline" style="height:56px;width:auto;display:block;margin:0 auto 12px;object-fit:contain" /><em>كُشف عنها</em>',
            sublineEn: 'Beauty that tells a story',
            sublineAr: 'جمالٌ يُروى، وسحرٌ يُعاش',
          },
          {
            id: 't1b',
            startPct: 0.45, endPct: 0.72,
            eyebrow: 'The Collection',
            eyebrowAr: 'المجموعة',
            headlineHtml: 'Gathered<br/><em>with care</em>',
            headlineHtmlAr: 'جُمع<br/><em>بعناية</em>',
            headlineFontSize: '52px',
            position: { bottom: '18%', left: '50%', right: 'auto', top: 'auto', transform: 'translateX(-50%)', textAlign: 'center' },
          },
          {
            id: 't1c',
            startPct: 0.8, endPct: 1.0,
            headlineHtml: '<em>Made</em><br/>for you',
            headlineHtmlAr: '<em>صُنع</em><br/>لكِ',
            headlineFontSize: '64px',
            cta: { label: 'Explore Now', labelAr: 'اكتشفي الآن', scrollTo: 'products1' },
          },
        ]}
      />

      {/* ══════════════════ LIP CAROUSEL ══════════════════ */}
      <div className="fixed-section" id="products1">
        <div className="sep"></div>
        <LipCarousel />
        <div className="sep"></div>
      </div>

      {/* ══════════════════ PRODUCT CATEGORIES ══════════════════ */}
      <CategoryGrid />

      {/* ══════════════════ FULL-SCREEN LUXURY SLIDER ══════════════════ */}
      <LuxurySlider />

      {/* ══════════════════ VIDEOS 2 + 5 — SIDE BY SIDE ══════════════════ */}
      <div className="video-row-pair">
        <div className="video-row-half">
          <VideoScroll
            src="/videos/2.mp4"
            overlays={[
              {
                id: 't2a',
                startPct: 0.1, endPct: 0.5,
                eyebrow: 'The Ritual Begins',
                eyebrowAr: 'يبدأ الطقس',
                headlineHtml: 'Colors in<br/><em>motion</em>',
                headlineHtmlAr: 'الألوان في<br/><em>حركة</em>',
                sublineEn: 'Colors dancing in beauty',
                sublineAr: 'الألوان تتراقص في سماء الجمال',
              },
              {
                id: 't2b',
                startPct: 0.6, endPct: 1.0,
                headlineHtml: 'Every shade<br/>tells a <em>story</em>',
                headlineHtmlAr: 'كل لون<br/>يحكي <em>قصة</em>',
                headlineFontSize: '44px',
              },
            ]}
          />
        </div>
        <div className="video-row-half">
          <VideoScroll
            src="/videos/5.mp4"
            overlays={[
              {
                id: 't5a',
                startPct: 0.15, endPct: 0.85,
                eyebrow: 'Abundance',
                eyebrowAr: 'الوفرة',
                headlineHtml: 'Every drop<br/><em>matters</em>',
                headlineHtmlAr: 'كل قطرة<br/><em>تصنع الفارق</em>',
                sublineEn: 'Every drop makes a difference',
                sublineAr: 'كل قطرة تصنع الفارق',
              },
            ]}
          />
        </div>
      </div>

      {/* ══════════════════ RITUAL SECTION ══════════════════ */}
      <RitualSection />

      {/* ══════════════════ MARQUEE + STATS ══════════════════ */}
      <div className="fixed-section">
        <div className="marquee">
          <div className="marquee-track">
            {[
              { en: 'Luxury Makeup',  ar: 'ميك أب فاخر',      dot: false },
              { en: '✦',              ar: '✦',                  dot: true  },
              { en: 'Kuwait City',    ar: 'مدينة الكويت',       dot: false },
              { en: '✦',              ar: '✦',                  dot: true  },
              { en: 'Cruelty Free',   ar: 'خالٍ من القسوة',    dot: false },
              { en: '✦',              ar: '✦',                  dot: true  },
              { en: 'GCC Delivery',   ar: 'توصيل للخليج',       dot: false },
              { en: '✦',              ar: '✦',                  dot: true  },
              { en: 'Luxury Makeup',  ar: 'ميك أب فاخر',        dot: false },
              { en: '✦',              ar: '✦',                  dot: true  },
              { en: 'Kuwait City',    ar: 'مدينة الكويت',        dot: false },
              { en: '✦',              ar: '✦',                  dot: true  },
              { en: 'Cruelty Free',   ar: 'خالٍ من القسوة',     dot: false },
              { en: '✦',             ar: '✦',                   dot: true  },
              { en: 'GCC Delivery',   ar: 'توصيل للخليج',        dot: false },
              { en: '✦',              ar: '✦',                  dot: true  },
            ].map((item, i) =>
              item.dot
                ? <span key={i} className="m-dot"> ✦ </span>
                : (
                  <span key={i}>
                    <span className="m-item en-only">{item.en}</span>
                    <span className="m-item ar-only">{item.ar}</span>
                  </span>
                )
            )}
          </div>
        </div>

        <div className="stats-strip reveal-target">
          {[
            { num: '12K+', en: 'Happy Clients',   ar: 'عميلة سعيدة'    },
            { num: '48',   en: 'Unique Shades',    ar: 'لون فريد'        },
            { num: '6',    en: 'GCC Countries',    ar: 'دولة خليجية'    },
            { num: '100%', en: 'Cruelty Free',     ar: 'خالي من القسوة' },
          ].map(s => (
            <div key={s.num} className="stat-item">
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
            <div className="story-col-left">
              <span className="sc-label en-only">Why Claraline</span>
              <span className="sc-label ar-only">لماذا كالرالاين</span>
              <h2 className="sc-title en-only">Crafted<br/>for <em>you</em></h2>
              <h2 className="sc-title ar-only">مُصنَّع<br/>من <em>أجلكِ</em></h2>
            </div>
            <div className="story-col-right reveal-target">
              {[
                { icon: '✦', en: 'Halal Certified',  ar: 'معتمد حلال',     bodyEn: 'All our products are officially halal certified',         bodyAr: 'جميع منتجاتنا حلال ومعتمدة رسمياً' },
                { icon: '◈', en: 'Long Lasting',      ar: 'يدوم طويلاً',    bodyEn: 'Stays all day in the hot Gulf climate',                   bodyAr: 'تدوم طوال اليوم في أجواء الخليج الحارة' },
                { icon: '◇', en: 'Gulf Climate',      ar: 'مناخ الخليج',    bodyEn: 'Specially formulated for Gulf climate conditions',         bodyAr: 'مُصمَّم خصيصاً لمناخ دول الخليج' },
                { icon: '✧', en: 'Cruelty Free',      ar: 'خالٍ من القسوة', bodyEn: 'Never tested on animals — always and forever',            bodyAr: 'لا اختبارات على الحيوانات أبداً' },
                { icon: '◉', en: 'Rich Pigment',      ar: 'تغطية غنية',     bodyEn: 'Full coverage formula with vibrant colors',               bodyAr: 'تركيبة بتغطية كاملة وألوان نابضة' },
                { icon: '⟡', en: 'Kuwait Made',       ar: 'صُنع في الكويت', bodyEn: 'Proudly crafted in the heart of Kuwait',                  bodyAr: 'مصنوع بفخر في قلب الكويت' },
              ].map(f => (
                <div key={f.en} className="feature-card">
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
        <EyeCarousel />
        <div className="sep"></div>
      </div>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <div className="fixed-section">
        <div className="testimonials reveal-target" id="testimonials">
          <div className="test-header">
            <span className="t-label en-only">Real Reviews</span>
            <span className="t-label ar-only">آراء حقيقية</span>
            <h2 className="t-title">
              <span className="en-only">They <em>love</em> Claraline</span>
              <span className="ar-only">يحبّون <em>كالرالاين</em></span>
            </h2>
          </div>
          <div className="test-grid">
            {[
              {
                en:  '"The Velvet Rouge stays on all day — even in Kuwait summer."',
                ar:  '«يدوم طوال اليوم حتى في صيف الكويت الحار، لا مثيل له»',
                initials: 'نو', name: 'Noura Al-Rashidi', loc: 'Kuwait City',
              },
              {
                en:  '"Desert Dusk is the palette I never knew I needed."',
                ar:  '«باليت غروب الصحراء كان الناقص في حياتي، ألوان ساحرة»',
                initials: 'سا', name: 'Sara Al-Mutairi', loc: 'Salmiya, Kuwait',
              },
              {
                en:  '"Finally a luxury brand that understands Gulf skin tones."',
                ar:  '«أول علامة فاخرة تفهم درجات بشرة الخليج فعلاً»',
                initials: 'لي', name: 'Lina Al-Ahmad', loc: 'Hawalli, Kuwait',
              },
            ].map(t => (
              <div key={t.name} className="test-card">
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

        <div className="newsletter">
          <span className="nl-label en-only">Join the Ritual</span>
          <span className="nl-label ar-only">انضمي إلى الطقس</span>
          <h2 className="nl-title">
            <span className="en-only">Be the <em>first</em></span>
            <span className="ar-only">كوني <em>الأولى</em></span>
          </h2>
          <p className="nl-sub en-only" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Get exclusive offers and be the first to discover new arrivals</p>
          <p className="nl-sub ar-only">احصلي على العروض الحصرية وأحدث الإضافات</p>
          <NewsletterForm />
        </div>

        {/* Marquee 2 */}
        <div className="marquee">
          <div className="marquee-track rev">
            {[
              { en: 'KNET Accepted',             ar: 'KNET مقبول',          dot: false },
              { en: '✦',                         ar: '✦',                    dot: true  },
              { en: 'Tabby — Buy Now Pay Later',  ar: 'تابي — اشتري الآن',  dot: false },
              { en: '✦',                         ar: '✦',                    dot: true  },
              { en: 'Free Delivery Over KD 20',  ar: 'توصيل مجاني فوق 20 د', dot: false },
              { en: '✦',                         ar: '✦',                    dot: true  },
              { en: 'Tamara Available',           ar: 'تمارا متوفرة',         dot: false },
              { en: '✦',                         ar: '✦',                    dot: true  },
              { en: 'GCC Shipping',               ar: 'شحن للخليج',           dot: false },
              { en: '✦',                         ar: '✦',                    dot: true  },
              { en: 'KNET Accepted',             ar: 'KNET مقبول',            dot: false },
              { en: '✦',                         ar: '✦',                    dot: true  },
              { en: 'Tabby — Buy Now Pay Later',  ar: 'تابي — اشتري الآن',  dot: false },
              { en: '✦',                         ar: '✦',                    dot: true  },
            ].map((item, i) =>
              item.dot
                ? <span key={i} className="m-dot"> ✦ </span>
                : (
                  <span key={i}>
                    <span className="m-item en-only">{item.en}</span>
                    <span className="m-item ar-only">{item.ar}</span>
                  </span>
                )
            )}
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <Image src="/logo.png" alt="Claraline" width={160} height={48} style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
              </div>
              <p className="footer-tag en-only" style={{ fontFamily: "'Cormorant Garamond', serif", direction: 'ltr' }}>Beauty from Kuwait to the world</p>
              <p className="footer-tag ar-only">جمالٌ من الكويت إلى العالم</p>
              <div className="footer-socials">
                {['ig', 'tt', 'wa', 'sc'].map(s => (
                  <div key={s} className="footer-social">{s}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="footer-col-title en-only">Shop</div>
              <div className="footer-col-title ar-only">تسوقي</div>
              <ul className="footer-links en-only">
                {['Lip Collection', 'Eye Collection', 'Foundation', 'Gift Sets', 'New Arrivals'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <ul className="footer-links ar-only">
                {['مجموعة الشفاه', 'مجموعة العيون', 'الأساس', 'طقم الهدايا', 'وصل حديثاً'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-title en-only">Contact</div>
              <div className="footer-col-title ar-only">تواصل معنا</div>
              <ul className="footer-links en-only">
                {['Instagram', 'WhatsApp', 'Email Us', 'Kuwait — Shuwaikh', 'Return Policy'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <ul className="footer-links ar-only">
                {['إنستغرام', 'واتساب', 'البريد الإلكتروني', 'الكويت — الشويخ', 'سياسة الإرجاع'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-title en-only">Info</div>
              <div className="footer-col-title ar-only">معلومات</div>
              <ul className="footer-links en-only">
                {['About Us', 'Ingredients', 'Sustainability', 'Halal Certificate', 'Privacy Policy'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <ul className="footer-links ar-only">
                {['من نحن', 'المكونات', 'الاستدامة', 'شهادة حلال', 'سياسة الخصوصية'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy en-only">© 2024 Claraline. All rights reserved.</span>
            <span className="footer-copy ar-only">© 2024 كالرالاين. جميع الحقوق محفوظة.</span>
            <span className="footer-copy">KNET · Tabby · Tamara · Visa · Mastercard</span>
          </div>
        </footer>
      </div>

    </main>
  )
}
