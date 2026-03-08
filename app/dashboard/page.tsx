import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardShell from '@/components/dashboard-shell'
import type { List } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: lists } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return <DashboardShell initialLists={(lists ?? []) as List[]} />
}
