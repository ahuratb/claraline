export interface SubCategory {
  name_en: string
  name_ar: string
  slug: string
}

export interface MenuCategory {
  name_en: string
  name_ar: string
  slug: string
  subcategories: SubCategory[]
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    name_en: 'LIP', name_ar: 'الشفاه', slug: 'lip',
    subcategories: [
      { name_en: 'Lipstick',  name_ar: 'أحمر شفاه',  slug: 'lipstick' },
      { name_en: 'Lip Gloss', name_ar: 'ملمع',        slug: 'lipgloss' },
      { name_en: 'Lip Liner', name_ar: 'قلم تحديد',  slug: 'lipliner' },
      { name_en: 'Lip Balm',  name_ar: 'بلسم',        slug: 'lipbalm' },
      { name_en: 'Lip Oil',   name_ar: 'زيت',          slug: 'lipoil' },
    ],
  },
  {
    name_en: 'EYE', name_ar: 'العيون', slug: 'eye',
    subcategories: [
      { name_en: 'Mascara',   name_ar: 'ماسكارا', slug: 'mascara' },
      { name_en: 'Eyeliner',  name_ar: 'محدد',     slug: 'eyeliner' },
      { name_en: 'Eyeshadow', name_ar: 'ظلال',     slug: 'eyeshadow' },
      { name_en: 'Brow',      name_ar: 'حواجب',    slug: 'brow' },
    ],
  },
  {
    name_en: 'FACE', name_ar: 'الوجه', slug: 'face',
    subcategories: [
      { name_en: 'Foundation',  name_ar: 'كريم أساس', slug: 'foundation' },
      { name_en: 'Concealer',   name_ar: 'كونسيلر',   slug: 'concealer' },
      { name_en: 'Powder',      name_ar: 'بودرة',      slug: 'powder' },
      { name_en: 'Blush',       name_ar: 'بلاش',       slug: 'blush' },
      { name_en: 'Highlighter', name_ar: 'هايلايتر',   slug: 'highlighter' },
    ],
  },
  {
    name_en: 'GIFT SETS', name_ar: 'هدايا', slug: 'gift',
    subcategories: [],
  },
]
