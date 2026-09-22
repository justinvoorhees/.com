import { WorkGallery } from "@/components/WorkGallery";
import { achievements } from "@/content/home";
import { workSections } from "@/content/work";

export default function HomePage() {
	return (
		<main className="mx-auto flex max-w-[1000px] flex-col gap-[50px] px-6 py-[200px]">
			<div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
				<div className="shrink-0 whitespace-nowrap">
					<p>Justin Voorhees</p>
					<p>Designer</p>
					<p>&nbsp;</p>
					<a href="mailto:hello@justinvoorhees.com" className="text-link">
						hello@justinvoorhees.com
					</a>
				</div>

				<div className="flex max-w-[500px] flex-col gap-4">
					<p>Navigating the melt of product roles from San Diego, CA.</p>
					<p>
						{"Recently I worked with Fabric on Hypersub, "}
						<a href="#receipts" className="underline">
							Receipts
						</a>
						{", and "}
						<a href="#spandex" className="underline">
							spanDEX
						</a>
						{". In the past I worked with Typeset and SamCart on their creator platforms, and with Nonlinear for "}
						<a href="#polychain" className="underline">
							Polychain Capital
						</a>
						{" and "}
						<a href="#structure" className="underline">
							Structure
						</a>
						{"."}
					</p>
					<p>I enjoy being a father, long bicycle rides in the dirt, drums, and painting tiny men.</p>
				</div>
			</div>

			<WorkGallery sections={workSections} />

			<div className="flex w-full flex-col gap-5">
				<hr className="w-full border-t border-black/10" />
				<ul className="flex w-full max-w-[337px] flex-col">
					{achievements.map((achievement) =>
						achievement.href ? (
							<li key={achievement.label}>
								<a
									href={achievement.href}
									target="_blank"
									rel="noopener noreferrer"
									className="italic underline"
								>
									{achievement.label}
								</a>
								{achievement.suffix}
							</li>
						) : (
							<li key={achievement.label}>
								<span className="italic">{achievement.label}</span>
								{achievement.suffix}
							</li>
						),
					)}
				</ul>
			</div>
		</main>
	);
}
