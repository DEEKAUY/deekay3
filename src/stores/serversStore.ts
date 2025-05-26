import { create } from 'zustand';
import { Server, Channel, ChannelType } from '../types';

type ServersState = {
  servers: Server[];
  activeServer: Server | null;
  activeChannel: Channel | null;
  createServer: (name: string) => void;
  joinServer: (serverId: string) => void;
  setActiveServer: (serverId: string) => void;
  setActiveChannel: (channelId: string) => void;
  addChannel: (serverId: string, name: string, type: ChannelType) => void;
};

// Mock initial data
const mockServers: Server[] = [
  {
    id: '1',
    name: 'Rooster HQ',
    icon: '🐓',
    ownerId: '1',
    channels: [
      { id: '1-1', name: 'general', type: 'text' },
      { id: '1-2', name: 'voice-chat', type: 'voice' },
      { id: '1-3', name: 'announcements', type: 'text' },
    ],
    members: ['1'],
  },
  {
    id: '2',
    name: 'Gaming',
    icon: '🎮',
    ownerId: '1',
    channels: [
      { id: '2-1', name: 'general', type: 'text' },
      { id: '2-2', name: 'voice-lobby', type: 'voice' },
    ],
    members: ['1'],
  },
];

export const useServersStore = create<ServersState>((set, get) => ({
  servers: mockServers,
  activeServer: mockServers[0],
  activeChannel: mockServers[0].channels[0],
  
  createServer: (name) => {
    set((state) => {
      const newServer: Server = {
        id: String(state.servers.length + 1),
        name,
        icon: '🏠',
        ownerId: '1', // Assuming the current user
        channels: [
          { id: `${state.servers.length + 1}-1`, name: 'general', type: 'text' },
          { id: `${state.servers.length + 1}-2`, name: 'voice-chat', type: 'voice' },
        ],
        members: ['1'],
      };
      
      return { 
        servers: [...state.servers, newServer],
        activeServer: newServer,
        activeChannel: newServer.channels[0],
      };
    });
  },
  
  joinServer: (serverId) => {
    // In a real app, this would call an API
    // For demo, we'll just update the server's members list
    set((state) => {
      const updatedServers = state.servers.map(server => {
        if (server.id === serverId && !server.members.includes('1')) {
          return {
            ...server,
            members: [...server.members, '1'],
          };
        }
        return server;
      });
      
      return { servers: updatedServers };
    });
  },
  
  setActiveServer: (serverId) => {
    set((state) => {
      const server = state.servers.find(s => s.id === serverId) || null;
      const channel = server?.channels[0] || null;
      
      return {
        activeServer: server,
        activeChannel: channel,
      };
    });
  },
  
  setActiveChannel: (channelId) => {
    set((state) => {
      if (!state.activeServer) return state;
      
      const channel = state.activeServer.channels.find(c => c.id === channelId) || null;
      
      return { activeChannel: channel };
    });
  },
  
  addChannel: (serverId, name, type) => {
    set((state) => {
      const updatedServers = state.servers.map(server => {
        if (server.id === serverId) {
          const newChannel: Channel = {
            id: `${serverId}-${server.channels.length + 1}`,
            name,
            type,
          };
          
          return {
            ...server,
            channels: [...server.channels, newChannel],
          };
        }
        return server;
      });
      
      const updatedActiveServer = updatedServers.find(s => s.id === serverId) || null;
      
      return { 
        servers: updatedServers,
        activeServer: updatedActiveServer,
      };
    });
  },
}));