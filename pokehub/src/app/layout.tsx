import "~/styles/globals.css";

import { type Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import { CartDrawer } from "~/app/_components/CartDrawer";
import { Header } from "~/app/_components/Header";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "PokeHub",
  description: "Pokémon TCG sealed product, raw singles, and graded slabs.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// Run server functions in Sydney to co-locate with Supabase (ap-southeast-2).
export const preferredRegion = "syd1";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html
      lang="en"
      data-direction="editorial"
      data-theme="light"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <TRPCReactProvider>
          <Header
            signedIn={!!session?.user}
            email={session?.user.email ?? null}
            isAdmin={session?.user.role === "ADMIN"}
          />
          {children}
          <CartDrawer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
