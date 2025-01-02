import {Box, HStack, IconButton, Text} from "@chakra-ui/react";
import { TbCamera, TbMicrophone } from "react-icons/tb";
import { User } from '@/types/auth';
import TranscriptionPanel from "./transcription_panel";
import { Transcription } from "@/types/events";
import React from "react";

interface VideoPlayerProps {
  isLocal: boolean;
  remoteStream?: MediaStream | null;
  remoteVideoRef?: React.RefObject<HTMLVideoElement | null>;
  localStream?: MediaStream | null;
  transcriptions?: Transcription[];
  localVideoRef?: React.RefObject<HTMLVideoElement | null>;
  user?: User | null;
  connectedTo?: string | null | undefined;
  toggleCamera?: () => void;
  toggleMic?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (
  {
    isLocal,
    remoteStream,
    remoteVideoRef,
    localVideoRef,
    transcriptions,
    user,
    connectedTo,
    toggleCamera,
    toggleMic
  }) => {

  if (isLocal && (localVideoRef == null || user == null )) {
    return <></>
  }
  if (!isLocal && (remoteVideoRef == null || remoteStream == null || connectedTo == null)) {
    return <></>
  }

  return (
    <Box h={{base: "180px", md: "400px", lg: "100%"}} bg="gray.300" rounded="3xl" pos="relative">
      <video
        ref={
          isLocal ? localVideoRef : remoteVideoRef
        }
        autoPlay
        muted={isLocal}
        style={{width: "auto", height: "100%", borderRadius: "24px"}}
      />
      <Text fontSize="md" color="white" pos="absolute" top="2" left="2">
        {
          isLocal ? user?.name : connectedTo
        }
      </Text>
      {
        isLocal && (
          <HStack gap={2} pos="absolute" bottom="2" left="50%" transform="translateX(-50%)">
            <IconButton
              aria-label="Toggle Video"
              rounded="full"
              color="white"
              bg="gray.800"
              size="2xl"
              _hover={{bg: "red.500"}}
              onClick={toggleCamera}
            >
              <TbCamera/>
            </IconButton>
            <IconButton
              aria-label="Toggle Audio"
              rounded="full"
              color="white"
              bg="gray.800"
              size="2xl"
              _hover={{bg: "red.500"}}
              onClick={toggleMic}
            >
              <TbMicrophone/>
            </IconButton>
          </HStack>
        )
      }
      <TranscriptionPanel transcriptions={transcriptions}/>
    </Box>
  )
}

export default VideoPlayer;