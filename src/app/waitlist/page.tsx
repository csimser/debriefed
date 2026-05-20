import { redirect } from 'next/navigation'

export default function WaitlistPage() {
  redirect('/signup?source=waitlist')
}
