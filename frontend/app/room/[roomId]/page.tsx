"use client";
import { useEffect } from "react";
import {
  HStack, IconButton, Text, VStack,
  Flex, Box,
} from "@chakra-ui/react";
import {
  TbArrowBack, TbCamera, TbPhone, TbMicrophone
} from "react-icons/tb";
import { Toaster } from "@/components/ui/toaster";
import useRoom from "@/hooks/room";
import { useAuth } from "@/hooks/auth";
import { useParams, useRouter } from 'next/navigation'
import socket from "@/lib/socket";

const RoomPage = () => {

  const { user } = useAuth();
  const params = useParams<{ roomId: string }>();
  const router = useRouter();

  const roomId = params.roomId;

  const {
    call,
    roomID,
    connectedTo,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    transcript,
    startCall,
    endCall,
    toggleCamera,
    toggleMic
  } = useRoom();

  useEffect(() => {
    if (roomID && window.location.pathname !== `/room/${roomID}`) {
      router.push(`/room/${roomID}`)
    }
    if (user && roomId !== 'new') {
      socket.emit("join_room", { roomID: roomId, user: user?.email })
    }
  }, [roomID, roomId, user]);

  return (
    <>
      <VStack bg="gray.900" p={4} w="100%" h="100%">
        <HStack w="100%">
          <IconButton
            aria-label="Leave"
            rounded="full"
            color="white"
            bg="gray.800"
            size="2xl"
            _hover={{bg: "red.500"}}
          >
            <TbArrowBack/>
          </IconButton>
        </HStack>
        <Flex
          w="100%" justify="center" align="center"
          gap={{ base: 4, md: 8 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box h="md" bg="gray.300" rounded="3xl" pos="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{width: "100%", height: "100%", borderRadius: "24px"}}
            />
            <Text fontSize="md" color="white" pos="absolute" top="2" left="2">
              { user?.name }
            </Text>
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
                <TbMicrophone />
              </IconButton>
            </HStack>
          </Box>
          <Box h="md" rounded="3xl">
            {
              remoteStream && (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  style={{width: "100%", height: "100%", borderRadius: "24px"}}
                />
              )
            }
          </Box>
        </Flex>
        {
          roomId === 'new' && call === 'dormant' && (
            <VStack w="100%" justify="center" align="center" mt={4}>
              <Text fontSize="md" color="gray.300">
                Click to start
              </Text>
              <IconButton
                aria-label="Call"
                rounded="full"
                color="white"
                bg="gray.800"
                size="2xl"
                _hover={{bg: "teal.500"}}
                onClick={startCall}
              >
                <TbPhone/>
              </IconButton>
            </VStack>
          )
        }
        {
          roomId !== 'new' && (call === 'waiting' ? (
              <VStack w="100%" justify="center" align="center" mt={4}>
                <Text fontSize="md" color="gray.300">
                  Waiting for { connectedTo }
                </Text>
              </VStack>
            ) : (
              <></>
            ))
        }
        <Text fontSize="md" color="gray.300">
          { transcript }
        </Text>
      </VStack>
      <Toaster/>
    </>
  );
};

export default RoomPage;
