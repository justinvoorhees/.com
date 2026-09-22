import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WorkSection } from "@/content/work";
import { WorkGallery } from "./WorkGallery";

const sections: WorkSection[] = [
	{
		id: "spandex",
		images: [{ src: "spandex-1.png", alt: "spanDEX screen 1", aspectRatio: "1 / 1" }],
		label: "spanDEX",
		href: "https://spandex.sh/",
	},
	{
		id: "structure",
		images: [{ src: "structure-1.png", alt: "Structure Exchange 1", aspectRatio: "1 / 1" }],
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

	it("lazy-loads every image except the first one on the page", () => {
		const multiImageSections: WorkSection[] = [
			{
				id: "spandex",
				images: [
					{ src: "spandex-1.png", alt: "spanDEX screen 1", aspectRatio: "1 / 1" },
					{ src: "spandex-2.png", alt: "spanDEX screen 2", aspectRatio: "1 / 1" },
				],
				label: "spanDEX",
				href: "https://spandex.sh/",
			},
			{
				id: "structure",
				images: [{ src: "structure-1.png", alt: "Structure Exchange 1", aspectRatio: "1 / 1" }],
				label: "Structure Exchange",
			},
		];
		render(<WorkGallery sections={multiImageSections} />);
		expect(screen.getByAltText("spanDEX screen 1")).not.toHaveAttribute("loading");
		expect(screen.getByAltText("spanDEX screen 2")).toHaveAttribute("loading", "lazy");
		expect(screen.getByAltText("Structure Exchange 1")).toHaveAttribute("loading", "lazy");
	});
});
