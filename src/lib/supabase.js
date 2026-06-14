import { createClient } from '@supabase/supabase-js'

// ─── Replace with your real Supabase credentials ───────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
// ────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Examiner Queries ────────────────────────────────────────────────────────

const TIER_ORDER = { premium: 0, featured: 1, free: 2 }

/** Strip characters that break PostgREST `.or()` filters */
function sanitizeSearchTerm(term) {
  return term
    .replace(/[%,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Premium -> Featured -> Free, then alphabetical by provider/practice name */
export function sortExaminersByTier(list) {
  return [...list].sort((a, b) => {
    const byTier = (TIER_ORDER[a.tier] ?? 3) - (TIER_ORDER[b.tier] ?? 3)
    if (byTier !== 0) return byTier
    const aLabel = a.practice_name || a.name || ''
    const bLabel = b.practice_name || b.name || ''
    return aLabel.localeCompare(bLabel, undefined, { sensitivity: 'base' })
  })
}

/** Fetch active examiners with optional filters; sorted premium first */
export async function getExaminers({ city, search, walkIns, openWeekends } = {}) {
  let query = supabase.from('examiners').select('*').eq('active', true)

  if (city) query = query.eq('city', city)
  if (walkIns) query = query.contains('badges', ['Walk-ins Welcome'])
  if (openWeekends) query = query.contains('badges', ['Open Weekends'])

  const q = sanitizeSearchTerm(search || '')
  if (q) {
    // Match provider or practice names that start with the search text.
    query = query.or(`name.ilike.${q}%,practice_name.ilike.${q}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return sortExaminersByTier(data || [])
}

// ─── Admin API (service role server-side — bypasses RLS) ─────────────────────

async function adminRequest(adminPassword, method, { body, id } = {}) {
  const url = id ? `/api/admin-examiners?id=${encodeURIComponent(id)}` : '/api/admin-examiners'
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': adminPassword,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Admin API not reachable. Restart with `npm run dev` and ensure SUPABASE_SERVICE_ROLE_KEY is in .env'
    )
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)

  if (method === 'GET' && !Array.isArray(data)) {
    throw new Error('Admin API returned invalid data')
  }

  return data
}

/** Fetch all examiners (admin) */
export async function getAllExaminers(adminPassword) {
  const data = await adminRequest(adminPassword, 'GET')
  return Array.isArray(data) ? data : []
}

/** Add a new examiner */
export async function addExaminer(adminPassword, examiner) {
  return adminRequest(adminPassword, 'POST', { body: examiner })
}

/** Update an examiner */
export async function updateExaminer(adminPassword, id, updates) {
  return adminRequest(adminPassword, 'PATCH', { body: { id, ...updates } })
}

/** Delete an examiner */
export async function deleteExaminer(adminPassword, id) {
  await adminRequest(adminPassword, 'DELETE', { id })
}
