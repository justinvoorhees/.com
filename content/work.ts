const BLOB_BASE = "https://r3kzpcvwnu1bcbve.public.blob.vercel-storage.com";

export type WorkImage = {
	src: string;
	alt: string;
	aspectRatio: string;
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
			{ src: `${BLOB_BASE}/spandex_01.png`, alt: "spanDEX screen 1", aspectRatio: "1000 / 578.125" },
			{ src: `${BLOB_BASE}/spandex_02.png`, alt: "spanDEX screen 2", aspectRatio: "4096 / 2084" },
		],
		label: "spanDEX",
		href: "https://spandex.sh/",
	},
	{
		id: "receipts",
		images: [
			{ src: `${BLOB_BASE}/receipts_test.png`, alt: "Receipts screen", aspectRatio: "1000 / 637.451" },
		],
		label: "Receipts",
		href: "https://receipts.justinvoorhees.com",
	},
	{
		id: "polychain",
		images: [
			{ src: `${BLOB_BASE}/polychain_01.png`, alt: "Polychain Design System 1", aspectRatio: "1 / 1" },
			{ src: `${BLOB_BASE}/polychain_02.png`, alt: "Polychain Design System 2", aspectRatio: "4096 / 2913" },
			{ src: `${BLOB_BASE}/polychain_03.png`, alt: "Polychain Design System 3", aspectRatio: "4096 / 2039" },
		],
		label: "Polychain Design System",
		href: `${BLOB_BASE}/Polychain%20Design%20System.pdf`,
	},
	{
		id: "structure",
		images: [
			{ src: `${BLOB_BASE}/structure_01.png`, alt: "Structure Exchange 1", aspectRatio: "4096 / 2304" },
			{ src: `${BLOB_BASE}/structure_02.png`, alt: "Structure Exchange 2", aspectRatio: "1 / 1" },
			{ src: `${BLOB_BASE}/structure_03.png`, alt: "Structure Exchange 3", aspectRatio: "1 / 1" },
		],
		label: "Structure Exchange",
	},
];
