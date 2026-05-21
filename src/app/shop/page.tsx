import { getAllProducts } from '@/lib/sanity'
import { DEMO_PRODUCTS } from '@/lib/demo-products'
import ShopClient from './ShopClient'

export const revalidate = 3600

export const metadata = {
  title: 'Shop — claraline',
  description: 'Explore the full claraline collection',
}

export default async function ShopPage() {
  const products = await getAllProducts().catch(() => [])
  // Fall back to demo products when Sanity has nothing in stock.
  const list = products.length > 0 ? products : DEMO_PRODUCTS
  return <ShopClient products={list} />
}
