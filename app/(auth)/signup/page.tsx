import SignupForm from '@/components/signup-form'
import Logo from '@/components/logo'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 gap-2">
      <Link href="/" className="scale-80">
        <Logo />
      </Link>

      <div className="w-full max-w-md border-2 border-zinc-200 rounded-2xl p-14">
        <h1 className="text-4xl font-bold text-zinc-700 mb-2 text-center">Create an account</h1>
        <p className="text-zinc-500 mb-8 text-center">Start managing your tasks today</p>
        <SignupForm />
      </div>
    </div>
  )
}
