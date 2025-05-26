import { create } from 'zustand';
import { Message } from '../types';

type MessagesState = {
  messages: Record<string, Message[]>; // channelId -> messages
  sendMessage: (channelId: string, content: string) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
};

// Generate a mock message for a channel
const generateMockMessages = (channelId: string): Message[] => {
  const baseMessages: Message[] = [
    {
      id: `${channelId}-1`,
      channelId,
      content: 'Welcome to this channel!',
      sender: {
        id: '999',
        username: 'RoosterBot',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoosterBot',
      },
      timestamp: new Date().toISOString(),
    },
    {
      id: `${channelId}-2`,
      channelId,
      content: 'Feel free to start chatting here',
      sender: {
        id: '999',
        username: 'RoosterBot',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoosterBot',
      },
      timestamp: new Date().toISOString(),
    },
  ];
  
  return baseMessages;
};

// Mock initial data for a few channels
const initialMessages: Record<string, Message[]> = {
  '1-1': generateMockMessages('1-1'),
  '2-1': generateMockMessages('2-1'),
};

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: initialMessages,
  
  sendMessage: (channelId, content) => {
    set((state) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const newMessage: Message = {
        id: `${channelId}-${Date.now()}`,
        channelId,
        content,
        sender: {
          id: user.id || '1',
          username: user.username || 'User',
          avatar: user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=User',
        },
        timestamp: new Date().toISOString(),
      };
      
      const channelMessages = state.messages[channelId] || [];
      
      return {
        messages: {
          ...state.messages,
          [channelId]: [...channelMessages, newMessage],
        },
      };
    });
  },
  
  deleteMessage: (channelId, messageId) => {
    set((state) => {
      const channelMessages = state.messages[channelId];
      
      if (!channelMessages) return state;
      
      return {
        messages: {
          ...state.messages,
          [channelId]: channelMessages.filter(m => m.id !== messageId),
        },
      };
    });
  },
}));