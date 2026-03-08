import LoginForm from '@/components/login-form'
import Logo from '@/components/logo'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4">
      <Link href="/" className="mt-3 mb-16 scale-80">
        <Logo />
      </Link>

      <div className="w-full max-w-md border-2 border-zinc-200 rounded-2xl p-14">
        <h1 className="text-4xl font-bold text-zinc-700 mb-2 text-center">Welcome back</h1>
        <p className="text-zinc-500 mb-8 text-center">Log in to your account</p>
        <LoginForm />
      </div>
    </div>
  )
}
