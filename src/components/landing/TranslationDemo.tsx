'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DEMO_DICTIONARY } from '@/lib/constants/demo-dictionary'

// ── Types ──────────────────────────────────────────────────────────

interface TermMatch {
  military: string
  civilian: string
  civilianShort: string
  start: number
  end: number
}

// ── Pre-sorted dictionary keys (longest first) ────────────────────

const SORTED_KEYS = Object.keys(DEMO_DICTIONARY).sort((a, b) => b.length - a.length)

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Extract just the first option from "Chief Petty Officer / Department Manager" → "Chief Petty Officer" */
function firstOption(civilian: string): string {
  return civilian.split(' / ')[0].trim()
}

// ── Case-matching helper ──────────────────────────────────────────

function matchCase(original: string, replacement: string): string {
  if (!original || !replacement) return replacement
  // ALL CAPS source → ALL CAPS replacement
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase()
  }
  // Title Case source → Title Case replacement
  if (original[0] === original[0].toUpperCase() && original.slice(1) !== original.slice(1).toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  // lowercase source → lowercase replacement
  if (original === original.toLowerCase()) {
    return replacement.toLowerCase()
  }
  return replacement
}

// ── Translation engine ─────────────────────────────────────────────

function translateText(input: string): { matches: TermMatch[]; translated: string } {
  const matches: TermMatch[] = []
  const occupied = new Set<number>()

  // Pass 1: Find all matches (longest-first, no overlaps)
  for (const key of SORTED_KEYS) {
    const regex = new RegExp(`\\b${escapeRegex(key)}\\b`, 'gi')
    let m: RegExpExecArray | null
    while ((m = regex.exec(input)) !== null) {
      const start = m.index
      const end = start + m[0].length
      let overlap = false
      for (let i = start; i < end; i++) {
        if (occupied.has(i)) { overlap = true; break }
      }
      if (overlap) continue
      for (let i = start; i < end; i++) occupied.add(i)

      const fullCivilian = DEMO_DICTIONARY[key]
      matches.push({
        military: m[0],
        civilian: fullCivilian,
        civilianShort: firstOption(fullCivilian),
        start,
        end,
      })
    }
  }

  // Sort by position
  matches.sort((a, b) => a.start - b.start)

  // Pass 2: Build translated string — replace ALL occurrences
  let translated = ''
  let cursor = 0
  for (const match of matches) {
    translated += input.slice(cursor, match.start)
    const civ = match.civilianShort
    translated += matchCase(match.military, civ)
    cursor = match.end
  }
  translated += input.slice(cursor)

  // Pass 3: Post-processing cleanup
  translated = postProcess(translated)

  return { matches, translated }
}

// ── Post-processing ───────────────────────────────────────────────

function postProcess(text: string): string {
  let out = text

  // Fix double/triple spaces
  out = out.replace(/  +/g, ' ')

  // Fix "a" before vowel → "an" (only lowercase articles)
  out = out.replace(/\ba (a|e|i|o|u)/gi, (match, vowel) => {
    const aWord = match[0] === 'A' ? 'An' : 'an'
    return `${aWord} ${vowel}`
  })

  // Fix "an" before consonant → "a"
  out = out.replace(/\ban ([bcdfghjklmnpqrstvwxyz])/gi, (match, consonant) => {
    const aWord = match[0] === 'A' ? 'A' : 'a'
    return `${aWord} ${consonant}`
  })

  // Fix possessive 's after replaced terms (e.g., "team member's" not "team member 's")
  out = out.replace(/ 's\b/g, "'s")

  // Clean up orphaned punctuation patterns
  out = out.replace(/\(\s*\)/g, '') // empty parens
  out = out.replace(/,\s*,/g, ',')  // double commas
  out = out.replace(/\.\s*\./g, '.') // double periods
  out = out.replace(/\s+([.,;:!?])/g, '$1') // space before punctuation

  // Trim leading/trailing whitespace per line
  out = out.split('\n').map(line => line.trim()).join('\n')

  return out.trim()
}

// ── Static examples ────────────────────────────────────────────────

const STATIC_EXAMPLES = [
  {
    branch: 'Army',
    badge: '🪖',
    before:
      'Platoon Sergeant, 11B Infantry, responsible for COIN operations at 3 FOBs in RC-East. Led 42-soldier platoon through 200+ combat patrols.',
    after:
      'Team Supervisor, Infantry Specialist. Managed counterinsurgency operations across 3 forward operating bases in Regional Command East. Led 42-member team through 200+ field operations.',
    terms: ['Platoon Sergeant → Team Supervisor', '11B → Infantry Specialist', 'COIN → Counterinsurgency', 'FOBs → Remote Facilities', 'RC-East → Eastern Region', 'combat patrols → field operations'],
  },
  {
    branch: 'Navy',
    badge: '⚓',
    before:
      'LCPO of Engineering Division. Supervised 15 sailors standing watch in CIC during 8-month deployment. Achieved 98% FMC rate.',
    after:
      'Department Head of Engineering Division. Supervised 15 team members providing operational coverage in the operations center during 8-month extended field assignment. Achieved 98% fully operational rate.',
    terms: ['LCPO → Department Head', 'sailors → team members', 'standing watch → operational coverage', 'CIC → operations center', 'deployment → field assignment', 'FMC → fully operational'],
  },
  {
    branch: 'Air Force',
    badge: '✈',
    before:
      'NCOIC of base communications. Managed PCS transitions for squadron of 120 airmen. Completed all PME requirements while TDY to OCONUS assignment.',
    after:
      'Supervisor of facility communications. Managed permanent relocations for department of 120 team members. Completed all professional development requirements during temporary duty assignment at international location.',
    terms: ['NCOIC → Supervisor', 'base → facility', 'PCS → permanent relocation', 'squadron → department', 'airmen → team members', 'PME → professional development', 'TDY → temporary duty', 'OCONUS → international'],
  },
]

// ── Component ──────────────────────────────────────────────────────

export function TranslationDemo() {
  const [input, setInput] = useState('')
  const [hasTranslated, setHasTranslated] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [result, setResult] = useState<{ matches: TermMatch[]; translated: string } | null>(null)
  const [showResults, setShowResults] = useState(false)

  function handleTranslate() {
    if (!input.trim()) return
    const res = translateText(input.trim())
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setResult(res)
      setShowResults(true)
      setHasTranslated(true)
      return
    }

    // Show skeleton for deliberate processing feel
    setShowSkeleton(true)
    setShowResults(false)
    setHasTranslated(true)

    setTimeout(() => {
      setResult(res)
      setShowSkeleton(false)
      setShowResults(true)
    }, 400)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleTranslate()
    }
  }

  function handleTryExample(text: string) {
    setInput(text)
    const res = translateText(text)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setResult(res)
      setShowResults(true)
      setHasTranslated(true)
      return
    }

    setShowSkeleton(true)
    setShowResults(false)
    setHasTranslated(true)

    setTimeout(() => {
      setResult(res)
      setShowSkeleton(false)
      setShowResults(true)
    }, 400)
  }

  // Deduplicate matched terms for chips
  const uniqueMatches = useMemo(() => {
    if (!result) return []
    const seen = new Set<string>()
    return result.matches.filter((m) => {
      const key = m.military.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [result])

  // ── Highlighted original text ──────────────────────────────────

  function renderHighlighted() {
    if (!result) return null
    const { matches } = result
    const parts: React.ReactNode[] = []
    let cursor = 0
    const text = input.trim()

    for (let i = 0; i < matches.length; i++) {
      const m = matches[i]
      if (m.start > cursor) {
        parts.push(<span key={`t-${i}`}>{text.slice(cursor, m.start)}</span>)
      }
      parts.push(
        <mark
          key={`m-${i}`}
          className="px-0.5 rounded-sm border-b bg-gold/15 text-gold border-gold/50"
          title={m.civilianShort}
        >
          {text.slice(m.start, m.end)}
        </mark>
      )
      cursor = m.end
    }
    if (cursor < text.length) {
      parts.push(<span key="tail">{text.slice(cursor)}</span>)
    }
    return parts
  }

  return (
    <section id="translation-demo" className="bg-bg-primary border-t border-gold/20 px-4 md:px-12 py-14 md:py-20 relative overflow-hidden scroll-mt-4">
      {/* Subtle gold glow top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(212, 168, 75, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section badge */}
        <div className="text-center mb-6">
          <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-5">
            Try It Now — No Sign-Up Required
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-3">
            See Your Service{' '}
            <span className="text-gold">Translate in Real Time</span>
          </h2>
          <p className="text-base text-text-muted max-w-xl mx-auto">
            See how Debriefed recognizes your military language. Paste any jargon below — we&apos;ll show you exactly what civilian employers see, and what it should say.
          </p>
        </div>

        {/* ── Input area ──────────────────────────────────────── */}
        <div className="mt-8">
          <label htmlFor="demo-input" className="block font-mono text-[11px] uppercase tracking-wider text-text-dim mb-2">
            Paste any military jargon, job title, or eval bullet
          </label>
          <textarea
            id="demo-input"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Platoon Sergeant, 11B Infantry, responsible for COIN operations at 3 FOBs in RC-East"
            className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 font-mono text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none resize-none transition-colors"
          />
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={handleTranslate}
              disabled={!input.trim()}
              className="px-7 py-3 font-heading text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Translate →
            </button>
            {hasTranslated && (
              <button
                onClick={() => { setInput(''); setResult(null); setHasTranslated(false); setShowSkeleton(false); setShowResults(false) }}
                className="text-xs text-text-dim hover:text-text-muted transition-colors font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Skeleton loading state ──────────────────────────── */}
        {hasTranslated && showSkeleton && (
          <div className="mt-8 space-y-5">
            <div className="bg-bg-secondary/50 border border-border rounded-lg p-5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-3">Processing...</div>
              <div className="space-y-2.5">
                <div className="h-3 w-full rounded bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse" style={{ animationDelay: '100ms' }} />
                <div className="h-3 w-3/5 rounded bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse" style={{ animationDelay: '200ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Results panel ────────────────────────────────────── */}
        {hasTranslated && showResults && result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {result.matches.length > 0 ? (
              <div className="space-y-5">
                {/* Original with highlights */}
                <div className="bg-bg-secondary/50 border border-border rounded-lg p-5">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-2">
                    Original — Military Terms Highlighted
                  </div>
                  <p className="text-sm leading-relaxed text-text-muted">
                    {renderHighlighted()}
                  </p>
                </div>

                {/* How Civilian Employers Read This */}
                <div className="bg-bg-secondary/50 border border-gold/30 rounded-lg p-5">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-gold mb-2">
                    How Civilian Employers Read This
                  </div>
                  <p className="text-sm leading-relaxed text-text whitespace-pre-line">
                    {result.translated}
                  </p>
                </div>

                {/* What It Should Say CTA */}
                <div className="bg-gold-dim border border-gold/30 rounded-lg p-5">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-gold mb-2">
                    What It Should Say →
                  </div>
                  <p className="text-sm text-text-muted mb-4">
                    The dictionary catches the terms — but your resume needs more than word swaps. Our AI rewrites your experience into polished civilian language that hiring managers actually respond to.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-block px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
                  >
                    Get the Full AI-Polished Version — Build Your Free Resume →
                  </Link>
                </div>

                {/* Term chips — staggered entrance */}
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-2">
                    {uniqueMatches.length} Term{uniqueMatches.length !== 1 ? 's' : ''} Matched
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uniqueMatches.map((m, i) => (
                      <span
                        key={i}
                        className="bg-gold-dim text-gold font-mono text-[11px] px-2.5 py-1 rounded animate-fade-in opacity-0"
                        style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
                      >
                        {m.military} → {m.civilianShort}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-bg-secondary/50 border border-border rounded-lg p-6 text-center">
                <p className="text-sm text-text-muted mb-1">
                  No military terms detected in your input.
                </p>
                <p className="text-xs text-text-dim">
                  Try pasting a bullet from your eval or service record, or click one of the examples below.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Static examples (shown when user hasn't translated) ── */}
        {!hasTranslated && (
          <div className="mt-10">
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-4 text-center">
              Real Examples — Click to Try
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STATIC_EXAMPLES.map((ex) => (
                <button
                  key={ex.branch}
                  onClick={() => handleTryExample(ex.before)}
                  className="text-left bg-bg-secondary/50 border border-border border-l-4 border-l-gold rounded-lg p-4 hover:border-gold/50 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{ex.badge}</span>
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-gold">
                      {ex.branch}
                    </span>
                  </div>

                  {/* Before */}
                  <div className="mb-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-text-dim mb-1">Before</div>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-3">{ex.before}</p>
                  </div>

                  {/* After */}
                  <div className="mb-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-status-green mb-1">After</div>
                    <p className="text-xs text-text leading-relaxed line-clamp-3">{ex.after}</p>
                  </div>

                  {/* Term pills — show all */}
                  <div className="flex flex-wrap gap-1">
                    {ex.terms.map((t, i) => (
                      <span key={i} className="bg-gold-dim text-gold font-mono text-[9px] px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-[10px] text-text-dim group-hover:text-gold transition-colors font-mono uppercase">
                    Click to try →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-block px-8 py-4 font-heading text-base font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
          >
            Get Your Full AI Translation Free →
          </Link>
          <p className="mt-3 text-xs text-text-dim">
            Free account — no credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
