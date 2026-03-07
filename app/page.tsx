import Navbar from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-8 pt-24 max-w-2xl">
        <h1 className="text-4xl font-bold text-zinc-900 leading-snug mb-6">
          You've got 47 tabs open, three half-finished projects, and a grocery
          list written on a receipt you definitely lost. Let's fix that.
        </h1>
        <p className="text-lg text-zinc-500 leading-relaxed mb-10">
          A simple, clean to-do app to keep track of everything that matters.
          Create lists, add tasks, and check them off as you go.
        </p>
        <a
          href="/signup"
          className="inline-block px-6 py-3 text-sm font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-700 transition-colors"
        >
          Get started for free
        </a>
      </main>
    </div>
  )
}
