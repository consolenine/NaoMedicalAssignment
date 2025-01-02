"use client";

import io from 'socket.io-client';
import { getCookie } from 'typescript-cookie';
import constants from "@/utils/constants";

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:8000",
  {
    transports: ["websocket"],
    auth: {
      token: 'Bearer ' + getCookie(constants.AUTH_COOKIE)
    }
  }
);

export default socket;