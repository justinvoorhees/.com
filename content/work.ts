const BLOB_BASE = "https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com";

export type WorkImage = {
	src: string;
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
			{ src: `${BLOB_BASE}/spandex_01.png`, alt: "spanDEX screen 1" },
			{ src: `${BLOB_BASE}/spandex_02.png`, alt: "spanDEX screen 2" },
		],
		label: "spanDEX",
		href: "https://spandex.sh/",
	},
	{
		id: "receipts",
		images: [{ src: `${BLOB_BASE}/receipts_test.png`, alt: "Receipts screen" }],
		label: "Receipts",
		href: "https://receipts.justinvoorhees.com",
	},
	{
		id: "polychain",
		images: [
			{ src: `${BLOB_BASE}/polychain_01.png`, alt: "Polychain Design System 1" },
			{ src: `${BLOB_BASE}/polychain_02.png`, alt: "Polychain Design System 2" },
			{ src: `${BLOB_BASE}/polychain_03.png`, alt: "Polychain Design System 3" },
		],
		label: "Polychain Design System",
		href: `${BLOB_BASE}/Polychain%20Design%20System.pdf`,
	},
	{
		id: "structure",
		images: [
			{ src: `${BLOB_BASE}/structure_01.png`, alt: "Structure Exchange 1" },
			{ src: `${BLOB_BASE}/structure_02.png`, alt: "Structure Exchange 2" },
			{ src: `${BLOB_BASE}/structure_03.png`, alt: "Structure Exchange 3" },
		],
		label: "Structure Exchange",
	},
];
