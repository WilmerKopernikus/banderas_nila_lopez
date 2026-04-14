"""
Rename SVG files in municipios_colombia/ to match municipalities.js exactly.
Every file should be 'Municipio, Departamento.svg'.
Only processes entries S through Z (inclusive).
Reports:
  - Files renamed
  - Municipalities without a file
  - Files with no matching municipality
"""

import re
import unicodedata
from pathlib import Path

# ── 1. Load municipalities list ────────────────────────────────────────────
muni_js = open('municipalities.js', encoding='utf-8').read()
all_entries = re.findall(r"'([^']+)'", muni_js)

def base_letter(s):
    """Return uppercase ASCII base letter (strips accents)."""
    ch = unicodedata.normalize('NFD', s[0])
    base = ''.join(c for c in ch if unicodedata.category(c) != 'Mn')
    return base.upper()

# Only S–Z inclusive
entries = [e for e in all_entries if base_letter(e) >= 'S']
print(f"Municipalities to process (S–Z): {len(entries)}")

# ── 2. Helper: normalize for fuzzy matching ────────────────────────────────
def norm(s):
    return unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode().strip()

# ── 3. Build lookup map of existing files ─────────────────────────────────
FOLDER = Path('images/banderas/municipios_colombia')

def build_lookup():
    """Map several normalized keys → Path for each .svg file."""
    lookup = {}
    for fpath in FOLDER.glob('*.svg'):
        stem = fpath.stem  # filename without .svg

        # key 1: exact normalized stem
        lookup[norm(stem)] = fpath

        # key 2: convert old parentheses format "Name (Dept)" → "name, dept"
        converted = re.sub(r'\s*\(([^)]+)\)', r', \1', stem)
        lookup[norm(converted)] = fpath

        # key 3: just the base name before any comma or parenthesis
        base = re.split(r'[,(]', stem)[0].strip()
        # Only add base key if not already claimed (avoids wrong matches)
        bk = norm(base)
        if bk not in lookup:
            lookup[bk] = fpath

    return lookup

# ── 4. Main loop ──────────────────────────────────────────────────────────
renamed     = []   # (old_name, new_name)
already_ok  = []   # target already exists
not_found   = []   # no matching file

for entry in entries:
    target_path = FOLDER / (entry + '.svg')

    # Already correct?
    if target_path.exists():
        already_ok.append(entry)
        continue

    # Rebuild lookup each iteration so renames are reflected
    lookup = build_lookup()

    # Try several keys for this entry
    base = entry.split(', ')[0].strip()
    dept = entry.split(', ')[1].strip() if ', ' in entry else ''

    candidates = [
        norm(entry),                        # "abejorral, antioquia"
        norm(base),                          # "abejorral"
        norm(f"{base} ({dept})") if dept else None,  # "abejorral (antioquia)"
    ]

    found = None
    for key in candidates:
        if key and key in lookup:
            candidate = lookup[key]
            # Make sure we're not accidentally grabbing a file for a different dept
            # Verify: if candidate has a dept in its name, it should match
            cst = norm(candidate.stem)
            cdept = dept.lower() if dept else ''
            # Accept if: no dept in filename, OR dept matches, OR after norm both match
            has_dept_in_name = ',' in candidate.stem or '(' in candidate.stem
            if has_dept_in_name:
                # Only accept if department matches
                if cdept and norm(cdept) not in cst:
                    continue
            found = candidate
            break

    if found:
        if found != target_path:
            found.rename(target_path)
            renamed.append((found.name, entry + '.svg'))
        else:
            already_ok.append(entry)
    else:
        not_found.append(entry)

# ── 5. Find orphan files (A–R range, no matching municipality) ─────────────
target_names = {e + '.svg' for e in entries}
orphans = sorted(
    f.name for f in FOLDER.glob('*.svg')
    if base_letter(f.name) <= 'R' and f.name not in target_names
)

# ── 6. Report ─────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print(f"RENOMBRADOS: {len(renamed)}")
for old, new in renamed:
    print(f"  '{old}'  →  '{new}'")

print(f"\n{'='*60}")
print(f"YA CORRECTOS (sin cambio): {len(already_ok)}")

print(f"\n{'='*60}")
print(f"MUNICIPIOS SIN ARCHIVO: {len(not_found)}")
for m in not_found:
    print(f"  ✗  {m}")

print(f"\n{'='*60}")
print(f"ARCHIVOS SIN MUNICIPIO CORRESPONDIENTE: {len(orphans)}")
for f in orphans:
    print(f"  ?  {f}")

print(f"\n{'='*60}")
print(f"RESUMEN: {len(renamed)} renombrados | {len(already_ok)} ya OK | "
      f"{len(not_found)} sin archivo | {len(orphans)} huérfanos")
