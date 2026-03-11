'use client'

import { useState } from 'react'
import type { Todo } from '@/lib/types'

type Props = {
  listId: string
  onAdded: (created: Todo, tempId: string) => void
  onAddFailed?: (tempId: string) => void
}

export default function AddTodoForm({ listId, onAdded, onAddFailed }: Props) {
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || adding) return
    setAdding(true)

    const title = newTitle.trim()
    const tempId = `temp-${Date.now()}`
    const optimistic: Todo = { id: tempId, list_id: listId, title, completed: false, created_at: new Date().toISOString() }
    setNewTitle('')
    onAdded(optimistic, tempId)

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, list_id: listId }),
    })

    if (res.ok) {
      const created: Todo = await res.json()
      onAdded(created, tempId)
    } else if (onAddFailed) {
      onAddFailed(tempId)
    }
    setAdding(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="text"
        value={newTitle}
        onChange={e => {
          const val = e.target.value
          setNewTitle(val.length === 1 ? val.toUpperCase() : val)
        }}
        placeholder="Add a new task..."
        className="flex-1 min-w-0 px-5 py-3 md:px-6 md:py-4 rounded-full border border-zinc-200 bg-white text-sm md:text-base text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-turquoise shadow-sm"
      />
      <button
        type="submit"
        disabled={adding}
        className="px-5 py-3 md:px-7 md:py-4 rounded-full bg-coral text-white font-semibold text-sm md:text-base hover:bg-coral/85 transition-colors shadow-sm shrink-0"
      >
        Add
      </button>
    </form>
  )
}
