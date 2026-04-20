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
              position="absolute"
              top={20}
              right={20}
              zIndex={30}
              align="center"
              justify="flex-end"
              h={36}
            >
              {/* Right side */}
              <Flex align="center" gap={8}>
                <Link href="/visas" style={{ textDecoration: "none" }}>
                  <Flex
                    align="center"
                    gap={6}
                    h={34}
                    px={14}
                    bg="var(--bg-raised)"
                    color="var(--fg)"
                    border="1px solid var(--border)"
                    borderRadius="99px"
                    className="transition-colors"
                  >
                    <Text as="span" className="material-symbols-outlined" size={15}>
                      passport
                    </Text>
                    <Text as="span" size={14} weight="semibold">
                      Visas
                    </Text>
                  </Flex>
                </Link>

                <ProfileAvatar />
              </Flex>
            </Flex>

            <Suspense>
              <Box as="main" className="max-w-2xl mx-auto w-xl px-0 pb-32">
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
