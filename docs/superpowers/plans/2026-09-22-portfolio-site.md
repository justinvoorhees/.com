# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two-page Next.js portfolio site (`/` and `/work`) exactly as specified in the design spec, with automated tests covering all links, anchors, and the lightbox interaction.

**Architecture:** A single Next.js (App Router) project with two routes. Home (`/`) is a static server component with hardcoded bio/job/achievement content. `/work` is a server component that passes static section data (image imports + labels/links) into a client component (`WorkGallery`) that owns the lightbox open/close state. No CMS, no data fetching, no nav.

**Tech Stack:** Next.js ^15, React ^19, TypeScript ^5.4, Tailwind CSS ^4 (CSS-based config, no `tailwind.config.ts`), Vitest ^2 + React Testing Library for tests.

**Spec:** `docs/superpowers/specs/2026-09-21-portfolio-site-design.md`

## Global Constraints

- Node 20 (matches the environment this was planned in).
- Next.js `^15.0.0`, React `^19.0.0`, TypeScript `^5.4.0`, Tailwind `^4.0.0` — pinned to match these floors.
- Design tokens (exact values, from the spec): background `#fafafa`, text `#191414`, link `#0921ea`, font "ABC Diatype Variable" loaded from `assets/ABCDiatypeVariable.ttf`.
- No nav/header component anywhere. The only entry points into `/work` are the four underlined terms in the Home bio paragraph (`Receipts`, `spanDEX`, `Polychain Capital`, `Structure`), linking to `/work#receipts`, `/work#spandex`, `/work#polychain`, `/work#structure` respectively.
- Images live in `assets/img/*.png` and are imported directly into components (not moved to `/public`). The PDF is the one exception — copied into `public/` because `/public` is the only statically-servable path in Next.js.
- Deployment (GitHub repo creation, Vercel project, custom domain/DNS cutover) is explicitly **out of scope for this plan** — it involves live logins and a DNS panel change that need direct user participation, and will be done as a guided follow-up once this code is reviewed.

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a buildable Next.js app with import alias `@/*` → project root, and a placeholder Home page at `/`. Later tasks replace `app/page.tsx`'s content but keep this file path.

- [ ] **Step 1: Write `package.json`**

```json
{
	"name": "portfolio",
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"test": "vitest run",
		"typecheck": "tsc --noEmit"
	},
	"dependencies": {
		"next": "^15.0.0",
		"react": "^19.0.0",
		"react-dom": "^19.0.0"
	},
	"devDependencies": {
		"@tailwindcss/postcss": "^4.0.0",
		"@types/node": "^20.14.0",
		"@types/react": "^19.0.0",
		"@types/react-dom": "^19.0.0",
		"tailwindcss": "^4.0.0",
		"typescript": "^5.4.0"
	}
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
	"compilerOptions": {
		"target": "ES2017",
		"lib": ["dom", "dom.iterable", "esnext"],
		"allowJs": true,
		"skipLibCheck": true,
		"strict": true,
		"noEmit": true,
		"esModuleInterop": true,
		"module": "esnext",
		"moduleResolution": "bundler",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"jsx": "preserve",
		"incremental": true,
		"plugins": [{ "name": "next" }],
		"paths": {
			"@/*": ["./*"]
		}
	},
	"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
	"exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Write `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 5: Write `postcss.config.mjs`**

```js
const config = {
	plugins: {
		"@tailwindcss/postcss": {},
	},
};

export default config;
```

- [ ] **Step 6: Write `app/globals.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 7: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Justin Voorhees",
	description: "Portfolio of Justin Voorhees.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
```

- [ ] **Step 8: Write placeholder `app/page.tsx`**

```tsx
export default function HomePage() {
	return <main>Home</main>;
}
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: installs with no errors, creates `package-lock.json`.

- [ ] **Step 10: Verify the project builds**

Run: `npm run build`
Expected: `Compiled successfully`, output shows routes `/` (and no other routes yet).

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts postcss.config.mjs app/
git commit -m "Scaffold Next.js project"
```

---

### Task 2: Testing harness (Vitest + React Testing Library)

**Files:**
- Modify: `package.json` (add devDependencies + confirm `test` script)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/smoke.test.tsx`

**Interfaces:**
- Consumes: nothing beyond Task 1's project.
- Produces: `npm test` runs Vitest with jsdom + `@testing-library/jest-dom` matchers available globally in every later `*.test.tsx` file. Import alias `@/*` resolves the same way it does in the app.

- [ ] **Step 1: Add test dependencies to `package.json`**

Add to `devDependencies` (keep existing entries from Task 1):

```json
		"@testing-library/jest-dom": "^6.5.0",
		"@testing-library/react": "^16.0.0",
		"@vitejs/plugin-react": "^4.3.0",
		"jsdom": "^25.0.0",
		"vitest": "^2.0.0"
```

Run: `npm install`

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
```

- [ ] **Step 3: Write `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Write the failing smoke test**

```tsx
// app/smoke.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function Hello() {
	return <p>hello test harness</p>;
}

describe("test harness", () => {
	it("renders and asserts with jest-dom matchers", () => {
		render(<Hello />);
		expect(screen.getByText("hello test harness")).toBeInTheDocument();
	});
});
```

- [ ] **Step 5: Run the test**

Run: `npx vitest run app/smoke.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts app/smoke.test.tsx
git commit -m "Add Vitest + React Testing Library harness"
```

---

### Task 3: Design tokens, font, and root layout

**Files:**
- Create: `app/fonts.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `assets/ABCDiatypeVariable.ttf` (already present in the repo).
- Produces: a CSS variable `--font-abc-diatype` applied to `<html>`, and Tailwind theme tokens `bg-background`, `text-foreground`, `text-link` usable by every later task's markup.

No automated test for this task: it changes global styling and font loading only, and `app/layout.tsx` renders `<html>`/`<body>`, which React Testing Library cannot mount in jsdom (nested `html` tags). Correctness is verified by the build step below and by the manual browser check in Task 9.

- [ ] **Step 1: Write `app/fonts.ts`**

```ts
import localFont from "next/font/local";

export const abcDiatype = localFont({
	src: "../assets/ABCDiatypeVariable.ttf",
	variable: "--font-abc-diatype",
	display: "swap",
});
```

- [ ] **Step 2: Update `app/globals.css`**

```css
@import "tailwindcss";

@theme {
	--color-background: #fafafa;
	--color-foreground: #191414;
	--color-link: #0921ea;
	--font-sans: var(--font-abc-diatype), ui-sans-serif, system-ui, sans-serif;
}

html {
	scroll-behavior: smooth;
}

body {
	background-color: var(--color-background);
	color: var(--color-foreground);
	font-family: var(--font-sans);
}
```

- [ ] **Step 3: Update `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { abcDiatype } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
	title: "Justin Voorhees",
	description: "Portfolio of Justin Voorhees.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={abcDiatype.variable}>
			<body>{children}</body>
		</html>
	);
}
```

- [ ] **Step 4: Verify the project still builds**

Run: `npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
git add app/fonts.ts app/globals.css app/layout.tsx
git commit -m "Wire up ABC Diatype font and design tokens"
```

---

### Task 4: Work content data + PDF asset

**Files:**
- Create: `content/work.ts`
- Create: `content/work.test.ts`
- Create: `public/polychain-design-system.pdf` (copy of `assets/Polychain Design System.pdf`)

**Interfaces:**
- Consumes: the 9 PNGs already in `assets/img/`.
- Produces: `workSections: WorkSection[]` (type `WorkSection = { id: string; images: { src: StaticImageData | string; alt: string }[]; label: string; href?: string }`), exported from `content/work.ts`. Task 6 (`WorkGallery`) and Task 7 (`/work` page) both import `workSections` and the `WorkSection`/`WorkImage` types from this file.

- [ ] **Step 1: Copy the PDF into `public/`**

Run: `cp "assets/Polychain Design System.pdf" "public/polychain-design-system.pdf"`
Expected: `public/polychain-design-system.pdf` exists (`ls public/` shows it).

- [ ] **Step 2: Write the failing test**

```ts
// content/work.test.ts
import { describe, expect, it } from "vitest";
import { workSections } from "./work";

describe("workSections", () => {
	it("has the four sections in order with the right anchor ids", () => {
		expect(workSections.map((section) => section.id)).toEqual([
			"spandex",
			"receipts",
			"polychain",
			"structure",
		]);
	});

	it("links spanDEX and Receipts labels to their external sites", () => {
		const spandex = workSections.find((section) => section.id === "spandex");
		const receipts = workSections.find((section) => section.id === "receipts");
		expect(spandex?.href).toBe("https://spandex.sh/");
		expect(receipts?.href).toBe("https://receipts.justinvoorhees.com");
	});

	it("links the Polychain Design System label to the local PDF", () => {
		const polychain = workSections.find((section) => section.id === "polychain");
		expect(polychain?.href).toBe("/polychain-design-system.pdf");
	});

	it("does not link the Structure Exchange label", () => {
		const structure = workSections.find((section) => section.id === "structure");
		expect(structure?.href).toBeUndefined();
	});

	it("has the expected image counts per section", () => {
		expect(workSections.map((section) => section.images.length)).toEqual([2, 1, 3, 3]);
	});
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run content/work.test.ts`
Expected: FAIL with "Cannot find module './work'" (file doesn't exist yet).

- [ ] **Step 4: Write `content/work.ts`**

```ts
import type { StaticImageData } from "next/image";
import spandex01 from "@/assets/img/spandex_01.png";
import spandex02 from "@/assets/img/spandex_02.png";
import receiptsTest from "@/assets/img/receipts_test.png";
import polychain01 from "@/assets/img/polychain_01.png";
import polychain02 from "@/assets/img/polychain_02.png";
import polychain03 from "@/assets/img/polychain_03.png";
import structure01 from "@/assets/img/structure_01.png";
import structure02 from "@/assets/img/structure_02.png";
import structure03 from "@/assets/img/structure_03.png";

export type WorkImage = {
	src: StaticImageData | string;
	alt: string;
};

export type WorkSection = {
	id: string;
	images: WorkImage[];
	label: string;
	href?: string;
};

export const workSections: WorkSection[] = [
	{
		id: "spandex",
		images: [
			{ src: spandex01, alt: "spanDEX screen 1" },
			{ src: spandex02, alt: "spanDEX screen 2" },
		],
		label: "spanDEX",
		href: "https://spandex.sh/",
	},
	{
		id: "receipts",
		images: [{ src: receiptsTest, alt: "Receipts screen" }],
		label: "Receipts",
		href: "https://receipts.justinvoorhees.com",
	},
	{
		id: "polychain",
		images: [
			{ src: polychain01, alt: "Polychain Design System 1" },
			{ src: polychain02, alt: "Polychain Design System 2" },
			{ src: polychain03, alt: "Polychain Design System 3" },
		],
		label: "Polychain Design System",
		href: "/polychain-design-system.pdf",
	},
	{
		id: "structure",
		images: [
			{ src: structure01, alt: "Structure Exchange 1" },
			{ src: structure02, alt: "Structure Exchange 2" },
			{ src: structure03, alt: "Structure Exchange 3" },
		],
		label: "Structure Exchange",
	},
];
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run content/work.test.ts`
Expected: PASS (5 tests). Note: under Vitest, importing a `.png` resolves to a plain string (Vite's default asset handling), which satisfies the `StaticImageData | string` type — no mocking needed for this data-only test.

- [ ] **Step 6: Commit**

```bash
git add content/work.ts content/work.test.ts public/polychain-design-system.pdf
git commit -m "Add work page content data and PDF asset"
```

---

### Task 5: Lightbox component

**Files:**
- Create: `components/Lightbox.tsx`
- Create: `components/Lightbox.test.tsx`

**Interfaces:**
- Consumes: nothing project-specific (takes `src`/`alt`/`onClose` as props).
- Produces: `Lightbox` component, exported from `components/Lightbox.tsx`, with props `{ src: StaticImageData | string; alt: string; onClose: () => void }`. Renders a `role="dialog"` element. Task 6 (`WorkGallery`) renders this component when an image is clicked.

This task needs `next/image` mocked so tests don't depend on real image optimization. Add the mock to `vitest.setup.ts` now — it's shared by every later component test too.

- [ ] **Step 1: Add the `next/image` mock to `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

vi.mock("next/image", () => ({
	default: (props: {
		src: { src: string } | string;
		alt: string;
		className?: string;
		sizes?: string;
	}) => {
		const resolvedSrc =
			typeof props.src === "string" ? props.src : props.src.src;
		return React.createElement("img", {
			src: resolvedSrc,
			alt: props.alt,
			className: props.className,
		});
	},
}));
```

- [ ] **Step 2: Write the failing test**

```tsx
// components/Lightbox.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Lightbox } from "./Lightbox";

describe("Lightbox", () => {
	it("renders the given image inside a dialog", () => {
		render(<Lightbox src="spandex-1.png" alt="spanDEX screen 1" onClose={vi.fn()} />);
		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(screen.getByAltText("spanDEX screen 1")).toBeInTheDocument();
	});

	it("calls onClose when the backdrop is clicked", () => {
		const onClose = vi.fn();
		render(<Lightbox src="spandex-1.png" alt="spanDEX screen 1" onClose={onClose} />);
		fireEvent.click(screen.getByRole("dialog"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose when the image itself is clicked", () => {
		const onClose = vi.fn();
		render(<Lightbox src="spandex-1.png" alt="spanDEX screen 1" onClose={onClose} />);
		fireEvent.click(screen.getByAltText("spanDEX screen 1"));
		expect(onClose).not.toHaveBeenCalled();
	});

	it("calls onClose when Escape is pressed", () => {
		const onClose = vi.fn();
		render(<Lightbox src="spandex-1.png" alt="spanDEX screen 1" onClose={onClose} />);
		fireEvent.keyDown(window, { key: "Escape" });
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run components/Lightbox.test.tsx`
Expected: FAIL with "Cannot find module './Lightbox'".

- [ ] **Step 4: Write `components/Lightbox.tsx`**

```tsx
"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect } from "react";

export function Lightbox({
	src,
	alt,
	onClose,
}: {
	src: StaticImageData | string;
	alt: string;
	onClose: () => void;
}) {
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		// biome-ignore-start: dialog is closed via Escape (keydown handler above) as well as click
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,26,0.5)] backdrop-blur-[3px]"
			onClick={onClose}
		>
			<div
				className="max-h-[90vh] max-w-[90vw]"
				onClick={(event) => event.stopPropagation()}
			>
				<Image
					src={src}
					alt={alt}
					className="h-auto max-h-[90vh] w-auto max-w-full"
				/>
			</div>
		</div>
		// biome-ignore-end
	);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/Lightbox.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add vitest.setup.ts components/Lightbox.tsx components/Lightbox.test.tsx
git commit -m "Add Lightbox component"
```

---

### Task 6: WorkGallery component

**Files:**
- Create: `components/WorkGallery.tsx`
- Create: `components/WorkGallery.test.tsx`

**Interfaces:**
- Consumes: `WorkSection`/`WorkImage` types from `@/content/work` (Task 4), `Lightbox` from `@/components/Lightbox` (Task 5).
- Produces: `WorkGallery` component, exported from `components/WorkGallery.tsx`, with props `{ sections: WorkSection[] }`. Renders a `<section id={section.id}>` per section. Task 7 (`/work` page) renders `<WorkGallery sections={workSections} />`.

- [ ] **Step 1: Write the failing test**

```tsx
// components/WorkGallery.test.tsx
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WorkSection } from "@/content/work";
import { WorkGallery } from "./WorkGallery";

const sections: WorkSection[] = [
	{
		id: "spandex",
		images: [{ src: "spandex-1.png", alt: "spanDEX screen 1" }],
		label: "spanDEX",
		href: "https://spandex.sh/",
	},
	{
		id: "structure",
		images: [{ src: "structure-1.png", alt: "Structure Exchange 1" }],
		label: "Structure Exchange",
	},
];

describe("WorkGallery", () => {
	it("renders a section element for each id", () => {
		render(<WorkGallery sections={sections} />);
		expect(document.getElementById("spandex")).toBeInTheDocument();
		expect(document.getElementById("structure")).toBeInTheDocument();
	});

	it("renders a linked label when href is set", () => {
		render(<WorkGallery sections={sections} />);
		const link = screen.getByRole("link", { name: "spanDEX" });
		expect(link).toHaveAttribute("href", "https://spandex.sh/");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("renders a plain text label when href is not set", () => {
		render(<WorkGallery sections={sections} />);
		expect(screen.queryByRole("link", { name: "Structure Exchange" })).not.toBeInTheDocument();
		expect(screen.getByText("Structure Exchange").tagName).toBe("P");
	});

	it("opens the lightbox with the clicked image", () => {
		render(<WorkGallery sections={sections} />);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		fireEvent.click(screen.getByAltText("spanDEX screen 1"));
		const dialog = screen.getByRole("dialog");
		expect(within(dialog).getByAltText("spanDEX screen 1")).toBeInTheDocument();
	});

	it("closes the lightbox when the backdrop is clicked", () => {
		render(<WorkGallery sections={sections} />);
		fireEvent.click(screen.getByAltText("spanDEX screen 1"));
		fireEvent.click(screen.getByRole("dialog"));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/WorkGallery.test.tsx`
Expected: FAIL with "Cannot find module './WorkGallery'".

- [ ] **Step 3: Write `components/WorkGallery.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { WorkImage, WorkSection } from "@/content/work";
import { Lightbox } from "@/components/Lightbox";

export function WorkGallery({ sections }: { sections: WorkSection[] }) {
	const [openImage, setOpenImage] = useState<WorkImage | null>(null);

	return (
		<>
			{sections.map((section) => (
				<section key={section.id} id={section.id} className="flex w-full flex-col gap-5">
					{section.images.map((image) => (
						<button
							key={image.alt}
							type="button"
							className="block w-full cursor-zoom-in text-left"
							onClick={() => setOpenImage(image)}
						>
							<Image
								src={image.src}
								alt={image.alt}
								className="h-auto w-full"
								sizes="(min-width: 800px) 800px, 100vw"
							/>
						</button>
					))}
					{section.href ? (
						<a
							href={section.href}
							target="_blank"
							rel="noopener noreferrer"
							className="underline"
						>
							{section.label}
						</a>
					) : (
						<p>{section.label}</p>
					)}
				</section>
			))}
			{openImage ? (
				<Lightbox
					src={openImage.src}
					alt={openImage.alt}
					onClose={() => setOpenImage(null)}
				/>
			) : null}
		</>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/WorkGallery.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add components/WorkGallery.tsx components/WorkGallery.test.tsx
git commit -m "Add WorkGallery component with lightbox wiring"
```

---

### Task 7: Work page route

**Files:**
- Create: `app/work/page.tsx`
- Create: `app/work/page.test.tsx`

**Interfaces:**
- Consumes: `workSections` from `@/content/work` (Task 4), `WorkGallery` from `@/components/WorkGallery` (Task 6).
- Produces: the `/work` route.

- [ ] **Step 1: Write the failing test**

```tsx
// app/work/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WorkPage from "./page";

describe("WorkPage", () => {
	it("renders all four sections with their anchors", () => {
		render(<WorkPage />);
		expect(document.getElementById("spandex")).toBeInTheDocument();
		expect(document.getElementById("receipts")).toBeInTheDocument();
		expect(document.getElementById("polychain")).toBeInTheDocument();
		expect(document.getElementById("structure")).toBeInTheDocument();
	});

	it("links the Polychain Design System label to the PDF", () => {
		render(<WorkPage />);
		expect(screen.getByRole("link", { name: "Polychain Design System" })).toHaveAttribute(
			"href",
			"/polychain-design-system.pdf",
		);
	});

	it("links the Receipts label to receipts.justinvoorhees.com", () => {
		render(<WorkPage />);
		expect(screen.getByRole("link", { name: "Receipts" })).toHaveAttribute(
			"href",
			"https://receipts.justinvoorhees.com",
		);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/work/page.test.tsx`
Expected: FAIL with "Cannot find module './page'".

- [ ] **Step 3: Write `app/work/page.tsx`**

```tsx
import { WorkGallery } from "@/components/WorkGallery";
import { workSections } from "@/content/work";

export default function WorkPage() {
	return (
		<main className="mx-auto flex max-w-[800px] flex-col gap-10 px-6 py-[200px]">
			<WorkGallery sections={workSections} />
		</main>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/work/page.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Verify the full test suite and build still pass**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds, route list includes `/` and `/work`.

- [ ] **Step 6: Commit**

```bash
git add app/work/page.tsx app/work/page.test.tsx
git commit -m "Add /work page route"
```

---

### Task 8: Home content + page

**Files:**
- Create: `content/home.ts`
- Modify: `app/page.tsx` (replaces Task 1's placeholder)
- Create: `app/page.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks (Home's bio links to `/work#...` anchors are plain hrefs, not a shared constant — matching the anchors defined in Task 4's `workSections` ids by convention).
- Produces: the `/` route with final content. Nothing later depends on this file.

- [ ] **Step 1: Write `content/home.ts`**

```ts
export type Job = {
	company: string;
	role: string;
	dates: string;
};

export type Achievement = {
	label: string;
	suffix: string;
	href: string;
};

export const jobs: Job[] = [
	{ company: "Fabric", role: "Designer", dates: "Aug 2024 - Sep 2026" },
	{ company: "Typeset", role: "Designer", dates: "Aug 2023 - Apr 2024" },
	{ company: "SamCart", role: "Designer", dates: "Feb 2022 - Aug 2023" },
	{ company: "Nonlinear", role: "Junior Designer", dates: "Nov 2020 - Feb 2022" },
];

export const achievements: Achievement[] = [
	{
		label: "2026 Grand Depart",
		suffix: ", Stagecoach 400",
		href: "https://socalbikepacking.com/2026-2/",
	},
	{
		label: "East Arete",
		suffix: ", Mount Humphreys",
		href: "https://www.mountainproject.com/route/106736873/east-arete",
	},
	{
		label: "East Face",
		suffix: ", Mount Darwin",
		href: "https://www.summitpost.org/east-face-right-side/155672",
	},
	{
		label: "Kolob Canyon",
		suffix: ", Zion NP",
		href: "https://ropewiki.com/Kolob_Canyon",
	},
	{
		label: "Marble Fork Kaweah (Chrysalis)",
		suffix: ", Sequoia NP",
		href: "https://ropewiki.com/Conditions:Marble_Fork_Kaweah_River_(Chrysalis)-20200810062413",
	},
	{
		label: "Tourist",
		suffix: "",
		href: "https://album.link/s/3TF4BMhLxpINZElzyEZR4l",
	},
];
```

- [ ] **Step 2: Write the failing test**

```tsx
// app/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
	it("renders the mailto contact link", () => {
		render(<HomePage />);
		const link = screen.getByRole("link", { name: "hello@justinvoorhees.com" });
		expect(link).toHaveAttribute("href", "mailto:hello@justinvoorhees.com");
	});

	it("links each underlined bio term to its /work section", () => {
		render(<HomePage />);
		expect(screen.getByRole("link", { name: "Receipts" })).toHaveAttribute("href", "/work#receipts");
		expect(screen.getByRole("link", { name: "spanDEX" })).toHaveAttribute("href", "/work#spandex");
		expect(screen.getByRole("link", { name: "Polychain Capital" })).toHaveAttribute(
			"href",
			"/work#polychain",
		);
		expect(screen.getByRole("link", { name: "Structure" })).toHaveAttribute("href", "/work#structure");
	});

	it("renders all four job history entries", () => {
		render(<HomePage />);
		expect(screen.getByText("Fabric, Designer")).toBeInTheDocument();
		expect(screen.getByText("Typeset, Designer")).toBeInTheDocument();
		expect(screen.getByText("SamCart, Designer")).toBeInTheDocument();
		expect(screen.getByText("Nonlinear, Junior Designer")).toBeInTheDocument();
	});

	it("renders achievement links with their original hrefs", () => {
		render(<HomePage />);
		expect(screen.getByRole("link", { name: "2026 Grand Depart" })).toHaveAttribute(
			"href",
			"https://socalbikepacking.com/2026-2/",
		);
		expect(screen.getByRole("link", { name: "Tourist" })).toHaveAttribute(
			"href",
			"https://album.link/s/3TF4BMhLxpINZElzyEZR4l",
		);
	});
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run app/page.test.tsx`
Expected: FAIL — the placeholder `HomePage` from Task 1 doesn't render any of these links.

- [ ] **Step 4: Write `app/page.tsx`**

```tsx
import Link from "next/link";
import { achievements, jobs } from "@/content/home";

export default function HomePage() {
	return (
		<main className="mx-auto flex max-w-[600px] flex-col gap-5 px-6 py-[200px]">
			<a href="mailto:hello@justinvoorhees.com" className="text-link">
				hello@justinvoorhees.com
			</a>

			<div className="flex flex-col gap-4">
				<p>
					{"Navigating the melt of product roles from San Diego, CA. Recently I worked with Fabric on Hypersub, "}
					<Link href="/work#receipts" className="underline">
						Receipts
					</Link>
					{", and "}
					<Link href="/work#spandex" className="underline">
						spanDEX
					</Link>
					{". In the past I worked with Typeset and SamCart on their creator platforms, and with Nonlinear for "}
					<Link href="/work#polychain" className="underline">
						Polychain Capital
					</Link>
					{" and "}
					<Link href="/work#structure" className="underline">
						Structure
					</Link>
					{"."}
				</p>
				<p>I enjoy being a father, long bicycle rides in the dirt, drums, and painting tiny men.</p>
			</div>

			<div className="flex flex-col gap-4">
				{jobs.map((job) => (
					<div key={job.company}>
						<p>
							{job.company}, {job.role}
						</p>
						<p>{job.dates}</p>
					</div>
				))}
			</div>

			<hr className="w-full border-t border-black/10" />

			<ul className="flex w-full max-w-[337px] flex-col">
				{achievements.map((achievement) => (
					<li key={achievement.label}>
						<a
							href={achievement.href}
							target="_blank"
							rel="noopener noreferrer"
							className="italic underline"
						>
							{achievement.label}
						</a>
						{achievement.suffix}
					</li>
				))}
			</ul>
		</main>
	);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run app/page.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add content/home.ts app/page.tsx app/page.test.tsx
git commit -m "Add final Home page content"
```

---

### Task 9: Full verification pass

**Files:** none created or modified — this task only runs checks.

**Interfaces:**
- Consumes: the complete app from Tasks 1–8.
- Produces: nothing for later tasks; this is the plan's final gate.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests across every file pass (smoke test from Task 2 can be deleted first, since Task 2's `app/smoke.test.tsx` was only there to prove the harness works — remove it now that real tests exist).

Run: `rm app/smoke.test.tsx`

Run: `npm test`
Expected: PASS, no reference to the deleted smoke test.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `Compiled successfully`, routes `/` and `/work` both listed.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev` (in the background, or in a separate terminal)

Then, in an actual browser, check:
- `http://localhost:3000/` — bio renders with four underlined links; clicking each one navigates to `/work` and scrolls to the matching section; mailto link opens a mail client; achievement links open their target sites in new tabs.
- `http://localhost:3000/work` — all four sections render with their images, in order; spanDEX and Receipts labels open their external sites in new tabs; Polychain Design System label opens the PDF; Structure Exchange label is plain (non-clickable) text; clicking any image opens the fullscreen lightbox, which closes on background click and on Escape.
- Resize the browser to ~400px wide — no horizontal scrolling, text and images reflow correctly.

This step requires an actual browser and cannot be fully automated by an agent without browser tooling — if executing this plan without browser access, run the automated checks above, then explicitly tell the user that the interactive/visual check still needs to happen before calling the feature done.

- [ ] **Step 5: Commit (only if Step 1 produced a change)**

```bash
git add app/smoke.test.tsx
git commit -m "Remove smoke test now that real tests exist"
```

(Note: `git add` on a deleted file stages the deletion; this is correct.)

---

## Self-review notes

- **Spec coverage:** Home content/links (Task 8), Work sections/links/PDF (Tasks 4, 6, 7), lightbox open/close (Tasks 5, 6), fonts/tokens (Task 3), scaffolding/build (Task 1), assets handling — images via static import (Task 4), PDF via `/public` copy (Task 4), no-nav constraint (documented in Global Constraints, nothing to build), responsive check (Task 9 manual pass). Deployment section of the spec is intentionally deferred — called out explicitly in Global Constraints.
- **Placeholder scan:** no TBD/TODO; every step has real, complete code.
- **Type consistency:** `WorkSection`/`WorkImage` defined once in Task 4, imported (not redefined) in Tasks 6 and 7; `Lightbox` props defined in Task 5 match how Task 6 calls it (`src`, `alt`, `onClose`).
