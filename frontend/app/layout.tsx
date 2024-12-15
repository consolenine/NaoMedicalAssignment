import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { VStack, Box } from "@chakra-ui/react";
import { Header } from "@/components";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Healthcare Assignment",
  description: "Healthcare Translation Web App with Generative AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <Provider>
          <VStack gap={0} h="100vh" w="100vw">
            <Header w="100%" />
            <Box as="main" flex={1} w="100%">
              {children}
            </Box>
          </VStack>
        </Provider>
      </body>
    </html>
  );
}
