# Portfolio site (justinvoorhees.com) — design spec

## Overview

A single-page personal portfolio for Justin Voorhees: contact info, a
short bio, and a project gallery, all on one scrolling page at `/`.
Design is fully specified in Figma; this spec translates it into a
concrete Next.js implementation and deployment plan.

Figma file: `86GfzCJDYUESIeqLeQnBG1` ("Portfolio")
- Single page (current): node `5099:42812`
- Lightbox reference: node `5085:35496`

> **Revision (2026-09-22, second pivot):** the site was originally
> designed as two pages (Home + `/work`), fully built and reviewed. The
> user then decided to merge everything into one page per a new Figma
> frame (`5099:42812`), dropping the separate `/work` route entirely.
> The job history list that was on the old Home page (Fabric/Typeset/
> SamCart/Nonlinear + dates) is intentionally **not** carried into the
> merged page — confirmed with the user, not an oversight. This spec
> reflects the current (single-page) design; see git history for the
> superseded two-page version.

A second, independent piece of work — republishing the existing
`fabric-tca-decoder` app at `receipts.justinvoorhees.com` — is
explicitly **out of scope** for this spec. That repo's GitHub org
(`withfabricxyz`) has been deleted, so it needs a fresh repo and new
secrets; it will get its own short design pass once this site ships.

## Goals

- Ship `justinvoorhees.com` on Vercel, replacing the current
  (effectively unused) Cargo-hosted site.
- Implement exactly what's in Figma — one page, no CMS, no nav beyond
  what's specified.
- Keep the codebase simple: static, hardcoded content (no MDX, no
  headless CMS) since content changes happen via git commits.

## Non-goals

- No blog/writing section, no `/about`, no standalone photo gallery.
- No separate `/work` route (dropped in the second pivot — see
  Overview) and no job history section (dropped in the same pivot,
  confirmed intentional).
- No persistent site nav/header — the page has no nav anywhere in
  Figma; the four underlined bio terms are same-page anchor links
  (`#receipts`, `#spandex`, `#polychain`, `#structure`) into the
  gallery further down the same page.
- No custom in-page PDF viewer — the Polychain Design System link
  opens the PDF via the browser's native renderer.

> **Revision (2026-09-22, first pivot):** the original plan was to
> commit images and the PDF directly to the repo. In practice the
> "Polychain Design System.pdf" turned out to be 211MB (GitHub
> hard-rejects any file over 100MB) and one image (`spandex_01.png`)
> was 80MB — both impractical to keep in git. All 9 images and the PDF
> now live in Vercel Blob (`portfolio-assets` store) instead; git
> history was rewritten to remove them after this was discovered (see
> Assets section below for the resulting URLs).

## Repo & deployment

- GitHub repo: `github.com/justinvoorhees/.com` (Justin's personal
  account; `receipts` is reserved separately for the decoder follow-up).
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS.
- Vercel project `portfolio` (account `hello-41099863`), with a linked
  Vercel Blob store `portfolio-assets` (public access) holding all
  images and the PDF. GitHub auto-deploy integration still needs to be
  connected via the Vercel dashboard (the CLI's auto-link failed —
  Vercel account has no GitHub login connection yet); until then,
  deploys are manual (`vercel --prod`).
- Custom domain `justinvoorhees.com` attached in Vercel. DNS is
  currently managed at `cargo.site`; records will be updated there per
  Vercel's instructions. The current Cargo site is parked/unused, so
  cutover is low-risk, but I will confirm with Justin immediately
  before making the DNS change since it's still a production flip.

## Page: Home (`/`) — single page

Content and structure (from Figma node `5099:42812`), top to bottom:

1. **Header** (left column): "Justin Voorhees" / "Designer" / blank
   line / `hello@justinvoorhees.com` — mailto link, blue (`#0921ea`).
2. **Bio** (right column, next to the header), three paragraphs (exact
   copy, from Figma):

   > Navigating the melt of product roles from San Diego, CA.
   >
   > Recently I worked with Fabric on Hypersub, <u>Receipts</u>, and
   > <u>spanDEX</u>. In the past I worked with Typeset and SamCart on
   > their creator platforms, and with Nonlinear for <u>Polychain
   > Capital</u> and <u>Structure</u>.
   >
   > I enjoy being a father, long bicycle rides in the dirt, drums,
   > and painting tiny men.

   The four underlined terms are **same-page anchor links** into the
   gallery below:
   - "Receipts" → `#receipts`
   - "spanDEX" → `#spandex`
   - "Polychain Capital" → `#polychain`
   - "Structure" → `#structure`

   Native anchor navigation handles the scroll — no custom JS — plus
   global `scroll-behavior: smooth`.

3. **Gallery** (full width, below the header/bio row): four stacked
   sections, each with an anchor `id` matching the bio's links:
   1. **`#spandex`** — `spandex_01.png`, `spandex_02.png`, label
      "spanDEX" → external link to `https://spandex.sh/`.
   2. **`#receipts`** — `receipts_test.png`, label "Receipts" →
      external link to `https://receipts.justinvoorhees.com`.
   3. **`#polychain`** — `polychain_01.png`, `polychain_02.png`,
      `polychain_03.png`, label "Polychain Design System" → opens the
      PDF's Vercel Blob URL (see Assets) in a new tab; browser renders
      it natively.
   4. **`#structure`** — `structure_01.png`, `structure_02.png`,
      `structure_03.png`, label "Structure Exchange" — plain text, not
      a link (confirmed: no href on this label in Figma).

   More images will be added to these sections over time — the
   section components should make it easy to add another image
   without restructuring.
4. **Footer**: horizontal divider, then the achievements list
   (already-correct external links, `target="_blank"`,
   `rel="noopener noreferrer"`):
   - 2026 Grand Depart, Stagecoach 400 → socalbikepacking.com
   - East Arete, Mount Humphreys → mountainproject.com
   - East Face, Mount Darwin → summitpost.org
   - Kolob Canyon, Zion NP → ropewiki.com
   - Marble Fork Kaweah (Chrysalis), Sequoia NP → ropewiki.com
   - Tourist → album.link
   - "👀" — plain italic text, no link, last item in the list.

Layout: Figma spec is a 1000px-wide content column (header + bio share
a row at the top, gallery spans the full 1000px below). Implementation
uses a responsive centered container with `max-width: 1000px` and side
padding for narrower viewports; header and bio stack vertically below
some breakpoint since Figma's fixed side-by-side positions don't
translate directly to mobile width.

### Lightbox

Clicking any gallery image opens a fullscreen overlay: a
`rgba(26,26,26,0.5)` scrim with `backdrop-blur`, the clicked image
shown large and centered (per Figma node `5085:35496`). Not specified
in Figma: closing behavior — implementation closes on click-outside
(clicking the scrim) or Escape key, since that's the standard pattern
for this kind of overlay.

## Assets

- **Images and PDF**: hosted in the Vercel Blob store `portfolio-assets`
  (public access, base `https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com`).
  Referenced by plain URL string in `content/work.ts` — not statically
  imported, since they're remote. Local copies remain in `assets/img/`
  and `assets/Polychain Design System.pdf` for reference only, gitignored
  (not committed — see the first-pivot Revision note for why). The
  exact URLs (all under the base URL above):
  - `spandex_01.png`, `spandex_02.png`, `receipts_test.png`,
    `polychain_01.png`, `polychain_02.png`, `polychain_03.png`,
    `structure_01.png`, `structure_02.png`, `structure_03.png`
  - PDF → `Polychain%20Design%20System.pdf`
- **Image sizing (2026-09-22 fix):** the original exports were far
  larger than needed (up to 11240px wide, ~125MB total — `spandex_01`
  alone was 80MB, making the page unusably slow on mobile). All 9 were
  resized to 2000px max width and re-uploaded to the same Blob
  pathnames (URLs unchanged, no code impact). New total ~9.35MB.
- Since these are remote URLs (not static imports), gallery images
  render via plain `<img>` tags rather than `next/image` — avoids
  needing `next.config.ts` `images.remotePatterns` configuration and
  explicit width/height for a Next.js-optimized remote image.
  Responsive sizing is handled with CSS. To avoid layout shift as
  images load, each `<img>` carries an explicit `width`/`height` (or
  CSS `aspect-ratio`) matching its known aspect ratio from Figma, and
  every image below the first uses `loading="lazy"`.
- **Font** (`assets/ABCDiatypeVariable.ttf`): unaffected by the above —
  still committed to git (small file, ~700KB) and loaded via
  `next/font/local`, self-hosted at build time.

## Styling tokens (from Figma)

- Background: `#fafafa`
- Text: `#191414`
- Link (mailto): `#0921ea`
- Font: ABC Diatype Variable, 16px body text
- Underline style: `text-underline-position: from-font`,
  `text-decoration-skip-ink: none` — applied globally to all `<a>`
  elements (mailto, bio anchors, gallery labels, achievement links),
  since every underline on the page uses this styling per Figma.

## Testing plan

- `next build` succeeds with no type errors.
- A test asserts the bio's four anchor hrefs (`#receipts`, `#spandex`,
  `#polychain`, `#structure`) are derived from `content/work.ts`'s
  section ids rather than restated as separate literals in both
  places — otherwise a renamed section id could silently break a bio
  link with no test failure anywhere.
- Manual pass in the browser (dev server) before calling this done:
  - Header, bio, gallery, and footer all render correctly; all four
    bio links jump to and highlight the correct gallery section;
    mailto link and achievement links point to the right URLs.
  - Gallery renders all four sections in order with correct images
    and labels; spanDEX and Receipts labels link out correctly;
    Polychain Design System label opens the PDF; Structure Exchange
    label is plain text.
  - Lightbox opens on image click, shows the correct image, closes on
    click-outside and Escape.
  - Spot-check at mobile width (~400px) — no horizontal scroll,
    header/bio stack sensibly, images reflow without excessive layout
    shift as they load.

## Follow-up (not part of this spec)

Once this site is live, do a short separate design pass for migrating
`fabric-tca-decoder` into a new repo (new secrets, since the old
GitHub org is gone) and deploying it to
`receipts.justinvoorhees.com`.
