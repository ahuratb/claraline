'use client'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'

const CATEGORIES = [
  { id: 'lip-care',    nameEn: 'Lip Care',       nameAr: 'عناية بالشفاه',          image: '/lipcare.png' },
  { id: 'lip-liner',   nameEn: 'Lip Liner',       nameAr: 'محدد الشفاه',            image: '/lipliner.png' },
  { id: 'lip-multi',   nameEn: 'Lip Multi-Use',   nameAr: 'شفاه متعدد الاستخدام',  image: '/lipmultiuse.png' },
  { id: 'primers',     nameEn: 'Primers',         nameAr: 'البرايمر',               image: '/primers.png' },
  { id: 'highlighter', nameEn: 'Highlighter',     nameAr: 'الهايلايتر',             image: '/highlighter.png' },
  { id: 'concealer',   nameEn: 'Concealer',       nameAr: 'الكونسيلر',              image: '/concealer.png' },
]

function CatCard({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const justDropped = useRef(false)
  const storageKey = `claraline-cat-img-${cat.id}`

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) setImgSrc(stored)
  }, [storageKey])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      localStorage.setItem(storageKey, dataUrl)
      setImgSrc(dataUrl)
      setImgError(false)
    }
    reader.readAsDataURL(file)
  }, [storageKey])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false)
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    justDropped.current = true
    setTimeout(() => { justDropped.current = false }, 300)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const showUploadZone = !imgSrc && imgError
  const activeSrc = imgSrc ?? (!imgError ? cat.image : null)

  return (
    <a
      href={`/shop?category=${cat.id}`}
      className={`cat-card reveal-target${isDragOver ? ' cat-drag-over' : ''}`}
      style={{ transitionDelay: `${index * 0.08}s`, textDecoration: 'none' }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={(e) => { if (justDropped.current) e.preventDefault() }}
    >
      <div className="cat-img-wrap">
        {activeSrc && (
          <Image
            src={activeSrc}
            alt={cat.nameEn}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            onError={() => { if (!imgSrc) setImgError(true) }}
          />
        )}

        {/* Drag-to-replace overlay for cards that already have an image */}
        {!showUploadZone && isDragOver && (
          <div className="cat-replace-hint">
            <span className="cat-replace-icon">↓</span>
            <span className="en-only">Replace image</span>
            <span className="ar-only">استبدل الصورة</span>
          </div>
        )}

        {/* Upload prompt for cards with missing images */}
        {showUploadZone && (
          <div
            className={`cat-upload-zone${isDragOver ? ' dragging' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click() }}
          >
            <div className="cat-upload-icon">✦</div>
            <div className="cat-upload-text">
              <span className="en-only">Drop image here</span>
              <span className="ar-only">أسقط الصورة هنا</span>
            </div>
            <div className="cat-upload-sub">
              <span className="en-only">or click to upload</span>
              <span className="ar-only">أو اضغط للرفع</span>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        <div className="cat-overlay" />
        <div className="cat-name-overlay">
          <span className="en-only">{cat.nameEn}</span>
          <span className="ar-only">{cat.nameAr}</span>
        </div>
      </div>
    </a>
  )
}

export default function CategoryGrid() {
  return (
    <div className="cat-section">
      <div className="sep" />
      <div className="cat-header reveal-target">
        <span className="section-label en-only">Shop by Category</span>
        <span className="section-label ar-only">تسوّقي حسب الفئة</span>
        <h2 className="section-title en-only">Find your <em>ritual</em></h2>
        <h2 className="section-title ar-only">اعثري على <em>طقسكِ</em></h2>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map((cat, i) => (
          <CatCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>
      <div className="sep" />
    </div>
  )
}
