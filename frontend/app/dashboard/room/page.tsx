"use client";
import {
  HStack, IconButton, Text, VStack,
  Flex, Box, Span,
} from "@chakra-ui/react";
import {
  TbArrowBack, TbCamera, TbPhone, TbMicrophone
} from "react-icons/tb";
import {Toaster} from "@/components/ui/toaster";
import useRoom from "@/hooks/room";

const RoomPage = () => {

  const {
    roomID,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    transcript,
    startCall,
    toggleCamera,
    toggleMic
  } = useRoom();

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
          <Text fontSize="md" color="gray.300">
            Your name <Span color="white" fontSize="xl"> { roomID } </Span>
          </Text>
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
              remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  style={{width: "100%", height: "100%", borderRadius: "24px"}}
                />
              ) : (
                <VStack h="100%" justify="center">
                  <Text color="gray.200" fontSize="3xl">
                    Connect with a specialist
                  </Text>
                  <IconButton
                    aria-label="Toggle Camera"
                    rounded="full"
                    color="white"
                    bg="gray.800"
                    size="2xl"
                    _hover={{bg: "red.500"}}
                    onClick={startCall}
                  >
                    <TbPhone />
                  </IconButton>
                </VStack>
              )
            }
          </Box>
        </Flex>
        <Text fontSize="md" color="gray.300">
          { transcript }
        </Text>
      </VStack>
      <Toaster/>
    </>
  );
};

export default RoomPage;
