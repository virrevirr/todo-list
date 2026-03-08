import Link from 'next/link'
import Logo from '@/components/logo'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-30 py-2 border-b border-zinc-200">
      <Link href="/" className="scale-80">
        <Logo />
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-12 py-4 text-base font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-12 py-4 text-base font-semibold text-white bg-coral rounded-full hover:bg-coral/85 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </nav>
  )
}
