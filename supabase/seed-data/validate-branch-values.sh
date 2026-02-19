#!/bin/bash
# ============================================================================
# validate-branch-values.sh
# Run this before pasting ANY SQL file into Supabase
# Checks for common VARCHAR violations and non-standard branch values
#
# Usage: ./validate-branch-values.sh file1.sql file2.sql ...
#        ./validate-branch-values.sh *.sql
#
# STANDARD BRANCH VALUES (lowercase abbreviations ONLY):
#   army, navy, usaf, usmc, uscg, ussf, general
#
# NEVER use full names like 'Coast Guard', 'Air Force', 'Marine Corps'
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

if [ $# -eq 0 ]; then
  echo "Usage: $0 <sql-file> [sql-file...]"
  echo "   or: $0 *.sql"
  exit 1
fi

echo "============================================"
echo "  Branch Value Validator"
echo "============================================"
echo ""

# Note: dict_military_jargon, dict_eval_phrases etc. also use the branch column
# for domain context values like 'logistics', 'intelligence', 'cyber' — these are valid.
# We only flag full branch NAMES (Coast Guard, Air Force, etc.) and title-case variants.

# Check 1: Full branch names used as VALUES (with surrounding quotes)
# These are the definite VARCHAR(10) violations when used as branch column values
echo "Check 1: Full branch names in VALUES clauses..."
for f in "$@"; do
  if [ ! -f "$f" ]; then continue; fi
  # Match INSERT lines containing these as quoted values
  # This catches them whether they're branch columns or not — a useful safety net
  HITS=$(grep -cP "VALUES\s*\(.*'(Coast Guard|Space Force|Marine Corps|U\.S\. Navy|U\.S\. Army|U\.S\. Air Force|U\.S\. Marine Corps|U\.S\. Coast Guard|U\.S\. Space Force)'" "$f" 2>/dev/null || true)
  if [ "$HITS" -gt 0 ]; then
    echo -e "  ${RED}FAIL${NC}: $f — $HITS line(s) with full branch names in VALUES"
    grep -nP "VALUES\s*\(.*'(Coast Guard|Space Force|Marine Corps|U\.S\. )'" "$f" 2>/dev/null | head -3
    VIOLATIONS=$((VIOLATIONS + HITS))
  fi
done
echo ""

# Check 2: Title-case branch names in INSERT statements for tables with branch columns
echo "Check 2: Title-case branch names in dict_ INSERTs..."
for f in "$@"; do
  if [ ! -f "$f" ]; then continue; fi
  HITS=$(grep -cP "INSERT INTO dict_(acronyms|military_jargon|phrase_translations|eval_phrases|mos_to_civilian).*VALUES.*'(Army|Navy|Marines|General)'" "$f" 2>/dev/null || true)
  if [ "$HITS" -gt 0 ]; then
    echo -e "  ${YELLOW}WARN${NC}: $f — $HITS title-case branch value(s) in dict_ tables"
    VIOLATIONS=$((VIOLATIONS + HITS))
  fi
done
echo ""

# Summary
echo "============================================"
if [ "$VIOLATIONS" -eq 0 ]; then
  echo -e "  ${GREEN}PASS${NC}: All files clean. Zero violations."
else
  echo -e "  ${RED}FAIL${NC}: $VIOLATIONS total violation(s) found."
  echo ""
  echo "  Standard branch values: army, navy, usaf, usmc, uscg, ussf, general"
fi
echo "============================================"

if [ "$VIOLATIONS" -gt 0 ]; then
  exit 1
fi
exit 0
