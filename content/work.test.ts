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
