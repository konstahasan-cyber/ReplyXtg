#!/usr/bin/env python3
"""
Turns the Next.js static export (out/) into a plain-HTML site that opens with a
double-click (file://): flat .html files, one style.css, one site.js, images/ and
fonts/. No framework JavaScript, no server. Interactivity comes from site.js.

Usage: python3 scripts/simple-html/build.py   (run after `npm run export`)
"""
import json
import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "out"
DIST = ROOT / "site"
HERE = pathlib.Path(__file__).resolve().parent

PAGES = {
    "/": "index.html",
    "/about/": "about.html",
    "/custom-home-building/": "custom-home-building.html",
    "/design-build/": "design-build.html",
    "/home-designs/": "home-designs.html",
    "/home-designs/riverstone-residence/": "riverstone-residence.html",
    "/home-designs/sierra-retreat/": "sierra-retreat.html",
    "/home-designs/oak-meadow-house/": "oak-meadow-house.html",
    "/process/": "process.html",
    "/service-areas/": "service-areas.html",
    "/service-areas/sacramento/": "sacramento-custom-homes.html",
    "/service-areas/folsom/": "folsom-custom-homes.html",
    "/service-areas/elk-grove/": "elk-grove-custom-homes.html",
    "/contact/": "contact.html",
    "/planner/": "planner.html",
    "/privacy/": "privacy.html",
    "/terms/": "terms.html",
}


def target(path: str) -> str | None:
    key = path if path.endswith("/") else path + "/"
    return PAGES.get(key)


def rewrite_href(m: re.Match) -> str:
    attr, url = m.group(1), m.group(2)
    path, rest = re.match(r"([^?#]*)(.*)", url).groups()
    if path.startswith("/images/"):
        return f'{attr}="{path[1:]}{rest}"'
    page = target(path)
    if page:
        return f'{attr}="{page}{rest}"'
    return m.group(0)


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    (DIST / "fonts").mkdir(parents=True)
    shutil.copytree(OUT / "images", DIST / "images")
    shutil.copy(OUT / "icon.svg", DIST / "icon.svg")

    # One stylesheet; fonts copied next to it.
    css_parts = []
    for css in sorted((OUT / "_next" / "static").rglob("*.css")):
        css_parts.append(css.read_text())
    css = "\n".join(css_parts)
    for font in (OUT / "_next" / "static" / "media").glob("*"):
        shutil.copy(font, DIST / "fonts" / font.name)
    css = re.sub(r"url\((['\"]?)(?:/_next/static/|\.\./)media/", r"url(\1fonts/", css)
    css += "\n" + (HERE / "extra.css").read_text()
    (DIST / "style.css").write_text(css)

    data = subprocess.run(
        ["node", "--experimental-strip-types", "--no-warnings", str(HERE / "data.mts")],
        check=True, capture_output=True, text=True, cwd=ROOT,
    ).stdout
    js = (HERE / "site.js").read_text().replace("/*__DATA__*/null", data)
    (DIST / "site.js").write_text(js)

    for route, name in {**PAGES, "/404/": "404.html"}.items():
        src = OUT / "404.html" if route == "/404/" else OUT / route.strip("/") / "index.html"
        html = src.read_text()
        # Drop framework scripts, preloads and RSC payloads; keep JSON-LD and the tiny inline js-class script.
        html = re.sub(r"<script[^>]*src=\"/_next/[^\"]*\"[^>]*></script>", "", html)
        html = re.sub(r"<script>\(?self\.__next_f[\s\S]*?</script>", "", html)
        html = re.sub(r"<script>[^<]*__next_f[\s\S]*?</script>", "", html)
        html = re.sub(r"<link[^>]*rel=\"(?:preload|modulepreload)\"[^>]*/?>", "", html)
        html = re.sub(r"<link[^>]*rel=\"stylesheet\"[^>]*/?>", "", html)
        html = re.sub(r"<link[^>]*href=\"/_next/[^\"]*\"[^>]*/?>", "", html)
        html = html.replace("</head>", '<link rel="stylesheet" href="style.css"/></head>', 1)
        html = html.replace("</body>", '<script src="site.js"></script></body>', 1)
        html = re.sub(r"(href|src)=\"(/[^\"]*)\"", rewrite_href, html)
        html = html.replace('href="/icon.svg', 'href="icon.svg')
        (DIST / name).write_text(html)

    (DIST / "README.txt").write_text(
        "Aurelia Grove Custom Homes — concept website (fictional company)\n\n"
        "Open index.html with a double-click. Everything works offline in your browser.\n"
        "Откройте index.html двойным кликом. Всё работает в браузере без интернета и без установки.\n"
    )
    print(f"Plain-HTML site written to {DIST.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
