'use client'

import { useState, useEffect } from 'react'

interface Announcement {
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
}

const TYPE_STYLES: Record<string, string> = {
  info: 'bg-status-blue-dim border-status-blue/50 text-status-blue',
  warning: 'bg-status-amber-dim border-status-amber/50 text-status-amber',
  error: 'bg-status-red-dim border-status-red/50 text-status-red',
  success: 'bg-status-green-dim border-status-green/50 text-status-green',
}

const TYPE_ICONS: Record<string, string> = {
  info: 'ℹ',
  warning: '⚠',
  error: '!',
  success: '✓',
}

const STORAGE_KEY = 'dismissed_announcement'

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(true) // Start dismissed to prevent flash

  useEffect(() => {
    // Fetch announcement
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch('/api/settings/announcement')
        if (response.ok) {
          const data = await response.json()
          if (data.announcement) {
            setAnnouncement(data.announcement)

            // Check if this announcement was dismissed
            const dismissedMessage = localStorage.getItem(STORAGE_KEY)
            if (dismissedMessage !== data.announcement.message) {
              setDismissed(false)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching announcement:', error)
      }
    }

    fetchAnnouncement()
  }, [])

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem(STORAGE_KEY, announcement.message)
      setDismissed(true)
    }
  }

  if (!announcement || dismissed) {
    return null
  }

  return (
    <div className={`border-b ${TYPE_STYLES[announcement.type] || TYPE_STYLES.info}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">{TYPE_ICONS[announcement.type] || TYPE_ICONS.info}</span>
            <p className="text-sm">{announcement.message}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-current opacity-60 hover:opacity-100 transition-opacity px-2"
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
