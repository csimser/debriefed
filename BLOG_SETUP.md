# Blog / Content Hub — Full Post Inventory

## All Posts — Current (15 total)

### MOS Transition Guides (8 posts)
| File | MOS | Est. Monthly Searches |
|---|---|---|
| mos-11b-infantry-civilian-career-transition.mdx | 11B | 3,200/mo |
| mos-25u-signal-it-cybersecurity-career.mdx | 25U | 1,800/mo |
| mos-25b-it-specialist-civilian-career.mdx | 25B | 2,100/mo |
| mos-68w-combat-medic-civilian-healthcare.mdx | 68W | 2,400/mo |
| mos-92a-logistics-supply-chain-career.mdx | 92A | 1,600/mo |
| mos-35f-intelligence-analyst-civilian-career.mdx | 35F | 1,400/mo |
| mos-31b-military-police-civilian-law-enforcement.mdx | 31B | 1,900/mo |
| mos-42a-human-resources-civilian-hr-career.mdx | 42A | 1,300/mo |

### Resume & Career Tips (4 posts)
| File | Target Query | Est. Monthly Searches |
|---|---|---|
| military-resume-ats-fails-fix.mdx | "military resume ATS" | 4,100/mo |
| military-to-project-manager-pmp-guide.mdx | "military PMP transition" | 3,100/mo |
| veteran-linkedin-profile-guide.mdx | "veteran LinkedIn profile" | 2,800/mo |
| military-to-cybersecurity-career-guide.mdx | "military cybersecurity career" | 3,600/mo |

### SkillBridge (1 post)
| File | Target Query | Est. Monthly Searches |
|---|---|---|
| skillbridge-complete-guide.mdx | "SkillBridge guide" | 5,200/mo |

### Federal Resume (1 post)
| File | Target Query | Est. Monthly Searches |
|---|---|---|
| federal-resume-usajobs-guide.mdx | "federal resume veterans" | 4,200/mo |

### Veteran Hiring Programs (1 post)
| File | Target Query | Est. Monthly Searches |
|---|---|---|
| veterans-preference-usajobs-veoa-guide.mdx | "veterans preference USAJOBS" | 3,900/mo |

---

## Next Priority Posts (not yet written)

### MOS Codes with High Search Volume
| Slug | MOS | Est. Monthly Searches |
|---|---|---|
| mos-12b-combat-engineer-civilian.mdx | 12B | 1,700/mo |
| mos-91a-wheeled-vehicle-mechanic.mdx | 91A/91B | 1,500/mo |
| mos-15t-helicopter-mechanic-aviation.mdx | 15T | 1,200/mo |
| mos-88m-motor-transport-logistics.mdx | 88M | 1,100/mo |
| mos-74d-cbrn-specialist.mdx | 74D | 900/mo |
| mos-79s-career-counselor.mdx | 79S | 800/mo |
| mos-94-electronic-maintainer.mdx | 94F/94E | 1,000/mo |

### High-Volume Career Topics
| Slug | Topic | Est. Monthly Searches |
|---|---|---|
| military-college-gi-bill-guide.mdx | GI Bill strategy | 6,100/mo |
| retirement-military-pension-tsp.mdx | Military retirement finances | 4,100/mo |
| military-spouse-career-transition.mdx | Military spouse careers | 3,400/mo |
| veteran-small-business-sba-loans.mdx | Veteran entrepreneurship | 2,900/mo |
| officer-transition-civilian.mdx | Officer transition O4-O6 | 2,600/mo |
| military-to-mba-guide.mdx | Military → MBA | 2,400/mo |
| veteran-cover-letter-guide.mdx | Veteran cover letters | 2,200/mo |
| national-guard-reserve-transition.mdx | Guard/Reserve transition | 1,800/mo |

---

## Install
```bash
git checkout -b feature/blog-content-hub
npm install gray-matter reading-time next-mdx-remote
npm install -D @tailwindcss/typography
```

Add typography plugin to tailwind.config.ts:
```ts
import typography from '@tailwindcss/typography'
export default { plugins: [typography] }
```

## Frontmatter Reference
```yaml
---
title: "Post Title"
description: "150-160 char SEO description"
date: "2026-03-01"
category: mos-transition   # mos-transition | resume-tips | skillbridge | federal-resume | veteran-hiring
tags: [tag1, tag2, tag3]
author: Debriefed Team
featured: false
mosCode: "11B"             # links to /mos/[code] page
targetJob: "project manager"
---
```
