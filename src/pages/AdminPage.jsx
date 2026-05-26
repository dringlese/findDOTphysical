import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllExaminers, addExaminer, updateExaminer, deleteExaminer } from '../lib/supabase'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'dotadmin2024'

const CITIES = [
  'Oklahoma City',
  'Tulsa',
  'Norman',
  'Lawton',
  'Edmond',
  'Broken Arrow',
  'Midwest City',
]

const BLANK = {
  name: '',
  clinic_type: '',
  city: '',
  state: 'OK',
  address: '',
  phone: '',
  fax: '',
  email: '',
  website: '',
  price: '',
  wait_time: '',
  hours: '',
  badges: '',
  accepts: '',
  tier: 'free',
  verified: false,
  active: true,
}

function buildSavePayload(editing) {
  return {
    name: editing.name,
    clinic_type: editing.clinic_type,
    city: editing.city,
    state: editing.state || 'OK',
    address: editing.address,
    phone: editing.phone,
    fax: editing.fax,
    email: editing.email,
    website: editing.website,
    price: editing.price,
    wait_time: editing.wait_time,
    hours: editing.hours,
    badges: editing.badges,
    accepts: editing.accepts,
    tier: editing.tier,
    verified: editing.verified,
    active: editing.active,
  }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [examiners, setExaminers] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [msg, setMsg] = useState(null)
  const msgTimer = useRef(null)

  const showMsg = useCallback((text, isError = false) => {
    setMsg({ text, isError })
    clearTimeout(msgTimer.current)
    msgTimer.current = setTimeout(() => setMsg(null), 4000)
  }, [])

  function login() {
    if (pw === ADMIN_PASSWORD) setAuthed(true)
    else showMsg('Incorrect password', true)
  }

  function logout() {
    setAuthed(false)
    setExaminers([])
    setPw('')
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllExaminers(pw)
      setExaminers(Array.isArray(data) ? data : [])
    } catch (err) {
      showMsg('Load error: ' + err.message, true)
    } finally {
      setLoading(false)
    }
  }, [pw, showMsg])

  useEffect(() => {
    if (authed) load()
  }, [authed, load])

  async function quickUpdate(id, updates) {
    const snapshot = examiners
    setExaminers((list) =>
      list.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex))
    )
    setUpdatingId(id)
    try {
      await updateExaminer(pw, id, updates)
      showMsg('Saved')
    } catch (err) {
      setExaminers(snapshot)
      showMsg('Update failed: ' + err.message, true)
    } finally {
      setUpdatingId(null)
    }
  }

  function openNew() {
    setEditing({ ...BLANK })
    setFormOpen(true)
  }

  function openEdit(ex) {
    setEditing({
      ...ex,
      badges: Array.isArray(ex.badges) ? ex.badges.join(', ') : ex.badges || '',
      accepts: Array.isArray(ex.accepts) ? ex.accepts.join(', ') : ex.accepts || '',
    })
    setFormOpen(true)
  }

  function closeForm() {
    setEditing(null)
    setFormOpen(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!editing.name?.trim()) {
      showMsg('Name is required', true)
      return
    }

    setSaving(true)
    try {
      const payload = buildSavePayload(editing)
      if (editing.id) {
        await updateExaminer(pw, editing.id, payload)
        showMsg('Examiner updated')
      } else {
        await addExaminer(pw, payload)
        showMsg('Examiner added')
      }
      await load()
      closeForm()
    } catch (err) {
      showMsg('Save failed: ' + err.message, true)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteExaminer(pw, id)
      setExaminers((list) => list.filter((ex) => ex.id !== id))
      showMsg(`Deleted ${name}`)
    } catch (err) {
      showMsg('Delete failed: ' + err.message, true)
    }
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <h1>Admin Login</h1>
        <p className="admin-login-hint">Manage examiner listings</p>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          autoComplete="current-password"
        />
        <button type="button" onClick={login} className="btn btn--call">
          Login
        </button>
      </div>
    )
  }

  const activeCount = examiners.filter((e) => e.active).length

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p className="admin-subtitle">
            {loading ? 'Loading…' : `${examiners.length} listings · ${activeCount} active`}
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="btn btn--call" onClick={openNew}>
            + Add Examiner
          </button>
          <button type="button" className="admin-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {msg && (
        <p className={`admin-msg ${msg.isError ? 'admin-msg--error' : ''}`} role="status">
          {msg.text}
        </p>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Phone</th>
              <th>Tier</th>
              <th>Active</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {examiners.map((ex) => {
              const busy = updatingId === ex.id
              return (
                <tr key={ex.id} className={!ex.active ? 'admin-row--inactive' : ''}>
                  <td className="admin-cell-name">
                    {ex.name}
                    {!ex.active && <span className="admin-tag admin-tag--hidden">Hidden</span>}
                  </td>
                  <td>{ex.city || '—'}</td>
                  <td className="admin-cell-phone">{ex.phone || '—'}</td>
                  <td>
                    <select
                      value={ex.tier || 'free'}
                      disabled={busy}
                      onChange={(e) => quickUpdate(ex.id, { tier: e.target.value })}
                      className={`tier-select tier-select--${ex.tier || 'free'}`}
                      aria-label={`Tier for ${ex.name}`}
                    >
                      <option value="free">Free</option>
                      <option value="featured">Featured</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                  <td className="admin-cell-check">
                    <input
                      type="checkbox"
                      className="admin-toggle"
                      checked={!!ex.active}
                      disabled={busy}
                      onChange={(e) => quickUpdate(ex.id, { active: e.target.checked })}
                      aria-label={`Active: ${ex.name}`}
                    />
                  </td>
                  <td className="admin-cell-check">
                    <input
                      type="checkbox"
                      className="admin-toggle"
                      checked={!!ex.verified}
                      disabled={busy}
                      onChange={(e) => quickUpdate(ex.id, { verified: e.target.checked })}
                      aria-label={`Verified: ${ex.name}`}
                    />
                  </td>
                  <td className="admin-cell-actions">
                    <button
                      type="button"
                      className="admin-btn"
                      onClick={() => openEdit(ex)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => handleDelete(ex.id, ex.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
            {!loading && examiners.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-empty">
                  No examiners yet. Click &quot;+ Add Examiner&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && editing && (
        <div className="modal-overlay" onClick={closeForm}>
          <form
            className="modal modal--admin"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
          >
            <div className="modal-header">
              <h2>{editing.id ? 'Edit Examiner' : 'Add Examiner'}</h2>
            </div>

            <div className="modal-body">
              <div className="form-grid">
              <Field label="Name *" required value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Field label="Clinic Type" value={editing.clinic_type} onChange={(v) => setEditing({ ...editing, clinic_type: v })} />

              <label className="form-label">
                City
                <select
                  className="form-input"
                  value={editing.city}
                  onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                >
                  <option value="">— Select city —</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <Field label="State" value={editing.state} onChange={(v) => setEditing({ ...editing, state: v })} />
              <Field label="Address" value={editing.address} onChange={(v) => setEditing({ ...editing, address: v })} />
              <Field label="Phone" value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} />
              <Field label="Fax (optional)" value={editing.fax} onChange={(v) => setEditing({ ...editing, fax: v })} />
              <Field label="Email" type="email" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} />
              <Field label="Website (optional)" value={editing.website} onChange={(v) => setEditing({ ...editing, website: v })} />
              <Field label="Price" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
              <Field label="Wait Time" value={editing.wait_time} onChange={(v) => setEditing({ ...editing, wait_time: v })} />
              <Field label="Hours" value={editing.hours} onChange={(v) => setEditing({ ...editing, hours: v })} placeholder="e.g. Mon–Fri 7am–6pm" />
              <Field label="Badges (comma-separated)" value={editing.badges} onChange={(v) => setEditing({ ...editing, badges: v })} placeholder="Walk-ins Welcome, FMCSA Certified" />
              <Field label="Accepts (comma-separated)" value={editing.accepts} onChange={(v) => setEditing({ ...editing, accepts: v })} placeholder="All CDL Classes, Hazmat" />

              <label className="form-label">
                Tier
                <select
                  className="form-input"
                  value={editing.tier}
                  onChange={(e) => setEditing({ ...editing, tier: e.target.value })}
                >
                  <option value="free">Free</option>
                  <option value="featured">Featured ($49/mo)</option>
                  <option value="premium">Premium ($99/mo)</option>
                </select>
              </label>
              </div>

              <div className="form-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.verified}
                    onChange={(e) => setEditing({ ...editing, verified: e.target.checked })}
                  />
                  FMCSA Verified
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.active}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  />
                  Active (visible on site)
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn admin-btn-cancel" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn--call" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', ...rest }) {
  return (
    <label className="form-label">
      {label}
      <input
        className="form-input"
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </label>
  )
}
