import React, { useState } from 'react';
import { User, Users, UserPlus, Search, X, Check } from 'lucide-react';
import { useFriendsStore } from '../stores/friendsStore';
import { UserStatus } from '../types';

const FriendsView: React.FC = () => {
  const { friends, pendingRequests, addFriend, acceptRequest, rejectRequest, removeFriend } = useFriendsStore();
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending' | 'add'>('online');
  const [friendUsername, setFriendUsername] = useState('');
  
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendUsername.trim()) {
      addFriend(friendUsername);
      setFriendUsername('');
    }
  };
  
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'available': return 'bg-accent-available';
      case 'busy': return 'bg-accent-busy';
      case 'sleeping': return 'bg-accent-sleeping';
      default: return 'bg-gray-500';
    }
  };
  
  const onlineFriends = friends.filter(friend => friend.status !== 'offline');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'online':
        return (
          <div className="space-y-2">
            {onlineFriends.length > 0 ? (
              onlineFriends.map(friend => (
                <div key={friend.id} className="friend-item">
                  <div className="relative mr-3">
                    <img
                      src={friend.avatar}
                      alt={friend.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`status-dot ${getStatusColor(friend.status)}`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{friend.username}</div>
                    <div className="text-text-muted text-sm capitalize">{friend.status}</div>
                  </div>
                  <button className="btn btn-secondary px-3 py-1 text-sm">
                    Message
                  </button>
                </div>
              ))
            ) : (
              <div className="text-text-secondary text-center py-6">
                <Users size={48} className="mx-auto mb-4 text-text-muted" />
                <p>No friends currently online</p>
              </div>
            )}
          </div>
        );
        
      case 'all':
        return (
          <div className="space-y-2">
            {friends.length > 0 ? (
              friends.map(friend => (
                <div key={friend.id} className="friend-item">
                  <div className="relative mr-3">
                    <img
                      src={friend.avatar}
                      alt={friend.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`status-dot ${getStatusColor(friend.status)}`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{friend.username}</div>
                    <div className="text-text-muted text-sm capitalize">{friend.status}</div>
                  </div>
                  <button 
                    className="btn btn-danger px-3 py-1 text-sm"
                    onClick={() => removeFriend(friend.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="text-text-secondary text-center py-6">
                <Users size={48} className="mx-auto mb-4 text-text-muted" />
                <p>You don't have any friends yet</p>
                <button 
                  className="btn btn-primary mt-4"
                  onClick={() => setActiveTab('add')}
                >
                  Add Friend
                </button>
              </div>
            )}
          </div>
        );
        
      case 'pending':
        return (
          <div className="space-y-2">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(request => (
                <div key={request.id} className="friend-item">
                  <div className="mr-3">
                    <img
                      src={request.from.avatar}
                      alt={request.from.username}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{request.from.username}</div>
                    <div className="text-text-muted text-sm">Incoming Friend Request</div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 rounded-full bg-accent-success text-white"
                      onClick={() => acceptRequest(request.id)}
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-accent-danger text-white"
                      onClick={() => rejectRequest(request.id)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-text-secondary text-center py-6">
                <UserPlus size={48} className="mx-auto mb-4 text-text-muted" />
                <p>No pending friend requests</p>
              </div>
            )}
          </div>
        );
        
      case 'add':
        return (
          <div>
            <div className="text-text-secondary mb-4">
              You can add friends by entering their username below.
            </div>
            <form onSubmit={handleAddFriend} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  className="input-field pr-10 w-full"
                  placeholder="Enter a username"
                  value={friendUsername}
                  onChange={(e) => setFriendUsername(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  <UserPlus size={20} />
                </button>
              </div>
            </form>
            
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-bold mb-2">Wumpus is waiting for friends</h3>
              <p className="text-text-secondary">
                Add friends to start chatting!
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-background-secondary">
        <div className="flex items-center mb-4">
          <Users size={24} className="mr-2" />
          <h1 className="text-2xl font-bold">Friends</h1>
        </div>
        
        <div className="flex border-b border-background">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'online' ? 'text-text-primary border-b-2 border-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
            onClick={() => setActiveTab('online')}
          >
            Online
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-text-primary border-b-2 border-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-text-primary border-b-2 border-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'add' ? 'text-text-primary border-b-2 border-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
            onClick={() => setActiveTab('add')}
          >
            Add Friend
          </button>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FriendsView;