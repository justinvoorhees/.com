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

	it("links the Polychain Design System label to its Blob-hosted PDF", () => {
		const polychain = workSections.find((section) => section.id === "polychain");
		expect(polychain?.href).toBe(
			"https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com/polychain-design-system.pdf",
		);
	});

	it("does not link the Structure Exchange label", () => {
		const structure = workSections.find((section) => section.id === "structure");
		expect(structure?.href).toBeUndefined();
	});

	it("has the expected image counts per section", () => {
		expect(workSections.map((section) => section.images.length)).toEqual([2, 1, 3, 3]);
	});

	it("points every image at the portfolio-assets Blob store", () => {
		const allImages = workSections.flatMap((section) => section.images);
		for (const image of allImages) {
			expect(image.src.startsWith("https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com/")).toBe(true);
		}
	});

	it("gives every image an aspectRatio for layout-shift prevention", () => {
		const allImages = workSections.flatMap((section) => section.images);
		for (const image of allImages) {
			expect(typeof image.aspectRatio).toBe("string");
			expect(image.aspectRatio.length).toBeGreaterThan(0);
		}
	});

	it("has the exact aspect ratios from the Figma design", () => {
		const bySrc = Object.fromEntries(
			workSections.flatMap((section) => section.images).map((image) => [image.src, image.aspectRatio]),
		);
		expect(bySrc[`${"https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com"}/spandex_01.png`]).toBe(
			"1000 / 578.125",
		);
		expect(bySrc[`${"https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com"}/polychain_01.png`]).toBe("1 / 1");
	});
});
