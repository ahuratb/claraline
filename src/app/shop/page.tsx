import { getAllProducts } from '@/lib/sanity'
import ShopClient from './ShopClient'

export const revalidate = 3600

export const metadata = {
  title: 'Shop — claraline',
  description: 'Explore the full claraline collection',
}

export default async function ShopPage() {
  const products = await getAllProducts().catch(() => [])
  return <ShopClient products={products} />
}
