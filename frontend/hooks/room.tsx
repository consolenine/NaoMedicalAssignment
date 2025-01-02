"use client";

import { useEffect, useRef, useState } from 'react';
import { toaster } from "@/components/ui/toaster";
import socket from '@/lib/socket';
import { Peer } from "peerjs";
import { useAuth } from "@/hooks/auth";
import { Transcription } from "@/types/events";

const useRoom = () => {
  const [call, setCall] = useState<string>("dormant");
  const [roomID, setRoomID] = useState<string | null>(null);
  const [peerID, setPeerID] = useState<string | null>(null);
  const [connectedTo, setConnectedTo] = useState<string | null>(null)
  const [language, setLanguage] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<Transcription[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<Peer | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  const { user } = useAuth();

  interface JoinEventData {
    user: string;
    peer: string;
  }
  interface ChatSessionCreatedData {
    staff_assigned: string;
  }

  useEffect(() => {
    // Initialize local media (camera and mic)
    let stream: MediaStream | null = null;

    const initializeMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "user" },
          },
          audio: true,
        });

        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error initializing media", error);
        toaster.create({
          title: "Camera or Microphone access denied",
          description: "Please allow access to use this feature.",
          type: "error",
          duration: 5000,
        });
      }
    };

    initializeMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setLocalStream(null);
    };
  }, []);

  useEffect(() => {
    if (!localStream) return;

    const peer = new Peer();

    // Set room ID on peer open
    peer.on("open", (id) => {
      setPeerID(id);
    });

    // Handle incoming calls
    peer.on("call", (incomingCall) => {

      // Ensure local stream is ready before answering
      incomingCall.answer(localStream);

      setCall("connected");

      // Handle remote stream
      incomingCall.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        console.log("Remote stream received", remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      // Handle call close
      incomingCall.on("close", () => {
        console.log("Call ended");
        setCall("closed");
      });
    });

    peerConnectionRef.current = peer;

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.destroy();
        peerConnectionRef.current = null;
      }
      socket.disconnect()
    };
  }, [localStream]);

  useEffect(() => {
    if (!localStream || language.length == 0) return;

    if (!speechRecognitionRef.current) {
      // ------------- Start Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language[0];
        recognition.continuous = true;
        recognition.onstart = () => {
          console.log("Speech recognition started...");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let chunk = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            chunk = result[0].transcript;
            setTranscript((prevTranscript) => [
              ...prevTranscript,
              {
                original: chunk,
                translated: chunk.toUpperCase()
              }
            ])
            // Emit chunk via socket
            socket.emit("room_speech_text", {
              text: chunk,
              room: roomID,
            });
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log("SpeechRecognition error:", event.error);
          recognition.onend = () => {
            console.log("Speech recognition ended. ");
            recognition.start();
          };
        };
        speechRecognitionRef.current = recognition;
      }
    }

    speechRecognitionRef.current?.start();

    return () => {
      speechRecognitionRef.current?.stop();
      speechRecognitionRef.current = null;
    };
  }, [localStream, language]);

  useEffect(() => {
    console.log(language, roomID)
    if (language.length > 0 && roomID) {
      socket.emit("set_lang_preference", {
        lang: language[0],
        room: roomID
      })
    }
  }, [language, roomID])

  socket.on("room_joined", (data: JoinEventData) => {
    console.log("Room joined", data);
    console.log(localStream);
    if (peerConnectionRef.current && localStream) {
      const outgoingCall = peerConnectionRef.current.call(data.peer, localStream);

      outgoingCall.on("stream", (stream: MediaStream) => {
        console.log("Outgoing stream", stream);

        // Validate the stream before setting it
        if (stream instanceof MediaStream) {
          setRemoteStream(stream);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        } else {
          console.error("Invalid outgoing stream:", stream);
        }
      });
    }
  });



  socket.on("chat_session_created", (data: ChatSessionCreatedData) => {
    if (data.staff_assigned) {
      setConnectedTo(data.staff_assigned)
    }
  })

  const startCall = async () => {
    if (localStream && peerID) {
      setRoomID(peerID);
      setCall("waiting");
      socket.emit("create_chat_session", { room: peerID, user: user?.email });
    } else {
      toaster.create({
        title: "Error",
        description: "Camera or microphone not initialized.",
        type: "error",
        duration: 5000,
      });
    }
  };

  const endCall = () => {
    setCall("closed");
    if (peerConnectionRef.current) {
      peerConnectionRef.current.destroy();
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getTracks().find((track) => track.kind === "video");

      if (videoTrack) {
        if (videoTrack.enabled) {
          videoTrack.stop()
        } else {
          // videoTrack.getConstraints()
        }
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getTracks().find((track) => track.kind === "audio");
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }

  return {
    call,
    connectedTo,
    peerID,
    roomID,
    setRoomID,
    startCall,
    endCall,
    toggleCamera,
    toggleMic,
    transcript,
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    language,
    setLanguage
  };
};

export default useRoom;
