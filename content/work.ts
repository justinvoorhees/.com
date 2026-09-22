import type { StaticImageData } from "next/image";
import spandex01 from "@/assets/img/spandex_01.png";
import spandex02 from "@/assets/img/spandex_02.png";
import receiptsTest from "@/assets/img/receipts_test.png";
import polychain01 from "@/assets/img/polychain_01.png";
import polychain02 from "@/assets/img/polychain_02.png";
import polychain03 from "@/assets/img/polychain_03.png";
import structure01 from "@/assets/img/structure_01.png";
import structure02 from "@/assets/img/structure_02.png";
import structure03 from "@/assets/img/structure_03.png";

export type WorkImage = {
	src: StaticImageData | string;
	alt: string;
};

export type WorkSection = {
	id: string;
	images: WorkImage[];
	label: string;
	href?: string;
};

export const workSections: WorkSection[] = [
	{
		id: "spandex",
		images: [
			{ src: spandex01, alt: "spanDEX screen 1" },
			{ src: spandex02, alt: "spanDEX screen 2" },
		],
		label: "spanDEX",
		href: "https://spandex.sh/",
	},
	{
		id: "receipts",
		images: [{ src: receiptsTest, alt: "Receipts screen" }],
		label: "Receipts",
		href: "https://receipts.justinvoorhees.com",
	},
	{
		id: "polychain",
		images: [
			{ src: polychain01, alt: "Polychain Design System 1" },
			{ src: polychain02, alt: "Polychain Design System 2" },
			{ src: polychain03, alt: "Polychain Design System 3" },
		],
		label: "Polychain Design System",
		href: "/polychain-design-system.pdf",
	},
	{
		id: "structure",
		images: [
			{ src: structure01, alt: "Structure Exchange 1" },
			{ src: structure02, alt: "Structure Exchange 2" },
			{ src: structure03, alt: "Structure Exchange 3" },
		],
		label: "Structure Exchange",
	},
];
