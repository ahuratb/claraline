export default function RitualSection() {
  return (
    <div className="fixed-section">
      <div className="sep"></div>
      <div className="ritual-section reveal-target" id="ritual1">
        <div className="ritual-bg-num">02</div>
        <div className="ritual-text">

          <span className="r-label en-only">The Claraline Ritual</span>
          <span className="r-label ar-only">طقس كالرالاين</span>

          <h2 className="r-heading en-only">Beauty as a<br /><em>daily ceremony</em></h2>
          <h2 className="r-heading ar-only">الجمال كـ<br /><em>طقس يومي</em></h2>

          <p className="r-body en-only" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Claraline is more than a brand — it is a philosophy of beauty that believes every woman deserves to begin her day with a ritual that elevates her. From the heart of Kuwait to the world.
          </p>
          <p className="r-body ar-only">
            كالرالاين ليست مجرد علامة تجارية — إنها فلسفة جمال تؤمن بأن كل امرأة تستحق أن تبدأ يومها بطقس يُعلي من قيمتها. من قلب الكويت إلى العالم.
          </p>

          <a href="/shop" className="r-link en-only">Discover Our Story</a>
          <a href="/shop" className="r-link ar-only">اكتشفي قصتنا</a>

        </div>

        <div className="ritual-visual reveal-target">
          <div className="ritual-frame">
            <div className="ritual-frame-border"></div>
            <div className="ritual-frame-corner tl"></div>
            <div className="ritual-frame-corner tr"></div>
            <div className="ritual-frame-corner bl"></div>
            <div className="ritual-frame-corner br"></div>
            <svg viewBox="0 0 200 260" width={180} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="glow2" cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="rgba(201,169,110,0.3)"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
              </defs>
              <ellipse cx="100" cy="100" rx="90" ry="90" fill="url(#glow2)"/>
              <ellipse cx="100" cy="82" rx="48" ry="58" fill="rgba(201,169,110,0.04)" stroke="rgba(201,169,110,0.18)" strokeWidth="0.5"/>
              <ellipse cx="83" cy="70" rx="7" ry="3.5" fill="rgba(201,169,110,0.5)"/>
              <ellipse cx="117" cy="70" rx="7" ry="3.5" fill="rgba(201,169,110,0.5)"/>
              <path d="M87 99 Q100 108 113 99" stroke="rgba(201,169,110,0.65)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <circle cx="100" cy="205" r="34" fill="none" stroke="rgba(201,169,110,0.1)" strokeWidth="0.5"/>
              <circle cx="100" cy="205" r="22" fill="none" stroke="rgba(201,169,110,0.14)" strokeWidth="0.5"/>
              <text x="100" y="209" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="11" fill="rgba(201,169,110,0.7)">claraline</text>
            </svg>
          </div>
        </div>
      </div>
      <div className="sep"></div>
    </div>
  )
}
