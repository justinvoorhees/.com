import Link from "next/link";
import { achievements, jobs } from "@/content/home";

export default function HomePage() {
	return (
		<main className="mx-auto flex max-w-[600px] flex-col gap-5 px-6 py-[200px]">
			<a href="mailto:hello@justinvoorhees.com" className="text-link">
				hello@justinvoorhees.com
			</a>

			<div className="flex flex-col gap-4">
				<p>
					{"Navigating the melt of product roles from San Diego, CA. Recently I worked with Fabric on Hypersub, "}
					<Link href="/work#receipts" className="underline">
						Receipts
					</Link>
					{", and "}
					<Link href="/work#spandex" className="underline">
						spanDEX
					</Link>
					{". In the past I worked with Typeset and SamCart on their creator platforms, and with Nonlinear for "}
					<Link href="/work#polychain" className="underline">
						Polychain Capital
					</Link>
					{" and "}
					<Link href="/work#structure" className="underline">
						Structure
					</Link>
					{"."}
				</p>
				<p>I enjoy being a father, long bicycle rides in the dirt, drums, and painting tiny men.</p>
			</div>

			<div className="flex flex-col gap-4">
				{jobs.map((job) => (
					<div key={job.company}>
						<p>
							{job.company}, {job.role}
						</p>
						<p>{job.dates}</p>
					</div>
				))}
			</div>

			<hr className="w-full border-t border-black/10" />

			<ul className="flex w-full max-w-[337px] flex-col">
				{achievements.map((achievement) => (
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
				))}
			</ul>
		</main>
	);
}
