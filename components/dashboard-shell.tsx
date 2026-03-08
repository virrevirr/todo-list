'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import type { List } from '@/lib/types'

type Props = {
  initialLists: List[]
  email: string
}

export default function DashboardShell({ initialLists, email }: Props) {
  const [selectedList, setSelectedList] = useState<List | null>(initialLists[0] ?? null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleSelect(list: List | null) {
    setSelectedList(list)
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
          isOpen={drawerOpen}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <h1 className="text-lg font-bold text-zinc-700">
              {selectedList ? selectedList.title : 'Select a list'}
            </h1>
          </div>
          <span className="text-sm text-zinc-400">{email}</span>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8">
          {selectedList ? (
            <p className="text-zinc-400 text-sm">Todos for "{selectedList.title}" will appear here.</p>
          ) : (
            <p className="text-zinc-400 text-sm">Create a list to get started.</p>
          )}
        </main>
      </div>
    </div>
  )
}
