"use client";

import React, { useState } from 'react';
import {
  Box,
  Input,
  Heading,
  VStack,
  Text,
  Span
} from '@chakra-ui/react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { signUp } from "@/lib/auth";

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLSignUp = () => {
    setLoading(true);
    signUp(name, email, password).then(() => {
      alert("Account created successfully");
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
          Sign Up
        </Heading>
        <VStack gap={4}>
          <Field label="Name" required>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              p={2}
            />
          </Field>
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
            onClick={handleLSignUp}
            loading={loading}
            loadingText="Processing..."
          >
            Create Account
          </Button>
        </VStack>
        <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
          Already have an account? &nbsp;
          <Link href={"/auth/login"}>
            <Span color="teal.500" cursor="pointer">
              Log In
            </Span>
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default SignUpPage;

