import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

const notoSansKR = Noto_Sans_KR({
	variable: "--font-noto-sans-kr",
	subsets: ["latin"],
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
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${notoSansKR.variable} antialiased flex flex-col min-h-screen font-noto-sans-kr`}
			>
				<Providers>
					<header className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700">
						<div className="container mx-auto flex items-center justify-between">
							<h1 className="text-4xl font-extrabold">
								오버더월 멀티뷰 생성기
							</h1>
							<ThemeToggle />
						</div>
					</header>
					<main className="flex-1 container mx-auto">{children}</main>
					<footer className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 h-12">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							버그 문의:{" "}
							<a href="mailto:397love@gmail.com" className="underline">
								397love@gmail.com
							</a>
						</p>
					</footer>
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
