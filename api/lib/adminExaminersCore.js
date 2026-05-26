import { createClient } from '@supabase/supabase-js'

const ALLOWED_FIELDS = new Set([
  'name',
  'clinic_type',
  'city',
  'state',
  'address',
  'phone',
  'fax',
  'email',
  'website',
  'price',
  'wait_time',
  'hours',
  'badges',
  'accepts',
  'rating',
  'review_count',
  'tier',
  'verified',
  'active',
  'stripe_subscription_id',
])

const STRING_FIELDS = new Set([
  'name',
  'clinic_type',
  'city',
  'state',
  'address',
  'phone',
  'fax',
  'email',
  'website',
  'price',
  'wait_time',
  'hours',
])

const OPTIONAL_STRING_FIELDS = new Set(['fax', 'email', 'website', 'address', 'clinic_type'])

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY and VITE_SUPABASE_URL must be set in .env')
  }
  return createClient(url, key)
}

function isAuthorized(headers) {
  const pw = headers['x-admin-password']
  const expected = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD
  return expected && pw === expected
}

/** Strip unknown keys and normalize types before Supabase write */
export function sanitizeExaminerPayload(input, { partial = false } = {}) {
  const out = {}
  for (const key of ALLOWED_FIELDS) {
    if (!(key in input)) continue
    let val = input[key]

    if (STRING_FIELDS.has(key) && typeof val === 'string') {
      val = val.trim()
      if (OPTIONAL_STRING_FIELDS.has(key) && val === '') val = null
    }

    if (key === 'badges' || key === 'accepts') {
      if (typeof val === 'string') {
        val = val.split(',').map((s) => s.trim()).filter(Boolean)
      }
      if (!Array.isArray(val)) val = []
    }

    if (key === 'rating') {
      val = val === '' || val === null || val === undefined ? null : Number(val)
      if (Number.isNaN(val)) val = null
    }

    if (key === 'review_count') {
      val = parseInt(val, 10)
      if (Number.isNaN(val)) val = 0
    }

    if (key === 'verified' || key === 'active') {
      val = Boolean(val)
    }

    if (key === 'tier' && !['free', 'featured', 'premium'].includes(val)) {
      val = 'free'
    }

    out[key] = val
  }

  if (!partial && !out.name) {
    throw new Error('Name is required')
  }

  return out
}

/** @returns {{ status: number, body?: unknown }} */
export async function handleAdminExaminers({ method, headers, query = {}, body = {} }) {
  if (!isAuthorized(headers)) {
    return { status: 401, body: { message: 'Unauthorized' } }
  }

  const supabase = getSupabase()

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('examiners')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return { status: 200, body: data || [] }
  }

  if (method === 'POST') {
    const row = sanitizeExaminerPayload(body, { partial: false })
    const { data, error } = await supabase.from('examiners').insert([row]).select()
    if (error) throw error
    return { status: 201, body: data[0] }
  }

  if (method === 'PATCH') {
    const { id, ...rest } = body
    if (!id) return { status: 400, body: { message: 'id is required' } }
    const updates = sanitizeExaminerPayload(rest, { partial: true })
    if (Object.keys(updates).length === 0) {
      return { status: 400, body: { message: 'No valid fields to update' } }
    }
    const { data, error } = await supabase
      .from('examiners')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    if (!data?.length) return { status: 404, body: { message: 'Examiner not found' } }
    return { status: 200, body: data[0] }
  }

  if (method === 'DELETE') {
    const id = query.id || body.id
    if (!id) return { status: 400, body: { message: 'id is required' } }
    const { error } = await supabase.from('examiners').delete().eq('id', id)
    if (error) throw error
    return { status: 204 }
  }

  return { status: 405, body: { message: 'Method not allowed' } }
}
