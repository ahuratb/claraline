export interface Product {
  _id: string
  _type: 'product'
  name_en: string
  name_ar: string
  slug: { current: string }
  price: number
  compareAtPrice?: number
  images: string[]
  collection: string
  description_en?: string
  description_ar?: string
  ingredients_en?: string
  ingredients_ar?: string
  howToUse_en?: string
  howToUse_ar?: string
  benefits_en?: string
  benefits_ar?: string
  sku?: string
  inStock: boolean
  stockCount?: number
  badge?: 'new' | 'bestseller' | 'limited'
  featured: boolean
  shades?: Shade[]
}

export interface Shade {
  name_en: string
  name_ar: string
  hex: string
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
}

export interface CartItem {
  productId: string
  name_en: string
  name_ar: string
  price: number
  quantity: number
  image?: string
  shade?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customer: Customer
  status: 'pending' | 'paid' | 'failed'
  paymentId?: string
  createdAt: string
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
}

export interface MyFatoorahResponse {
  IsSuccess: boolean
  Message: string
  Data: {
    InvoiceURL?: string
    InvoiceId?: number
    PaymentMethods?: PaymentMethod[]
    InvoiceStatus?: string
    CustomerReference?: string
  }
}

export interface PaymentMethod {
  PaymentMethodId: number
  PaymentMethodEn: string
  PaymentMethodAr: string
  PaymentMethodCode: string
  IsDirectPayment: boolean
  ServiceCharge: number
  TotalAmount: number
  CurrencyIso: string
  ImageUrl: string
}
