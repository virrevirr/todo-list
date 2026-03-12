'use client'

import { useEffect, useState } from 'react'
import type { Todo } from '@/lib/types'

type Props = {
  todo: Todo
  onToggle: (todo: Todo) => void
  onSelect: (todo: Todo) => void
}

function formatDeadline(deadline: string | null | undefined): string | null {
  if (!deadline) return null
  const d = new Date(deadline)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function isDeadlineOverdue(deadline: string | null | undefined, now: Date): boolean {
  if (!deadline) return false
  const d = new Date(deadline)
  if (Number.isNaN(d.getTime())) return false
  return d.getTime() < now.getTime()
}

export default function TodoListItem({ todo, onToggle, onSelect }: Props) {
  const [now, setNow] = useState(() => new Date())
  const deadlineLabel = formatDeadline(todo.deadline)
  const overdue = !todo.completed && isDeadlineOverdue(todo.deadline, now)

  useEffect(() => {
    // Re-evaluate overdue state every minute so the badge color updates
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <li
      className="group flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-zinc-100 hover:border-zinc-200 transition-colors shadow-sm cursor-pointer"
      onClick={() => onSelect(todo)}
    >
      <button
        onClick={e => { e.stopPropagation(); onToggle(todo) }}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        className={`w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all duration-150
            ${todo.completed ? 'bg-turquoise border-turquoise' : 'border-zinc-300 hover:border-turquoise bg-white'}`}
      >
        {todo.completed && (
          <svg viewBox="0 0 10 8" className="w-3 h-3" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
  
      {/* Title + description — stays flex-1 so it has room */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span
          className={`text-base font-medium ${todo.completed ? 'line-through text-zinc-400' : 'text-zinc-700'}`}
        >
          {todo.title}
        </span>
        {todo.description?.trim() && (
          <p
            className={`text-sm line-clamp-2 ${todo.completed ? 'text-zinc-400' : 'text-zinc-500'}`}
            title={todo.description.trim()}
          >
            {todo.description.trim()}
          </p>
        )}
      </div>
  
      {/* Tags container: vertical on mobile, horizontal from sm+ */}
      <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2 shrink-0">
        {todo.completed && (
          <span className="text-sm font-medium text-turquoise bg-turquoise/10 px-3 py-1 rounded-full">
            Done
          </span>
        )}
        {deadlineLabel && (
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              overdue ? 'text-coral bg-coral/10' : 'text-zinc-500 bg-zinc-100'
            }`}
          >
            {deadlineLabel}
          </span>
        )}
      </div>
  
      <span
        className="shrink-0 text-zinc-300 group-hover:text-zinc-500 transition-colors"
        aria-hidden
      >
        <svg viewBox="0 0 16 16" className="w-5 h-5" fill="currentColor">
          <circle cx="8" cy="4" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
        </svg>
      </span>
    </li>
  )
}