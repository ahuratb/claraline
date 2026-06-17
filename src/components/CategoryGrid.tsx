'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import type { CategoryItem } from '@/lib/site-content'

interface Props {
  categories: CategoryItem[]
  labelEn: string
  labelAr: string
  titleEn: string
  titleAr: string
}

function CircleItem({ cat, index }: { cat: CategoryItem; index: number }) {
  return (
    <Link
      href={`/shop?category=${cat.id}`}
      className="cat-circle reveal-target"
      style={{ transitionDelay: `${index * 0.06}s` }}
      draggable={false}
      data-edit={`categories.${index}`}
      data-edit-label={`Category — ${cat.nameEn}`}
    >
      <div className="cat-circle-img">
        {cat.image && (
          <Image
            src={cat.image}
            alt={cat.nameEn}
            fill
            sizes="(max-width: 768px) 130px, 180px"
            style={{ objectFit: 'cover' }}
            draggable={false}
          />
        )}
      </div>
      <div className="cat-circle-name">
        <span className="en-only">{cat.nameEn}</span>
        <span className="ar-only">{cat.nameAr}</span>
      </div>
    </Link>
  )
}

function CircleCarousel({ categories }: { categories: CategoryItem[] }) {
  const wrapRef        = useRef<HTMLDivElement>(null)
  const isDownRef      = useRef(false)
  const startXRef      = useRef(0)
  const startScrollRef = useRef(0)
  const didDragRef     = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = (e: React.PointerEvent) => {
    if (!wrapRef.current) return
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
      {categories.map((cat, i) => (
        <CircleItem key={cat.id} cat={cat} index={i} />
      ))}
    </div>
  )
}

export default function CategoryGrid({ categories, labelEn, labelAr, titleEn, titleAr }: Props) {
  return (
    <div className="cat-section">
      <div className="sep" />
      <div className="cat-header reveal-target">
        <span className="section-label en-only" data-edit="categoryLabelEn" data-edit-label="Category label (EN)">{labelEn}</span>
        <span className="section-label ar-only" data-edit="categoryLabelAr" data-edit-label="Category label (AR)">{labelAr}</span>
        <h2 className="section-title en-only" data-edit="categoryTitleEn" data-edit-label="Category title (EN)" dangerouslySetInnerHTML={{ __html: titleEn }} />
        <h2 className="section-title ar-only" data-edit="categoryTitleAr" data-edit-label="Category title (AR)" dangerouslySetInnerHTML={{ __html: titleAr }} />
      </div>
      <CircleCarousel categories={categories} />
      <div className="sep" />
    </div>
  )
}
