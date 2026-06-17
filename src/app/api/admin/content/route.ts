import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAdminSession } from '@/lib/admin'
import { getSiteContent, saveSiteContent, type SiteContent } from '@/lib/site-content'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const content = await getSiteContent()
  return NextResponse.json({ content })
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const content = body?.content as SiteContent | undefined

    // Minimal shape check — the editor always sends the full object.
    if (!content || !content.hero || !Array.isArray(content.stats)) {
      return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 })
    }

    await saveSiteContent(content)
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/content] save error:', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
