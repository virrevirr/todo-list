import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import LogoutButton from '@/components/logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <LogoutButton />
    </div>
  )
}