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

	it("links the Polychain Design System label to its Blob-hosted PDF", () => {
		render(<WorkPage />);
		expect(screen.getByRole("link", { name: "Polychain Design System" })).toHaveAttribute(
			"href",
			"https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com/Polychain%20Design%20System.pdf",
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
