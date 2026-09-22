export type Job = {
	company: string;
	role: string;
	dates: string;
};

export type Achievement = {
	label: string;
	suffix: string;
	href: string;
};

export const jobs: Job[] = [
	{ company: "Fabric", role: "Designer", dates: "Aug 2024 - Sep 2026" },
	{ company: "Typeset", role: "Designer", dates: "Aug 2023 - Apr 2024" },
	{ company: "SamCart", role: "Designer", dates: "Feb 2022 - Aug 2023" },
	{ company: "Nonlinear", role: "Junior Designer", dates: "Nov 2020 - Feb 2022" },
];

export const achievements: Achievement[] = [
	{
		label: "2026 Grand Depart",
		suffix: ", Stagecoach 400",
		href: "https://socalbikepacking.com/2026-2/",
	},
	{
		label: "East Arete",
		suffix: ", Mount Humphreys",
		href: "https://www.mountainproject.com/route/106736873/east-arete",
	},
	{
		label: "East Face",
		suffix: ", Mount Darwin",
		href: "https://www.summitpost.org/east-face-right-side/155672",
	},
	{
		label: "Kolob Canyon",
		suffix: ", Zion NP",
		href: "https://ropewiki.com/Kolob_Canyon",
	},
	{
		label: "Marble Fork Kaweah (Chrysalis)",
		suffix: ", Sequoia NP",
		href: "https://ropewiki.com/Conditions:Marble_Fork_Kaweah_River_(Chrysalis)-20200810062413",
	},
	{
		label: "Tourist",
		suffix: "",
		href: "https://album.link/s/3TF4BMhLxpINZElzyEZR4l",
	},
];
