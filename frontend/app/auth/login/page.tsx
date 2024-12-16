"use client";

import React, { useState } from 'react';
import {
  Box,
  Input,
  Heading,
  VStack,
  Text,
  Span,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

import { login } from "@/lib/auth";
import { useAuth } from "@/hooks/auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    login(email, password).then((user) => {
      setUser(user);
      router.push("/");
    }).catch((err) => {
      alert(err.message);
    }).finally(() => {
      setLoading(false);
    })
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="calc(100vh - 150px)"
    >
      <Box
        bg="white"
        p={8}
        boxShadow="xs"
        borderRadius="md"
        width="sm"
      >
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Login
        </Heading>
        <VStack gap={4}>
          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              p={2}
            />
          </Field>
          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              p={2}
            />
          </Field>
          <Button
            colorPalette="teal"
            width="full"
            onClick={handleLogin}
            loading={loading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </VStack>
        <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
          Don&apos;t have an account? &nbsp;
          <Link href={"/auth/signup"}>
            <Span color="teal.500" cursor="pointer">
              Sign up
            </Span>
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default LoginPage;

