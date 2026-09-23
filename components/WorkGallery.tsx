"use client";

import { useState } from "react";
import type { WorkImage, WorkSection } from "@/content/work";
import { Lightbox } from "@/components/Lightbox";

export function WorkGallery({ sections }: { sections: WorkSection[] }) {
	const [openImage, setOpenImage] = useState<WorkImage | null>(null);
	let imageIndex = 0;

	return (
		<>
			<div className="flex w-full flex-col gap-[50px]">
				{sections.map((section) => (
					<section key={section.id} id={section.id} className="flex w-full flex-col gap-5">
						{section.images.map((image) => {
							const isFirstImageOnPage = imageIndex === 0;
							imageIndex += 1;
							return (
								<button
									key={image.src}
									type="button"
									className="block w-full cursor-zoom-in text-left"
									onClick={() => setOpenImage(image)}
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
			{openImage ? (
				<Lightbox
					src={openImage.src}
					alt={openImage.alt}
					onClose={() => setOpenImage(null)}
				/>
			) : null}
		</>
	);
}
