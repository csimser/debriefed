#!/usr/bin/env bash
# =============================================================================
# Run Debriefed dictionary migration SQL files against Supabase
#
# Usage:
#   ./supabase/migrations/run-migrations.sh --db-url "postgresql://postgres.XXXX:PASSWORD@HOST:6543/postgres"
#
# Get your database URL from:
#   Supabase Dashboard → Settings → Database → Connection string → URI
#   (Use "Transaction" mode URI on port 6543)
#
# Requires: psql (PostgreSQL client)
#   Install: sudo apt install postgresql-client
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Parse arguments ──────────────────────────────────────────────────────────

DB_URL=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --db-url)
      DB_URL="$2"
      shift 2
      ;;
    --db-url=*)
      DB_URL="${1#*=}"
      shift
      ;;
    -h|--help)
      echo "Usage: $0 --db-url \"postgresql://...\""
      echo ""
      echo "Runs all Phase 1 + Phase 2 migration SQL files against your Supabase database."
      echo ""
      echo "Options:"
      echo "  --db-url URL   PostgreSQL connection string (required)"
      echo "                 Get it from: Supabase Dashboard → Settings → Database → Connection string"
      echo ""
      echo "Environment variables:"
      echo "  DATABASE_URL   Alternative to --db-url flag"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}" >&2
      echo "Run with --help for usage" >&2
      exit 1
      ;;
  esac
done

# Fall back to DATABASE_URL env var
if [[ -z "$DB_URL" ]]; then
  DB_URL="${DATABASE_URL:-}"
fi

if [[ -z "$DB_URL" ]]; then
  echo -e "${RED}Error: No database URL provided.${NC}" >&2
  echo "" >&2
  echo "Provide it via --db-url flag or DATABASE_URL environment variable." >&2
  echo "" >&2
  echo "Get your connection string from:" >&2
  echo "  Supabase Dashboard → Settings → Database → Connection string → URI" >&2
  echo "" >&2
  echo "Example:" >&2
  echo "  $0 --db-url \"postgresql://postgres.abc123:YourPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres\"" >&2
  exit 1
fi

# ── Check psql ───────────────────────────────────────────────────────────────

if ! command -v psql &>/dev/null; then
  echo -e "${RED}Error: psql (PostgreSQL client) is not installed.${NC}" >&2
  echo "" >&2
  echo "Install it with:" >&2
  echo "  sudo apt update && sudo apt install -y postgresql-client" >&2
  echo "" >&2
  echo "Or on macOS:" >&2
  echo "  brew install libpq && brew link --force libpq" >&2
  exit 1
fi

# ── Define migration files in execution order ────────────────────────────────

SQL_FILES=(
  # Phase 1: Schema additions (must run first)
  "20260224_phase1_schema_additions.sql"

  # Phase 1: Dictionary upserts (order doesn't matter between these)
  "20260224_phase1_upsert_mos_to_civilian.sql"
  "20260224_phase1_upsert_military_jargon.sql"
  "20260224_phase1_upsert_acronyms.sql"
  "20260224_phase1_upsert_phrase_translations.sql"

  # Phase 2: O*NET crosswalk table (must run before data parts)
  "20260224_phase2_create_onet_crosswalk.sql"

  # Phase 2: O*NET data (must run in order)
  "20260224_phase2_onet_data_part1.sql"
  "20260224_phase2_onet_data_part2.sql"
  "20260224_phase2_onet_data_part3.sql"
  "20260224_phase2_onet_data_part4.sql"
  "20260224_phase2_onet_data_part5.sql"
)

TOTAL=${#SQL_FILES[@]}

# ── Verify all files exist before starting ───────────────────────────────────

echo -e "${BOLD}Verifying migration files...${NC}"
MISSING=0
for file in "${SQL_FILES[@]}"; do
  filepath="${SCRIPT_DIR}/${file}"
  if [[ ! -f "$filepath" ]]; then
    echo -e "  ${RED}MISSING: ${file}${NC}"
    MISSING=$((MISSING + 1))
  fi
done

if [[ $MISSING -gt 0 ]]; then
  echo -e "\n${RED}Error: ${MISSING} migration file(s) missing. Aborting.${NC}" >&2
  exit 1
fi
echo -e "  ${GREEN}All ${TOTAL} files found.${NC}"

# ── Test database connection ─────────────────────────────────────────────────

echo -e "\n${BOLD}Testing database connection...${NC}"
if ! psql "$DB_URL" -c "SELECT 1;" &>/dev/null; then
  echo -e "  ${RED}Failed to connect to database.${NC}" >&2
  echo "  Check your connection string and try again." >&2
  exit 1
fi
echo -e "  ${GREEN}Connected successfully.${NC}"

# ── Run migrations ───────────────────────────────────────────────────────────

echo -e "\n${BOLD}Running ${TOTAL} migration files...${NC}\n"

STEP=0
for file in "${SQL_FILES[@]}"; do
  STEP=$((STEP + 1))
  filepath="${SCRIPT_DIR}/${file}"
  filesize=$(du -h "$filepath" | cut -f1)

  echo -ne "  [${STEP}/${TOTAL}] ${file} (${filesize})... "

  # Run SQL file, capture stderr
  ERROR_OUTPUT=$(psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$filepath" 2>&1) || {
    echo -e "${RED}FAILED${NC}"
    echo ""
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  Migration failed on file ${STEP}/${TOTAL}: ${file}${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Error output:"
    echo "$ERROR_OUTPUT" | tail -20
    echo ""
    echo -e "${YELLOW}Migrations 1-$((STEP - 1)) completed successfully.${NC}"
    echo -e "${YELLOW}Fix the error above and re-run. Already-applied files will safely upsert.${NC}"
    exit 1
  }

  echo -e "${GREEN}OK${NC}"
done

# ── Summary ──────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  All ${TOTAL} migrations completed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "  Phase 1: Schema additions applied"
echo "  Phase 1: 572 MOS + 1,649 jargon + 1,120 acronyms + 1,074 phrases upserted"
echo "  Phase 2: dict_onet_crosswalk table created with 24,248 rows"
echo ""
