'use client'

import type { Todo } from '@/lib/types'

type Props = {
  todo: Todo | null
  listTitle: string
  onClose: () => void
}

export default function TodoDetailsSidebar({ todo, listTitle, onClose }: Props) {
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
        className="fixed inset-y-0 right-0 w-[360px] max-w-full bg-white shadow-2xl border-l border-zinc-200 z-50 flex flex-col"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h3 className="text-base font-semibold text-zinc-800 truncate">
            {todo.title || 'Todo details'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="text-zinc-300 hover:text-zinc-500 transition-colors"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</p>
            <p className="mt-1 text-sm text-zinc-700">
              {todo.completed ? 'Completed' : 'Not completed'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">List</p>
            <p className="mt-1 text-sm text-zinc-700">
              {listTitle}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Created</p>
            <p className="mt-1 text-sm text-zinc-700">
              {new Date(todo.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

