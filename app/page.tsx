import { WorkGallery } from "@/components/WorkGallery";
import { achievements } from "@/content/home";
import { workSections } from "@/content/work";

export default function HomePage() {
	return (
		<main className="mx-auto flex max-w-[1000px] flex-col px-[10px] pt-[100px] pb-[200px] sm:px-6 sm:py-[333px]">
			<div className="flex flex-col gap-8 sm:flex-row sm:gap-0">
				<div className="w-full sm:w-1/2">
					<p>Justin Voorhees</p>
					<p>Designer</p>
					<p>&nbsp;</p>
					<a
						href="mailto:hello@justinvoorhees.com"
						className="text-link hover:underline"
					>
						hello@justinvoorhees.com
					</a>
				</div>

				<div className="flex w-full flex-col gap-4 sm:w-1/2">
					<p>Navigating the melt of product roles from San Diego, CA.</p>
					<p>
						{"Recently I worked with Fabric on Hypersub, "}
						<a href="#receipts" className="underline hover:text-[#6D6D6D]">
							Receipts
						</a>
						{", and "}
						<a href="#spandex" className="underline hover:text-[#6D6D6D]">
							spanDEX
						</a>
						{". In the past I worked with Typeset and SamCart on their creator platforms, and with Nonlinear for "}
						<a href="#polychain" className="underline hover:text-[#6D6D6D]">
							Polychain Capital
						</a>
						{" and "}
						<a href="#structure" className="underline hover:text-[#6D6D6D]">
							Structure
						</a>
						{"."}
					</p>
					<p>I enjoy being a father, long bicycle rides in the dirt, drums, and painting tiny men.</p>
				</div>
			</div>

			<div className="mt-[50px] sm:mt-[333px]">
				<WorkGallery sections={workSections} />
			</div>

			<div className="mt-[50px] flex w-full flex-col gap-5">
				<hr className="w-full border-t border-black/10" />
				<ul className="flex w-full max-w-[337px] flex-col">
					{achievements.map((achievement) =>
						achievement.href ? (
							<li key={achievement.label}>
								<a
									href={achievement.href}
									target="_blank"
									rel="noopener noreferrer"
									className="italic underline hover:text-[#6D6D6D]"
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
