import {Box, Flex, Heading, HStack, Spacer} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = ({ ...props }) => {
  return (
    <Box as="header" bg="white" py={4} px={8} {...props}>
      <Flex align="center">
        <Link href="/">
          <Heading as="h1" size="lg" color="blue.950">
            NaoMedical Assignment
          </Heading>
        </Link>
        <Spacer />
        <HStack>
          <Button variant={"solid"} colorPalette={"teal"} size={"md"} p={2}>
            Log In
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;