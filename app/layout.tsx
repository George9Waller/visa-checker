import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./context/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { AppShell } from "./design";
import { APP_NAME } from "./constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Helps track your time abroad so you can remain legal and compliant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NextAuthProvider>
            <ThemeProvider />
            <AppShell theme="system">
              <main>
                {children}
              </main>
            </AppShell>
          </NextAuthProvider>
        </NextIntlClientProvider>
        <ToastContainer
          toastStyle={{
            backgroundColor: "var(--bg-raised)",
            color: "var(--fg)",
            border: "1px solid var(--border)",
          }}
        />
      </body>
    </html>
  );
}
