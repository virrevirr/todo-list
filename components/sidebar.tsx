'use client'

import { useState, useEffect } from 'react'
import type { List } from '@/lib/types'
import LogoutButton from '@/components/logout-button'

type Props = {
  initialLists: List[]
  selectedId: string | null
  onSelect: (list: List | null) => void
  onClose: () => void
  isOpen: boolean
}

export default function Sidebar({ initialLists, selectedId, onSelect, onClose, isOpen }: Props) {
  const [lists, setLists] = useState<List[]>(initialLists)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setCreating(false)
      setNewName('')
    }
  }, [isOpen])

  async function handleCreate(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!newName.trim() || adding) return

    setAdding(true)
    const res = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newName.trim() }),
    })

    if (res.ok) {
      const created: List = await res.json()
      setLists(prev => [...prev, created])
      onSelect(created)
    }

    setNewName('')
    setCreating(false)
    setAdding(false)
  }

  async function handleDelete(list: List) {
    const res = await fetch(`/api/lists/${list.id}`, { method: 'DELETE' })

    if (res.ok) {
      setLists(prev => prev.filter(l => l.id !== list.id))
      if (selectedId === list.id) onSelect(null)
    }
  }

  return (
    <aside className="flex flex-col h-full border-r border-zinc-200 bg-white w-80 shrink-0">
      <div className="px-0 flex items-center justify-between" style={{ height: '68px' }}>
        {creating ? (
          <form onSubmit={handleCreate} className="flex gap-1 px-2 w-fit">
            <button
              type="button"
              onClick={() => { setCreating(false); setNewName('') }}
              className="text-zinc-300 hover:text-zinc-500 transition-colors text-2xl font-light leading-none px-1.5"
              aria-label="Cancel"
            >
              ✕
            </button>
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => {
                const val = e.target.value
                setNewName(val.length === 1 ? val.toUpperCase() : val)
              }}
              onKeyDown={e => e.key === 'Escape' && (setCreating(false), setNewName(''))}
              placeholder="List name"
              className="w-51 px-3 py-1.5 text-base rounded-lg border border-zinc-200 text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-turquoise"
            />
            <button
              type="submit"
              disabled={adding}
              className="text-base font-semibold text-white bg-coral px-2.5 py-1.5 rounded-lg hover:bg-coral/85 transition-colors disabled:opacity-50"
              style={{ marginLeft: '5px' }}
            >
              Add
            </button>
        
          </form>
        ) : (
          <>
            <button
              onClick={() => setCreating(true)}
              className="group flex items-center gap-2 text-zinc-500 pl-3.5 pr-3 py-1.5"
            >
              <span className="flex items-center gap-2 transition-transform duration-150 group-hover:scale-110 origin-left">
                <span className="text-2xl leading-none">+</span>
                <span className="text-lg font-semibold">New List</span>
              </span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="mr-3 text-zinc-300 hover:text-zinc-500 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        {lists.length === 0 && (
          <p className="text-base text-zinc-400 px-3 py-3">No lists yet.</p>
        )}
        {lists.map(list => (
          <div
            key={list.id}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
              selectedId === list.id
                ? 'bg-turquoise/20'
                : 'hover:bg-zinc-100'
            }`}
            onClick={() => onSelect(list)}
          >
            <span className="text-lg font-medium text-zinc-700 truncate">{list.title}</span>
            <button
              onClick={e => { e.stopPropagation(); handleDelete(list) }}
              className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-zinc-500 transition-all text-sm ml-2 shrink-0"
              aria-label={`Delete ${list.title}`}
            >
              ✕
            </button>
          </div>
        ))}
      </nav>

      <div className="p-5 border-t border-zinc-100">
        <LogoutButton />
      </div>
    </aside>
  )
}
