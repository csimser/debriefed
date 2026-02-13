import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
          </div>
        </Link>

        <Card className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-status-green-dim flex items-center justify-center">
            <svg className="w-10 h-10 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4 text-text">
            Email Verified!
          </h1>

          {/* Message */}
          <p className="text-text-muted mb-8">
            Your email has been verified successfully.
            You're all set to start using Debriefed.
          </p>

          {/* CTA Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-colors w-full"
          >
            Continue to Dashboard →
          </Link>

          {/* Secondary info */}
          <p className="text-text-dim text-sm mt-6">
            Welcome aboard. Let's get you debriefed.
          </p>
        </Card>
      </div>
    </div>
  )
}
