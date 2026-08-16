#!/usr/bin/env python3
"""Maintain canonical authorship and BreadcrumbList JSON-LD for blog articles."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
AUTHOR_URL = "https://italoseneadv.com.br/#sobre"
BASE_URL = "https://italoseneadv.com.br"
LD_RE = re.compile(r'(<script\s+type=["\']application/ld\+json["\']>\s*)(.*?)(\s*</script>)', re.S | re.I)


def make_breadcrumb(article_url: str, section: str) -> dict:
    return {
        "@type": "BreadcrumbList",
        "@id": f"{article_url}#breadcrumb",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Início", "item": f"{BASE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": "Conteúdos", "item": f"{BASE_URL}/blog/index.html"},
            {"@type": "ListItem", "position": 3, "name": section, "item": article_url},
        ],
    }


def update_jsonld(text: str, article_url: str) -> tuple[str, bool]:
    match = LD_RE.search(text)
    if not match:
        return text, False
    try:
        data = json.loads(match.group(2))
    except json.JSONDecodeError:
        return text, False

    if isinstance(data.get("@graph"), list):
        graph = data["@graph"]
        article = next((x for x in graph if isinstance(x, dict) and x.get("@type") == "BlogPosting"), None)
        if article is None:
            return text, False
        if isinstance(article.get("author"), dict):
            article["author"]["url"] = AUTHOR_URL
        section = article.get("articleSection", "Conteúdos jurídicos")
        if not any(isinstance(x, dict) and x.get("@type") == "BreadcrumbList" for x in graph):
            graph.append(make_breadcrumb(article_url, section))
        else:
            return text, False
        new_data = data
    elif isinstance(data, dict) and data.get("@type") == "BlogPosting":
        if isinstance(data.get("author"), dict):
            data["author"]["url"] = AUTHOR_URL
        section = data.get("articleSection", "Conteúdos jurídicos")
        new_data = {"@context": data.get("@context", "https://schema.org"), "@graph": [data, make_breadcrumb(article_url, section)]}
    else:
        return text, False

    rendered = json.dumps(new_data, ensure_ascii=False, indent=2)
    updated = text[:match.start(2)] + rendered + text[match.end(2):]
    return updated, True


changed = 0
for path in sorted((ROOT / "blog").glob("*.html")):
    if path.name == "index.html":
        continue
    text = path.read_text(encoding="utf-8")
    article_url = f"{BASE_URL}/blog/{path.name}"
    updated, did_change = update_jsonld(text, article_url)
    if did_change:
        path.write_text(updated, encoding="utf-8")
        changed += 1

print(f"Updated JSON-LD in {changed} articles")
