import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { writeClient, canUpload } from '@/lib/sanity-write'

export const runtime = 'nodejs'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!canUpload) {
    return NextResponse.json(
      { error: 'Image upload not configured — set SANITY_API_TOKEN and project id.' },
      { status: 503 },
    )
  }

  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image too large (max 8 MB)' }, { status: 413 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: file.name || 'upload',
      contentType: file.type,
    })

    return NextResponse.json({ url: asset.url, assetId: asset._id })
  } catch (err) {
    console.error('[admin/upload] error:', err)
    // Surface the underlying Sanity message (e.g. auth / permission errors)
    // so the admin sees the real cause instead of a generic failure.
    const msg = err instanceof Error ? err.message : 'Upload failed'
    const status = /unauthor|session|permission|token/i.test(msg) ? 401 : 500
    return NextResponse.json(
      { error: status === 401 ? `Sanity auth failed: ${msg} — check SANITY_API_TOKEN (needs Editor permission).` : msg },
      { status },
    )
  }
}
