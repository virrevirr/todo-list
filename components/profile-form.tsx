'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import LogoutButton from '@/components/logout-button'
import AppHeader from '@/components/app-header'

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
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{label}</span>
      <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:ring-2 focus-within:ring-turquoise transition-shadow">
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
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
          placeholder={`Add ${label.toLowerCase()}`}
        />
        {focused && isDirty && isValid && (
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); confirm() }}
            className="shrink-0 text-turquoise hover:text-turquoise/70 transition-colors"
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
            className={`w-3.5 h-3.5 shrink-0 transition-opacity ${focused ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}
            fill="none"
            aria-hidden
          >
            <path d="M11 2l3 3-8 8H3v-3L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
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
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <AppHeader
        left={
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Back to dashboard"
          >
            <svg viewBox="0 0 16 16" className="h-5 w-5 shrink-0" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        }
      />

      <main className="flex flex-1 flex-col overflow-y-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8">
          {/* Profile card — same style as todo list cards */}
          <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4 pb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coral shadow-sm">
                <span className="text-xl font-bold tracking-tight text-white">{initials}</span>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-zinc-800">
                  {[first, last].filter(Boolean).join(' ') || 'Your name'}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">{email}</p>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Profile details</h3>
              <div className="flex flex-col gap-6">
                <EditableField label="First name" value={first} onConfirm={v => { setFirst(v); handleSave(v, last) }} />
                <EditableField label="Last name" value={last} onConfirm={v => { setLast(v); handleSave(first, v) }} />
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Email</span>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <span className="text-base text-zinc-600">{email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-5 min-h-[1.25rem]">
              {error && <p className="text-sm text-red-500">{error}</p>}
              {saved && <p className="text-sm font-medium text-turquoise">Saved</p>}
              {saving && <p className="text-sm text-zinc-400">Saving…</p>}
            </div>
          </section>

          {/* Actions — pinned to bottom */}
          <div className="mt-auto flex flex-col gap-6 pt-4">
            <div className="flex justify-center">
              <LogoutButton />
            </div>
            <div className="border-t border-zinc-200 pt-6">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  Delete account
                </button>
              ) : (
                <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-4">
                  <p className="text-sm text-zinc-600">
                    This will permanently delete your account and all your data. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 rounded-full bg-coral py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 rounded-full border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 disabled:opacity-50"
                    >
                      {deleting ? 'Deleting…' : 'Yes, delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
