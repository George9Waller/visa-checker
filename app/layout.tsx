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

            {/* ── Top navbar ── */}
            <Flex
              as="header"
              variant="row"
              position="absolute"
              style={{ top: 20, right: 20, zIndex: 30, alignItems: "center", justifyContent: "flex-end", height: 36 }}
            >
              {/* Right side */}
              <Flex variant="row-center" gap="sm">
                <Link href="/visas" style={{ textDecoration: "none" }}>
                  <Flex
                    variant="row-center"
                    style={{ 
                      gap: 6, 
                      height: 34, 
                      paddingLeft: 14, 
                      paddingRight: 14, 
                      background: "var(--bg-raised)", 
                      color: "var(--fg)", 
                      border: "1px solid var(--border)", 
                      borderRadius: 99,
                      transition: "background-color 0.2s"
                    }}
                  >
                    <Icon name="passport" style={{ fontSize: 15 }} />
                    <Text as="span" style={{ fontSize: 14, fontWeight: 600 }}>
                      Visas
                    </Text>
                  </Flex>
                </Link>

                <ProfileAvatar />
              </Flex>
            </Flex>

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
