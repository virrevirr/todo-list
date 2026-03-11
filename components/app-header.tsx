import Logo from '@/components/logo'

type Props = {
  left: React.ReactNode
  right?: React.ReactNode
}

export default function AppHeader({ left, right }: Props) {
  return (
    <header className="relative flex h-[68px] items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6 shrink-0">
      <div className="flex items-center min-w-0">{left}</div>
      <div className="absolute left-1/2 -translate-x-1/2 scale-65 md:scale-80 pointer-events-none">
        <Logo />
      </div>
      <div className="flex items-center justify-end min-w-0 shrink-0">
        {right ?? <div className="w-9" aria-hidden />}
      </div>
    </header>
  )
}
