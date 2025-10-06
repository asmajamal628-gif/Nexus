import React, { useState, useRef } from "react";

const VideoCallUI: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // ✅ Start Call
  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch((err) =>
          console.error("AutoPlay error:", err)
        );
      }

      setInCall(true);
    } catch (err: any) {
      console.error("Error accessing media devices:", err.name, err.message);
      alert("⚠️ Please allow camera and microphone permissions.");
    }
  };

  // ✅ End Call
  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setInCall(false);
  };

  // ✅ Toggle Mute / Unmute
  const toggleMute = () => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  // ✅ Toggle Video On / Off
  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOn(videoTrack.enabled);
    }
  };

  // ✅ Screen Sharing
  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
          await localVideoRef.current.play().catch((err) =>
            console.error("Screen share play error:", err)
          );
        }

        screenStream.getVideoTracks()[0].onended = () => {
          if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          setScreenSharing(false);
        };

        setScreenSharing(true);
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    } else {
      if (localStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setScreenSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {!inCall ? (
        <button
          onClick={handleStartCall}
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full shadow-lg text-xl font-semibold transition transform hover:scale-105"
        >
          📞 Start Call
        </button>
      ) : (
        <div className="relative w-full max-w-5xl flex flex-col items-center">
          {/* Video container */}
          <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[500px] object-contain bg-black"
            ></video>

            {/* Name label */}
            <span className="absolute bottom-3 left-3 bg-black/70 text-xs px-2 py-1 rounded">
              You
            </span>
          </div>

          {/* Controls */}
          <div className="flex space-x-6 mt-6 bg-black/60 px-8 py-4 rounded-full backdrop-blur-md shadow-xl">
            <button
              onClick={toggleMute}
              className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-xl transition transform hover:scale-110 ${
                isMuted ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {isMuted ? "🔇" : "🎤"}
            </button>

            <button
              onClick={toggleVideo}
              className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-xl transition transform hover:scale-110 ${
                videoOn ? "bg-blue-500" : "bg-red-500"
              }`}
            >
              {videoOn ? "📹" : "🎥"}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-xl transition transform hover:scale-110 ${
                screenSharing ? "bg-red-500" : "bg-purple-600"
              }`}
            >
              {screenSharing ? "🛑" : "🖥️"}
            </button>

            <button
              onClick={handleEndCall}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-xl shadow-lg transform hover:scale-110"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallUI;
