#!/bin/bash
# =============================================================================
# Debriefed — Blog / Content Hub Setup Script
# Run from: ~/projects/debriefedfinal/debriefed/
# Usage:    chmod +x setup-blog.sh && ./setup-blog.sh
# =============================================================================

set -e  # Exit on any error

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()    { echo -e "${CYAN}[blog]${NC} $1"; }
ok()     { echo -e "${GREEN}[ok]${NC}   $1"; }
warn()   { echo -e "${YELLOW}[warn]${NC} $1"; }
fail()   { echo -e "${RED}[fail]${NC} $1"; exit 1; }

# =============================================================================
# 0. Sanity check — must be run from project root
# =============================================================================
if [ ! -f "package.json" ]; then
  fail "Run this from your project root (where package.json lives)"
fi

if ! grep -q "next" package.json; then
  fail "This doesn't look like a Next.js project"
fi

log "Project root confirmed: $(pwd)"

# =============================================================================
# 1. Git — create feature branch
# =============================================================================
log "Creating feature branch..."

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "feature/blog-content-hub" ]; then
  warn "Already on feature/blog-content-hub — skipping branch creation"
else
  git checkout -b feature/blog-content-hub
  ok "Created and checked out feature/blog-content-hub"
fi

# =============================================================================
# 2. Install npm dependencies
# =============================================================================
log "Installing npm dependencies..."
npm install gray-matter reading-time next-mdx-remote
npm install -D @tailwindcss/typography
ok "Dependencies installed"

# =============================================================================
# 3. Update tailwind.config.ts
# =============================================================================
log "Patching tailwind.config.ts..."

TAILWIND_CONFIG=""
if [ -f "tailwind.config.ts" ]; then
  TAILWIND_CONFIG="tailwind.config.ts"
elif [ -f "tailwind.config.js" ]; then
  TAILWIND_CONFIG="tailwind.config.js"
else
  fail "No tailwind.config.ts or tailwind.config.js found"
fi

# Add typography import if not already present
if ! grep -q "@tailwindcss/typography" "$TAILWIND_CONFIG"; then
  # Prepend import to top of file
  sed -i '1s/^/import typography from "@tailwindcss\/typography"\n/' "$TAILWIND_CONFIG"
  ok "Added typography import to $TAILWIND_CONFIG"
else
  warn "Typography import already present in $TAILWIND_CONFIG — skipping"
fi

# Add typography to plugins array if not already present
if ! grep -q "typography()" "$TAILWIND_CONFIG"; then
  # Try to add to plugins array
  if grep -q "plugins:" "$TAILWIND_CONFIG"; then
    sed -i 's/plugins: \[/plugins: [typography(), /' "$TAILWIND_CONFIG"
    ok "Added typography() to plugins array"
  else
    warn "Could not auto-patch plugins array — add manually:"
    warn "  plugins: [typography()]"
  fi
else
  warn "typography() already in plugins — skipping"
fi

# Also ensure content array includes MDX files
if ! grep -q "content/\*\*" "$TAILWIND_CONFIG" && ! grep -q "content/blog" "$TAILWIND_CONFIG"; then
  warn "Add './content/**/*.mdx' to your Tailwind content array manually if posts aren't styled"
fi

# =============================================================================
# 4. Create directory structure
# =============================================================================
log "Creating directories..."

mkdir -p src/lib
mkdir -p src/app/blog/\[slug\]
mkdir -p src/components/blog
mkdir -p content/blog

ok "Directories created"

# =============================================================================
# 5. Copy source files
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log "Copying source files..."

# lib
cp "$SCRIPT_DIR/src/lib/mdx.ts"                              src/lib/mdx.ts
ok "  src/lib/mdx.ts"

# app routes
cp "$SCRIPT_DIR/src/app/blog/page.tsx"                       src/app/blog/page.tsx
ok "  src/app/blog/page.tsx"

cp "$SCRIPT_DIR/src/app/blog/[slug]/page.tsx"                "src/app/blog/[slug]/page.tsx"
ok "  src/app/blog/[slug]/page.tsx"

cp "$SCRIPT_DIR/src/app/blog/sitemap.ts"                     src/app/blog/sitemap.ts
ok "  src/app/blog/sitemap.ts"

# components
cp "$SCRIPT_DIR/src/components/blog/PostCard.tsx"            src/components/blog/PostCard.tsx
ok "  src/components/blog/PostCard.tsx"

cp "$SCRIPT_DIR/src/components/blog/CategoryPill.tsx"        src/components/blog/CategoryPill.tsx
ok "  src/components/blog/CategoryPill.tsx"

cp "$SCRIPT_DIR/src/components/blog/MdxComponents.tsx"       src/components/blog/MdxComponents.tsx
ok "  src/components/blog/MdxComponents.tsx"

# =============================================================================
# 6. Copy all MDX content posts
# =============================================================================
log "Copying 26 blog posts..."

POST_COUNT=0
for mdx_file in "$SCRIPT_DIR/content/blog/"*.mdx; do
  filename=$(basename "$mdx_file")
  cp "$mdx_file" "content/blog/$filename"
  POST_COUNT=$((POST_COUNT + 1))
done

ok "  $POST_COUNT posts copied to content/blog/"

# =============================================================================
# 7. Sitemap merge check
# =============================================================================
log "Checking sitemap setup..."

if [ -f "src/app/sitemap.ts" ]; then
  warn "Root sitemap found at src/app/sitemap.ts"
  warn "Merge blog sitemap manually — add this import to your root sitemap:"
  echo ""
  echo "  // In src/app/sitemap.ts:"
  echo "  import { getAllPosts } from '@/lib/mdx'"
  echo "  // Then add blog post entries to your returned array"
  echo ""
elif [ -f "app/sitemap.ts" ]; then
  warn "Root sitemap found at app/sitemap.ts — same as above, merge manually"
fi

# =============================================================================
# 8. TypeScript path alias check
# =============================================================================
log "Checking @/ path alias in tsconfig.json..."

if [ -f "tsconfig.json" ]; then
  if grep -q '"@/*"' tsconfig.json; then
    ok "Path alias @/* already configured"
  else
    warn "@/* alias not found in tsconfig.json — add this to compilerOptions.paths:"
    echo '    "@/*": ["./src/*"]'
  fi
fi

# =============================================================================
# 9. next.config check for MDX
# =============================================================================
log "Checking Next.js config for MDX support..."

NEXT_CONFIG=""
[ -f "next.config.ts" ]  && NEXT_CONFIG="next.config.ts"
[ -f "next.config.mjs" ] && NEXT_CONFIG="next.config.mjs"
[ -f "next.config.js" ]  && NEXT_CONFIG="next.config.js"

if [ -n "$NEXT_CONFIG" ]; then
  if grep -q "mdx\|MDX" "$NEXT_CONFIG"; then
    ok "MDX already configured in $NEXT_CONFIG"
  else
    warn "No MDX config found in $NEXT_CONFIG"
    warn "next-mdx-remote handles MDX at runtime — no next.config changes needed"
    warn "But if you see MDX parse errors, ensure 'mdx' is not in pageExtensions"
  fi
fi

# =============================================================================
# 10. Verify build compiles
# =============================================================================
log "Running type check..."

if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  warn "TypeScript errors found — run 'npx tsc --noEmit' to review"
  warn "Common fixes: check @/ alias, verify next-mdx-remote types installed"
else
  ok "Type check passed"
fi

# =============================================================================
# 11. Ready to commit (manual)
# =============================================================================
log "Files staged — commit when ready:"
echo ""
echo "  git add ."
echo "  git commit -m \"feat: blog content hub — 26 posts, MDX infrastructure, SEO sitemap\""
echo ""

# =============================================================================
# Done
# =============================================================================
echo ""
echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}  Blog content hub setup complete           ${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo -e "  Posts installed:  ${CYAN}26${NC}"
echo -e "  Branch:           ${CYAN}feature/blog-content-hub${NC}"
echo -e "  Blog index:       ${CYAN}http://localhost:3000/blog${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. npm run dev — verify /blog renders correctly"
echo "  2. Check Tailwind typography styles on a post"
echo "  3. Merge sitemap into src/app/sitemap.ts if you have one"
echo "  4. git add . && git commit when ready"
echo ""
