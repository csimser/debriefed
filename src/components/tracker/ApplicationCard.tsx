'use client'

interface ApplicationCardProps {
  application: {
    id: string
    company_name: string
    job_title: string
    resume_name: string | null
    applied_date: string
    status: string
    notes: string | null
    salary_offered: number | null
  }
  onEdit: (id: string) => void
  onDragStart: (e: React.DragEvent, id: string) => void
}

export function ApplicationCard({ application, onEdit, onDragStart }: ApplicationCardProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application.id)}
      onClick={() => onEdit(application.id)}
      className="p-3 bg-bg-secondary border border-border rounded-lg cursor-grab active:cursor-grabbing hover:border-gold/30 transition-colors group"
    >
      <div className="font-semibold text-sm truncate">{application.company_name}</div>
      <div className="text-xs text-text-muted truncate mt-0.5">{application.job_title}</div>

      <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
        <span>{formatDate(application.applied_date)}</span>
        {application.resume_name && (
          <>
            <span className="opacity-30">|</span>
            <span className="truncate max-w-[120px]">{application.resume_name}</span>
          </>
        )}
      </div>

      {application.salary_offered && (
        <div className="text-xs text-gold mt-1 font-heading">
          ${application.salary_offered.toLocaleString()}
        </div>
      )}

      {application.notes && (
        <div className="text-xs text-text-muted mt-1 line-clamp-2 opacity-60">
          {application.notes}
        </div>
      )}
    </div>
  )
}
