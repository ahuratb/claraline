import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Claraline Kuwait',
  description: 'How Claraline Kuwait collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '56px', borderBottom: '1px solid rgba(201,169,110,0.25)', paddingBottom: '40px' }}>
          <p className="en-only" style={{ color: 'var(--champagne)', fontSize: '11px', letterSpacing: '4px', marginBottom: '16px' }}>
            CLARALINE KUWAIT
          </p>
          <p className="ar-only" style={{ color: 'var(--champagne)', fontSize: '12px', letterSpacing: '2px', marginBottom: '16px', direction: 'rtl', textAlign: 'right' }}>
            كالرالاين — الكويت
          </p>

          <h1 className="en-only" style={{ color: 'var(--ivory)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '16px' }}>
            Privacy Policy
          </h1>
          <h1 className="ar-only" style={{ color: 'var(--ivory)', fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 700, lineHeight: 1.3, marginBottom: '16px', direction: 'rtl', textAlign: 'right' }}>
            سياسة الخصوصية
          </h1>

          <p className="en-only" style={{ color: 'var(--muted)', fontSize: '13px', letterSpacing: '1px' }}>
            Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: June 2025
          </p>
          <p className="ar-only" style={{ color: 'var(--muted)', fontSize: '13px', direction: 'rtl', textAlign: 'right' }}>
            تاريخ السريان: ١ يناير ٢٠٢٥ &nbsp;·&nbsp; آخر تحديث: يونيو ٢٠٢٥
          </p>
        </div>

        {/* ── Intro ── */}
        <Section id="intro">
          <EnText>
            Claraline Kuwait (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a luxury makeup brand operating in the State of Kuwait, affiliated with Claraline International Co. L.L.C. We are committed to protecting your privacy and handling your personal data with the utmost care and transparency. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information when you visit our website or place an order.
          </EnText>
          <ArText>
            كالرالاين الكويت (&rdquo;نحن&rdquo;، &rdquo;لنا&rdquo;، &rdquo;خاصتنا&rdquo;) علامة تجارية فاخرة لمستحضرات التجميل تعمل في دولة الكويت، تابعة لشركة كالرالاين الدولية ذ.م.م. نحن ملتزمون بحماية خصوصيتك والتعامل مع بياناتك الشخصية بأعلى درجات العناية والشفافية. توضح سياسة الخصوصية هذه ما نجمعه من معلومات، وكيف نستخدمها، وحقوقك في ما يتعلق بتلك المعلومات عند زيارتك لموقعنا أو تقديمك طلب شراء.
          </ArText>
        </Section>

        {/* ── 1. Information We Collect ── */}
        <Section>
          <SectionTitle en="1. Information We Collect" ar="١. المعلومات التي نجمعها" />

          <EnText>
            <strong style={{ color: 'var(--ivory)' }}>Information you provide directly:</strong>
          </EnText>
          <ArText>
            <strong style={{ color: 'var(--ivory)' }}>المعلومات التي تقدمها مباشرة:</strong>
          </ArText>
          <BulletList
            en={[
              'Full name, email address, phone number, and delivery address when placing an order',
              'Account credentials (email and password) if you create an account',
              'Payment details — processed securely via Tap Payments; we never store card numbers',
              'Messages or inquiries submitted via WhatsApp or our contact channels',
              'Newsletter subscription preferences',
            ]}
            ar={[
              'الاسم الكامل، والبريد الإلكتروني، ورقم الهاتف، وعنوان التوصيل عند تقديم طلب الشراء',
              'بيانات الحساب (البريد الإلكتروني وكلمة المرور) عند إنشاء حساب',
              'بيانات الدفع — تُعالَج بشكل آمن عبر Tap Payments؛ نحن لا نحتفظ أبداً بأرقام البطاقات',
              'الرسائل والاستفسارات المُرسَلة عبر واتساب أو قنوات التواصل',
              'تفضيلات الاشتراك في النشرة البريدية',
            ]}
          />

          <EnText style={{ marginTop: '20px' }}>
            <strong style={{ color: 'var(--ivory)' }}>Information collected automatically:</strong>
          </EnText>
          <ArText style={{ marginTop: '20px' }}>
            <strong style={{ color: 'var(--ivory)' }}>المعلومات المجمعة تلقائياً:</strong>
          </ArText>
          <BulletList
            en={[
              'IP address, browser type, operating system, and referring URLs',
              'Pages visited, time spent on site, and clickstream data',
              'Device identifiers and cookie data (see Section 6)',
              'Cart and wishlist interactions',
            ]}
            ar={[
              'عنوان IP، ونوع المتصفح، ونظام التشغيل، وعناوين الإحالة',
              'الصفحات التي تمت زيارتها، والوقت المقضي في الموقع، وبيانات تسلسل النقرات',
              'معرّفات الجهاز وبيانات ملفات تعريف الارتباط (راجع القسم ٦)',
              'تفاعلات سلة التسوق وقائمة الرغبات',
            ]}
          />
        </Section>

        {/* ── 2. How We Use Your Information ── */}
        <Section>
          <SectionTitle en="2. How We Use Your Information" ar="٢. كيفية استخدام معلوماتك" />
          <BulletList
            en={[
              'To process, confirm, and deliver your orders within Kuwait',
              'To send order confirmation emails and shipping notifications via Resend',
              'To respond to your customer service enquiries',
              'To personalise your browsing and shopping experience',
              'To send promotional emails or SMS — only if you have opted in',
              'To detect and prevent fraud or unauthorised account access',
              'To comply with applicable Kuwaiti laws and regulations',
              'To improve our website, products, and marketing campaigns through analytics',
            ]}
            ar={[
              'معالجة طلباتك وتأكيدها وتوصيلها داخل الكويت',
              'إرسال رسائل تأكيد الطلب وإشعارات الشحن عبر خدمة Resend',
              'الرد على استفساراتك في خدمة العملاء',
              'تخصيص تجربة التصفح والتسوق الخاصة بك',
              'إرسال رسائل ترويجية بريدية أو نصية — فقط في حال موافقتك على الاشتراك',
              'الكشف عن الاحتيال ومنع الوصول غير المصرح به للحسابات',
              'الامتثال للقوانين واللوائح الكويتية المعمول بها',
              'تحسين موقعنا ومنتجاتنا وحملاتنا التسويقية من خلال التحليلات',
            ]}
          />
        </Section>

        {/* ── 3. Payment Processing — Tap Payments ── */}
        <Section>
          <SectionTitle en="3. Payment Processing — Tap Payments" ar="٣. معالجة المدفوعات — Tap Payments" />
          <EnText>
            All payments on the Claraline Kuwait website are processed by <strong style={{ color: 'var(--champagne)' }}>Tap Payments</strong>, a licensed payment service provider authorised by the Central Bank of Kuwait. When you complete a purchase, you are redirected to Tap Payments&rsquo; secure gateway. Claraline does not receive, store, or have access to your full card number, CVV, or any other sensitive payment credentials.
          </EnText>
          <ArText>
            تُعالَج جميع المدفوعات على موقع كالرالاين الكويت عبر <strong style={{ color: 'var(--champagne)' }}>Tap Payments</strong>، وهي شركة خدمات دفع مرخصة ومعتمدة من بنك الكويت المركزي. عند إتمام عملية الشراء، يتم تحويلك إلى بوابة الدفع الآمنة لـ Tap Payments. لا تتلقى كالرالاين أو تحتفظ أو تصل إلى رقم بطاقتك الكامل أو رمز CVV أو أي بيانات دفع حساسة أخرى.
          </ArText>
          <EnText>
            Tap Payments operates under its own privacy policy and security practices, which comply with PCI DSS standards. We receive only an order reference number and payment status confirmation. For enquiries about your payment data, please contact Tap Payments directly at <span style={{ color: 'var(--champagne)' }}>tap.company</span>.
          </EnText>
          <ArText>
            تعمل Tap Payments وفق سياسة الخصوصية وممارسات الأمان الخاصة بها، المتوافقة مع معايير PCI DSS. نحن نتلقى فقط رقم مرجع الطلب وتأكيد حالة الدفع. للاستفسار عن بيانات الدفع الخاصة بك، يرجى التواصل مع Tap Payments مباشرة على <span style={{ color: 'var(--champagne)' }}>tap.company</span>.
          </ArText>
        </Section>

        {/* ── 4. Sharing Your Information ── */}
        <Section>
          <SectionTitle en="4. Sharing Your Information" ar="٤. مشاركة معلوماتك" />
          <EnText>
            We do not sell, rent, or trade your personal data. We share data only with trusted service providers who help us operate our business, under strict confidentiality obligations:
          </EnText>
          <ArText>
            نحن لا نبيع أو نؤجر أو نتداول بياناتك الشخصية. نحن نشارك البيانات فقط مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل أعمالنا، وذلك وفق التزامات صارمة بالسرية:
          </ArText>
          <BulletList
            en={[
              'Tap Payments — secure payment processing',
              'Resend — transactional email delivery (order confirmations, shipping updates)',
              'Sanity — headless CMS for product catalogue management',
              'Vercel — website hosting and serverless infrastructure',
              'MongoDB Atlas — order and account data storage',
              'Delivery partners within Kuwait — your name and address only, for order fulfilment',
            ]}
            ar={[
              'Tap Payments — معالجة المدفوعات الآمنة',
              'Resend — إرسال الرسائل البريدية التحويلية (تأكيدات الطلبات وتحديثات الشحن)',
              'Sanity — نظام إدارة المحتوى الخاص بكتالوج المنتجات',
              'Vercel — استضافة الموقع والبنية التحتية بدون خادم',
              'MongoDB Atlas — تخزين بيانات الطلبات والحسابات',
              'شركاء التوصيل داخل الكويت — اسمك وعنوانك فقط، لأغراض تنفيذ الطلب',
            ]}
          />
          <EnText>
            We may also disclose information if required by Kuwaiti law, court order, or governmental authority.
          </EnText>
          <ArText>
            قد نكشف أيضاً عن المعلومات إذا اقتضى ذلك القانون الكويتي أو أمر قضائي أو جهة حكومية.
          </ArText>
        </Section>

        {/* ── 5. International Data Transfers ── */}
        <Section>
          <SectionTitle en="5. International Data Transfers" ar="٥. نقل البيانات الدولي" />
          <EnText>
            Claraline Kuwait is operated locally, but some of our service providers (Vercel, Sanity, MongoDB Atlas) store and process data on servers located outside Kuwait. Where this occurs, we ensure appropriate safeguards are in place, including data processing agreements consistent with applicable data protection standards.
          </EnText>
          <ArText>
            تعمل كالرالاين الكويت محلياً، إلا أن بعض مزودي خدماتنا (Vercel وSanity وMongoDB Atlas) يحتفظون ببيانات ويعالجونها على خوادم تقع خارج الكويت. عند حدوث ذلك، نحرص على وضع الضمانات المناسبة، بما في ذلك اتفاقيات معالجة البيانات المتوافقة مع معايير حماية البيانات المعمول بها.
          </ArText>
        </Section>

        {/* ── 6. Cookies ── */}
        <Section>
          <SectionTitle en="6. Cookies &amp; Local Storage" ar="٦. ملفات تعريف الارتباط والتخزين المحلي" />
          <EnText>
            Our website uses the following technologies to improve your experience:
          </EnText>
          <ArText>
            يستخدم موقعنا التقنيات التالية لتحسين تجربتك:
          </ArText>
          <BulletList
            en={[
              'Session cookies — to keep you logged in during your visit',
              'Preference cookies — to remember your language (Arabic/English) and theme (light/dark)',
              'Cart storage — your cart is saved in your browser\'s localStorage under "claraline-cart"',
              'Analytics cookies — to understand how visitors use the site (anonymised data only)',
            ]}
            ar={[
              'ملفات الجلسة — لإبقائك مسجلاً الدخول أثناء زيارتك',
              'ملفات تفضيلات — لتذكر لغتك (العربية/الإنجليزية) والسمة (فاتحة/داكنة)',
              'تخزين سلة التسوق — يتم حفظ سلتك في التخزين المحلي للمتصفح تحت "claraline-cart"',
              'ملفات التحليلات — لفهم كيفية استخدام الزوار للموقع (بيانات مجهولة الهوية فقط)',
            ]}
          />
          <EnText>
            You can control cookie preferences through your browser settings. Disabling certain cookies may affect site functionality.
          </EnText>
          <ArText>
            يمكنك التحكم في تفضيلات ملفات تعريف الارتباط من خلال إعدادات المتصفح. قد يؤثر تعطيل بعض الملفات على وظائف الموقع.
          </ArText>
        </Section>

        {/* ── 7. Your Rights ── */}
        <Section>
          <SectionTitle en="7. Your Rights" ar="٧. حقوقك" />
          <EnText>
            You have the right to:
          </EnText>
          <ArText>
            لك الحق في:
          </ArText>
          <BulletList
            en={[
              'Access the personal data we hold about you',
              'Request correction of inaccurate or incomplete data',
              'Request deletion of your account and associated data',
              'Withdraw consent to marketing communications at any time',
              'Lodge a complaint with the relevant Kuwaiti authorities',
            ]}
            ar={[
              'الاطلاع على البيانات الشخصية التي نحتفظ بها عنك',
              'طلب تصحيح البيانات غير الدقيقة أو غير المكتملة',
              'طلب حذف حسابك والبيانات المرتبطة به',
              'سحب موافقتك على الاتصالات التسويقية في أي وقت',
              'تقديم شكوى إلى الجهات الكويتية المختصة',
            ]}
          />
          <EnText>
            To exercise any of these rights, contact us at <span style={{ color: 'var(--champagne)' }}>privacy@claraline.me</span>.
          </EnText>
          <ArText>
            لممارسة أي من هذه الحقوق، تواصل معنا على <span style={{ color: 'var(--champagne)' }}>privacy@claraline.me</span>.
          </ArText>
        </Section>

        {/* ── 8. Data Retention ── */}
        <Section>
          <SectionTitle en="8. Data Retention" ar="٨. الاحتفاظ بالبيانات" />
          <EnText>
            We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, or as required by Kuwaiti law. Order records are kept for a minimum of five (5) years for tax and compliance purposes. Account data is retained until you request deletion. Marketing consent records are kept until consent is withdrawn.
          </EnText>
          <ArText>
            نحتفظ ببياناتك الشخصية طالما كان ذلك ضرورياً لتحقيق الأغراض الموضحة في هذه السياسة، أو كما يقتضيه القانون الكويتي. تُحتفظ بسجلات الطلبات لمدة لا تقل عن خمس (٥) سنوات لأغراض ضريبية وامتثالية. تُحتفظ ببيانات الحساب حتى تطلب حذفها. تُحتفظ بسجلات موافقة التسويق حتى يتم سحب الموافقة.
          </ArText>
        </Section>

        {/* ── 9. Children's Privacy ── */}
        <Section>
          <SectionTitle en="9. Children's Privacy" ar="٩. خصوصية الأطفال" />
          <EnText>
            Our website and services are intended for users aged 18 and above. We do not knowingly collect personal data from minors. If you believe a child has provided us with personal information, please contact us immediately.
          </EnText>
          <ArText>
            موقعنا وخدماتنا موجهة للمستخدمين الذين تبلغ أعمارهم ١٨ عاماً أو أكثر. نحن لا نجمع بيانات شخصية من القاصرين عن سابق علم. إذا كنت تعتقد أن طفلاً قدّم لنا معلومات شخصية، فيرجى التواصل معنا فوراً.
          </ArText>
        </Section>

        {/* ── 10. Changes to This Policy ── */}
        <Section>
          <SectionTitle en="10. Changes to This Policy" ar="١٠. التغييرات على هذه السياسة" />
          <EnText>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. Material changes will be communicated via a notice on our website or by email. Continued use of our website after such changes constitutes your acceptance of the updated policy.
          </EnText>
          <ArText>
            قد نحدّث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو القانون المعمول به. سيتم إخطارك بالتغييرات الجوهرية عبر إشعار على موقعنا أو عبر البريد الإلكتروني. استمرارك في استخدام موقعنا بعد هذه التغييرات يُعدّ قبولاً منك للسياسة المحدثة.
          </ArText>
        </Section>

        {/* ── 11. Contact ── */}
        <Section last>
          <SectionTitle en="11. Contact Us" ar="١١. تواصل معنا" />
          <EnText>
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact the Claraline Kuwait Data Privacy team:
          </EnText>
          <ArText>
            إذا كان لديك أي أسئلة أو مخاوف أو طلبات تتعلق بسياسة الخصوصية هذه، يرجى التواصل مع فريق خصوصية البيانات في كالرالاين الكويت:
          </ArText>
          <div style={{ marginTop: '24px', padding: '24px', border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.04)' }}>
            <p className="en-only" style={{ color: 'var(--ivory)', fontSize: '14px', lineHeight: 2, textTransform: 'none', letterSpacing: '0.5px' }}>
              <strong>Claraline Kuwait</strong><br />
              Email: <span style={{ color: 'var(--champagne)' }}>privacy@claraline.me</span><br />
              WhatsApp: <span style={{ color: 'var(--champagne)' }}>+965 4111 9050</span><br />
              Address: Al Salmiya, Block 2, Salem AlMubarak Street, The 8 Mall, Floor −1, Office No. 17, Kuwait
            </p>
            <p className="ar-only" style={{ color: 'var(--ivory)', fontSize: '14px', lineHeight: 2, direction: 'rtl', textAlign: 'right', textTransform: 'none' }}>
              <strong>كالرالاين الكويت</strong><br />
              البريد الإلكتروني: <span style={{ color: 'var(--champagne)' }}>privacy@claraline.me</span><br />
              واتساب: <span style={{ color: 'var(--champagne)' }}>+965 4111 9050</span><br />
              العنوان: السالمية، قطعة ٢، شارع سالم المبارك، The 8 Mall، الطابق −١، مكتب رقم ١٧، الكويت
            </p>
          </div>
        </Section>

      </div>
    </main>
  )
}

/* ── Internal layout helpers ── */

function Section({ children, id, last }: { children: React.ReactNode; id?: string; last?: boolean }) {
  return (
    <section id={id} style={{ marginBottom: last ? 0 : '48px', paddingBottom: last ? 0 : '48px', borderBottom: last ? 'none' : '1px solid rgba(201,169,110,0.1)' }}>
      {children}
    </section>
  )
}

function SectionTitle({ en, ar }: { en: string; ar: string }) {
  return (
    <>
      <h2
        className="en-only"
        dangerouslySetInnerHTML={{ __html: en }}
        style={{ color: 'var(--champagne)', fontSize: '15px', fontWeight: 600, letterSpacing: '2px', marginBottom: '20px' }}
      />
      <h2
        className="ar-only"
        dangerouslySetInnerHTML={{ __html: ar }}
        style={{ color: 'var(--champagne)', fontSize: '15px', fontWeight: 600, letterSpacing: '1px', marginBottom: '20px', direction: 'rtl', textAlign: 'right' }}
      />
    </>
  )
}

function EnText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      className="en-only"
      style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.9, marginBottom: '12px', textTransform: 'none', letterSpacing: '0.3px', ...style }}
    >
      {children}
    </p>
  )
}

function ArText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      className="ar-only"
      style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 2.1, marginBottom: '12px', direction: 'rtl', textAlign: 'right', textTransform: 'none', ...style }}
    >
      {children}
    </p>
  )
}

function BulletList({ en, ar }: { en: string[]; ar: string[] }) {
  return (
    <>
      <ul className="en-only" style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.9, paddingLeft: '20px', textTransform: 'none', letterSpacing: '0.3px' }}>
        {en.map((item, i) => <li key={i} style={{ marginBottom: '6px' }}>{item}</li>)}
      </ul>
      <ul className="ar-only" style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 2.1, paddingRight: '20px', direction: 'rtl', textAlign: 'right', textTransform: 'none', listStylePosition: 'inside' }}>
        {ar.map((item, i) => <li key={i} style={{ marginBottom: '6px' }}>{item}</li>)}
      </ul>
    </>
  )
}
