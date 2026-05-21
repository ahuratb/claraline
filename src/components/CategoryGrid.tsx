'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'

const CATEGORIES = [
  { id: 'lip-care',    nameEn: 'Lip Care',       nameAr: 'عناية بالشفاه',         image: '/lipcare.png' },
  { id: 'lip-liner',   nameEn: 'Lip Liner',       nameAr: 'محدد الشفاه',           image: '/lipliner.png' },
  { id: 'lip-multi',   nameEn: 'Lip Multi-Use',   nameAr: 'شفاه متعدد الاستخدام', image: '/lipmultiuse.png' },
  { id: 'primers',     nameEn: 'Primers',         nameAr: 'البرايمر',              image: '/primers.png' },
  { id: 'highlighter', nameEn: 'Highlighter',     nameAr: 'الهايلايتر',            image: '/highlighter.png' },
  { id: 'concealer',   nameEn: 'Concealer',       nameAr: 'الكونسيلر',             image: '/concealer.png' },
]

function CircleItem({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  const [imgSrc, setImgSrc]       = useState<string | null>(null)
  const [imgError, setImgError]   = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef              = useRef<HTMLInputElement>(null)
  const justDropped               = useRef(false)
  const storageKey                = `claraline-cat-img-${cat.id}`

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
    <Link
      href={`/shop?category=${cat.id}`}
      className="cat-circle reveal-target"
      style={{ transitionDelay: `${index * 0.06}s` }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={(e) => { if (justDropped.current) e.preventDefault() }}
      draggable={false}
    >
      <div className="cat-circle-img">
        {activeSrc && (
          <Image
            src={activeSrc}
            alt={cat.nameEn}
            fill
            sizes="(max-width: 768px) 130px, 180px"
            style={{ objectFit: 'cover' }}
            onError={() => { if (!imgSrc) setImgError(true) }}
            draggable={false}
          />
        )}
        {showUploadZone && (
          <div
            className={`cat-circle-upload${isDragOver ? ' dragging' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click() }}
          >
            ✦
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>
      <div className="cat-circle-name">
        <span className="en-only">{cat.nameEn}</span>
        <span className="ar-only">{cat.nameAr}</span>
      </div>
    </Link>
  )
}

function CircleCarousel() {
  const wrapRef       = useRef<HTMLDivElement>(null)
  const isDownRef     = useRef(false)
  const startXRef     = useRef(0)
  const startScrollRef = useRef(0)
  const didDragRef    = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = (e: React.PointerEvent) => {
    if (!wrapRef.current) return
    // Only drag with mouse — let native touch scroll handle finger swipes
    if (e.pointerType !== 'mouse') return
    isDownRef.current = true
    didDragRef.current = false
    startXRef.current = e.clientX
    startScrollRef.current = wrapRef.current.scrollLeft
    setIsDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDownRef.current || !wrapRef.current) return
    const dx = e.clientX - startXRef.current
    if (Math.abs(dx) > 5) didDragRef.current = true
    wrapRef.current.scrollLeft = startScrollRef.current - dx
  }
  const stopDrag = () => {
    isDownRef.current = false
    setIsDragging(false)
  }

  const onClickCapture = (e: React.MouseEvent) => {
    if (didDragRef.current) {
      // Block the click that would otherwise follow a drag
      e.preventDefault()
      e.stopPropagation()
      didDragRef.current = false
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`cat-circle-track${isDragging ? ' dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
      onPointerCancel={stopDrag}
      onClickCapture={onClickCapture}
    >
      {CATEGORIES.map((cat, i) => (
        <CircleItem key={cat.id} cat={cat} index={i} />
      ))}
    </div>
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
      <CircleCarousel />
      <div className="sep" />
    </div>
  )
}
