import { Card } from '@/components/ui/Card'

interface QuickStatsProps {
  stats: {
    resumes: number
    jobsAnalyzed: number
    translations: number
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="p-4 text-center">
        <svg className="w-5 h-5 text-text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="font-heading text-2xl font-bold text-gold">{stats.resumes}</div>
        <div className="text-[11px] text-text-muted uppercase tracking-wider mt-0.5">Resumes</div>
      </Card>
      <Card className="p-4 text-center">
        <svg className="w-5 h-5 text-text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <div className="font-heading text-2xl font-bold text-gold">{stats.jobsAnalyzed}</div>
        <div className="text-[11px] text-text-muted uppercase tracking-wider mt-0.5">Jobs Analyzed</div>
      </Card>
      <Card className="p-4 text-center">
        <svg className="w-5 h-5 text-text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        <div className="font-heading text-2xl font-bold text-gold">{stats.translations}</div>
        <div className="text-[11px] text-text-muted uppercase tracking-wider mt-0.5">Translations</div>
      </Card>
    </div>
  )
}
