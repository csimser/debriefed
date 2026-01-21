'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report', icon: '!', color: 'text-red-400' },
  { value: 'feature', label: 'Feature Request', icon: '+', color: 'text-yellow-400' },
  { value: 'general', label: 'General Feedback', icon: '?', color: 'text-blue-400' },
]

interface FeedbackButtonProps {
  userId?: string
  userEmail?: string
}

export function FeedbackButton({ userId, userEmail }: FeedbackButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState('general')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState(userEmail || '')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const pathname = usePathname()

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow close animation
      const timeout = setTimeout(() => {
        if (!isOpen) {
          setCategory('general')
          setMessage('')
          setError('')
          setSubmitted(false)
          if (!userEmail) setEmail('')
        }
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, userEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || null,
          email: email || null,
          category,
          message,
          pageUrl: pathname,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        // Auto-close after showing success
        setTimeout(() => {
          setIsOpen(false)
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit feedback')
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gold text-bg-primary rounded-full shadow-lg hover:bg-gold-dim transition-all hover:scale-105 flex items-center justify-center group"
        title="Send Feedback"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <Card
            className="w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              // Success State
              <div className="text-center py-6">
                <div className="text-4xl mb-4 text-green-500">✓</div>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-2">
                  Thank You!
                </h2>
                <p className="text-text-muted">
                  Your feedback has been submitted successfully.
                </p>
              </div>
            ) : (
              // Form State
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-bold uppercase tracking-wider">
                    Send Feedback
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs text-text-muted uppercase mb-2">
                      Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {FEEDBACK_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setCategory(t.value)}
                          className={`p-3 rounded-md border text-center transition-all ${
                            category === t.value
                              ? 'border-gold bg-gold/10'
                              : 'border-border bg-bg-secondary hover:border-gold/50'
                          }`}
                        >
                          <div className={`text-lg mb-1 ${t.color}`}>{t.icon}</div>
                          <div className="text-xs text-white">{t.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email (if not logged in) */}
                  {!userId && (
                    <div>
                      <label className="block text-xs text-text-muted uppercase mb-2">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-text focus:border-gold focus:ring-1 focus:ring-gold/25 placeholder:text-text-dim"
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-text-muted uppercase mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        category === 'bug'
                          ? 'Describe the bug and how to reproduce it...'
                          : category === 'feature'
                          ? "Describe the feature you'd like to see..."
                          : 'Share your thoughts...'
                      }
                      rows={4}
                      required
                      minLength={10}
                      maxLength={5000}
                      className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25 resize-none placeholder:text-text-dim"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-text-dim">
                        Minimum 10 characters
                      </span>
                      <span className={`text-xs ${message.length > 4500 ? 'text-amber-500' : 'text-text-dim'}`}>
                        {message.length}/5000
                      </span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || message.length < 10}
                      className="flex-1"
                    >
                      {submitting ? 'Sending...' : 'Send Feedback'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
