'use client'

import { useState, useEffect } from 'react'
import type { List, Todo } from '@/lib/types'

type Props = {
  list: List
}

export default function TodoView({ list }: Props) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => {
    fetch(`/api/todos?list_id=${list.id}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTodos(data) })
  }, [list.id])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim(), list_id: list.id }),
    })

    if (res.ok) {
      const created: Todo = await res.json()
      setTodos(prev => [...prev, created])
      setNewTitle('')
    }
  }

  async function handleToggle(todo: Todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })

    if (res.ok) {
      const updated: Todo = await res.json()
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
    }
  }

  async function handleRename(todo: Todo) {
    const trimmed = editingTitle.trim()
    setEditingId(null)
    if (!trimmed || trimmed === todo.title) return

    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmed }),
    })

    if (res.ok) {
      const updated: Todo = await res.json()
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    if (res.ok) setTodos(prev => prev.filter(t => t.id !== id))
  }

  const remaining = todos.filter(t => !t.completed).length
  const sorted = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed))

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-3xl mx-auto px-8 flex flex-col h-full py-10 gap-6">

        {/* Header */}
        <div className="flex flex-col gap-2 shrink-0">
          <h2 className="text-4xl font-extrabold text-zinc-800 tracking-tight">{list.title}</h2>
          <div className="flex items-center gap-2">
            {remaining === 0 && todos.length > 0 ? (
              <span className="text-sm font-medium text-turquoise bg-turquoise/10 px-3 py-1 rounded-full">🎉 All done!</span>
            ) : todos.length === 0 ? (
              <span className="text-sm font-medium text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">No tasks yet</span>
            ) : (
              <>
                <span className="text-sm font-medium text-coral bg-coral/10 px-3 py-1 rounded-full">{remaining} left</span>
                <span className="text-sm text-zinc-400">{todos.length - remaining} completed</span>
              </>
            )}
          </div>
        </div>

        {/* Todo card */}
        <div className="rounded-2xl border border-zinc-200 shadow-sm flex flex-col min-h-0 flex-1">

          {/* Scrollable task list */}
          <div className="flex-1 overflow-y-auto">
            {todos.length === 0 ? (
              <div className="px-5 py-10 text-center text-zinc-400 text-sm">
                Add your first task below ↓
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {sorted.map(todo => (
                  <li
                    key={todo.id}
                    className="group flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50 transition-colors"
                  >
                    <button
                      onClick={() => handleToggle(todo)}
                      aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150
                        ${todo.completed
                          ? 'bg-turquoise border-turquoise'
                          : 'border-zinc-300 hover:border-turquoise'
                        }`}
                    >
                      {todo.completed && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    {editingId === todo.id ? (
                      <input
                        autoFocus
                        type="text"
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        onBlur={() => handleRename(todo)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRename(todo)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        className="flex-1 text-base text-zinc-700 bg-transparent focus:outline-none border-b border-turquoise"
                      />
                    ) : (
                      <span
                        onClick={() => { setEditingId(todo.id); setEditingTitle(todo.title) }}
                        className={`flex-1 text-base transition-colors cursor-text ${todo.completed ? 'line-through text-zinc-400' : 'text-zinc-700'}`}
                      >
                        {todo.title}
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-zinc-500 transition-all shrink-0"
                      aria-label={`Delete ${todo.title}`}
                    >
                      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add task input — fixed at bottom of card */}
          <div className="border-t border-zinc-100 bg-zinc-50/60 shrink-0">
            <form onSubmit={handleAdd} className="flex items-center gap-3 px-5 py-3">
              <span className="w-5 h-5 rounded-full border-2 border-dashed border-zinc-300 shrink-0" />
              <input
                type="text"
                value={newTitle}
                onChange={e => {
                  const val = e.target.value
                  setNewTitle(val.length === 1 ? val.toUpperCase() : val)
                }}
                placeholder="Add a new task..."
                className="flex-1 text-base text-zinc-700 placeholder:text-zinc-400 bg-transparent focus:outline-none"
              />
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
