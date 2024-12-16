"use client"
import {Box, Flex, Heading, HStack, Spacer} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import {setCookie} from "typescript-cookie";
import constants from "@/utils/constants";

const Header = ({ ...props }) => {

  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setCookie(constants.AUTH_COOKIE, '', { expires: new Date(0) });
    setUser(null);
    router.push("/");
  }

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
          {
            user ? (
              <Button
                variant={"ghost"}
                colorPalette={"red"}
                size={"md"}
                p={2}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant={"solid"}
                    colorPalette={"teal"}
                    size={"md"}
                    p={2}
                  >
                    Log In
                  </Button>
                </Link>

                <Link href="/auth/signup">
                  <Button
                    variant={"ghost"}
                    colorPalette={"teal"}
                    size={"md"}
                    p={2}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )
          }
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;