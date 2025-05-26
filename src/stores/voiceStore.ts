import { create } from 'zustand';
import SimplePeer from 'simple-peer';
import { io, Socket } from 'socket.io-client';

type VoiceUser = {
  id: string;
  username: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isScreenSharing: boolean;
};

type VoiceState = {
  isConnected: boolean;
  isScreenSharing: boolean;
  peers: Record<string, SimplePeer.Instance>;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  socket: Socket | null;
  isMuted: boolean;
  users: VoiceUser[];
  connect: (channelId: string) => Promise<void>;
  disconnect: () => void;
  toggleMute: () => void;
  toggleScreenShare: () => Promise<void>;
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useVoiceStore = create<VoiceState>((set, get) => ({
  isConnected: false,
  isScreenSharing: false,
  peers: {},
  localStream: null,
  screenStream: null,
  socket: null,
  isMuted: false,
  users: [],

  connect: async (channelId: string) => {
    try {
      // Request audio permissions first
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      // Connect to socket server
      const socket = io(SOCKET_URL, {
        query: { 
          channelId,
          username: JSON.parse(localStorage.getItem('user') || '{}').username
        }
      });

      // Handle new user joining
      socket.on('user-joined', ({ userId, username }) => {
        const { localStream, screenStream } = get();
        if (!localStream) return;

        // Create a new peer connection
        const peer = new SimplePeer({
          initiator: true,
          stream: localStream,
          trickle: false
        });

        // Store the peer
        const peers = { ...get().peers, [userId]: peer };
        set({ 
          peers,
          users: [...get().users, {
            id: userId,
            username,
            isSpeaking: false,
            isMuted: false,
            isScreenSharing: false
          }]
        });

        // Handle signaling
        peer.on('signal', signal => {
          socket.emit('signal', { userId, signal });
        });

        // Handle incoming stream
        peer.on('stream', (remoteStream) => {
          const audio = new Audio();
          audio.srcObject = remoteStream;
          audio.play().catch(console.error);
        });

        // Add screen share if active
        if (screenStream) {
          screenStream.getTracks().forEach(track => {
            peer.addTrack(track, screenStream);
          });
        }
      });

      // Handle incoming signals
      socket.on('signal', ({ userId, signal }) => {
        const peer = get().peers[userId];
        if (peer) {
          peer.signal(signal);
        }
      });

      // Handle user disconnect
      socket.on('user-left', ({ userId }) => {
        const peer = get().peers[userId];
        if (peer) {
          peer.destroy();
          const peers = { ...get().peers };
          delete peers[userId];
          set({ 
            peers,
            users: get().users.filter(user => user.id !== userId)
          });
        }
      });

      // Handle user updates (mute, screen share, etc.)
      socket.on('user-updated', ({ userId, updates }) => {
        set(state => ({
          users: state.users.map(user => 
            user.id === userId ? { ...user, ...updates } : user
          )
        }));
      });

      // Get initial user list
      socket.on('user-list', (users) => {
        set({ users: users.map(user => ({
          ...user,
          isSpeaking: false,
          isMuted: false,
          isScreenSharing: false
        }))});
      });

      set({
        localStream: stream,
        socket,
        isConnected: true
      });
    } catch (error) {
      console.error('Failed to connect to voice channel:', error);
      throw error;
    }
  },

  disconnect: () => {
    const { localStream, screenStream, socket, peers } = get();

    // Stop all media tracks
    localStream?.getTracks().forEach(track => track.stop());
    screenStream?.getTracks().forEach(track => track.stop());

    // Destroy all peer connections
    Object.values(peers).forEach(peer => peer.destroy());

    // Disconnect socket
    socket?.disconnect();

    // Reset state
    set({
      isConnected: false,
      isScreenSharing: false,
      peers: {},
      localStream: null,
      screenStream: null,
      socket: null,
      isMuted: false,
      users: []
    });
  },

  toggleMute: () => {
    const { localStream, socket } = get();
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      const isMuted = !audioTracks[0].enabled;
      set({ isMuted });
      
      // Notify other users
      socket?.emit('user-update', { isMuted });
    }
  },

  toggleScreenShare: async () => {
    const { isScreenSharing, socket, peers } = get();

    if (isScreenSharing) {
      // Stop screen sharing
      get().screenStream?.getTracks().forEach(track => track.stop());
      set({ screenStream: null, isScreenSharing: false });

      // Notify peers
      Object.values(peers).forEach(peer => {
        get().screenStream?.getTracks().forEach(track => {
          peer.removeTrack(track, get().screenStream!);
        });
      });

      socket?.emit('user-update', { isScreenSharing: false });
    } else {
      try {
        // Request screen share permissions
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always'
          },
          audio: false
        });

        // Update state
        set({ screenStream: stream, isScreenSharing: true });

        // Share screen with all peers
        Object.values(peers).forEach(peer => {
          stream.getTracks().forEach(track => {
            peer.addTrack(track, stream);
          });
        });

        // Handle stream end (user stops sharing)
        stream.getVideoTracks()[0].onended = () => {
          set({ screenStream: null, isScreenSharing: false });
          socket?.emit('user-update', { isScreenSharing: false });
        };

        // Notify other users
        socket?.emit('user-update', { isScreenSharing: true });
      } catch (error: any) {
        if (error.name === 'NotAllowedError') {
          console.error('Screen sharing permission denied by user');
          alert('Please allow screen sharing permission to share your screen.');
        } else {
          console.error('Failed to start screen sharing:', error);
        }
        set({ screenStream: null, isScreenSharing: false });
      }
    }
  }
}));