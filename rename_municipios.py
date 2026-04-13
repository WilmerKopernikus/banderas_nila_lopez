import os
import re

folder = r"c:\Users\waflo\Desktop\Projects\banderas_nila_lopez\images\banderas\municipios_colombia"

# Pattern: "Name (Department).svg" or "Name (Department)" files
paren_pattern = re.compile(r'^(.+?)\s+\((.+?)\)(\.svg)$', re.IGNORECASE)

files = os.listdir(folder)
svg_files = [f for f in files if f.endswith('.svg')]

# Separate files with and without parentheses
with_parens = {}   # base_name (lowercase) -> list of full filenames
without_parens = set()

for f in svg_files:
    m = paren_pattern.match(f)
    if m:
        base = m.group(1)
        base_lower = base.lower()
        if base_lower not in with_parens:
            with_parens[base_lower] = []
        with_parens[base_lower].append(f)
    else:
        stem = os.path.splitext(f)[0].lower()
        without_parens.add(stem)

renames = []  # (old_name, new_name)

for base_lower, file_list in with_parens.items():
    if len(file_list) > 1:
        # Duplicates: rename "Base (Dept).svg" -> "Base, Dept.svg"
        for fname in file_list:
            m = paren_pattern.match(fname)
            base_name = m.group(1)
            dept = m.group(2)
            ext = m.group(3)
            new_name = f"{base_name}, {dept}{ext}"
            if fname != new_name:
                renames.append((fname, new_name))
    else:
        # Single occurrence: strip parenthetical
        fname = file_list[0]
        m = paren_pattern.match(fname)
        base_name = m.group(1)
        ext = m.group(3)
        new_name = f"{base_name}{ext}"
        # Check if a file without parens already exists for this base
        if base_name.lower() in without_parens:
            # Conflict: there's already a "Base.svg" without parens
            # In this case, treat as if we keep dept to avoid collision
            dept = m.group(2)
            new_name = f"{base_name}, {dept}{ext}"
        if fname != new_name:
            renames.append((fname, new_name))

print(f"Files to rename: {len(renames)}")
print()

# Preview
for old, new in sorted(renames):
    print(f"  {old}")
    print(f"  -> {new}")
    print()

confirm = input("Proceed with renaming? (y/n): ").strip().lower()
if confirm == 'y':
    errors = []
    for old, new in renames:
        old_path = os.path.join(folder, old)
        new_path = os.path.join(folder, new)
        if os.path.exists(new_path) and old_path != new_path:
            errors.append(f"SKIP (already exists): {new}")
            continue
        os.rename(old_path, new_path)
    print(f"\nDone. {len(renames) - len(errors)} files renamed.")
    if errors:
        print("Skipped (conflicts):")
        for e in errors:
            print(f"  {e}")
else:
    print("Cancelled.")
