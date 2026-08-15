#!/usr/bin/env python3
"""Generate the canonical sitemap for the static GitHub Pages site."""
from __future__ import annotations

import html
import json
import re
import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://italoseneadv.com.br"


def git_date(path: Path) -> str:
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", str(path.relative_to(ROOT))],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        value = result.stdout.strip()
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
            return value
    except (OSError, subprocess.CalledProcessError, ValueError):
        pass
    return date.today().isoformat()


def article_dates(path: Path) -> tuple[str | None, str | None]:
    text = path.read_text(encoding="utf-8", errors="replace")
    published = re.search(r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"', text)
    modified = re.search(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"', text)
    return (published.group(1) if published else None, modified.group(1) if modified else None)


def add(items: list[dict[str, str]], path: str, lastmod: str, changefreq: str, priority: str) -> None:
    items.append({"loc": f"{BASE}/{path}" if path else f"{BASE}/", "lastmod": lastmod, "changefreq": changefreq, "priority": priority})


def main() -> None:
    items: list[dict[str, str]] = []
    add(items, "", git_date(ROOT / "index.html"), "weekly", "1.0")
    add(items, "landingpage.html", git_date(ROOT / "landingpage.html"), "monthly", "0.5")

    for path in sorted((ROOT / "areas").glob("*.html")):
        if path.name == "duvidas.html":
            continue
        add(items, f"areas/{path.name}", git_date(path), "monthly", "0.8")

    add(items, "blog/", git_date(ROOT / "blog" / "index.html"), "weekly", "0.9")
    for path in sorted((ROOT / "blog").glob("*.html")):
        if path.name == "index.html":
            continue
        published, modified = article_dates(path)
        add(items, f"blog/{path.name}", modified or published or git_date(path), "yearly", "0.7")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for item in items:
        lines.append(
            "  <url>"
            f"<loc>{html.escape(item['loc'])}</loc>"
            f"<lastmod>{item['lastmod']}</lastmod>"
            f"<changefreq>{item['changefreq']}</changefreq>"
            f"<priority>{item['priority']}</priority>"
            "</url>"
        )
    lines.append("</urlset>")
    output = ROOT / "sitemap.xml"
    output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Generated {len(items)} URLs in {output}")


if __name__ == "__main__":
    main()
