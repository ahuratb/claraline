import { createClient } from '@sanity/client'

/* ──────────────────────────────────────────────────────────────
   Server-only Sanity client with write access.
   Uses SANITY_API_TOKEN — NEVER import this in client components.
   Used by the admin upload route to push images to the Sanity CDN
   (asset store) and get back a permanent, public URL.
   ────────────────────────────────────────────────────────────── */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

export const canUpload = /^[a-z0-9-]+$/.test(projectId) && !!token

export const writeClient = createClient({
  projectId: canUpload ? projectId : 'placeholder',
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})
