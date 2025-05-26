import { create } from 'zustand';
import { Friend, FriendRequest } from '../types';

type FriendsState = {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  addFriend: (username: string) => void;
  acceptRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
};

// Mock initial data
const mockFriends: Friend[] = [
  {
    id: '2',
    username: 'SteveJobs',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SteveJobs',
    status: 'available',
  },
  {
    id: '3',
    username: 'ElonMusk',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ElonMusk',
    status: 'busy',
  },
  {
    id: '4',
    username: 'BillGates',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BillGates',
    status: 'sleeping',
  },
];

const mockRequests: FriendRequest[] = [
  {
    id: '1',
    from: {
      id: '5',
      username: 'MarkZuckerberg',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MarkZuckerberg',
    },
    status: 'pending',
  },
];

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: mockFriends,
  pendingRequests: mockRequests,
  
  addFriend: (username) => {
    // In a real app, this would send a friend request
    // For demo, we'll just add a mock friend
    set((state) => {
      const newFriend: Friend = {
        id: String(state.friends.length + 5),
        username,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        status: 'available',
      };
      
      return { friends: [...state.friends, newFriend] };
    });
  },
  
  acceptRequest: (requestId) => {
    set((state) => {
      const request = state.pendingRequests.find(r => r.id === requestId);
      
      if (!request) return state;
      
      const newFriend: Friend = {
        id: request.from.id,
        username: request.from.username,
        avatar: request.from.avatar,
        status: 'available',
      };
      
      return {
        friends: [...state.friends, newFriend],
        pendingRequests: state.pendingRequests.filter(r => r.id !== requestId),
      };
    });
  },
  
  rejectRequest: (requestId) => {
    set((state) => ({
      pendingRequests: state.pendingRequests.filter(r => r.id !== requestId),
    }));
  },
  
  removeFriend: (friendId) => {
    set((state) => ({
      friends: state.friends.filter(f => f.id !== friendId),
    }));
  },
}));