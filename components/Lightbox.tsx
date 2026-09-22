"use client";

import { useEffect } from "react";

export function Lightbox({
	src,
	alt,
	onClose,
}: {
	src: string;
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
		<div
			role="dialog"
			aria-modal="true"
			aria-label={alt}
			className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,26,0.5)] backdrop-blur-[3px]"
			onClick={onClose}
		>
			<div
				className="max-h-[90vh] max-w-[90vw]"
				onClick={(event) => event.stopPropagation()}
			>
				{/* eslint-disable-next-line @next/next/no-img-element -- remote Blob URL, not a static import */}
				<img
					src={src}
					alt={alt}
					className="h-auto max-h-[90vh] w-auto max-w-full"
				/>
			</div>
		</div>
	);
}
