import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/** Returns the session only if the current user is an admin, else null. */
export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return null
  return session
}

/** Throws when the current request is not an authenticated admin. */
export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error('UNAUTHORIZED')
  return session
}
