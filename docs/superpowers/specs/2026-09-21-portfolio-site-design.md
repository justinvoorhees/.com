# Portfolio site (justinvoorhees.com) — design spec

## Overview

A two-page personal portfolio for Justin Voorhees: a Home page (contact,
bio, work history, achievements) and a `/work` page (project gallery).
Design is fully specified in Figma; this spec translates it into a
concrete Next.js implementation and deployment plan.

Figma file: `86GfzCJDYUESIeqLeQnBG1` ("Portfolio")
- Home: node `5094:36539`
- Work: node `5081:88`
- Work + lightbox reference: node `5085:35496`

A second, independent piece of work — republishing the existing
`fabric-tca-decoder` app at `receipts.justinvoorhees.com` — is
explicitly **out of scope** for this spec. That repo's GitHub org
(`withfabricxyz`) has been deleted, so it needs a fresh repo and new
secrets; it will get its own short design pass once this site ships.

## Goals

- Ship `justinvoorhees.com` on Vercel, replacing the current
  (effectively unused) Cargo-hosted site.
- Implement exactly what's in Figma — no additional pages, no CMS, no
  nav beyond what's specified.
- Keep the codebase simple: static, hardcoded content (no MDX, no
  headless CMS) since content changes happen via git commits.

## Non-goals

- No blog/writing section, no `/about`, no standalone photo gallery —
  dropped from an earlier draft of this spec once the actual Figma
  designs (Home + `/work` only) were provided.
- No persistent site nav/header. Confirmed against the Figma file:
  there is no nav component anywhere in it. The only entry point into
  `/work` is the four underlined terms in the Home bio paragraph.
  There is no link back to Home from `/work` — browser back only.
- No image CMS/blob storage — images commit directly to the repo
  (confirmed acceptable given the small number of images).
- No custom in-page PDF viewer — the Polychain Design System link
  opens the PDF via the browser's native renderer.

## Repo & deployment

- New GitHub repo `portfolio` under Justin's personal GitHub account
  (this directory becomes that repo).
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS.
- Vercel project connected to the repo via GitHub integration;
  push to `main` auto-deploys to production.
- Custom domain `justinvoorhees.com` attached in Vercel. DNS is
  currently managed at `cargo.site`; records will be updated there per
  Vercel's instructions. The current Cargo site is parked/unused, so
  cutover is low-risk, but I will confirm with Justin immediately
  before making the DNS change since it's still a production flip.

## Page: Home (`/`)

Content and structure (from Figma node `5094:36539`), top to bottom:

1. `hello@justinvoorhees.com` — mailto link, blue (`#0921ea`).
2. Bio paragraph (exact copy, from Figma):

   > Navigating the melt of product roles from San Diego, CA. Recently
   > I worked with Fabric on Hypersub, <u>Receipts</u>, and
   > <u>spanDEX</u>. In the past I worked with Typeset and SamCart on
   > their creator platforms, and with Nonlinear for <u>Polychain
   > Capital</u> and <u>Structure</u>.
   >
   > I enjoy being a father, long bicycle rides in the dirt, drums,
   > and painting tiny men.

   The four underlined terms are links to sections on `/work`:
   - "Receipts" → `/work#receipts`
   - "spanDEX" → `/work#spandex`
   - "Polychain Capital" → `/work#polychain`
   - "Structure" → `/work#structure`

   These are the **only** entry points into `/work` anywhere on the
   site. Native anchor navigation handles the scroll — no custom JS —
   plus global `scroll-behavior: smooth`.

3. Job history (plain text, not linked):
   - Fabric, Designer — Aug 2024 - Sep 2026
   - Typeset, Designer — Aug 2023 - Apr 2024
   - SamCart, Designer — Feb 2022 - Aug 2023
   - Nonlinear, Junior Designer — Nov 2020 - Feb 2022
4. Horizontal divider.
5. Achievements list, rendered as-is from Figma (already-correct
   external links, `target="_blank"`):
   - 2026 Grand Depart, Stagecoach 400 → socalbikepacking.com
   - East Arete, Mount Humphreys → mountainproject.com
   - East Face, Mount Darwin → summitpost.org
   - Kolob Canyon, Zion NP → ropewiki.com
   - Marble Fork Kaweah (Chrysalis), Sequoia NP → ropewiki.com
   - Tourist → album.link

Layout: single column, Figma spec is 600px wide centered in a
1440px frame; implementation uses a responsive centered container
with `max-width: 600px` and side padding for narrower viewports.

## Page: Work (`/work`)

Four stacked sections (from Figma node `5081:88`), each with an
anchor `id` matching the Home page's links:

1. **`#spandex`** — `spandex_01.png`, `spandex_02.png`, label
   "spanDEX" → external link to `https://spandex.sh/`.
2. **`#receipts`** — `receipts_test.png`, label "Receipts" →
   external link to `https://receipts.justinvoorhees.com`.
3. **`#polychain`** — `polychain_01.png`, `polychain_02.png`,
   `polychain_03.png`, label "Polychain Design System" → opens
   `public/polychain-design-system.pdf` (copied from
   `assets/Polychain Design System.pdf`) in a new tab; browser
   renders it natively.
4. **`#structure`** — `structure_01.png`, `structure_02.png`,
   `structure_03.png`, label "Structure Exchange" — plain text, not
   a link (confirmed: no href on this label in Figma).

More images will be added to these sections over time — the section
components should make it easy to add another image without
restructuring.

Layout: single column, Figma spec is 800px wide; implementation uses
a responsive centered container with `max-width: 800px`.

### Lightbox

Clicking any image on `/work` opens a fullscreen overlay: a
`rgba(26,26,26,0.5)` scrim with `backdrop-blur`, the clicked image
shown large and centered (per Figma node `5085:35496`). Not specified
in Figma: closing behavior — implementation closes on click-outside
(clicking the scrim) or Escape key, since that's the standard pattern
for this kind of overlay.

## Assets

- **Images** (`assets/img/*.png`): imported directly into components
  via Next's static image import and rendered with `next/image` — no
  need to move them into `/public`; committed to git as-is.
- **Font** (`assets/ABCDiatypeVariable.ttf`): loaded via
  `next/font/local`, self-hosted at build time, referenced by path —
  no move needed.
- **PDF** (`assets/Polychain Design System.pdf`): copied into
  `public/polychain-design-system.pdf` since `/public` is the only
  statically-servable path in Next.js, and it needs a real URL to
  link to.

## Styling tokens (from Figma)

- Background: `#fafafa`
- Text: `#191414`
- Link (mailto): `#0921ea`
- Font: ABC Diatype Variable, 16px body text
- Underline style: `text-underline-position: from-font`,
  `text-decoration-skip-ink: none`

## Testing plan

- `next build` succeeds with no type errors.
- Manual pass in the browser (dev server) before calling this done:
  - Home renders correctly; all four bio links jump to and highlight
    the correct `/work` section; mailto link and achievement links
    point to the right URLs.
  - `/work` renders all four sections in order with correct images
    and labels; spanDEX and Receipts labels link out correctly;
    Polychain Design System label opens the PDF; Structure Exchange
    label is plain text.
  - Lightbox opens on image click, shows the correct image, closes on
    click-outside and Escape.
  - Spot-check at mobile width (~400px) — no horizontal scroll,
    images and text reflow sensibly.

## Follow-up (not part of this spec)

Once this site is live, do a short separate design pass for migrating
`fabric-tca-decoder` into a new repo (new secrets, since the old
GitHub org is gone) and deploying it to
`receipts.justinvoorhees.com`.
