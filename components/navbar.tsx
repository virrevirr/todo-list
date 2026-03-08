import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-30 py-2 border-b border-zinc-1000">
      <Link href="/">
        <Image src="/todo.svg" alt="ToDo logo" width={50} height={20} priority />
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-12 py-4 text-base font-semibold text-zinc-500 hover:zinc-900 transition-colors"
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
