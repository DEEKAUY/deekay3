export type UserStatus = 'available' | 'busy' | 'sleeping' | 'offline';

export type ChannelType = 'text' | 'voice';

export type Channel = {
  id: string;
  name: string;
  type: ChannelType;
};

export type Server = {
  id: string;
  name: string;
  icon: string;
  ownerId: string;
  channels: Channel[];
  members: string[];
};

export type Friend = {
  id: string;
  username: string;
  avatar: string;
  status: UserStatus;
};

export type FriendRequest = {
  id: string;
  from: {
    id: string;
    username: string;
    avatar: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
};

export type Message = {
  id: string;
  channelId: string;
  content: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
};