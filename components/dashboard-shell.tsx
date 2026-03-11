'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import TodoView from '@/components/todo-view'
import Logo from '@/components/logo'
import type { List, Todo } from '@/lib/types'

type Props = {
  initialLists: List[]
  initialTodosByList: Record<string, Todo[]>
  initials: string
}

export default function DashboardShell({ initialLists, initialTodosByList, initials }: Props) {
  const router = useRouter()
  const [selectedList, setSelectedList] = useState<List | null>(() => {
    const storedId = localStorage.getItem('selectedListId')
    if (storedId) {
      const match = initialLists.find(l => l.id === storedId)
      if (match) return match
    }
    return initialLists[0] ?? null
  })
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem('selectedListId')
    if (!storedId) return
    const match = initialLists.find(l => l.id === storedId)
    if (match) setSelectedList(match)
  }, [initialLists])

  function handleSelect(list: List | null) {
    setSelectedList(list)
    if (list) {
      localStorage.setItem('selectedListId', list.id)
    } else {
      localStorage.removeItem('selectedListId')
    }
    setDrawerOpen(false)
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          initialLists={initialLists}
          selectedId={selectedList?.id ?? null}
          onSelect={handleSelect}
          onClose={() => setDrawerOpen(false)}
          isOpen={drawerOpen}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label="Open sidebar"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 scale-80">
            <Logo />
          </div>
          <button
            aria-label="Profile"
            onClick={() => router.push('/profile')}
            className="w-9 h-9 rounded-full bg-coral flex items-center justify-center shrink-0 hover:bg-coral/85 transition-colors"
          >
            <span className="text-white text-sm font-bold leading-none">{initials}</span>
          </button>
        </header>

        <main
          className="relative flex-1 overflow-hidden bg-zinc-50"
        >
          {selectedList ? (
            <TodoView key={selectedList.id} list={selectedList} initialTodos={initialTodosByList[selectedList.id] ?? []} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="text-5xl">✨</div>
              <h3 className="text-2xl font-bold text-zinc-800">Nothing here yet!</h3>
              <p className="text-zinc-400 text-sm max-w-xs">Open the menu and create your first list to start getting things done.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
