export default function UKFlag({ width = 20, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 60 30"
      width={width}
      height={height}
      style={{ borderRadius: 2, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}
      aria-hidden
    >
      <clipPath id="uk-rect"><rect width="60" height="30" /></clipPath>
      <g clipPath="url(#uk-rect)">
        <rect width="60" height="30" fill="#012169" />
        {/* white diagonals */}
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        {/* red diagonals */}
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"
          clipPath="url(#uk-rect)" />
        {/* white cross */}
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        {/* red cross */}
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}
