import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardShell from '@/components/dashboard-shell'
import type { List, Todo } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: lists } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const listIds = (lists ?? []).map(l => l.id)

  const { data: todos } = listIds.length > 0
    ? await supabase
        .from('todos')
        .select('*')
        .in('list_id', listIds)
        .order('created_at', { ascending: true })
    : { data: [] }

  const todosByList = (todos ?? []).reduce<Record<string, Todo[]>>((acc, todo) => {
    if (!acc[todo.list_id]) acc[todo.list_id] = []
    acc[todo.list_id].push(todo)
    return acc
  }, {})

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()

  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .map(n => n![0].toUpperCase())
    .join('') || user.email![0].toUpperCase()

  return (
    <DashboardShell
      initialLists={(lists ?? []) as List[]}
      initialTodosByList={todosByList}
      initials={initials}
    />
  )
}
