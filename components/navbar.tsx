import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-30 py-2 border-b border-zinc-100">
      <Link href="/">
        <Image src="/todo.svg" alt="ToDo logo" width={50} height={20} priority />
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-12 py-5 text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-12 py-5 text-sm font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-700 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </nav>
  )
}
