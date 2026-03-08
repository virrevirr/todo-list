import Navbar from '@/components/navbar'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Navbar />
      <main className="px-30 pt-24 max-w-2xl">
        <h1 className="text-6xl font-bold text-zinc-700 leading-snug mb-6">
          One place for everything you need to get done.
        </h1>
        <p className="text-lg text-zinc-500 leading-relaxed mb-10">
          ToDo keeps all your tasks in one place. Create lists, add tasks, and check them off as you go.
        </p>
        <a
          href="/signup"
          className="inline-block px-12 py-4 text-base font-semibold text-white bg-coral rounded-full hover:bg-coral/85 transition-colors"
        >
          Get started for free
        </a>
      </main>
      <Image
        src="/flowy-lines.svg"
        alt=""
        width={1000}
        height={500}
        className="absolute bottom-0 right-0 pointer-events-none select-none rotate-[5deg] translate-y-24 origin-bottom-right"
        priority
      />
    </div>
  )
}
