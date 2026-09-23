import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { workSections } from "@/content/work";
import HomePage from "./page";

describe("HomePage", () => {
	it("renders the mailto contact link", () => {
		render(<HomePage />);
		const link = screen.getByRole("link", { name: "hello@justinvoorhees.com" });
		expect(link).toHaveAttribute("href", "mailto:hello@justinvoorhees.com");
	});

	it("links each underlined bio term to its gallery section, derived from workSections", () => {
		render(<HomePage />);
		// Derived from workSections rather than restated as literals, so a
		// renamed section id fails this test instead of silently breaking the link.
		for (const section of workSections) {
			const link = document.querySelector(`a[href="#${section.id}"]`);
			expect(link, `expected an anchor link to #${section.id}`).not.toBeNull();
		}
		// Some bio terms (e.g. "Receipts", "spanDEX") share their visible text
		// with the gallery section's own link label below, so scope to the
		// bio's local #-anchor link rather than an ambiguous name-only query.
		const bioLinkTo = (name: string) =>
			screen.getAllByRole("link", { name }).find((link) => link.getAttribute("href")?.startsWith("#"));
		expect(bioLinkTo("Receipts")).toHaveAttribute("href", "#receipts");
		expect(bioLinkTo("spanDEX")).toHaveAttribute("href", "#spandex");
		expect(bioLinkTo("Polychain Capital")).toHaveAttribute("href", "#polychain");
		expect(bioLinkTo("Structure")).toHaveAttribute("href", "#structure");
	});

	it("does not render a job history section", () => {
		render(<HomePage />);
		expect(screen.queryByText(/Fabric, Designer/)).not.toBeInTheDocument();
	});

	it("renders achievement links with their original hrefs, including the trailing plain-text entry", () => {
		render(<HomePage />);
		expect(screen.getByRole("link", { name: "2026 Grand Depart" })).toHaveAttribute(
			"href",
			"https://socalbikepacking.com/2026-2/",
		);
		expect(screen.getByRole("link", { name: "Tourist" })).toHaveAttribute(
			"href",
			"https://album.link/s/3TF4BMhLxpINZElzyEZR4l",
		);
		expect(screen.getByText("👀")).toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "👀" })).not.toBeInTheDocument();
	});

	it("renders the gallery inline, with all four sections", () => {
		render(<HomePage />);
		expect(document.getElementById("spandex")).toBeInTheDocument();
		expect(document.getElementById("receipts")).toBeInTheDocument();
		expect(document.getElementById("polychain")).toBeInTheDocument();
		expect(document.getElementById("structure")).toBeInTheDocument();
	});

	it("links the Polychain Design System label to its Blob-hosted PDF", () => {
		render(<HomePage />);
		expect(screen.getByRole("link", { name: "Polychain Design System" })).toHaveAttribute(
			"href",
			"https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com/polychain-design-system.pdf",
		);
	});
});
