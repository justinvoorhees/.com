"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkImage } from "@/content/work";

const SWIPE_THRESHOLD_PX = 40;

export function Lightbox({
	images,
	initialIndex,
	onClose,
}: {
	images: WorkImage[];
	initialIndex: number;
	onClose: () => void;
}) {
	const [index, setIndex] = useState(initialIndex);
	const touchStartRef = useRef<{ x: number; y: number } | null>(null);
	const image = images[index];

	function showNext() {
		setIndex((current) => (current + 1) % images.length);
	}

	function showPrevious() {
		setIndex((current) => (current - 1 + images.length) % images.length);
	}

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	function handleTouchStart(event: React.TouchEvent) {
		const touch = event.touches[0];
		touchStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
	}

	function handleTouchEnd(event: React.TouchEvent) {
		const start = touchStartRef.current;
		const touch = event.changedTouches[0];
		touchStartRef.current = null;
		if (!start || !touch) return;

		const deltaX = touch.clientX - start.x;
		const deltaY = touch.clientY - start.y;
		if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) return;

		if (deltaX < 0) showNext();
		else showPrevious();
	}

	if (!image) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label={image.alt}
			className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,26,0.5)] backdrop-blur-[3px]"
			onClick={onClose}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			<div
				className="relative h-[90vh] w-full sm:h-auto sm:w-auto sm:max-h-[90vh] sm:max-w-[90vw]"
				onClick={(event) => event.stopPropagation()}
			>
				{/* eslint-disable-next-line @next/next/no-img-element -- remote Blob URL, not a static import */}
				<img
					src={image.src}
					alt={image.alt}
					className="h-full w-full object-contain sm:h-auto sm:max-h-[90vh] sm:w-auto sm:max-w-full"
				/>
			</div>
		</div>
	);
}
