import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NextAuthProvider from "./context/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Flex } from "./components/ui/layout/Flex";
import { Box } from "./components/ui/layout/Box";
import { Text } from "./components/ui/typography/Text";
import { Icon } from "./components/ui/typography/Icon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visa checker",
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
            <Suspense>
              <Box as="main" variant="page-container" p="none">
                {children}
              </Box>
            </Suspense>
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
