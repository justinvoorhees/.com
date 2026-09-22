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
