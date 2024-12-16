import {
  HStack, Text, VStack,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <VStack h={"100%"} w={"100%"} align="center" justify="center">
      <Text fontSize={"4xl"}>
        Welcome to Healthcare Connect
      </Text>
      <HStack justify={"center"}>
        <Link href="/room/new">
          <Button variant="solid" colorPalette="teal" size="md" p={2} mr={4}>
            Connect with a Doctor
          </Button>
        </Link>
      </HStack>
    </VStack>
  );
}
