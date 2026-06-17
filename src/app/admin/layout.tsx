import './admin.css'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin'

export const metadata = {
  title: 'Claraline — Content Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/login?callbackUrl=/admin')
  return <>{children}</>
}
