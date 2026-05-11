import { createClient } from '@supabase/supabase-js'

// ─── Replace with your real Supabase credentials ───────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
// ────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Examiner Queries ────────────────────────────────────────────────────────

/** Fetch all active examiners, premium first */
export async function getExaminers({ city, search, walkIns, openWeekends } = {}) {
  let query = supabase
    .from('examiners')
    .select('*')
    .eq('active', true)
    .order('tier', { ascending: false }) // premium > featured > free

  if (city) query = query.ilike('city', city)
  if (walkIns) query = query.contains('badges', ['Walk-ins Welcome'])
  if (openWeekends) query = query.contains('badges', ['Open Weekends'])
  if (search) {
    query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,clinic_type.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error

  // Sort: premium → featured → free (Supabase text sort isn't perfect for this)
  const tierOrder = { premium: 0, featured: 1, free: 2 }
  return (data || []).sort((a, b) => (tierOrder[a.tier] ?? 3) - (tierOrder[b.tier] ?? 3))
}

/** Fetch all examiners (admin) */
export async function getAllExaminers() {
  const { data, error } = await supabase
    .from('examiners')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

/** Add a new examiner */
export async function addExaminer(examiner) {
  const { data, error } = await supabase.from('examiners').insert([examiner]).select()
  if (error) throw error
  return data[0]
}

/** Update an examiner */
export async function updateExaminer(id, updates) {
  const { data, error } = await supabase
    .from('examiners')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

/** Delete an examiner */
export async function deleteExaminer(id) {
  const { error } = await supabase.from('examiners').delete().eq('id', id)
  if (error) throw error
}
