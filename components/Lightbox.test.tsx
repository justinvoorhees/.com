import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { WorkImage } from "@/content/work";
import { Lightbox } from "./Lightbox";

const images: WorkImage[] = [
	{ src: "https://example.com/spandex-1.png", alt: "spanDEX screen 1", aspectRatio: "1 / 1" },
	{ src: "https://example.com/spandex-2.png", alt: "spanDEX screen 2", aspectRatio: "1 / 1" },
	{ src: "https://example.com/receipts-1.png", alt: "Receipts screen", aspectRatio: "1 / 1" },
];

function touch(clientX: number, clientY = 0) {
	return { touches: [{ clientX, clientY }], changedTouches: [{ clientX, clientY }] };
}

describe("Lightbox", () => {
	it("renders the image at the initial index inside a dialog", () => {
		render(<Lightbox images={images} initialIndex={0} onClose={vi.fn()} />);
		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(screen.getByAltText("spanDEX screen 1")).toBeInTheDocument();
	});

	it("calls onClose when the backdrop is clicked", () => {
		const onClose = vi.fn();
		render(<Lightbox images={images} initialIndex={0} onClose={onClose} />);
		fireEvent.click(screen.getByRole("dialog"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose when the image itself is clicked", () => {
		const onClose = vi.fn();
		render(<Lightbox images={images} initialIndex={0} onClose={onClose} />);
		fireEvent.click(screen.getByAltText("spanDEX screen 1"));
		expect(onClose).not.toHaveBeenCalled();
	});

	it("calls onClose when Escape is pressed", () => {
		const onClose = vi.fn();
		render(<Lightbox images={images} initialIndex={0} onClose={onClose} />);
		fireEvent.keyDown(window, { key: "Escape" });
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("shows the next image when swiped left", () => {
		render(<Lightbox images={images} initialIndex={0} onClose={vi.fn()} />);
		const dialog = screen.getByRole("dialog");
		fireEvent.touchStart(dialog, touch(200));
		fireEvent.touchEnd(dialog, touch(100));
		expect(screen.getByAltText("spanDEX screen 2")).toBeInTheDocument();
	});

	it("shows the previous image when swiped right", () => {
		render(<Lightbox images={images} initialIndex={1} onClose={vi.fn()} />);
		const dialog = screen.getByRole("dialog");
		fireEvent.touchStart(dialog, touch(100));
		fireEvent.touchEnd(dialog, touch(200));
		expect(screen.getByAltText("spanDEX screen 1")).toBeInTheDocument();
	});

	it("wraps around when swiping past the last image", () => {
		render(<Lightbox images={images} initialIndex={2} onClose={vi.fn()} />);
		const dialog = screen.getByRole("dialog");
		fireEvent.touchStart(dialog, touch(200));
		fireEvent.touchEnd(dialog, touch(100));
		expect(screen.getByAltText("spanDEX screen 1")).toBeInTheDocument();
	});

	it("ignores small or mostly-vertical touch movements", () => {
		render(<Lightbox images={images} initialIndex={0} onClose={vi.fn()} />);
		const dialog = screen.getByRole("dialog");
		fireEvent.touchStart(dialog, touch(200, 0));
		fireEvent.touchEnd(dialog, touch(190, 0));
		expect(screen.getByAltText("spanDEX screen 1")).toBeInTheDocument();

		fireEvent.touchStart(dialog, touch(200, 0));
		fireEvent.touchEnd(dialog, touch(100, 300));
		expect(screen.getByAltText("spanDEX screen 1")).toBeInTheDocument();
	});
});
