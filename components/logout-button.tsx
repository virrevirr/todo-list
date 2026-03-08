'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 text-sm font-semibold text-white bg-coral rounded-full hover:bg-coral/85 transition-colors"
    >
      Log out
    </button>
  )
}
