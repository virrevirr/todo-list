'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <p className="text-center text-zinc-600">
        Check your email to confirm your account.
      </p>
    )
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
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-700 text-base focus:outline-none focus:ring-2 focus:ring-turquoise"
          placeholder="Min. 6 characters"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-6 py-3 bg-coral text-white font-semibold rounded-full hover:bg-coral/85 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <a href="/login" className="text-coral hover:underline">
          Log in
        </a>
      </p>
    </form>
  )
}
