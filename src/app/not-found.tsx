import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="text-center">
        <div className="font-heading text-8xl font-bold text-gold mb-4">404</div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Mission Not Found
        </h1>
        <p className="text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button>Return to Base</Button>
        </Link>
      </div>
    </div>
  )
}
