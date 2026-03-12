'use client'

import { createClient } from '@/lib/supabase-browser'

export default function LogoutButton() {
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
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
