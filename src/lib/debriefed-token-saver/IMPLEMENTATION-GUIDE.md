# Debriefed Token-Saving Implementation Guide

## Overview

This guide explains how to implement the token-saving resources to reduce AI costs by 40-60%.

---

## File Inventory

| File | Purpose | Estimated Savings |
|------|---------|-------------------|
| `military-terms-dictionary.json` | Direct term translation lookup | 70% of translation calls |
| `action-verbs-library.json` | Verb suggestions without AI | 100% of verb suggestion calls |
| `prompt-library.json` | Optimized prompts for all features | 30-50% token reduction |
| `navy-rating-crosswalk.json` | Rating to civilian job mapping | 80% of MOS translation calls |

---

## Implementation Priority

### Phase 1: Quick Wins (Day 1)

**1. Term Translation Lookup**

Before calling AI to translate a term:
```javascript
import terms from './military-terms-dictionary.json';

function translateTerm(militaryTerm) {
  const normalized = militaryTerm.toLowerCase().trim();
  
  // Check acronyms first
  if (terms.acronyms[militaryTerm.toUpperCase()]) {
    return terms.acronyms[militaryTerm.toUpperCase()];
  }
  
  // Check general terms
  if (terms.terms[normalized]) {
    return terms.terms[normalized];
  }
  
  // Not found - fall back to AI
  return null;
}
```

**2. Action Verb Suggestions**

Suggest verbs based on skill category - no AI needed:
```javascript
import verbs from './action-verbs-library.json';

function suggestVerbs(category, count = 5) {
  const categoryVerbs = verbs[category]?.verbs || verbs.quantified_impact.verbs;
  return categoryVerbs.slice(0, count);
}

// Usage
suggestVerbs('leadership', 5);  // ["accelerated", "accomplished", "achieved", "administered", "advanced"]
suggestVerbs('technical', 5);   // ["adapted", "adjusted", "administered", "analyzed", "applied"]
```

**3. Rating-to-Job Lookup**

Before calling AI for job suggestions:
```javascript
import crosswalk from './navy-rating-crosswalk.json';

function getCivilianJobs(rating) {
  const match = crosswalk.ratings[rating.toUpperCase()];
  if (match) {
    return {
      titles: match.civilian_titles,
      industries: match.industries,
      onet_codes: match.onet_codes
    };
  }
  return null; // Fall back to AI
}

// Usage
getCivilianJobs('DC');
// Returns: { titles: ["Firefighter", "Fire Inspector", ...], industries: [...] }
```

---

### Phase 2: Prompt Optimization (Day 2-3)

**Replace Existing Prompts**

Use prompts from `prompt-library.json`:

```javascript
import prompts from './prompt-library.json';

async function rewriteBullet(bullet, targetRole) {
  const config = prompts.bullet_rewrite;
  
  const userPrompt = config.user_template
    .replace('{{bullet}}', bullet)
    .replace('{{target_role}}', targetRole);
  
  const response = await callAI({
    model: config.model, // 'haiku' - cheaper!
    system: config.system_prompt,
    user: userPrompt,
    max_tokens: config.max_tokens,
    temperature: config.temperature
  });
  
  return JSON.parse(response);
}
```

**Batch Operations**

Rewrite multiple bullets in one call:
```javascript
async function rewriteBulletsBatch(bullets, targetRole) {
  const config = prompts.bullet_batch_rewrite;
  
  const numbered = bullets.map((b, i) => `${i + 1}. ${b}`).join('\n');
  
  const userPrompt = config.user_template
    .replace('{{bullets_numbered}}', numbered)
    .replace('{{target_role}}', targetRole);
  
  const response = await callAI({
    model: config.model,
    system: config.system_prompt,
    user: userPrompt,
    max_tokens: config.max_tokens
  });
  
  return JSON.parse(response);
}

// 5 bullets = 1 API call instead of 5
```

---

### Phase 3: Caching Layer (Day 4-5)

**Cache Common Operations**

```javascript
// Redis or in-memory cache
const cache = new Map();

async function analyzeJob(jobDescription) {
  // Create cache key from job description hash
  const cacheKey = `job:${hashString(jobDescription)}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // Not cached - call AI
  const result = await callJobAnalysisAI(jobDescription);
  
  // Cache for 24 hours
  cache.set(cacheKey, result, { ttl: 86400 });
  
  return result;
}
```

**What to Cache:**
- Job analysis results (same job = same analysis)
- MOS translations
- Common bullet rewrites
- Skill gap calculations

**What NOT to Cache:**
- Cover letters (personalized)
- Full resume builds
- User-specific recommendations

---

### Phase 4: Model Tiering (Day 6)

**Route to Appropriate Model**

```javascript
const MODEL_ROUTING = {
  // Simple tasks → Haiku (cheap)
  'bullet_rewrite': 'claude-3-haiku-20240307',
  'term_translation': 'claude-3-haiku-20240307',
  'skill_extraction': 'claude-3-haiku-20240307',
  'keyword_injection': 'claude-3-haiku-20240307',
  
  // Complex tasks → Sonnet (quality)
  'cover_letter': 'claude-3-5-sonnet-20241022',
  'job_analysis': 'claude-3-5-sonnet-20241022',
  'eval_extraction': 'claude-3-5-sonnet-20241022',
  'federal_resume': 'claude-3-5-sonnet-20241022'
};

function getModel(task) {
  return MODEL_ROUTING[task] || 'claude-3-haiku-20240307';
}
```

---

## Decision Tree: When to Use AI

```
User requests translation/suggestion
          │
          ▼
    ┌─────────────┐
    │ Check local │
    │  dictionary │
    └─────────────┘
          │
          ▼
    Found in dictionary?
     │           │
    YES          NO
     │           │
     ▼           ▼
  Return      Check O*NET
  directly    crosswalk
                 │
                 ▼
           Found in crosswalk?
            │           │
           YES          NO
            │           │
            ▼           ▼
         Return      Call AI
         directly    (Haiku)
```

---

## Expected Savings

| Feature | Before (tokens/call) | After (tokens/call) | Savings |
|---------|---------------------|---------------------|---------|
| Term translation | 150 | 0 (lookup) | 100% |
| Verb suggestions | 100 | 0 (lookup) | 100% |
| MOS → Jobs | 200 | 0 (lookup) | 100% |
| Bullet rewrite | 400 | 200 | 50% |
| Job analysis | 800 | 400 | 50% |
| Cover letter | 1000 | 500 | 50% |

**Estimated Monthly Savings:** 40-60% of current AI costs

---

## Files to Add to Your Repo

```
/lib/data/
  ├── military-terms-dictionary.json
  ├── action-verbs-library.json
  ├── navy-rating-crosswalk.json
  └── prompt-library.json

/lib/utils/
  ├── termLookup.ts
  ├── verbSuggester.ts
  ├── ratingCrosswalk.ts
  └── promptBuilder.ts
```

---

## Claude Code Prompt to Implement

```
Implement token-saving architecture for Debriefed:

1. Add the JSON data files to /lib/data/
2. Create utility functions:
   - termLookup.ts: Check military-terms-dictionary.json before AI calls
   - verbSuggester.ts: Return verbs from action-verbs-library.json
   - ratingCrosswalk.ts: Lookup navy-rating-crosswalk.json for job suggestions
   - promptBuilder.ts: Use optimized prompts from prompt-library.json

3. Update existing AI call sites to:
   - Check local dictionaries first
   - Use optimized prompts from prompt-library.json
   - Route simple tasks to Haiku, complex to Sonnet
   - Batch multiple bullets into single calls

4. Add caching for:
   - Job analysis results (key by job description hash)
   - Common term translations

Priority: termLookup.ts and promptBuilder.ts first - biggest impact.
```

---

## Monitoring

Track these metrics to measure impact:
- AI calls per user session (should decrease)
- Tokens per feature (should decrease)
- Cache hit rate (should be >60% for job analysis)
- Cost per resume generated

Add logging:
```javascript
function logAICall(feature, tokens, cached) {
  console.log(`[AI] ${feature}: ${tokens} tokens, cached: ${cached}`);
  // Send to analytics
}
```
