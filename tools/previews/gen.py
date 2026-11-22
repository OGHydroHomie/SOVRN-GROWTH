#!/usr/bin/env python3
"""Generate private, personalized preview pages from the live homepage.

Usage:
  python3 tools/previews/gen.py                 # every prospect in prospects.json
  python3 tools/previews/gen.py crown-restoration dwyer-restoration

Each page is written to site-root/p/<slug>/index.html. It is the homepage's working
dashboard with the owner's name in it, a "what we'd build first" section written for
that company, and booking links that mention the company. Pages are noindex and are
never added to the sitemap.
"""
import html
import json
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "site-root"
HOME = SITE / "index.html"
PROSPECTS = Path(__file__).with_name("prospects.json")

GENERIC_BODY = "Hi%20Elijah%2C%20I%27d%20like%20to%20book%20a%2015-minute%20call.%20Biggest%20headache%20right%20now%3A%20"


def esc(s):
    return html.escape(s, quote=True)


def cut_section(src, section_id):
    """Remove <section class="sec" id="..."> ... </section> (sections do not nest)."""
    m = re.search(r'\n<section class="sec" id="%s"[^>]*>.*?\n</section>\n' % re.escape(section_id), src, re.S)
    if not m:
        raise SystemExit("section not found: " + section_id)
    return src[:m.start()] + "\n" + src[m.end():]


def must_replace(src, old, new, count=1):
    n = src.count(old)
    if n != count:
        raise SystemExit("expected %d of %r, found %d" % (count, old[:70], n))
    return src.replace(old, new)


def build(p, home):
    company, brand, first, last = p["company"], p["brand"], p["first"], p["last"]
    name = p.get("name", brand)  # how the page refers to them; brand is the short dashboard label
    initials = (first[:1] + last[:1]).upper()
    body = urllib.parse.quote("Hi Elijah, I saw the %s preview. Let's set up 15 minutes. " % name, safe="")
    s = home

    # Head: private page, no canonical, no structured data.
    s = re.sub(r"<title>.*?</title>", "<title>%s | Preview by SOVRN Growth</title>" % esc(company), s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="A working preview prepared for %s by SOVRN Growth.">\n<meta name="robots" content="noindex, nofollow">' % esc(company), s, count=1)
    s = re.sub(r'<link rel="canonical"[^>]*>\n', "", s, count=1)
    s = re.sub(r'<meta property="og:[^"]+" content="[^"]*">\n', "", s)
    s = re.sub(r'<script type="application/ld\+json">.*?</script>\n', "", s, count=1, flags=re.S)

    # Header: just the mark and the booking button.
    s = re.sub(r'(<nav class="nav" aria-label="Main">).*?(</nav>)',
               r'\1\n      <a class="btn btn-green btn-sm" href="sms:+15128820814?&amp;body=%s"><span class="long">Book 15 minutes</span><span class="short-lbl">Book a call</span></a>\n    \2' % body,
               s, count=1, flags=re.S)
    s = s.replace('<a class="mark" href="#top"', '<a class="mark" href="https://www.sovrngrowth.com/"', 1)

    # Hero copy.
    s = re.sub(r'<h1 id="hero-h">.*?</h1>', '<p class="prep">Prepared for %s at %s</p>\n    <h1 id="hero-h">%s</h1>' % (esc(first), esc(company), esc(p["h1"])), s, count=1, flags=re.S)
    s = re.sub(r'<p class="lede">.*?</p>', '<p class="lede">%s <strong>Click around. It works.</strong></p>' % esc(p["lede"]), s, count=1, flags=re.S)
    s = must_replace(s, '<a class="btn btn-ghost" href="#build">See what we build</a>', '<a class="btn btn-ghost" href="#first">What we\'d build first</a>')

    # The dashboard belongs to the owner.
    s = must_replace(s, "Good morning, Dana", "Good morning, " + esc(first), count=s.count("Good morning, Dana"))
    s = must_replace(s, "Dana Ortiz", esc(first + " " + last), count=s.count("Dana Ortiz"))
    s = must_replace(s, '<span class="av" aria-hidden="true">DO</span>', '<span class="av" aria-hidden="true">%s</span>' % initials, count=2)
    s = must_replace(s, '<span class="d-logo"></span>Operations</div>', '<span class="d-logo"></span>%s</div>' % esc(brand))

    # Sections: keep the dashboard, the stays/goes strip, how it works and the founder note.
    for sid in ("week", "build", "questions"):
        s = cut_section(s, sid)
    cards = "\n".join('      <article class="first-card glass"><h3>%s</h3><p>%s</p></article>' % (esc(t), esc(b)) for t, b in p["cards"])
    first_sec = ('\n<section class="sec" id="first" aria-labelledby="first-h">\n  <div class="wrap">\n    <div class="sec-h">\n'
                 '      <h2 id="first-h">What we\'d build first for %s</h2>\n'
                 '      <p>Starting points from what we could see from the outside. On a 15-minute call, you tell us what actually eats your week, and we shape it to that.</p>\n'
                 '    </div>\n    <div class="first3">\n%s\n    </div>\n  </div>\n</section>\n') % (esc(name), cards)
    s = must_replace(s, '\n<section class="sec" id="own"', first_sec + '\n<section class="sec" id="own"')

    # Closing call to action.
    s = must_replace(s, "<h2 id=\"final-h\">Tell us what's eating your week.</h2>", '<h2 id="final-h">Let\'s walk through %s together.</h2>' % esc(name))
    s = re.sub(r'(<h2 id="final-h">.*?</h2>\s*)<p>.*?</p>',
               r'\1<p>Fifteen minutes on Zoom or the phone. I\'ll show you this preview shaped around how %s actually runs, and tell you what it would take to build. If it isn\'t worth building, I\'ll say so.</p>' % esc(name).replace("\\", "\\\\"),
               s, count=1, flags=re.S)
    s = s.replace(GENERIC_BODY, body)
    s = re.sub(r'body=Hi%20Elijah%2C%20I%27d%20like%20to%20talk%20about%20a%20custom%20build\.[^"]*', "body=" + body, s)

    # Footer note.
    s = must_replace(s, "<p>SOVRN Growth is operated by Lux Eterna LLC.</p>",
                     "<p>Prepared for %s. This page is private and isn't listed anywhere.</p>\n    <p>SOVRN Growth is operated by Lux Eterna LLC.</p>" % esc(company))

    # Small styles for the pieces this page adds.
    extra = ("\n/* Preview page additions */\n"
             ".prep{display:inline-block;margin:0 auto 22px;padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.04);color:var(--muted);font-size:15px;font-weight:600;letter-spacing:0}\n"
             ".first3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:52px}\n"
             ".first-card{padding:30px 28px 32px}\n"
             ".first-card h3{font-size:23px;letter-spacing:-.015em}\n"
             ".first-card p{margin-top:12px;color:var(--muted);font-size:17px}\n"
             "@media (max-width:900px){.first3{grid-template-columns:minmax(0,1fr)}.first-card{padding:24px}}\n")
    s = must_replace(s, "</style>", extra + "</style>", count=s.count("</style>")) if s.count("</style>") == 1 else s.replace("</style>", extra + "</style>", 1)

    assert "Dana" not in s, "owner name left behind"
    assert "—" not in re.sub(r"<script.*?</script>", "", s, flags=re.S), "em dash in page copy"
    return s


def main():
    home = HOME.read_text()
    prospects = json.loads(PROSPECTS.read_text())
    want = set(sys.argv[1:])
    done = []
    for p in prospects:
        if want and p["slug"] not in want:
            continue
        out = SITE / "p" / p["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build(p, home))
        done.append(p["slug"])
    print("wrote %d preview pages: %s" % (len(done), ", ".join(done)))


if __name__ == "__main__":
    main()
