#!/usr/bin/env python3
"""Generate the canonical sitemap for the static GitHub Pages site."""
from __future__ import annotations

import gzip
import html
import json
import re
import subprocess
from datetime import date
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent if SCRIPT_DIR.name == "scripts" else SCRIPT_DIR
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


def article_title(path: Path) -> str:
    text = path.read_text(encoding="utf-8", errors="strict")
    match = re.search(r"<h1(?:\s[^>]*)?>(.*?)</h1>", text, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        raise ValueError(f"Article has no h1 title: {path.relative_to(ROOT)}")
    title = re.sub(r"<[^>]+>", "", match.group(1))
    return " ".join(html.unescape(title).split())


def update_html_sitemap(article_paths: list[Path]) -> None:
    dated_articles = []
    for path in article_paths:
        published, modified = article_dates(path)
        dated_articles.append((modified or published or git_date(path), path.name, article_title(path)))
    dated_articles.sort(key=lambda item: (item[0], item[1]), reverse=True)

    links = "".join(
        f'<li><a href="/blog/{html.escape(filename, quote=True)}">{html.escape(title)}</a></li>'
        for _, filename, title in dated_articles
    )
    output = ROOT / "sitemap.html"
    source = output.read_text(encoding="utf-8", errors="strict")
    updated, replacements = re.subn(
        r'(<ul class="sitemap-list">).*?(</ul>)',
        lambda match: f"{match.group(1)}{links}{match.group(2)}",
        source,
        count=1,
        flags=re.DOTALL,
    )
    if replacements != 1:
        raise ValueError("Could not identify the article list in sitemap.html")
    output.write_text(updated, encoding="utf-8")


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
    article_paths = sorted(path for path in (ROOT / "blog").glob("*.html") if path.name != "index.html")
    for path in article_paths:
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
    xml_text = "\n".join(lines) + "\n"
    (ROOT / "sitemap.xml").write_text(xml_text, encoding="utf-8")
    (ROOT / "urllist.txt").write_text(
        "\n".join(item["loc"] for item in items) + "\n",
        encoding="utf-8",
    )
    (ROOT / "sitemap.xml.gz").write_bytes(gzip.compress(xml_text.encode("utf-8"), mtime=0))
    update_html_sitemap(article_paths)
    print(f"Generated {len(items)} synchronized URLs in sitemap.xml, sitemap.xml.gz, sitemap.html and urllist.txt")


if __name__ == "__main__":
    main()
