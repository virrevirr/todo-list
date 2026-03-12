'use client'

import { useState } from 'react'
import type { List, Todo } from '@/lib/types'
import TodoDetailsSidebar from '@/components/todo-details-sidebar'
import AddTodoForm from '@/components/add-todo-form'
import TodoListItem from '@/components/todo-list-item'

type Props = {
  list: List
  initialTodos: Todo[]
}

export default function TodoView({ list, initialTodos }: Props) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

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

        <h2 className="text-4xl font-extrabold text-zinc-800 tracking-tight">{list.title}</h2>

        <AddTodoForm
          listId={list.id}
          onAdded={(todoOrCreated, tempId) => {
            setTodos(prev => {
              const hasTemp = prev.some(t => t.id === tempId)
              if (hasTemp) return prev.map(t => (t.id === tempId ? todoOrCreated : t))
              return [...prev, todoOrCreated]
            })
          }}
          onAddFailed={tempId => setTodos(prev => prev.filter(t => t.id !== tempId))}
        />

        {todos.length === 0 ? (
          <p className="text-sm text-zinc-400 px-1">No tasks yet - add one above.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sorted.map(todo => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onSelect={setSelectedTodo}
              />
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
