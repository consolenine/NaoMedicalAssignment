"use client";
import React, { useState, useEffect, useRef } from "react";
import { Stack, Box, Text } from "@chakra-ui/react"
import { Transcription } from "@/types/events";

interface TranscriptionPanelProps {
  transcriptions?: Transcription[];
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({ transcriptions }) => {

  const [showOriginal, setShowOriginal] = useState(true);
  const [playAudio, setPlayAudio] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Automatically scroll to bottom
    if (baseRef.current) {
      baseRef.current.scrollTo({ top: baseRef.current.scrollHeight });
    }
  }, [transcriptions]);

  if (transcriptions === undefined) {
    return <></>
  }

  return (
    <Stack
      gap="2" pos="absolute"
      left="-20%" bottom="0" maxH="100px"
      overflow="auto"
      ref={baseRef}
    >
      {
        transcriptions.length > 0 && transcriptions.map((transcription, index) => (
          <Box key={index} bg="white" rounded="xl" p={2} maxW="300px">
            <Text>
              {showOriginal ? transcription.original : transcription.translated}
            </Text>
          </Box>
        ))
      }
    </Stack>
  )
}

export default TranscriptionPanel;