import { chromium } from 'playwright'
import fs from 'node:fs'

const SHOTS = '/home/fiveftslim/projects/debriefedfinal/debriefed/docs/verification'
const BASE = 'http://localhost:8743'
const SF = 'file:///home/fiveftslim/projects/debriefedfinal/debriefed/dist-singlefile/Debriefed.html'

const JD = `Logistics Manager - Acme Distribution. We need an experienced logistics manager
to oversee warehouse operations, inventory management, and a team of 15 staff.
Requirements: 5+ years supply chain experience, inventory control systems, budget management,
team leadership. Preferred: Lean Six Sigma, CSCP certification, SAP ERP experience.
Bachelor's degree in supply chain or business preferred.`

const PROFILE = {
  id: 't1', first_name: 'Alex', last_name: 'Vet', email: 'a@b.co', branch: 'navy',
  rank: 'PO1', paygrade: 'E-6', rating_mos: 'LS1', years_of_service: 10,
  target_role: 'Logistics Manager', onboarding_completed: true,
}
const EXPERIENCES = [{
  id: 'e1', job_title: 'Logistics Specialist', company_name: 'US Navy', is_current: true,
  start_date: '2019-01-01', sort_order: 0,
  bullets: [
    { id: 'b1', original_text: 'Managed supply for 400 personnel and maintained 99% inventory accuracy on $48M of gear', status: 'pending', sort_order: 0 },
  ],
}]
const RESUME = {
  id: 'r1', title: 'Base Resume', type: 'civilian', template: 'classic_professional',
  is_master: true, created_at: '2026-06-01T00:00:00Z', updated_at: '2026-06-01T00:00:00Z',
  content: {
    contact: { full_name: 'Alex Vet', email: 'a@b.co', city: 'Norfolk', state: 'VA' },
    professional_summary: 'Logistics professional with 10 years of supply chain leadership.',
    experiences: [{
      id: 'e1', job_title: 'Logistics Specialist', company_name: 'US Navy', is_current: true,
      start_date: '2019-01-01',
      bullets: [
        { id: 'b1', original_text: 'Managed supply for 400 personnel and maintained 99% inventory accuracy on $48M of gear', translated_text: 'Directed inventory control for $48M in equipment supporting 400 staff with 99% accuracy', status: 'accepted' },
      ],
    }],
    skills: [{ name: 'Inventory Management' }, { name: 'Team Leadership' }, { name: 'Budget Management' }],
    education: [],
    certifications: [],
  },
}
const SKILLS = [
  { id: 's1', name: 'Inventory Management', category: 'technical' },
  { id: 's2', name: 'Team Leadership', category: 'soft' },
  { id: 's3', name: 'Budget Management', category: 'technical' },
]

const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`)
}

async function seed(page, { withKey }) {
  await page.evaluate(({ profile, experiences, skills, resume, withKey }) => {
    localStorage.clear()
    localStorage.setItem('debriefed:v1:profile', JSON.stringify(profile))
    localStorage.setItem('debriefed:v1:experiences', JSON.stringify(experiences))
    localStorage.setItem('debriefed:v1:skills', JSON.stringify(skills))
    localStorage.setItem('debriefed:v1:resumes', JSON.stringify([resume]))
    localStorage.setItem('debriefed:v1:settings', JSON.stringify({ onboarding_completed: true }))
    if (withKey) localStorage.setItem('debriefed:apiKey', 'sk-ant-test0000000000000000')
  }, { profile: PROFILE, experiences: EXPERIENCES, skills: SKILLS, resume: RESUME, withKey })
}

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1380, height: 920 } })
const page = await context.newPage()
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(e.message))

// ════ MODE 1: no key, online (PWA) ════
console.log('\n── MODE 1: no key + online (PWA)')
await page.goto(BASE + '/dashboard/', { waitUntil: 'domcontentloaded' })
await seed(page, { withKey: false })
// fresh first-launch state
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('debriefed:v1:settings'))
  delete s.first_launch_seen
  localStorage.setItem('debriefed:v1:settings', JSON.stringify(s))
})
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2500) // let SW install + precache
let body = await page.textContent('body')
check('first-launch modal shows', /works for free, no setup required/i.test(body))
check('modal has dictionary option', /Use the dictionary \(no key needed\)/i.test(body))
check('modal has key option', /Add an Anthropic key/i.test(body))
await page.screenshot({ path: `${SHOTS}/1-first-launch-modal.png` })
await page.click('text=Use the dictionary (no key needed)')
await page.waitForTimeout(800)
body = await page.textContent('body')
check('modal dismissed, dashboard usable', /Welcome back, Alex/i.test(body))

// job match: dictionary analysis, keyless
await page.goto(BASE + '/job-match/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1500)
const jdBox = page.locator('textarea').first()
await jdBox.fill(JD)
await page.waitForTimeout(4000) // debounced dictionary analysis
body = await page.textContent('body')
check('dictionary match analysis renders', /Dictionary translation/i.test(body) && /%/.test(body))
check('no key prompts shown', !/you need a key|API key required/i.test(body))
check('enhance affordance present (add key)', /add key/i.test(body))
await page.screenshot({ path: `${SHOTS}/2-jobmatch-dictionary-nokey.png`, fullPage: false })

// ════ MODE 2: no key, offline (PWA via service worker) ════
console.log('\n── MODE 2: no key + offline (PWA)')
await context.setOffline(true)
await page.goto(BASE + '/career-tools/', { waitUntil: 'domcontentloaded' }).catch(() => {})
await page.waitForTimeout(2000)
body = await page.textContent('body').catch(() => '')
const offlineServed = body.length > 200
check('offline page served by service worker', offlineServed, `${body.length} chars`)
if (offlineServed) {
  check('offline banner visible', /Offline — using dictionary translation/i.test(body))
  // dictionary data available offline?
  const dataOk = await page.evaluate(async () => {
    try { const r = await fetch('/data/military_jargon.json'); const j = await r.json(); return Array.isArray(j) && j.length > 1000 } catch { return false }
  })
  check('dictionary data served offline', dataOk)
  const fontOk = await page.evaluate(async () => {
    try { const r = await fetch('/fonts/pdf/lato-400.ttf'); return r.ok } catch { return false }
  })
  check('PDF fonts served offline', fontOk)
  await page.screenshot({ path: `${SHOTS}/3-offline-nokey-banner.png` })
}

// ════ MODE 4 (key + offline) — stay offline, add key ════
console.log('\n── MODE 4: key + offline (PWA)')
await seed(page, { withKey: true })
await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {})
await page.waitForTimeout(1500)
body = await page.textContent('body').catch(() => '')
check('offline banner still visible with key', /Offline — using dictionary translation/i.test(body))
await page.goto(BASE + '/job-match/', { waitUntil: 'domcontentloaded' }).catch(() => {})
await page.waitForTimeout(1200)
await page.locator('textarea').first().fill(JD).catch(() => {})
await page.waitForTimeout(4000)
body = await page.textContent('body').catch(() => '')
check('dictionary analysis works offline with key', /Dictionary translation/i.test(body) && /%/.test(body))
// AI button disabled offline: EnhanceWithAI renders a <span title=...> instead of button
const disabledTooltip = await page.locator('[title*="AI enhancement needs internet"]').count()
check('AI affordances disabled with tooltip', disabledTooltip > 0, `${disabledTooltip} found`)
await page.screenshot({ path: `${SHOTS}/4-offline-withkey-disabled-ai.png` })

// ════ MODE 3: key + online ════
console.log('\n── MODE 3: key + online (PWA)')
await context.setOffline(false)
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1500)
await page.locator('textarea').first().fill(JD)
await page.waitForTimeout(4000)
body = await page.textContent('body')
check('no offline banner when online', !/Offline — using dictionary/i.test(body))
check('dictionary analysis still primary', /Dictionary translation/i.test(body))
const aiButtons = await page.locator('button:has-text("AI Deep Analysis"), button:has-text("Enhance with AI"), button:has-text("AI Bullet Rewrites")').count()
check('active AI buttons with key', aiButtons > 0, `${aiButtons} found`)
await page.screenshot({ path: `${SHOTS}/5-online-withkey-ai-available.png` })

// resume create/save/version/export sanity (key+online state)
await page.goto(BASE + '/resumes/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2000)
body = await page.textContent('body')
check('resume editor loads', /resume/i.test(body))
await page.screenshot({ path: `${SHOTS}/6-resume-editor.png` })

// MOS occupation search page (works in all modes; spot-check online)
await page.goto(BASE + '/mos/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1000)
body = await page.textContent('body')
check('MOS explorer renders', /occupation|MOS|military/i.test(body))

// ════ Single-file on file:// (no key) ════
console.log('\n── SINGLE-FILE: file://, no key')
const sfPage = await context.newPage()
sfPage.on('pageerror', (e) => pageErrors.push('SF: ' + e.message))
await sfPage.goto(SF, { waitUntil: 'domcontentloaded' })
await sfPage.evaluate(({ profile, experiences, skills, resume }) => {
  localStorage.clear()
  localStorage.setItem('debriefed:v1:profile', JSON.stringify(profile))
  localStorage.setItem('debriefed:v1:experiences', JSON.stringify(experiences))
  localStorage.setItem('debriefed:v1:skills', JSON.stringify(skills))
  localStorage.setItem('debriefed:v1:resumes', JSON.stringify([resume]))
  localStorage.setItem('debriefed:v1:settings', JSON.stringify({ onboarding_completed: true, first_launch_seen: true }))
}, { profile: PROFILE, experiences: EXPERIENCES, skills: SKILLS, resume: RESUME })
await sfPage.goto(SF + '#/job-match', { waitUntil: 'domcontentloaded' })
await sfPage.reload({ waitUntil: 'domcontentloaded' })
await sfPage.waitForTimeout(2000)
await sfPage.locator('textarea').first().fill(JD)
await sfPage.waitForTimeout(4500)
body = await sfPage.textContent('body')
check('single-file dictionary analysis works', /Dictionary translation/i.test(body) && /%/.test(body))
const fontsEmbedded = await sfPage.evaluate(() => {
  const f = window.__DEBRIEFED_FONTS__
  return f && Object.keys(f).length >= 30 && f['lato-400.ttf']?.startsWith('data:')
})
check('PDF fonts embedded as data URLs', !!fontsEmbedded)
await sfPage.screenshot({ path: `${SHOTS}/7-singlefile-jobmatch-dictionary.png` })

const fatal = pageErrors.filter((e) => !/ResizeObserver/.test(e))
check('zero page errors across all modes', fatal.length === 0, fatal.slice(0, 3).join(' | '))

fs.writeFileSync(`${SHOTS}/results.json`, JSON.stringify(results, null, 2))
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} checks passed`)
await browser.close()
process.exit(results.every((r) => r.ok) ? 0 : 1)
