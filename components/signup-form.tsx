'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const lettersOnly = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/

export default function SignupForm() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleName(value: string, setter: (v: string) => void) {
    if (value === '' || lettersOnly.test(value)) setter(value)
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!lettersOnly.test(firstName)) return setError('First name must contain only letters.')
    if (!lettersOnly.test(lastName)) return setError('Last name must contain only letters.')

    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      })
    }

    setLoading(false)

    if (data.session) {
      router.push('/dashboard')
    } else {
      setError('Check your email to confirm your account.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="firstName" className="text-sm font-semibold text-zinc-600">
          First name
        </label>
        <input
          id="firstName"
          type="text"
          required
          value={firstName}
          onChange={e => handleName(e.target.value, setFirstName)}
          className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-700 text-base focus:outline-none focus:ring-2 focus:ring-turquoise"
          placeholder="Astrid"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="lastName" className="text-sm font-semibold text-zinc-600">
          Last name
        </label>
        <input
          id="lastName"
          type="text"
          required
          value={lastName}
          onChange={e => handleName(e.target.value, setLastName)}
          className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-700 text-base focus:outline-none focus:ring-2 focus:ring-turquoise"
          placeholder="Lindqvist"
        />
      </div>

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
