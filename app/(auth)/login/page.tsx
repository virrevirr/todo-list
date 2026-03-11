import LoginForm from '@/components/login-form'
import Logo from '@/components/logo'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative flex h-[68px] items-center justify-between border-b border-zinc-200 px-4 md:px-6 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Back to home"
        >
          <svg viewBox="0 0 16 16" className="h-5 w-5 shrink-0" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 scale-65 md:scale-80">
          <Logo />
        </div>
        <div className="w-9 shrink-0" aria-hidden />
      </header>

      <div className="flex flex-1 flex-col items-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md border-2 border-zinc-200 rounded-2xl p-8 md:p-14">
          <h1 className="text-4xl font-bold text-zinc-700 mb-2 text-center">Welcome back</h1>
          <p className="text-zinc-500 mb-8 text-center">Log in to your account</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
