export default function KuwaitFlag({ width = 20, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 24 16"
      width={width}
      height={height}
      style={{ borderRadius: 2, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}
      aria-hidden
    >
      <rect width="24" height="5.33" fill="#007A3D" />
      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
      <rect y="10.66" width="24" height="5.33" fill="#CE1126" />
      <polygon points="0,0 7,5.33 7,10.66 0,16" fill="#000000" />
    </svg>
  )
}
