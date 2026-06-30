/** Mirrors the `products` table in the central Supabase (vendor panel) */
export type CentralProduct = {
  id: string
  sku: string
  barcode?: string
  brand_name_en: string
  brand_name_ar?: string
  name: string
  name_ar?: string
  product_name_en?: string
  product_name_ar?: string
  category?: string
  category_ar?: string
  sub_category?: string
  color_code?: string
  skin_type?: string
  skin_concern?: string
  volume_weight?: string
  description_en?: string
  description_ar?: string
  key_benefits_en?: string
  key_benefits_ar?: string
  how_to_use_en?: string
  how_to_use_ar?: string
  ingredients_en?: string
  ingredients_ar?: string
  tags?: string
  country_of_origin?: string
  price: number
  wholesale_price?: number
  distributor_price?: number
  stock: number
  image_1?: string
  image_2?: string
  image_3?: string
  created_at?: string
  updated_at?: string
}
