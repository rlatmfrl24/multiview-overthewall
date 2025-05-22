import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
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
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
			>
				<header className="flex items-center justify-between h-16 border-b border-gray-200">
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
