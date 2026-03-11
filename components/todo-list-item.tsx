'use client'

import type { Todo } from '@/lib/types'
import SwipeableItem from '@/components/swipeable-item'

type Props = {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: string) => void
  onSelect: (todo: Todo) => void
}

function formatDeadline(deadline: string | null | undefined): string | null {
  if (!deadline) return null
  const d = new Date(deadline)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export default function TodoListItem({ todo, onToggle, onDelete, onSelect }: Props) {
  const deadlineLabel = formatDeadline(todo.deadline)

  return (
    <SwipeableItem
      onDelete={() => onDelete(todo.id)}
      deleteLabel={`Delete ${todo.title}`}
    >
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
              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <span
          className={`flex-1 text-base ${todo.completed ? 'line-through text-zinc-400' : 'text-zinc-700'}`}
        >
          {todo.title}
        </span>

        {todo.completed && (
          <span className="text-sm font-medium text-turquoise bg-turquoise/10 px-3 py-1 rounded-full shrink-0">
            Done
          </span>
        )}

        {deadlineLabel && (
          <span className="text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full shrink-0">
            {deadlineLabel}
          </span>
        )}

        <button
          onClick={e => { e.stopPropagation(); onDelete(todo.id) }}
          className="hidden md:block opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-zinc-500 transition-all shrink-0"
          aria-label={`Delete ${todo.title}`}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      </li>
    </SwipeableItem>
  )
}
