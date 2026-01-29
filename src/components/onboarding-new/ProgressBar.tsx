'use client'

interface Step {
  id: number
  name: string
  shortName: string
}

const STEPS: Step[] = [
  { id: 0, name: 'Welcome', shortName: 'Welcome' },
  { id: 1, name: 'Contact Info', shortName: 'Contact' },
  { id: 2, name: 'Military Background', shortName: 'Military' },
  { id: 3, name: 'Experience', shortName: 'Experience' },
  { id: 4, name: 'Skills & Certs', shortName: 'Skills' },
  { id: 5, name: 'Education', shortName: 'Education' },
  { id: 6, name: 'Summary', shortName: 'Summary' },
]

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="bg-bg-secondary border-b border-border px-4 py-3">
      <div className="max-w-4xl mx-auto">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm transition-colors ${
                  idx < currentStep
                    ? 'bg-status-green text-white'
                    : idx === currentStep
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-tertiary text-text-muted'
                }`}
              >
                {idx < currentStep ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-6 sm:w-12 md:w-16 lg:w-20 h-0.5 mx-1 transition-colors ${
                    idx < currentStep ? 'bg-status-green' : 'bg-bg-tertiary'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step names - hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:flex justify-between">
          {STEPS.map((step) => (
            <span
              key={step.id}
              className={`text-xs text-center w-20 ${
                step.id === currentStep ? 'text-gold font-semibold' : 'text-text-muted'
              }`}
            >
              {step.shortName}
            </span>
          ))}
        </div>

        {/* Mobile: show current step name */}
        <div className="sm:hidden text-center">
          <span className="text-xs text-gold font-semibold">
            Step {currentStep + 1}: {STEPS[currentStep]?.name}
          </span>
        </div>
      </div>
    </div>
  )
}

export { STEPS }
