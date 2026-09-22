import { WorkGallery } from "@/components/WorkGallery";
import { workSections } from "@/content/work";

export default function WorkPage() {
	return (
		<main className="mx-auto flex max-w-[800px] flex-col gap-10 px-6 py-[200px]">
			<WorkGallery sections={workSections} />
		</main>
	);
}
