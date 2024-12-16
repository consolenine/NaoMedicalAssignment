"use client";
import React, { useEffect, useState } from "react";
import {
  Box, HStack, Text
} from "@chakra-ui/react";
import Link from "next/link";
import socket from "@/lib/socket";
import { useAuth } from "@/hooks/auth";

interface ChatSession {
  room: string;
  patient: string;
  status: string;
  start_time: string;
}

const AdminRootPage = () => {

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return;
    socket.connect()
    socket.emit("admin_online", { user: user?.email} )
    socket.on("awaiting_patients", (data: ChatSession[]) => {
      setChatSessions(data)
    })

    return () => {
      socket.off("awaiting_patients")
    }
  }, [user])

  return (
    <Box w={"100%"} p={4}>
      <HStack wrap={"wrap"}>
        {
          chatSessions.length > 0 && chatSessions.map((session, index) => {
            console.log(session)
            return (
              <Link key={index} href={`/room/${session.room}`}>
                <Box w={"300px"} h={"200px"} bg={"teal.100"} p={2} rounded={"xl"}>
                  <Text>{session.patient}</Text>
                  <Text>{session.start_time}</Text>
                  <Text>{session.status}</Text>
                  <Text>Room ID {session.room}</Text>
                </Box>
              </Link>
            )
          })
        }
      </HStack>
    </Box>
  )
}
export default AdminRootPage