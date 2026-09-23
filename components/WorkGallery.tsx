"use client";

import { useState } from "react";
import type { WorkSection } from "@/content/work";
import { Lightbox } from "@/components/Lightbox";

// Renders the embedded site at its configured design width so it always shows the same layout,
// then scales it down with a container-query-relative transform to fit the section's actual
// rendered width. A smaller design width zooms in.
function embedDesignHeight(aspectRatio: string, designWidth: number): number {
	const [ratioWidth, ratioHeight] = aspectRatio.split("/").map((part) => Number.parseFloat(part));
	return designWidth * (ratioHeight / ratioWidth);
}

export function WorkGallery({ sections }: { sections: WorkSection[] }) {
	const allImages = sections.flatMap((section) => section.images);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	let imageIndex = 0;

	return (
		<>
			<div className="flex w-full flex-col gap-[50px]">
				{sections.map((section) => (
					<section key={section.id} id={section.id} className="flex w-full flex-col gap-5">
						{section.images.map((image) => {
							const isFirstImageOnPage = imageIndex === 0;
							const currentIndex = imageIndex;
							imageIndex += 1;
							return (
								<button
									key={image.src}
									type="button"
									className="block w-full cursor-zoom-in text-left"
									onClick={() => setActiveIndex(currentIndex)}
								>
									{/* eslint-disable-next-line @next/next/no-img-element -- remote Blob URL, not a static import */}
									<img
										src={image.src}
										alt={image.alt}
										className="h-auto w-full"
										style={{ aspectRatio: image.aspectRatio }}
										loading={isFirstImageOnPage ? undefined : "lazy"}
									/>
								</button>
							);
						})}
						{section.embed ? (
							<a
								href={section.href ?? section.embed.src}
								target="_blank"
								rel="noopener noreferrer"
								className="block w-full"
							>
								<div
									className="relative w-full overflow-hidden bg-white"
									style={{ aspectRatio: section.embed.aspectRatio, containerType: "inline-size" }}
								>
									<iframe
										src={section.embed.src}
										title={section.embed.title}
										loading="lazy"
										tabIndex={-1}
										scrolling="no"
										className="pointer-events-none absolute left-0 top-0 border-0"
										style={{
											width: section.embed.designWidth,
											height: embedDesignHeight(section.embed.aspectRatio, section.embed.designWidth),
											transformOrigin: "top left",
											transform: `scale(calc(100cqi / ${section.embed.designWidth}px))`,
										}}
									/>
								</div>
							</a>
						) : null}
						{section.href ? (
							<a
								href={section.href}
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-[#6D6D6D]"
							>
								{section.label}
							</a>
						) : (
							<p>{section.label}</p>
						)}
					</section>
				))}
			</div>
			{activeIndex !== null ? (
				<Lightbox
					images={allImages}
					initialIndex={activeIndex}
					onClose={() => setActiveIndex(null)}
				/>
			) : null}
		</>
	);
}
