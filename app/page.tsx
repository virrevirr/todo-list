import Navbar from '@/components/navbar'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Mobile layout */}
      <div className="flex flex-col lg:hidden px-6 pt-16 pb-10 items-center text-center gap-8">
        <h1 className="text-4xl font-bold text-zinc-700 leading-snug">
          One place for everything you need to get done.
        </h1>
        <p className="text-base text-zinc-500 leading-relaxed">
          ToDo keeps all your tasks in one place. Create lists, add tasks, and check them off as you go.
        </p>
        <a
          href="/signup"
          className="inline-block px-10 py-4 text-base font-semibold text-white bg-coral rounded-full hover:bg-coral/85 transition-colors"
        >
          Get started for free
        </a>
        <Image
          src="/todo-list.png"
          alt="Todo list preview"
          width={340}
          height={420}
          className="rounded-3xl shadow-xl w-full max-w-sm"
        />
      </div>

      {/* Desktop layout */}
      <main className="hidden lg:block px-30 pt-24 max-w-2xl">
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
      <div className="hidden lg:block absolute bottom-50 right-50 pointer-events-none select-none">
        <Image
          src="/todo-list.png"
          alt="Todo list preview"
          width={480}
          height={600}
          className="rounded-3xl shadow-xl"
        />
      </div>
      <Image
        src="/flowy-lines.svg"
        alt=""
        width={1000}
        height={500}
        className="hidden lg:block absolute bottom-0 right-0 pointer-events-none select-none rotate-[5deg] translate-y-24 origin-bottom-right"
        priority
      />
    </div>
  )
}
