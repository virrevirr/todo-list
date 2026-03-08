import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import LogoutButton from '@/components/logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-200">
        <h1 className="text-xl font-bold text-zinc-700">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">{user.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="px-8 py-10">
        <h2 className="text-2xl font-bold text-zinc-700 mb-6">My lists</h2>
        <p className="text-zinc-400">No lists yet.</p>
      </main>
    </div>
  )
}
