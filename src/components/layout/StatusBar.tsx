'use client'

import { useEffect, useState } from 'react'

export function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) + ' LOCAL')
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-t-sidebar text-t-sidebar-fg border-b border-border px-8 py-2.5 flex items-center justify-between font-nav text-xs">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <span className="text-status-green">SYSTEM ONLINE</span>
        </div>
        <span className="opacity-70">DEBRIEFED v1.0</span>
      </div>
      <div className="opacity-70">
        <span>{time}</span>
      </div>
    </div>
  )
}
