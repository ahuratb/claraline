import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Claraline Kuwait',
  description: 'Terms and conditions governing use of the Claraline Kuwait website and purchase of products.',
}

export default function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <h1 className="ar-only" style={{ color: 'var(--ivory)', fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 700, lineHeight: 1.3, marginBottom: '16px', direction: 'rtl', textAlign: 'right' }}>
            الشروط والأحكام
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
            Welcome to Claraline Kuwait. These Terms &amp; Conditions govern your use of our website and the purchase of products through it. By accessing our website or placing an order, you agree to be bound by these terms. Please read them carefully before proceeding.
          </EnText>
          <EnText>
            Claraline Kuwait is affiliated with Claraline International Co. L.L.C., a luxury cosmetics company headquartered in Turkey and operating in Kuwait. All sales are governed by the laws of the State of Kuwait.
          </EnText>
          <ArText>
            مرحباً بك في كالرالاين الكويت. تحكم هذه الشروط والأحكام استخدامك لموقعنا الإلكتروني وشراء المنتجات من خلاله. باستخدامك للموقع أو تقديمك طلب شراء، فإنك توافق على الالتزام بهذه الشروط. يرجى قراءتها بعناية قبل المتابعة.
          </ArText>
          <ArText>
            كالرالاين الكويت تابعة لشركة كالرالاين الدولية ذ.م.م.، وهي شركة مستحضرات تجميل فاخرة مقرها تركيا وتعمل في الكويت. تخضع جميع المبيعات لقوانين دولة الكويت.
          </ArText>
        </Section>

        {/* ── 1. Use of the Website ── */}
        <Section>
          <SectionTitle en="1. Use of the Website" ar="١. استخدام الموقع" />
          <EnText>
            You may use this website for lawful purposes only. You agree not to:
          </EnText>
          <ArText>
            يجوز لك استخدام هذا الموقع للأغراض المشروعة فقط. توافق على عدم القيام بما يلي:
          </ArText>
          <BulletList
            en={[
              'Use the site in any way that violates applicable Kuwaiti law or regulation',
              'Attempt to gain unauthorised access to any part of the website or its related systems',
              'Scrape, copy, or republish content without our written consent',
              'Submit false, inaccurate, or misleading information when placing an order',
              'Use automated tools (bots, crawlers) to interact with the site without permission',
            ]}
            ar={[
              'استخدام الموقع بأي طريقة تنتهك القانون أو اللوائح الكويتية المعمول بها',
              'محاولة الوصول غير المصرح به إلى أي جزء من الموقع أو الأنظمة المرتبطة به',
              'استخراج أو نسخ أو إعادة نشر المحتوى دون موافقتنا الخطية',
              'تقديم معلومات كاذبة أو غير دقيقة أو مضللة عند تقديم طلب شراء',
              'استخدام أدوات آلية (روبوتات، برامج الزحف) للتفاعل مع الموقع دون إذن',
            ]}
          />
        </Section>

        {/* ── 2. Products & Pricing ── */}
        <Section>
          <SectionTitle en="2. Products &amp; Pricing" ar="٢. المنتجات والأسعار" />
          <EnText>
            All product descriptions, images, and specifications on our website are provided in good faith and are as accurate as possible. We reserve the right to correct errors at any time.
          </EnText>
          <ArText>
            جميع أوصاف المنتجات والصور والمواصفات المدرجة على موقعنا مقدمة بحسن نية وهي دقيقة قدر الإمكان. نحتفظ بالحق في تصحيح الأخطاء في أي وقت.
          </ArText>
          <BulletList
            en={[
              'All prices are displayed in Kuwaiti Dinar (KWD) and include applicable taxes',
              'Prices are subject to change without prior notice',
              'In the event of a pricing error, we will contact you before processing your order',
              'Product availability is subject to stock levels and may change without notice',
              'Product shades and finishes may vary slightly from on-screen representations due to monitor calibration',
            ]}
            ar={[
              'تُعرض جميع الأسعار بالدينار الكويتي (KWD) وتشمل الضرائب المطبقة',
              'الأسعار عرضة للتغيير دون إشعار مسبق',
              'في حالة وجود خطأ في السعر، سنتواصل معك قبل معالجة طلبك',
              'توافر المنتجات يخضع لمستويات المخزون وقد يتغير دون إشعار',
              'قد تختلف درجات الألوان والتشطيبات قليلاً عن ما يظهر على الشاشة بسبب معايرة الشاشة',
            ]}
          />
        </Section>

        {/* ── 3. Orders & Payment ── */}
        <Section>
          <SectionTitle en="3. Orders &amp; Payment" ar="٣. الطلبات والدفع" />
          <EnText>
            When you place an order, you are making an offer to purchase. We reserve the right to accept or decline any order. Your order is confirmed only when you receive an order confirmation email from us.
          </EnText>
          <ArText>
            عند تقديمك طلب شراء، فإنك تقدم عرضاً للشراء. نحتفظ بالحق في قبول أي طلب أو رفضه. يُعدّ طلبك مؤكداً فقط عند استلامك رسالة تأكيد الطلب منا.
          </ArText>
          <EnText>
            <strong style={{ color: 'var(--ivory)' }}>Payment via Tap Payments:</strong> All payments are processed through <strong style={{ color: 'var(--champagne)' }}>Tap Payments</strong>, our authorised payment gateway. We accept the following methods:
          </EnText>
          <ArText>
            <strong style={{ color: 'var(--ivory)' }}>الدفع عبر Tap Payments:</strong> تُعالَج جميع المدفوعات من خلال <strong style={{ color: 'var(--champagne)' }}>Tap Payments</strong>، بوابة الدفع المعتمدة لدينا. نقبل الطرق التالية:
          </ArText>
          <BulletList
            en={[
              'KNET — Kuwait\'s national debit network',
              'Visa &amp; Mastercard credit and debit cards',
              'Apple Pay',
              'Tap Pay — digital wallet',
            ]}
            ar={[
              'كي-نت KNET — شبكة البطاقات المدينة الوطنية الكويتية',
              'بطاقات فيزا وماستركارد الائتمانية والمدينة',
              'Apple Pay',
              'Tap Pay — المحفظة الرقمية',
            ]}
          />
          <EnText>
            By providing your payment details, you authorise Tap Payments to charge the specified amount. Claraline is not responsible for any fees charged by your bank or card issuer.
          </EnText>
          <ArText>
            بتقديمك تفاصيل الدفع، فإنك تفوّض Tap Payments بتحصيل المبلغ المحدد. لا تتحمل كالرالاين المسؤولية عن أي رسوم يفرضها بنكك أو جهة إصدار بطاقتك.
          </ArText>
        </Section>

        {/* ── 4. Delivery ── */}
        <Section>
          <SectionTitle en="4. Delivery" ar="٤. التوصيل" />
          <BulletList
            en={[
              'We deliver within Kuwait only — delivery to all governorates',
              'Standard delivery: 2–4 business days from order confirmation',
              'Express delivery: 1 business day (available on select areas)',
              'Delivery fees are calculated at checkout based on your area',
              'Orders placed before 12:00 PM (KWT) on business days are processed the same day',
              'Delivery times are estimates and may be affected by public holidays or unforeseen circumstances',
              'Risk of loss and title for products pass to you upon delivery',
            ]}
            ar={[
              'نوصّل داخل الكويت فقط — التوصيل لجميع المحافظات',
              'التوصيل العادي: ٢–٤ أيام عمل من تأكيد الطلب',
              'التوصيل السريع: يوم عمل واحد (متاح في مناطق مختارة)',
              'يتم احتساب رسوم التوصيل عند الدفع بناءً على منطقتك',
              'تُعالَج الطلبات المقدمة قبل الساعة ١٢:٠٠ ظهراً (بتوقيت الكويت) في أيام العمل في نفس اليوم',
              'مواعيد التوصيل تقديرية وقد تتأثر بالعطل الرسمية أو الظروف غير المتوقعة',
              'ينتقل خطر الضياع وملكية المنتجات إليك عند التسليم',
            ]}
          />
        </Section>

        {/* ── 5. Returns & Refunds ── */}
        <Section>
          <SectionTitle en="5. Returns &amp; Refunds" ar="٥. الإرجاع والاسترداد" />
          <EnText>
            We want you to love your Claraline products. Our return policy is as follows:
          </EnText>
          <ArText>
            نريدك أن تكوني مسرورة بمنتجات كالرالاين. سياسة الإرجاع لدينا على النحو التالي:
          </ArText>
          <BulletList
            en={[
              'Returns accepted within 7 days of delivery for unopened, unused products in original packaging',
              'Due to hygiene standards, opened cosmetics cannot be returned or exchanged unless they are faulty or damaged upon arrival',
              'Damaged or incorrect items must be reported within 48 hours of delivery with photographic evidence',
              'Refunds are processed within 5–10 business days to the original payment method via Tap Payments',
              'Delivery charges are non-refundable unless the return is due to our error',
              'Gift sets must be returned complete — partial returns are not accepted',
            ]}
            ar={[
              'يُقبل الإرجاع خلال ٧ أيام من التسليم للمنتجات غير المفتوحة وغير المستخدمة بعبوتها الأصلية',
              'بسبب معايير النظافة، لا يمكن إرجاع مستحضرات التجميل المفتوحة أو استبدالها إلا إذا كانت معيبة أو تالفة عند الاستلام',
              'يجب الإبلاغ عن المنتجات التالفة أو الخاطئة خلال ٤٨ ساعة من التسليم مع إرفاق صور',
              'تُعالَج المبالغ المستردة خلال ٥–١٠ أيام عمل إلى طريقة الدفع الأصلية عبر Tap Payments',
              'رسوم التوصيل غير قابلة للاسترداد إلا إذا كان الإرجاع بسبب خطأ من جانبنا',
              'يجب إرجاع طقم الهدايا كاملاً — لا يُقبل الإرجاع الجزئي',
            ]}
          />
          <EnText>
            To initiate a return, contact us via WhatsApp or email with your order number and reason for return.
          </EnText>
          <ArText>
            لبدء طلب الإرجاع، تواصل معنا عبر واتساب أو البريد الإلكتروني مع ذكر رقم طلبك وسبب الإرجاع.
          </ArText>
        </Section>

        {/* ── 6. User Accounts ── */}
        <Section>
          <SectionTitle en="6. User Accounts" ar="٦. حسابات المستخدمين" />
          <EnText>
            You may create an account to access order history, save addresses, and enjoy a faster checkout. You are responsible for:
          </EnText>
          <ArText>
            يمكنك إنشاء حساب للوصول إلى سجل الطلبات وحفظ العناوين والاستمتاع بتجربة دفع أسرع. أنت مسؤول عن:
          </ArText>
          <BulletList
            en={[
              'Maintaining the confidentiality of your login credentials',
              'All activity that occurs under your account',
              'Notifying us immediately of any unauthorised use of your account',
              'Ensuring your account information remains accurate and up-to-date',
            ]}
            ar={[
              'الحفاظ على سرية بيانات تسجيل دخولك',
              'جميع النشاطات التي تحدث تحت حسابك',
              'إخطارنا فوراً بأي استخدام غير مصرح به لحسابك',
              'التأكد من أن معلومات حسابك تظل دقيقة ومحدثة',
            ]}
          />
          <EnText>
            We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
          </EnText>
          <ArText>
            نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط أو تنخرط في أنشطة احتيالية.
          </ArText>
        </Section>

        {/* ── 7. Intellectual Property ── */}
        <Section>
          <SectionTitle en="7. Intellectual Property" ar="٧. الملكية الفكرية" />
          <EnText>
            All content on this website — including but not limited to the Claraline name, logo, product photography, video content, text, and design — is the exclusive property of Claraline International Co. L.L.C. or its licensors and is protected by Kuwaiti and international intellectual property laws.
          </EnText>
          <ArText>
            جميع المحتويات على هذا الموقع — بما في ذلك على سبيل المثال لا الحصر اسم كالرالاين وشعارها وصور المنتجات والمحتوى المرئي والنصوص والتصميم — هي ملك حصري لشركة كالرالاين الدولية ذ.م.م. أو المرخصين لها وتحميها قوانين الملكية الفكرية الكويتية والدولية.
          </ArText>
          <EnText>
            You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
          </EnText>
          <ArText>
            لا يجوز لك إعادة إنتاج أو توزيع أو تعديل أو إنشاء أعمال مشتقة من أي محتوى دون إذننا الخطي الصريح.
          </ArText>
        </Section>

        {/* ── 8. Disclaimer of Warranties ── */}
        <Section>
          <SectionTitle en="8. Disclaimer of Warranties" ar="٨. إخلاء مسؤولية الضمانات" />
          <EnText>
            Our products are cosmetics designed for external use only. While we maintain high standards of quality and our products are internationally tested and certified (including Halal certification), individual results may vary. We strongly recommend:
          </EnText>
          <ArText>
            منتجاتنا مستحضرات تجميل مصممة للاستخدام الخارجي فقط. رغم أننا نحافظ على معايير جودة عالية ومنتجاتنا مختبرة ومعتمدة دولياً (بما في ذلك شهادة الحلال)، قد تتفاوت النتائج الفردية. نوصي بشدة بما يلي:
          </ArText>
          <BulletList
            en={[
              'Performing a patch test before full application, especially for sensitive skin',
              'Reviewing the full ingredient list on the product packaging',
              'Consulting a dermatologist if you have known skin conditions or allergies',
              'Discontinuing use immediately if irritation or allergic reaction occurs',
            ]}
            ar={[
              'إجراء اختبار على بقعة صغيرة من الجلد قبل التطبيق الكامل، خاصةً لأصحاب البشرة الحساسة',
              'مراجعة قائمة المكونات الكاملة على عبوة المنتج',
              'استشارة طبيب الجلدية إذا كانت لديك حالات جلدية أو حساسيات معروفة',
              'التوقف الفوري عن الاستخدام في حالة حدوث تهيج أو رد فعل تحسسي',
            ]}
          />
          <EnText>
            The website is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee uninterrupted, error-free, or virus-free access.
          </EnText>
          <ArText>
            يُقدَّم الموقع &rdquo;كما هو&rdquo; دون أي ضمانات من أي نوع. لا نضمن وصولاً متواصلاً أو خالياً من الأخطاء أو الفيروسات.
          </ArText>
        </Section>

        {/* ── 9. Limitation of Liability ── */}
        <Section>
          <SectionTitle en="9. Limitation of Liability" ar="٩. حدود المسؤولية" />
          <EnText>
            To the maximum extent permitted by Kuwaiti law, Claraline Kuwait shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our website or products. Our total liability for any claim related to a product purchase shall not exceed the amount paid for that specific order.
          </EnText>
          <ArText>
            إلى أقصى حد يسمح به القانون الكويتي، لن تكون كالرالاين الكويت مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناشئة عن استخدام موقعنا أو منتجاتنا أو عدم القدرة على استخدامهما. لا تتجاوز مسؤوليتنا الإجمالية عن أي مطالبة تتعلق بشراء منتج المبلغ المدفوع لذلك الطلب المحدد.
          </ArText>
        </Section>

        {/* ── 10. Third-Party Links ── */}
        <Section>
          <SectionTitle en="10. Third-Party Links" ar="١٠. روابط الأطراف الثالثة" />
          <EnText>
            Our website may contain links to third-party websites (including Tap Payments, Instagram, WhatsApp, and other social platforms). These links are provided for your convenience only. Claraline is not responsible for the content, privacy practices, or policies of those websites. Visiting third-party links is at your own risk.
          </EnText>
          <ArText>
            قد يحتوي موقعنا على روابط لمواقع طرف ثالث (بما في ذلك Tap Payments وإنستغرام وواتساب ومنصات التواصل الاجتماعي الأخرى). هذه الروابط مقدمة لراحتك فقط. لا تتحمل كالرالاين المسؤولية عن محتوى تلك المواقع أو ممارسات الخصوصية أو سياساتها. زيارة روابط الطرف الثالث تكون على مسؤوليتك الخاصة.
          </ArText>
        </Section>

        {/* ── 11. Promotions & Discount Codes ── */}
        <Section>
          <SectionTitle en="11. Promotions &amp; Discount Codes" ar="١١. العروض ورموز الخصم" />
          <BulletList
            en={[
              'Promotional offers and discount codes are subject to their stated terms',
              'Codes are valid for a single use unless otherwise specified',
              'Claraline reserves the right to withdraw or modify promotions at any time',
              'Discount codes cannot be combined unless explicitly stated',
              'No cash equivalent is offered in lieu of a discount code',
            ]}
            ar={[
              'تخضع العروض الترويجية ورموز الخصم لشروطها المنصوص عليها',
              'الرموز صالحة للاستخدام مرة واحدة ما لم يُنص على خلاف ذلك',
              'تحتفظ كالرالاين بالحق في سحب أو تعديل العروض في أي وقت',
              'لا يمكن دمج رموز الخصم ما لم يُذكر ذلك صراحةً',
              'لا يُقدَّم بديل نقدي عوضاً عن رمز الخصم',
            ]}
          />
        </Section>

        {/* ── 12. Governing Law ── */}
        <Section>
          <SectionTitle en="12. Governing Law &amp; Dispute Resolution" ar="١٢. القانون الحاكم وتسوية النزاعات" />
          <EnText>
            These Terms &amp; Conditions are governed by and construed in accordance with the laws of the State of Kuwait. Any dispute arising from or in connection with these terms shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to the competent courts of Kuwait City, Kuwait.
          </EnText>
          <ArText>
            تخضع هذه الشروط والأحكام وتُفسَّر وفقاً لقوانين دولة الكويت. يخضع أي نزاع ينشأ عن أو يتعلق بهذه الشروط أولاً للتفاوض بحسن نية. وإذا لم يُحسم، تُحال النزاعات إلى المحاكم المختصة في مدينة الكويت، دولة الكويت.
          </ArText>
        </Section>

        {/* ── 13. Changes to Terms ── */}
        <Section>
          <SectionTitle en="13. Changes to These Terms" ar="١٣. التغييرات على هذه الشروط" />
          <EnText>
            We reserve the right to modify these Terms &amp; Conditions at any time. Changes will be posted on this page with an updated effective date. Your continued use of the website following any changes constitutes your acceptance of the revised terms. If you do not agree to the revised terms, please discontinue use of the website.
          </EnText>
          <ArText>
            نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تاريخ سريان محدّث. استمرارك في استخدام الموقع بعد أي تغييرات يُعدّ قبولاً منك للشروط المعدلة. إذا لم توافق على الشروط المعدلة، يرجى التوقف عن استخدام الموقع.
          </ArText>
        </Section>

        {/* ── 14. Contact ── */}
        <Section last>
          <SectionTitle en="14. Contact Us" ar="١٤. تواصل معنا" />
          <EnText>
            For any questions regarding these Terms &amp; Conditions, please contact us:
          </EnText>
          <ArText>
            لأي استفسارات بخصوص هذه الشروط والأحكام، يرجى التواصل معنا:
          </ArText>
          <div style={{ marginTop: '24px', padding: '24px', border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.04)' }}>
            <p className="en-only" style={{ color: 'var(--ivory)', fontSize: '14px', lineHeight: 2, textTransform: 'none', letterSpacing: '0.5px' }}>
              <strong>Claraline Kuwait</strong><br />
              Email: <span style={{ color: 'var(--champagne)' }}>hello@claraline.me</span><br />
              WhatsApp: <span style={{ color: 'var(--champagne)' }}>+965 4111 9050</span><br />
              Address: Al Salmiya, Block 2, Salem AlMubarak Street, The 8 Mall, Floor −1, Office No. 17, Kuwait<br />
              Website: <span style={{ color: 'var(--champagne)' }}>claraline.me</span>
            </p>
            <p className="ar-only" style={{ color: 'var(--ivory)', fontSize: '14px', lineHeight: 2, direction: 'rtl', textAlign: 'right', textTransform: 'none' }}>
              <strong>كالرالاين الكويت</strong><br />
              البريد الإلكتروني: <span style={{ color: 'var(--champagne)' }}>hello@claraline.me</span><br />
              واتساب: <span style={{ color: 'var(--champagne)' }}>+965 4111 9050</span><br />
              العنوان: السالمية، قطعة ٢، شارع سالم المبارك، The 8 Mall، الطابق −١، مكتب رقم ١٧، الكويت<br />
              الموقع: <span style={{ color: 'var(--champagne)' }}>claraline.me</span>
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
        {en.map((item, i) => <li key={i} style={{ marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: item }} />)}
      </ul>
      <ul className="ar-only" style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 2.1, paddingRight: '20px', direction: 'rtl', textAlign: 'right', textTransform: 'none', listStylePosition: 'inside' }}>
        {ar.map((item, i) => <li key={i} style={{ marginBottom: '6px' }}>{item}</li>)}
      </ul>
    </>
  )
}
