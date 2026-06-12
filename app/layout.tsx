import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Providers from "./Providers";
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Echo",
    description:
        "Echo  is a simple, fast messaging app built for genuine one-on-one conversations. Send messages instantly, see when someone's typing, and know exactly when your message has been read — all wrapped in a clean, distraction-free interface.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            suppressHydrationWarning
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                geistSans.variable,
                geistMono.variable,
                "font-mono",
                jetbrainsMono.variable,
            )}
        >
            <body
                suppressHydrationWarning
                className="h-screen flex flex-col overflow-hidden"
            >
                <ClerkProvider>
                    <Providers>
                        <Navbar />
                        <div className="flex-1 min-h-0">{children}</div>
                    </Providers>
                </ClerkProvider>
            </body>
        </html>
    );
}
