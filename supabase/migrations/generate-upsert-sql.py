#!/usr/bin/env python3
"""
Generate Supabase-compatible SQL upsert scripts from CSV exports.
Reads CSVs from /home/fiveftslim/debriefed-ai-lab/ and outputs SQL files
in the same directory as this script.

Usage: python3 generate-upsert-sql.py
"""

import csv
import os
import sys

CSV_DIR = "/home/fiveftslim/debriefed-ai-lab"
OUT_DIR = os.path.dirname(os.path.abspath(__file__))


def sql_escape(val: str) -> str:
    """Escape a string for SQL single-quoted literal."""
    if val is None:
        return "NULL"
    return val.replace("'", "''")


def sql_value(val: str, col_type: str) -> str:
    """Format a CSV value as a SQL literal based on column type."""
    if val is None or val.strip() == "":
        if col_type == "text[]":
            return "'{}'::TEXT[]"
        return "NULL"

    if col_type == "text[]":
        # CSV stores arrays as: ["val1","val2","val3"]
        # Convert to Postgres array literal: '{"val1","val2","val3"}'
        cleaned = val.strip()
        if cleaned.startswith("[") and cleaned.endswith("]"):
            # Parse JSON-style array, convert to Postgres array literal
            inner = cleaned[1:-1]
            if not inner.strip():
                return "'{}'::TEXT[]"
            # Split by '","' pattern, handling edge cases
            items = []
            import json
            try:
                parsed = json.loads(cleaned)
                for item in parsed:
                    items.append(sql_escape(str(item)))
                return "'{\"" + '","'.join(items) + "\"}'::TEXT[]"
            except (json.JSONDecodeError, TypeError):
                # Fallback: treat as Postgres array literal already
                return "'" + sql_escape(cleaned) + "'::TEXT[]"
        elif cleaned.startswith("{") and cleaned.endswith("}"):
            # Already Postgres array format
            return "'" + sql_escape(cleaned) + "'::TEXT[]"
        else:
            return "'{\"" + sql_escape(cleaned) + "\"}'::TEXT[]"
    elif col_type == "uuid":
        return "'" + sql_escape(val.strip()) + "'::UUID"
    elif col_type == "timestamptz":
        return "'" + sql_escape(val.strip()) + "'::TIMESTAMPTZ"
    else:
        return "'" + sql_escape(val.strip()) + "'"


def generate_mos_to_civilian():
    """Generate upsert SQL for dict_mos_to_civilian (572 rows)."""
    csv_file = os.path.join(CSV_DIR, "dict_mos_to_civilian_rows.csv")
    out_file = os.path.join(OUT_DIR, "20260224_phase1_upsert_mos_to_civilian.sql")

    columns = [
        ("id", "uuid"),
        ("branch", "text"),
        ("military_code", "text"),
        ("military_title", "text"),
        ("civilian_titles", "text[]"),
        ("onet_codes", "text[]"),
        ("industries", "text[]"),
        ("key_skills", "text[]"),
        ("description", "text"),
    ]

    update_cols = [c for c in columns if c[0] != "id"]

    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    col_names = ", ".join(c[0] for c in columns)
    update_set = ",\n    ".join(
        f"{c[0]} = EXCLUDED.{c[0]}" for c in update_cols
    )

    lines = [
        "-- =============================================================================",
        "-- Phase 1: Upsert dict_mos_to_civilian (572 rows)",
        "-- Source: /home/fiveftslim/debriefed-ai-lab/dict_mos_to_civilian_rows.csv",
        "-- Run AFTER 20260224_phase1_schema_additions.sql",
        "-- =============================================================================",
        "",
        "BEGIN;",
        "",
    ]

    for row in rows:
        values = ", ".join(sql_value(row.get(c[0], ""), c[1]) for c in columns)
        lines.append(
            f"INSERT INTO dict_mos_to_civilian ({col_names}) VALUES ({values})\n"
            f"  ON CONFLICT (id) DO UPDATE SET\n"
            f"    {update_set};"
        )

    lines.append("")
    lines.append("COMMIT;")
    lines.append("")

    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"  dict_mos_to_civilian: {len(rows)} rows -> {out_file}")


def generate_military_jargon():
    """Generate upsert SQL for dict_military_jargon (1,649 rows)."""
    csv_file = os.path.join(CSV_DIR, "dict_military_jargon_rows.csv")
    out_file = os.path.join(OUT_DIR, "20260224_phase1_upsert_military_jargon.sql")

    columns = [
        ("id", "uuid"),
        ("military_term", "text"),
        ("civilian_equivalent", "text"),
        ("context", "text"),
        ("category", "text"),
        ("example_military", "text"),
        ("example_civilian", "text"),
    ]

    update_cols = [c for c in columns if c[0] != "id"]

    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    col_names = ", ".join(c[0] for c in columns)
    update_set = ",\n    ".join(
        f"{c[0]} = EXCLUDED.{c[0]}" for c in update_cols
    )

    lines = [
        "-- =============================================================================",
        "-- Phase 1: Upsert dict_military_jargon (1,649 rows)",
        "-- Source: /home/fiveftslim/debriefed-ai-lab/dict_military_jargon_rows.csv",
        "-- Run AFTER 20260224_phase1_schema_additions.sql",
        "-- =============================================================================",
        "",
        "BEGIN;",
        "",
    ]

    for row in rows:
        values = ", ".join(sql_value(row.get(c[0], ""), c[1]) for c in columns)
        lines.append(
            f"INSERT INTO dict_military_jargon ({col_names}) VALUES ({values})\n"
            f"  ON CONFLICT (id) DO UPDATE SET\n"
            f"    {update_set};"
        )

    lines.append("")
    lines.append("COMMIT;")
    lines.append("")

    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"  dict_military_jargon: {len(rows)} rows -> {out_file}")


def generate_acronyms():
    """Generate upsert SQL for dict_acronyms (1,120 rows)."""
    csv_file = os.path.join(CSV_DIR, "dict_acronyms_rows.csv")
    out_file = os.path.join(OUT_DIR, "20260224_phase1_upsert_acronyms.sql")

    columns = [
        ("id", "uuid"),
        ("acronym", "text"),
        ("full_term", "text"),
        ("civilian_explanation", "text"),
        ("branch", "text"),
        ("category", "text"),
    ]

    update_cols = [c for c in columns if c[0] != "id"]

    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    col_names = ", ".join(c[0] for c in columns)
    update_set = ",\n    ".join(
        f"{c[0]} = EXCLUDED.{c[0]}" for c in update_cols
    )

    lines = [
        "-- =============================================================================",
        "-- Phase 1: Upsert dict_acronyms (1,120 rows)",
        "-- Source: /home/fiveftslim/debriefed-ai-lab/dict_acronyms_rows.csv",
        "-- Run AFTER 20260224_phase1_schema_additions.sql",
        "-- =============================================================================",
        "",
        "BEGIN;",
        "",
    ]

    for row in rows:
        values = ", ".join(sql_value(row.get(c[0], ""), c[1]) for c in columns)
        lines.append(
            f"INSERT INTO dict_acronyms ({col_names}) VALUES ({values})\n"
            f"  ON CONFLICT (id) DO UPDATE SET\n"
            f"    {update_set};"
        )

    lines.append("")
    lines.append("COMMIT;")
    lines.append("")

    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"  dict_acronyms: {len(rows)} rows -> {out_file}")


def generate_phrase_translations():
    """Generate upsert SQL for dict_phrase_translations (1,074 rows)."""
    csv_file = os.path.join(CSV_DIR, "dict_phrase_translations_rows.csv")
    out_file = os.path.join(OUT_DIR, "20260224_phase1_upsert_phrase_translations.sql")

    columns = [
        ("id", "uuid"),
        ("military_phrase", "text"),
        ("civilian_phrase", "text"),
        ("branch", "text"),
        ("category", "text"),
        ("context_notes", "text"),
    ]

    update_cols = [c for c in columns if c[0] != "id"]

    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    col_names = ", ".join(c[0] for c in columns)
    update_set = ",\n    ".join(
        f"{c[0]} = EXCLUDED.{c[0]}" for c in update_cols
    )

    lines = [
        "-- =============================================================================",
        "-- Phase 1: Upsert dict_phrase_translations (1,074 rows)",
        "-- Source: /home/fiveftslim/debriefed-ai-lab/dict_phrase_translations_rows.csv",
        "-- Run AFTER 20260224_phase1_schema_additions.sql",
        "-- =============================================================================",
        "",
        "BEGIN;",
        "",
    ]

    for row in rows:
        values = ", ".join(sql_value(row.get(c[0], ""), c[1]) for c in columns)
        lines.append(
            f"INSERT INTO dict_phrase_translations ({col_names}) VALUES ({values})\n"
            f"  ON CONFLICT (id) DO UPDATE SET\n"
            f"    {update_set};"
        )

    lines.append("")
    lines.append("COMMIT;")
    lines.append("")

    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"  dict_phrase_translations: {len(rows)} rows -> {out_file}")


def generate_onet_crosswalk():
    """Generate CREATE TABLE + data INSERT SQL for dict_onet_crosswalk.

    Reads milx0724.csv, filters for STATUS='A' (active), normalizes
    multiple O*NET codes per row into separate rows.
    Output is split into multiple files for Supabase SQL editor limits.
    """
    csv_file = os.path.join(CSV_DIR, "milx0724.csv")

    # First: CREATE TABLE + RLS + indexes
    schema_file = os.path.join(OUT_DIR, "20260224_phase2_create_onet_crosswalk.sql")

    schema_sql = """-- =============================================================================
-- Phase 2: Create dict_onet_crosswalk table
-- Official DoD Military-to-O*NET Occupation Crosswalk
-- Source: milx0724.csv (DoD DMDC crosswalk, July 2024 release)
-- Run BEFORE the data insert scripts
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS dict_onet_crosswalk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  svc TEXT NOT NULL,
  moc TEXT NOT NULL,
  moc_title TEXT NOT NULL,
  onet_code TEXT,
  onet_title TEXT,
  soc_code TEXT,
  soc_title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_moc ON dict_onet_crosswalk (moc);
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_onet_code ON dict_onet_crosswalk (onet_code);
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_svc ON dict_onet_crosswalk (svc);
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_svc_moc ON dict_onet_crosswalk (svc, moc);

-- RLS: public read access (matches other dict_ tables)
ALTER TABLE dict_onet_crosswalk ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read onet crosswalk"
  ON dict_onet_crosswalk FOR SELECT
  USING (true);

COMMIT;
"""

    with open(schema_file, "w", encoding="utf-8") as f:
        f.write(schema_sql)
    print(f"  onet_crosswalk schema -> {schema_file}")

    # Second: Read CSV and generate data inserts
    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            if row.get("STATUS", "").strip() != "A":
                continue

            svc = sql_escape(row.get("SVC", "").strip())
            moc = sql_escape(row.get("MOC", "").strip())
            moc_title = sql_escape(row.get("MOC_TITLE", "").strip())

            # Primary O*NET/SOC mapping
            onet1 = row.get("ONET1", "").strip()
            onet1_title = row.get("ONET1_TITLE", "").strip()
            soc1 = row.get("SOC1", "").strip()
            soc1_title = row.get("SOC1_TITLE", "").strip()

            # Always insert primary row
            rows.append({
                "svc": svc, "moc": moc, "moc_title": moc_title,
                "onet_code": onet1 if onet1 else None,
                "onet_title": onet1_title if onet1_title else None,
                "soc_code": soc1 if soc1 else None,
                "soc_title": soc1_title if soc1_title else None,
            })

            # Additional O*NET mappings (ONET2-4)
            for i in range(2, 5):
                onet_code = row.get(f"ONET{i}", "").strip()
                onet_title = row.get(f"ONET{i}_TITLE", "").strip()
                soc_code = row.get(f"SOC{i}", "").strip()
                soc_title = row.get(f"SOC{i}_TITLE", "").strip()
                if onet_code or soc_code:
                    rows.append({
                        "svc": svc, "moc": moc, "moc_title": moc_title,
                        "onet_code": sql_escape(onet_code) if onet_code else None,
                        "onet_title": sql_escape(onet_title) if onet_title else None,
                        "soc_code": sql_escape(soc_code) if soc_code else None,
                        "soc_title": sql_escape(soc_title) if soc_title else None,
                    })

    print(f"  onet_crosswalk: {len(rows)} total rows (normalized from active records)")

    # Split into parts of 5,000 rows each
    CHUNK_SIZE = 5000
    part_num = 0
    for i in range(0, len(rows), CHUNK_SIZE):
        part_num += 1
        chunk = rows[i:i + CHUNK_SIZE]
        part_file = os.path.join(
            OUT_DIR,
            f"20260224_phase2_onet_data_part{part_num}.sql"
        )

        lines = [
            f"-- =============================================================================",
            f"-- Phase 2: dict_onet_crosswalk data — Part {part_num}",
            f"-- Rows {i + 1} to {i + len(chunk)} of {len(rows)}",
            f"-- Source: milx0724.csv (active records only, normalized)",
            f"-- Run AFTER 20260224_phase2_create_onet_crosswalk.sql",
            f"-- =============================================================================",
            "",
            "BEGIN;",
            "",
        ]

        for r in chunk:
            onet_code = f"'{r['onet_code']}'" if r["onet_code"] else "NULL"
            onet_title = f"'{r['onet_title']}'" if r["onet_title"] else "NULL"
            soc_code = f"'{r['soc_code']}'" if r["soc_code"] else "NULL"
            soc_title = f"'{r['soc_title']}'" if r["soc_title"] else "NULL"

            lines.append(
                f"INSERT INTO dict_onet_crosswalk (svc, moc, moc_title, onet_code, onet_title, soc_code, soc_title) "
                f"VALUES ('{r['svc']}', '{r['moc']}', '{r['moc_title']}', {onet_code}, {onet_title}, {soc_code}, {soc_title}) "
                f"ON CONFLICT DO NOTHING;"
            )

        lines.append("")
        lines.append("COMMIT;")
        lines.append("")

        with open(part_file, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

        print(f"  onet_crosswalk part {part_num}: {len(chunk)} rows -> {part_file}")


if __name__ == "__main__":
    print("Generating Supabase upsert SQL from ai-lab CSV exports...\n")
    print("Phase 1: Dictionary table upserts")
    generate_mos_to_civilian()
    generate_military_jargon()
    generate_acronyms()
    generate_phrase_translations()
    print("\nPhase 2: O*NET crosswalk table + data")
    generate_onet_crosswalk()
    print("\nDone! Review the SQL files before running in Supabase SQL Editor.")
    print("Run order:")
    print("  1. 20260224_phase1_schema_additions.sql")
    print("  2. 20260224_phase1_upsert_mos_to_civilian.sql")
    print("  3. 20260224_phase1_upsert_military_jargon.sql")
    print("  4. 20260224_phase1_upsert_acronyms.sql")
    print("  5. 20260224_phase1_upsert_phrase_translations.sql")
    print("  6. 20260224_phase2_create_onet_crosswalk.sql")
    print("  7. 20260224_phase2_onet_data_part*.sql (in order)")
