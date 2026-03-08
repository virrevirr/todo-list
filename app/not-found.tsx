import Link from 'next/link'
import Navbar from '@/components/navbar'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-10">

        {/* Illustration */}
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle */}
          <circle cx="80" cy="80" r="72" fill="#40E0D0" fillOpacity="0.12" />
          {/* Sad clipboard */}
          <rect x="44" y="32" width="72" height="88" rx="12" fill="white" stroke="#40E0D0" strokeWidth="4"/>
          {/* Clipboard top clip */}
          <rect x="64" y="26" width="32" height="14" rx="7" fill="#40E0D0"/>
          {/* Lines */}
          <rect x="58" y="62" width="44" height="6" rx="3" fill="#e4e4e7"/>
          <rect x="58" y="76" width="32" height="6" rx="3" fill="#e4e4e7"/>
          <rect x="58" y="90" width="38" height="6" rx="3" fill="#e4e4e7"/>
          {/* Sad face */}
          <circle cx="80" cy="115" r="18" fill="#FF7F50"/>
          <circle cx="74" cy="111" r="2.5" fill="white"/>
          <circle cx="86" cy="111" r="2.5" fill="white"/>
          <path d="M74 121 Q80 117 86 121" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h1 className="text-6xl font-extrabold tracking-tight text-zinc-800">
            Oops!
          </h1>
          <p className="text-zinc-400 text-base max-w-xs">
            This page doesn't exist. 
            Don't worry - let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 text-base font-semibold text-white bg-coral rounded-full hover:bg-coral/85 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 text-base font-semibold text-zinc-500 border border-zinc-200 rounded-full hover:border-zinc-400 hover:text-zinc-800 transition-colors"
          >
            My dashboard
          </Link>
        </div>

      </main>
    </div>
  )
}
