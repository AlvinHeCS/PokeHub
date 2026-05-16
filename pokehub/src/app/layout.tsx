import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

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

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" className={`${geist.variable}`}>
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
