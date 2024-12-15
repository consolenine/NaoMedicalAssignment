"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Field } from "@/components/ui/field";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Logic for handling login
    console.log('Email:', email);
    console.log('Password:', password);
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
            colorScheme="blue"
            width="full"
            onClick={handleLogin}
          >
            Login
          </Button>
        </VStack>
        <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
          Don&apos;t have an account? Sign up
        </Text>
      </Box>
    </Box>
  );
};

export default LoginPage;

