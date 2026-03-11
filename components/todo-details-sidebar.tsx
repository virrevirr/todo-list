'use client'

import { useState, useEffect } from 'react'
import type { Todo } from '@/lib/types'

type Props = {
  todo: Todo | null
  listTitle: string
  onClose: () => void
  onSaved?: (updated: Todo) => void
  onDelete?: (id: string) => void
}

export default function TodoDetailsSidebar({ todo, listTitle, onClose, onSaved, onDelete }: Props) {
  const [draftTitle, setDraftTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [draftDescription, setDraftDescription] = useState('')
  const [draftDate, setDraftDate] = useState('')
  const [draftTime, setDraftTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (todo) {
      setDraftTitle(todo.title)
      setDraftDescription(todo.description ?? '')
      if (todo.deadline) {
        const d = new Date(todo.deadline)
        if (!Number.isNaN(d.getTime())) {
          // Use local date/time parts so the picker shows the time
          // the user originally chose in their own timezone.
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          const hours = String(d.getHours()).padStart(2, '0')
          const minutes = String(d.getMinutes()).padStart(2, '0')

          setDraftDate(`${year}-${month}-${day}`)   // YYYY-MM-DD
          setDraftTime(`${hours}:${minutes}`)       // HH:MM (local)
        } else {
          setDraftDate('')
          setDraftTime('')
        }
      } else {
        setDraftDate('')
        setDraftTime('')
      }
      setEditingTitle(false)
      setError(null)
      setSaving(false)
    }
  }, [todo])

  if (!todo) return null

  async function handleSaveAndClose() {
    if (!todo || saving) return

    try {
      setSaving(true)
      setError(null)

      const updates: Record<string, unknown> = {}

      const trimmedTitle = draftTitle.trim()
      if (trimmedTitle && trimmedTitle !== todo.title) {
        updates.title = trimmedTitle
      }

      const normalizedDescription = draftDescription
      if (normalizedDescription !== (todo.description ?? '')) {
        updates.description = normalizedDescription === '' ? null : normalizedDescription
      }

      let newDeadline: string | null = todo.deadline ?? null
      if (draftDate) {
        const isoBase = `${draftDate}T${draftTime || '00:00'}:00`
        const d = new Date(isoBase)
        newDeadline = Number.isNaN(d.getTime()) ? null : d.toISOString()
      } else if (!draftDate && !draftTime) {
        newDeadline = null
      }
      if (newDeadline !== todo.deadline) {
        updates.deadline = newDeadline
      }

      if (Object.keys(updates).length === 0) {
        onClose()
        setSaving(false)
        return
      }

      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Could not save changes.')
        setSaving(false)
        return
      }

      const updated: Todo = await res.json()
      if (onSaved) onSaved(updated)
      onClose()
      setSaving(false)
    } catch {
      setError('Could not save changes.')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!todo || deleting || !onDelete) return
    setDeleting(true)
    setError(null)
    const res = await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
    if (res.ok) {
      onDelete(todo.id)
      onClose()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Could not delete task.')
    }
    setDeleting(false)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={handleSaveAndClose}
      />

      {/* Sidebar panel */}
      <aside
        className="fixed inset-y-0 right-0 w-80 max-w-full bg-white shadow-2xl border-l border-zinc-200 z-50 flex flex-col"
      >
        {/* Top bar: close (left), delete (right) */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-zinc-100">
          <button
            onClick={handleSaveAndClose}
            aria-label="Close details"
            className="text-zinc-300 hover:text-zinc-500 transition-colors p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-label={`Delete ${todo.title}`}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 flex flex-col gap-8">
          {/* Title */}
          <div className="pt-1 space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.12em]">
              Task name
            </p>
            {editingTitle ? (
              <div className="flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-turquoise">
                <input
                  autoFocus
                  type="text"
                  value={draftTitle}
                  onChange={e => setDraftTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                    if (e.key === 'Escape') {
                      setDraftTitle(todo.title)
                      e.currentTarget.blur()
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-base md:text-lg font-semibold text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
                  placeholder="Todo name"
                />
                <span className="w-3.5 shrink-0" aria-hidden="true" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingTitle(true)}
                className="inline-flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 cursor-text hover:bg-white hover:border-zinc-300 transition-colors"
              >
                <span className="min-w-0 flex-1 truncate text-left text-base md:text-lg font-semibold text-zinc-800">
                  {draftTitle || 'Todo details'}
                </span>
                <span className="shrink-0 text-zinc-300">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                    <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            )}
          </div>

          {/* Description */}
          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.12em]">
              Description
            </p>
            <div className="min-h-[72px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 focus-within:ring-2 focus-within:ring-turquoise">
              <textarea
                value={draftDescription}
                onChange={e => setDraftDescription(e.target.value)}
                placeholder="Add a description for this task..."
                className="w-full min-h-[64px] resize-none bg-transparent text-sm text-zinc-700 placeholder:text-zinc-300 focus:outline-none"
              />
            </div>
          </section>

          {/* Deadline */}
          <section className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.12em]">
              Deadline
            </p>
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 space-y-4">
              <div className="flex flex-col gap-3">
                {/* Date picker */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-400">Date</span>
                  <input
                    type="date"
                    value={draftDate}
                    onChange={e => setDraftDate(e.target.value)}
                    className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-turquoise appearance-none"
                  />
                </div>

                {/* Time picker */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-400">Time</span>
                  <input
                    type="time"
                    value={draftTime}
                    onChange={e => setDraftTime(e.target.value)}
                    className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-turquoise appearance-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Footer actions */}
        <footer className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-zinc-200 text-zinc-600 text-sm font-semibold hover:bg-white hover:border-zinc-300 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="flex-1 py-2.5 rounded-full bg-coral text-white text-sm font-semibold hover:bg-coral/90 shadow-sm transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Done'}
            </button>
          </div>
        </footer>
      </aside>
    </>
  )
}

