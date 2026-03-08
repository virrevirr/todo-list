import Link from 'next/link'
import Logo from '@/components/logo'

export default function ConfirmEmailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex justify-center py-6 border-b border-zinc-200">
        <Link href="/" className="scale-80">
          <Logo />
        </Link>
      </div>

      <main className="flex flex-col items-center justify-center flex-1 px-6">
        <div className="w-full max-w-md border-2 border-zinc-200 rounded-2xl p-14 flex flex-col items-center gap-6 text-center">

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-turquoise/15 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                stroke="#40E0D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-zinc-800 tracking-tight">
              Check your email
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We sent you a confirmation link. Click it to activate your account and get started.
            </p>
          </div>

          <div className="w-full h-px bg-zinc-100" />

          <p className="text-sm text-zinc-400">
            Already confirmed?{' '}
            <Link href="/login" className="text-coral font-semibold hover:underline">
              Log in
            </Link>
          </p>

        </div>
      </main>
    </div>
  )
}
