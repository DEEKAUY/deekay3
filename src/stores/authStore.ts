import { create } from 'zustand';
import { UserStatus } from '../types';

type User = {
  id: string;
  username: string;
  avatar: string;
  status: UserStatus;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateStatus: (status: UserStatus) => void;
};

// For the demo, we'll use localStorage to persist the user
const getStoredUser = (): User | null => {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getStoredUser(),
  user: getStoredUser(),
  
  login: async (username, password) => {
    // In a real app, this would call an API
    // For demo purposes, we'll just set the user directly
    const user: User = {
      id: '1',
      username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      status: 'available',
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  register: async (username, password) => {
    // Similar to login for this demo
    const user: User = {
      id: '1',
      username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      status: 'available',
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
  
  updateStatus: (status) => {
    set((state) => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, status };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
    });
  },
}));