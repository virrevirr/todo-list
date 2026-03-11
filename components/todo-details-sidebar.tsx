'use client'

import { useState, useEffect } from 'react'
import type { Todo } from '@/lib/types'

type Props = {
  todo: Todo | null
  listTitle: string
  onClose: () => void
}

export default function TodoDetailsSidebar({ todo, listTitle, onClose }: Props) {
  const [draftTitle, setDraftTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [draftDescription, setDraftDescription] = useState('')

  useEffect(() => {
    if (todo) {
      setDraftTitle(todo.title)
      setDraftDescription(todo.description ?? '')
      setEditingTitle(false)
    }
  }, [todo])

  if (!todo) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className="fixed inset-y-0 right-0 w-80 max-w-full bg-white shadow-2xl border-l border-zinc-200 z-50 flex flex-col"
      >
        {/* Top bar with mirrored sidebar icon */}
        <header className="flex items-center px-4 py-4">
          <button
            onClick={onClose}
            aria-label="Close details"
            className="text-zinc-300 hover:text-zinc-500 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 flex flex-col gap-8">
          {/* Title */}
          <div className="pt-1 space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.12em]">
              Task name
            </p>
            {editingTitle ? (
              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5">
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
                  className="w-full bg-transparent text-base md:text-lg font-semibold text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
                  placeholder="Todo name"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingTitle(true)}
                className="inline-flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 mx-auto max-w-full cursor-text hover:bg-white hover:border-zinc-300 transition-colors"
              >
                <span className="text-base md:text-lg font-semibold text-zinc-800 truncate">
                  {draftTitle || 'Todo details'}
                </span>
                <span className="ml-auto text-zinc-300">
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
            <div className="min-h-[72px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
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
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
              <span className="text-zinc-400 italic">
                No deadline set
              </span>
            </div>
          </section>

          {/* Context (small, subtle) */}
          <div className="mt-auto text-xs text-zinc-400">
            <span className="font-medium">List:</span> {listTitle}
          </div>
        </div>

        {/* Footer actions */}
        <footer className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-zinc-200 text-zinc-600 text-sm font-semibold hover:bg-white hover:border-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full bg-coral text-white text-sm font-semibold hover:bg-coral/90 shadow-sm transition-colors"
            >
              Done
            </button>
          </div>
        </footer>
      </aside>
    </>
  )
}

