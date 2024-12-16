import React from "react";
import {
  HStack, Text
} from "@chakra-ui/react";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HStack w="100%" p={4}>
        <Text>Admin Panel</Text>
      </HStack>
      {children}
    </>
  )
}