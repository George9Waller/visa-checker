import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NextAuthProvider from "./context/NextAuthProvider";
import SignOut from "./components/SignOut";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visa checker",
  description:
    "Helps track your time abroad so you can remain legal and compliant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen"}>
        <NextAuthProvider>
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <Link href="/" className="btn btn-ghost text-xl">
                Visa checker
              </Link>
            </div>
            <div className="flex-none flex flex-row gap-2">
              <Link href="/" className="btn btn-accent">
                Calendar
              </Link>
              <Link href="/visas" className="btn btn-primary">
                Visas
              </Link>
              <SignOut />
            </div>
          </div>
          <Suspense>
            <main className="flex flex-col items-center justify-between py-12 max-w-screen-lg mx-auto">
              {children}
            </main>
          </Suspense>
        </NextAuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
