import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Justin Voorhees",
	description: "Portfolio of Justin Voorhees.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
