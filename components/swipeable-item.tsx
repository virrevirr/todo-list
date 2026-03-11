'use client'

import { useState, useRef } from 'react'

const SWIPE_THRESHOLD = 60
const REVEAL_WIDTH = 72

type Props = {
  onDelete: () => void
  deleteLabel: string
  children: React.ReactNode
}

export default function SwipeableItem({ onDelete, deleteLabel, children }: Props) {
  const [offsetX, setOffsetX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const isSwipe = useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    isSwipe.current = false
    setDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    if (!isSwipe.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
      isSwipe.current = true
    }
    if (!isSwipe.current) return

    e.preventDefault()
    const clamped = Math.min(0, Math.max(-REVEAL_WIDTH, dx + (offsetX === -REVEAL_WIDTH ? -REVEAL_WIDTH : 0)))
    setOffsetX(clamped)
  }

  function onTouchEnd() {
    setDragging(false)
    if (offsetX < -SWIPE_THRESHOLD) {
      setOffsetX(-REVEAL_WIDTH)
    } else {
      setOffsetX(0)
    }
  }

  function close() {
    setOffsetX(0)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-zinc-400 rounded-2xl"
        style={{ width: REVEAL_WIDTH }}
      >
        <button
          onClick={onDelete}
          className="flex items-center justify-center w-full h-full"
          aria-label={deleteLabel}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {offsetX < 0 && (
          <div className="absolute inset-0 z-10" onClick={close} />
        )}
        {children}
      </div>
    </div>
  )
}
