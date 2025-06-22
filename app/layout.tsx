import React from "react";
import type {Metadata} from "next";
import {Rubik_Dirt, Exo_2, Rubik} from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/app/context/Theme";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import {Toaster} from "@/components/ui/sonner";
import PageAnimation from "@/components/animations/PageAnimation";

const rubik = Rubik({
    weight: ["300", "400", "500", "700", "800", "900"],
    subsets: ["latin", "cyrillic"],
    variable: '--font-rubik'
});

const rubik_dirt = Rubik_Dirt({
    weight: "400",
    subsets: ["latin"],
    variable: '--font-rubik-dirt'
});

export const metadata: Metadata = {
    title: "Bunker Game online",
    description: "Bunker pet project",
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {

    const session = await auth()

    return (
        <html suppressHydrationWarning lang="ru">
        <SessionProvider session={session}>
            <body
                className={`${rubik.className} ${rubik_dirt.variable} dark:bg-dark-primary_bg_color `}
            >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <PageAnimation>
                    {children}
                </PageAnimation>
                <Toaster/>
            </ThemeProvider>
            </body>
        </SessionProvider>
        </html>
    );
}
