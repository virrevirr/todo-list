'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      console.log('Supabase error:', error)
    } else {
      console.log('No error, redirecting...')
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold text-zinc-600">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-700 text-base focus:outline-none focus:ring-2 focus:ring-turquoise"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-semibold text-zinc-600">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-700 text-base focus:outline-none focus:ring-2 focus:ring-turquoise"
          placeholder="Your password"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-6 py-3 bg-coral text-white font-semibold rounded-full hover:bg-coral/85 transition-colors disabled:opacity-50"
      >
        {loading ? 'Logging in…' : 'Log in'}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-coral hover:underline">
          Sign up
        </a>
      </p>
    </form>
  )
}
