import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
	variable: "--font-noto-sans-kr",
	subsets: ["latin"],
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: "Multiview Overthewall",
	description: "Multiview Maker for Overthewall",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${notoSansKR.variable} antialiased flex flex-col min-h-screen font-noto-sans-kr`}
			>
				<header
					className="flex items-center justify-between h-16 bo
				rder-b border-gray-200"
				>
					<h1 className="text-4xl font-extrabold container mx-auto">
						오버더월 멀티뷰 생성기
					</h1>
				</header>
				<main className="flex-1 container mx-auto">{children}</main>
				<footer className="flex items-center justify-center bg-gray-100 h-12">
					<p className="text-sm text-gray-500">397love@gmail.com</p>
				</footer>
			</body>
		</html>
	);
}
