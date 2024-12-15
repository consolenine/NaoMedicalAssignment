import React from "react";
import { Box, Text, Heading } from "@chakra-ui/react";

interface TranscriptionPanelProps {
  transcriptPatient: string;
  transcriptStaff: string;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcriptPatient,
  transcriptStaff,
}) => {
  return (
    <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">
      <Heading size="md" mb={4}>
        Live Transcription
      </Heading>
      <Box mb={4}>
        <Heading size="sm">Patient:</Heading>
        <Text>{transcriptPatient}</Text>
      </Box>
      <Box>
        <Heading size="sm">Healthcare Staff:</Heading>
        <Text>{transcriptStaff}</Text>
      </Box>
    </Box>
  );
};

export default TranscriptionPanel;
