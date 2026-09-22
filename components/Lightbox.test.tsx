import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Lightbox } from "./Lightbox";

describe("Lightbox", () => {
	it("renders the given image inside a dialog", () => {
		render(<Lightbox src="https://example.com/spandex-1.png" alt="spanDEX screen 1" onClose={vi.fn()} />);
		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(screen.getByAltText("spanDEX screen 1")).toBeInTheDocument();
	});

	it("calls onClose when the backdrop is clicked", () => {
		const onClose = vi.fn();
		render(<Lightbox src="https://example.com/spandex-1.png" alt="spanDEX screen 1" onClose={onClose} />);
		fireEvent.click(screen.getByRole("dialog"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose when the image itself is clicked", () => {
		const onClose = vi.fn();
		render(<Lightbox src="https://example.com/spandex-1.png" alt="spanDEX screen 1" onClose={onClose} />);
		fireEvent.click(screen.getByAltText("spanDEX screen 1"));
		expect(onClose).not.toHaveBeenCalled();
	});

	it("calls onClose when Escape is pressed", () => {
		const onClose = vi.fn();
		render(<Lightbox src="https://example.com/spandex-1.png" alt="spanDEX screen 1" onClose={onClose} />);
		fireEvent.keyDown(window, { key: "Escape" });
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
