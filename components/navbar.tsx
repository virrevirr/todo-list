import Link from 'next/link'
import Logo from '@/components/logo'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-3 md:px-30 py-2 border-b border-zinc-200">
      <Link href="/" className="scale-65 md:scale-80 origin-left">
        <Logo />
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/login"
          className="px-3 py-3 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2.5 text-sm font-semibold text-white bg-coral rounded-full hover:bg-coral/85 transition-colors whitespace-nowrap"
        >
          Sign up
        </Link>
      </div>
    </nav>
  )
}
