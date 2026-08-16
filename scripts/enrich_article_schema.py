#!/usr/bin/env python3
"""Maintain canonical authorship and BreadcrumbList JSON-LD for blog articles."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
AUTHOR_URL = "https://italoseneadv.com.br/#sobre"
BASE_URL = "https://italoseneadv.com.br"


def add_author_url(text: str) -> tuple[str, bool]:
    if AUTHOR_URL in text:
        return text, False
    pattern = re.compile(
        r'("author"\s*:\s*\{\s*"@type"\s*:\s*"Person",\s*"name"\s*:\s*"Ítalo Sêne",)(\s*)'
    )
    updated, count = pattern.subn(
        r'\1\n      "url": "' + AUTHOR_URL + r'",\2', text, count=1
    )
    return updated, bool(count)


def add_breadcrumb(text: str, article_url: str) -> tuple[str, bool]:
    if '"@type": "BreadcrumbList"' in text:
        return text, False

    section_match = re.search(r'"articleSection"\s*:\s*"([^"]+)"', text)
    section = section_match.group(1) if section_match else "Conteúdos jurídicos"
    marker = f'      "articleSection": "{section}"\n    }}\n  ]'
    replacement = f'''      "articleSection": "{section}"
    }},
    {{
      "@type": "BreadcrumbList",
      "@id": "{article_url}#breadcrumb",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Início",
          "item": "{BASE_URL}/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "Conteúdos",
          "item": "{BASE_URL}/blog/index.html"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "{section}",
          "item": "{article_url}"
        }}
      ]
    }}
  ]'''
    if marker not in text:
        return text, False
    return text.replace(marker, replacement, 1), True


author_changed = 0
breadcrumb_changed = 0
for path in sorted((ROOT / "blog").glob("*.html")):
    if path.name == "index.html":
        continue
    text = path.read_text(encoding="utf-8")
    article_url = f"{BASE_URL}/blog/{path.name}"
    text, changed_author = add_author_url(text)
    text, changed_breadcrumb = add_breadcrumb(text, article_url)
    if changed_author or changed_breadcrumb:
        path.write_text(text, encoding="utf-8")
    author_changed += int(changed_author)
    breadcrumb_changed += int(changed_breadcrumb)

print(f"Updated author profile URL in {author_changed} articles")
print(f"Added BreadcrumbList in {breadcrumb_changed} articles")
