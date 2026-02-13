'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/Card'

interface BulletTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (template: string) => void
}

interface TemplateCategory {
  name: string
  templates: string[]
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    name: 'Leadership & Supervision',
    templates: [
      'Led a team of [X] personnel in [function/mission]',
      'Supervised [X] [junior/senior] personnel across [X] divisions/departments',
      'Served as [role] for [X]-person [team/division/department]',
      'Mentored [X] junior [enlisted/officers], resulting in [X] promotions/advancements',
      'Selected over [X] peers to serve as [role/position]',
      'Assumed responsibilities of [higher position] during [absence/deployment/vacancy]',
      'Established and led a [new team/program/initiative] of [X] personnel',
      'Directed daily operations for [unit/department] of [X] personnel',
      'Counseled and evaluated [X] personnel on performance and professional development',
      'Coordinated across [X] departments to achieve [objective]',
    ],
  },
  {
    name: 'Training & Development',
    templates: [
      'Trained [X] personnel on [system/procedure/topic]',
      'Developed and delivered training curriculum for [topic] to [X] personnel',
      'Qualified [X] personnel in [qualification/certification]',
      'Achieved a [X]% pass rate for [course/qualification/inspection]',
      'Created [X] training materials/SOPs/guides for [topic]',
      'Instructed [X] hours of classroom/hands-on training on [topic]',
      'Redesigned [training program] reducing qualification time by [X]%',
      'Served as subject matter expert for [topic/system]',
      'Facilitated [X] drills/exercises preparing [X] personnel for [mission/scenario]',
      'Onboarded and trained [X] new personnel, achieving full qualification in [X] days/weeks',
    ],
  },
  {
    name: 'Budget & Resource Management',
    templates: [
      'Managed $[X] budget for [program/department/project]',
      'Oversaw $[X] in equipment/inventory/assets',
      'Reduced costs by $[X] through [specific action]',
      'Maintained [X]% accountability of $[X] in assets',
      'Processed [X] financial transactions totaling $[X]',
      'Identified $[X] in savings through [process improvement/audit]',
      'Managed procurement of [X] items valued at $[X]',
      'Allocated and tracked budget across [X] cost centers/programs',
      'Eliminated $[X] in waste through [inventory management/process change]',
      'Forecasted and justified $[X] annual budget for [department/mission area]',
    ],
  },
  {
    name: 'Operations & Mission Execution',
    templates: [
      'Planned and executed [operation/mission/event] involving [X] personnel',
      'Coordinated logistics for [deployment/exercise/operation] across [X] locations',
      'Completed [X] missions/operations with zero safety incidents',
      'Maintained [X]% operational readiness for [equipment/unit/department]',
      'Responded to [X] emergency/crisis situations, ensuring [outcome]',
      'Managed scheduling and coordination for [X] daily/weekly operations',
      'Executed [X] [inspections/audits/assessments] with [X]% compliance',
      'Supported [named operation/exercise] in [location], accomplishing [result]',
      'Ensured 24/7 operational coverage through [scheduling/staffing strategy]',
      'Streamlined [process] reducing turnaround time from [X] to [X] days',
    ],
  },
  {
    name: 'Maintenance & Technical',
    templates: [
      'Maintained [X] pieces of equipment valued at $[X]',
      'Achieved [X]% equipment readiness rate, exceeding standard of [X]%',
      'Performed [X] corrective/preventive maintenance actions on [system/equipment]',
      'Troubleshot and repaired [system/equipment], restoring capability in [X] hours',
      'Managed maintenance program for [X] equipment items across [X] work centers',
      'Reduced equipment downtime by [X]% through [preventive maintenance/process improvement]',
      'Qualified as [maintenance certification/level] on [system/equipment]',
      'Implemented [maintenance tracking system/program] improving readiness by [X]%',
      'Conducted [X] technical inspections with zero discrepancies',
      'Overhauled [system/equipment] ahead of schedule, saving [X] man-hours',
    ],
  },
  {
    name: 'Safety & Compliance',
    templates: [
      'Achieved [X] consecutive days/hours of mishap-free operations',
      'Conducted [X] safety inspections identifying and correcting [X] hazards',
      'Developed and implemented safety program reducing incidents by [X]%',
      'Ensured [X]% compliance during [inspection/audit/assessment]',
      'Led [unit/department] to achieve [grade/score] during [inspection name]',
      'Managed [hazardous material/environmental/safety] program for [X] personnel',
      'Investigated [X] incidents, implementing corrective actions that prevented recurrence',
      'Maintained zero safety violations across [X] operations/evolutions',
      'Updated [X] SOPs/instructions to align with [new regulation/policy]',
      'Served as [Safety Officer/Safety Petty Officer/Safety NCO] for [X]-person [unit]',
    ],
  },
  {
    name: 'Process Improvement',
    templates: [
      'Reduced [process] time by [X]% through [specific improvement]',
      'Developed [SOP/process/system] that [quantified improvement]',
      'Automated [manual process] saving [X] man-hours per [week/month]',
      'Identified and eliminated [bottleneck/inefficiency] in [process]',
      'Implemented [new system/tool/method] increasing productivity by [X]%',
      'Redesigned [workflow/process] reducing errors by [X]%',
      'Created [database/tracker/dashboard] improving visibility into [metric]',
      'Standardized [process] across [X] departments/locations',
      'Proposed and implemented [initiative] adopted by [higher command/organization]',
      'Analyzed [data/metrics] to identify trends and drive [X]% improvement',
    ],
  },
  {
    name: 'Awards & Recognition',
    templates: [
      'Awarded [award name] for [specific achievement]',
      'Recognized as [title] of the [Quarter/Year] for [achievement]',
      'Selected as [Sailor/Soldier/Airman/Marine] of the [Quarter/Year]',
      'Received [letter of commendation/appreciation] from [authority] for [achievement]',
      'Nominated for [award/program] based on [achievement]',
      'Earned [certification/qualification/warfare pin] ahead of peers',
      'Ranked #[X] of [X] peers in performance evaluation',
      'Advanced to [rank] on first attempt',
      'Selected for [competitive program/billet/school] over [X] applicants',
      'Achieved [score/grade] on [exam/PRT/qualification], top [X]% of peers',
    ],
  },
  {
    name: 'Communication & Administration',
    templates: [
      'Drafted and routed [X] [reports/correspondence/packages] with zero errors',
      'Briefed [senior leadership/flag officers/executives] on [topic/status]',
      'Managed [personnel records/admin program] for [X] personnel',
      'Processed [X] [evaluations/awards/travel claims] within [X]-day deadline',
      'Authored [SOP/instruction/policy] adopted by [command/organization]',
      'Coordinated across [X] stakeholders to deliver [project/report] on time',
      'Presented [topic] to audiences of [X]+ personnel',
      'Maintained [X]% accuracy in [records management/data entry/tracking system]',
      'Managed [correspondence/taskers] across [X] subordinate commands',
      'Served as command representative at [X] [meetings/conferences/working groups]',
    ],
  },
  {
    name: 'Community & Volunteer',
    templates: [
      'Organized [event] for [X] participants, raising $[X] for [cause]',
      'Volunteered [X] hours with [organization/community group]',
      'Led [X] community outreach events representing [command/branch]',
      'Coordinated [MWR/holiday/family] event for [X] service members and families',
      'Served as [command volunteer role] managing [X] volunteers',
      'Mentored [X] youth through [program] in the local community',
    ],
  },
  {
    name: 'Deployment & Combat',
    templates: [
      'Deployed to [location] in support of [operation/mission]',
      'Completed [X]-month deployment maintaining [X]% operational tempo',
      'Provided [function] support during [X] combat/real-world operations',
      'Operated in [austere/hostile] environment for [X] months',
      'Supported [humanitarian/disaster relief] operations in [location]',
      'Stood [X] hours of watch/duty ensuring [security/readiness]',
    ],
  },
  {
    name: 'Project Management',
    templates: [
      'Led [project name] from concept to completion in [X] [days/weeks/months]',
      'Managed [X] concurrent projects with combined value of $[X]',
      'Delivered [project] [X days/weeks] ahead of schedule and $[X] under budget',
      'Coordinated [X] cross-functional teams to achieve [project milestone]',
      'Developed project timeline and milestones for [initiative]',
      'Tracked and reported [project] status to [senior leadership/stakeholders]',
    ],
  },
  {
    name: 'Cybersecurity & IT',
    templates: [
      'Administered [network/system] supporting [X] users across [X] locations',
      'Detected and responded to [X] cybersecurity incidents',
      'Implemented [security control/tool] reducing vulnerabilities by [X]%',
      'Maintained [X]% uptime for [system/network] supporting [mission]',
      'Migrated [X] users/systems from [old platform] to [new platform]',
      'Configured and maintained [X] [servers/workstations/network devices]',
      'Conducted [X] security audits ensuring compliance with [framework/standard]',
      'Managed [IT asset/account] lifecycle for [X] users',
    ],
  },
]

const RECENTLY_USED_KEY = 'debriefed_recent_templates'
const MAX_RECENT = 8

function getRecentTemplates(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_USED_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecentTemplate(template: string) {
  const recent = getRecentTemplates().filter(t => t !== template)
  recent.unshift(template)
  localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)))
}

export function BulletTemplateModal({ isOpen, onClose, onSelect }: BulletTemplateModalProps) {
  const [search, setSearch] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [recentTemplates, setRecentTemplates] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      setRecentTemplates(getRecentTemplates())
      setSearch('')
      setExpandedCategory(null)
    }
  }, [isOpen])

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return TEMPLATE_CATEGORIES
    const q = search.toLowerCase()
    return TEMPLATE_CATEGORIES
      .map(cat => ({
        ...cat,
        templates: cat.templates.filter(t => t.toLowerCase().includes(q)),
      }))
      .filter(cat => cat.templates.length > 0)
  }, [search])

  const filteredRecent = useMemo(() => {
    if (!search.trim()) return recentTemplates
    const q = search.toLowerCase()
    return recentTemplates.filter(t => t.toLowerCase().includes(q))
  }, [search, recentTemplates])

  const totalResults = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.templates.length, 0)
  }, [filteredCategories])

  const handleSelect = (template: string) => {
    saveRecentTemplate(template)
    onSelect(template)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">
              Bullet Templates
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-text-dim hover:text-text transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates... (e.g., budget, training, safety)"
              className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-border rounded text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
              autoFocus
            />
            {search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-dim">
                {totalResults} result{totalResults !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-text-dim mt-2">
            Select a template to insert as a new bullet. Fill in the [bracketed] placeholders with your details.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Recently Used */}
          {filteredRecent.length > 0 && (
            <div className="mb-3">
              <button
                onClick={() => setExpandedCategory(expandedCategory === '__recent' ? null : '__recent')}
                className="w-full flex items-center justify-between py-2 px-3 bg-gold/10 border border-gold/20 rounded hover:bg-gold/15 transition-colors"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                  Recently Used ({filteredRecent.length})
                </span>
                <svg
                  className={`w-4 h-4 text-gold transition-transform ${expandedCategory === '__recent' ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedCategory === '__recent' && (
                <ul className="mt-1 space-y-1">
                  {filteredRecent.map((template, i) => (
                    <TemplateRow key={`recent-${i}`} template={template} onSelect={handleSelect} />
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Category Accordions */}
          {filteredCategories.map((cat) => (
            <div key={cat.name}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                className="w-full flex items-center justify-between py-2 px-3 bg-bg-tertiary border border-border rounded hover:border-gold/30 transition-colors"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {cat.name} ({cat.templates.length})
                </span>
                <svg
                  className={`w-4 h-4 text-text-dim transition-transform ${expandedCategory === cat.name ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {(expandedCategory === cat.name || search.trim()) && (
                <ul className="mt-1 space-y-1">
                  {cat.templates.map((template, i) => (
                    <TemplateRow key={`${cat.name}-${i}`} template={template} onSelect={handleSelect} />
                  ))}
                </ul>
              )}
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-text-dim text-sm">
              No templates match &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function TemplateRow({ template, onSelect }: { template: string; onSelect: (t: string) => void }) {
  // Highlight [bracket] placeholders
  const parts = template.split(/(\[[^\]]+\])/)

  return (
    <li>
      <button
        onClick={() => onSelect(template)}
        className="w-full text-left px-3 py-2 rounded text-sm text-text-muted hover:bg-gold/10 hover:text-text transition-colors"
      >
        {parts.map((part, i) =>
          part.startsWith('[') && part.endsWith(']') ? (
            <span key={i} className="bg-status-amber-dim text-status-amber px-0.5 rounded">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </button>
    </li>
  )
}
