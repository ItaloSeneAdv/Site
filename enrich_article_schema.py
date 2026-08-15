#!/usr/bin/env python3
"""Add the author's canonical profile URL to every BlogPosting JSON-LD block."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
AUTHOR_URL = "https://italoseneadv.com.br/#sobre"
pattern = re.compile(r'("author"\s*:\s*\{\s*"@type"\s*:\s*"Person",\s*"name"\s*:\s*"Ítalo Sêne",)(\s*)')

changed = 0
for path in sorted((ROOT / "blog").glob("*.html")):
    if path.name == "index.html":
        continue
    text = path.read_text(encoding="utf-8")
    if AUTHOR_URL in text:
        continue
    updated, count = pattern.subn(r'\1\n      "url": "' + AUTHOR_URL + r'",\2', text, count=1)
    if count:
        path.write_text(updated, encoding="utf-8")
        changed += 1

print(f"Updated author profile URL in {changed} articles")
