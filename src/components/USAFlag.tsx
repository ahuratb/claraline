export default function USAFlag({ width = 20, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 30 20"
      width={width}
      height={height}
      style={{ borderRadius: 2, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}
      aria-hidden
    >
      {/* 13 alternating stripes */}
      <rect width="30" height="20" fill="#B22234" />
      <rect y="1.54"  width="30" height="1.54" fill="#fff" />
      <rect y="4.62"  width="30" height="1.54" fill="#fff" />
      <rect y="7.69"  width="30" height="1.54" fill="#fff" />
      <rect y="10.77" width="30" height="1.54" fill="#fff" />
      <rect y="13.85" width="30" height="1.54" fill="#fff" />
      <rect y="16.92" width="30" height="1.54" fill="#fff" />
      {/* Blue canton */}
      <rect width="12" height="10.77" fill="#3C3B6E" />
    </svg>
  )
}
