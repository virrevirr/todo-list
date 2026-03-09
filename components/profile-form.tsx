'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const lettersOnly = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/

type Props = {
  initials: string
  firstName: string
  lastName: string
  email: string
}

function EditableField({
  label,
  value,
  onConfirm,
}: {
  label: string
  value: string
  onConfirm: (v: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const [focused, setFocused] = useState(false)

  useEffect(() => { setDraft(value) }, [value])

  const isDirty = draft.trim() !== value.trim()
  const isValid = lettersOnly.test(draft.trim()) && draft.trim().length > 0

  function confirm() {
    if (isDirty && isValid) {
      onConfirm(draft.trim())
    } else {
      setDraft(value)
    }
  }

  function revert() {
    setDraft(value)
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 group">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
        <input
          type="text"
          value={draft}
          onChange={e => {
            const v = e.target.value
            if (v === '' || lettersOnly.test(v)) setDraft(v)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); revert() }}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); confirm(); (e.target as HTMLInputElement).blur() }
            if (e.key === 'Escape') { revert(); (e.target as HTMLInputElement).blur() }
          }}
          className="text-base text-zinc-800 font-medium bg-transparent focus:outline-none w-full placeholder:text-zinc-300"
          placeholder={`Add ${label.toLowerCase()}`}
        />
      </div>
      {focused && isDirty && isValid && (
        <button
          onMouseDown={e => { e.preventDefault(); confirm() }}
          className="ml-3 shrink-0 text-turquoise hover:text-turquoise/70 transition-colors"
          aria-label="Confirm"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {(!focused || !isDirty) && (
        <svg
          viewBox="0 0 16 16"
          className={`w-3.5 h-3.5 shrink-0 ml-3 transition-opacity ${focused ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}
          fill="none"
        >
          <path d="M11 2l3 3-8 8H3v-3L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  )
}

export default function ProfileForm({ initials, firstName, lastName, email }: Props) {
  const router = useRouter()
  const [first, setFirst] = useState(firstName)
  const [last, setLast] = useState(lastName)
  const [saving, setSaving] = useState(false)

  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSave(newFirst: string, newLast: string) {
    setError(null)
    setSaving(true)
    setSaved(false)

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: newFirst, last_name: newLast }),
    })

    setSaving(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong.')
    } else {
      setSaved(true)
      router.refresh()
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch('/api/profile', { method: 'DELETE' })

    if (res.ok) {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Could not delete account.')
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="flex items-center px-6 py-4 border-b border-zinc-200">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-medium"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </header>

      <main className="flex flex-col items-center flex-1 px-6 py-14">
        <div className="w-full max-w-sm flex flex-col gap-10">

          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-coral flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{initials}</span>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-zinc-800">{[first, last].filter(Boolean).join(' ') || 'Your name'}</p>
              <p className="text-sm text-zinc-400 mt-0.5">{email}</p>
            </div>
          </div>

          {/* Editable fields */}
          <div className="flex flex-col">
            <EditableField label="First name" value={first} onConfirm={v => { setFirst(v); handleSave(v, last) }} />
            <EditableField label="Last name" value={last} onConfirm={v => { setLast(v); handleSave(first, v) }} />
            <div className="flex items-center justify-between py-4 border-b border-zinc-100">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</span>
                <span className="text-base text-zinc-400">{email}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          {error && <p className="text-sm text-red-400 -mt-6">{error}</p>}
          {saved && <p className="text-sm text-turquoise font-medium -mt-6">Saved</p>}
          {saving && <p className="text-sm text-zinc-400 -mt-6">Saving…</p>}

          {/* Delete */}
          <div className="flex flex-col gap-3">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors text-left"
              >
                Delete account
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-zinc-500">This will permanently delete your account.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2.5 rounded-full border border-zinc-200 text-zinc-500 text-sm font-semibold hover:border-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-full border border-red-200 text-red-400 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Yes, delete'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
