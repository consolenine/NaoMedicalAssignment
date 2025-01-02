"use client";

import { useEffect } from "react";
import {
  HStack, IconButton, Text, VStack,
  Flex
} from "@chakra-ui/react";
import {
  TbArrowBack, TbPhone,
} from "react-icons/tb";
import { Toaster } from "@/components/ui/toaster";
import useRoom from "@/hooks/room";
import { useAuth } from "@/hooks/auth";
import { useParams, useRouter } from 'next/navigation';
import socket from "@/lib/socket";
import {LanguageSelect, VideoPlayer} from "@/components";

const RoomPage = () => {

  const { user } = useAuth();
  const params = useParams<{ roomId: string }>();
  const router = useRouter();

  const roomId = params.roomId;

  const {
    call,
    roomID,
    setRoomID,
    peerID,
    connectedTo,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    transcript,
    startCall,
    endCall,
    toggleCamera,
    toggleMic,
    language,
    setLanguage
  } = useRoom();

  useEffect(() => {
    if (roomID && window.location.pathname !== `/room/${roomID}`) {
      router.push(`/room/${roomID}`)
    }
    if (user && roomId !== 'new' && peerID) {
      socket.connect()
      setRoomID(roomId);
      socket.emit("join_room", { roomID: roomId, user: user?.email, peer: peerID })
    }
  }, [roomID, roomId, user, peerID]);

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
            onClick={endCall}
          >
            <TbArrowBack/>
          </IconButton>
          {
            roomId !== 'new' && (
              <LanguageSelect language={language} setLanguage={setLanguage}/>
            )
          }
        </HStack>
        <Flex
          w="100%" flex={1} justify={{ lg: "center" }} align={{ lg: "center" }}
          gap={{ base: 4, md: 8 }}
          direction={{ base: "column", lg: "row" }}
        >
          <VideoPlayer
            isLocal={true}
            localVideoRef={localVideoRef} user={user}
            toggleCamera={toggleCamera} toggleMic={toggleMic} transcriptions={transcript} />
          {
            remoteStream && (
              <VideoPlayer
              isLocal={false} remoteStream={remoteStream} remoteVideoRef={remoteVideoRef}
              connectedTo={connectedTo} transcriptions={transcript} />
            )
          }
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
      </VStack>
      <Toaster/>
    </>
  );
};

export default RoomPage;
