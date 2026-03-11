'use client'

import { useState, useRef } from 'react'
import type { List, Todo } from '@/lib/types'
import TodoDetailsSidebar from '@/components/todo-details-sidebar'

type Props = {
  list: List
  initialTodos: Todo[]
}

const SWIPE_THRESHOLD = 60
const REVEAL_WIDTH = 72

function SwipeableItem({ todo, onDelete, children }: {
  todo: Todo
  onDelete: () => void
  children: React.ReactNode
}) {
  const [offsetX, setOffsetX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const isSwipe = useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    isSwipe.current = false
    setDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    // Only treat as horizontal swipe if more horizontal than vertical
    if (!isSwipe.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
      isSwipe.current = true
    }
    if (!isSwipe.current) return

    e.preventDefault()
    const clamped = Math.min(0, Math.max(-REVEAL_WIDTH, dx + (offsetX === -REVEAL_WIDTH ? -REVEAL_WIDTH : 0)))
    setOffsetX(clamped)
  }

  function onTouchEnd() {
    setDragging(false)
    if (offsetX < -SWIPE_THRESHOLD) {
      setOffsetX(-REVEAL_WIDTH)
    } else {
      setOffsetX(0)
    }
  }

  function close() {
    setOffsetX(0)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Delete background */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-zinc-400 rounded-2xl"
        style={{ width: REVEAL_WIDTH }}
      >
        <button
          onClick={onDelete}
          className="flex items-center justify-center w-full h-full"
          aria-label={`Delete ${todo.title}`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>

      {/* Swipeable content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Backdrop to close when swiped open */}
        {offsetX < 0 && (
          <div className="absolute inset-0 z-10" onClick={close} />
        )}
        {children}
      </div>
    </div>
  )
}

export default function TodoView({ list, initialTodos }: Props) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || adding) return
    setAdding(true)

    const tempId = `temp-${Date.now()}`
    const optimistic: Todo = { id: tempId, list_id: list.id, title: newTitle.trim(), completed: false, created_at: new Date().toISOString() }
    setTodos(prev => [...prev, optimistic])
    setNewTitle('')

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: optimistic.title, list_id: list.id }),
    })
    if (res.ok) {
      const created: Todo = await res.json()
      setTodos(prev => prev.map(t => t.id === tempId ? created : t))
    } else {
      setTodos(prev => prev.filter(t => t.id !== tempId))
    }
    setAdding(false)
  }

  async function handleToggle(todo: Todo) {
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t))

    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    if (!res.ok) {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t))
    }
  }

  async function handleDelete(id: string) {
    const deleted = todos.find(t => t.id === id)
    setTodos(prev => prev.filter(t => t.id !== id))

    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    if (!res.ok && deleted) {
      setTodos(prev => [...prev, deleted])
    }
  }

  const sorted = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed))

  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-zinc-800 tracking-tight">{list.title}</h2>

        {/* Add task input */}
        <form onSubmit={handleAdd} className="flex items-center gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={e => {
              const val = e.target.value
              setNewTitle(val.length === 1 ? val.toUpperCase() : val)
            }}
            placeholder="Add a new task..."
            className="flex-1 min-w-0 px-5 py-3 md:px-6 md:py-4 rounded-full border border-zinc-200 bg-white text-sm md:text-base text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 shadow-sm"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-5 py-3 md:px-7 md:py-4 rounded-full bg-coral text-white font-semibold text-sm md:text-base hover:bg-coral/85 transition-colors shadow-sm shrink-0"
          >
            Add
          </button>
        </form>

        {/* Todo list */}
        {todos.length === 0 ? (
          <p className="text-sm text-zinc-400 px-1">No tasks yet - add one above.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sorted.map(todo => (
              <SwipeableItem key={todo.id} todo={todo} onDelete={() => handleDelete(todo.id)}>
                <li
                  className="group flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-zinc-100 hover:border-zinc-200 transition-colors shadow-sm cursor-pointer"
                  onClick={() => setSelectedTodo(todo)}
                >
                  {/* Rounded square checkbox */}
                  <button
                    onClick={e => { e.stopPropagation(); handleToggle(todo) }}
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

                  {/* Title (read-only here; editing via details sidebar) */}
                  <span
                    className={`flex-1 text-base ${todo.completed ? 'line-through text-zinc-400' : 'text-zinc-700'}`}
                  >
                    {todo.title}
                  </span>

                  {/* Status badge */}
                  {todo.completed && (
                    <span className="text-sm font-medium text-turquoise bg-turquoise/10 px-3 py-1 rounded-full shrink-0">
                      Done
                    </span>
                  )}

                  {/* Deadline tag */}
                  {todo.deadline && (() => {
                    const d = new Date(todo.deadline)
                    if (Number.isNaN(d.getTime())) return null
                    const label = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
                    return (
                      <span className="text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full shrink-0">
                        {label}
                      </span>
                    )
                  })()}

                  {/* Delete (desktop hover) */}
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(todo.id) }}
                    className="hidden md:block opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-zinc-500 transition-all shrink-0"
                    aria-label={`Delete ${todo.title}`}
                  >
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              </SwipeableItem>
            ))}
          </ul>
        )}

      </div>
      <TodoDetailsSidebar
        todo={selectedTodo}
        listTitle={list.title}
        onClose={() => setSelectedTodo(null)}
        onSaved={updated => {
          setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
          setSelectedTodo(updated)
        }}
      />
    </div>
  )
}
