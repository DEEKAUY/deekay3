import React, { useState } from 'react';
import { Mic, MicOff, Headphones, Headphones as HeadphonesOff, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { UserStatus } from '../types';

interface UserBarProps {
  user: {
    id: string;
    username: string;
    avatar: string;
    status: UserStatus;
  };
}

const UserBar: React.FC<UserBarProps> = ({ user }) => {
  const { logout, updateStatus } = useAuthStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  const handleStatusChange = (status: UserStatus) => {
    updateStatus(status);
    setShowStatusMenu(false);
  };
  
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'available': return 'bg-accent-available';
      case 'busy': return 'bg-accent-busy';
      case 'sleeping': return 'bg-accent-sleeping';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusLabel = (status: UserStatus) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Do Not Disturb';
      case 'sleeping': return 'Sleeping';
      default: return 'Offline';
    }
  };
  
  return (
    <div className="bg-background-secondary p-2 flex items-center justify-between">
      {/* User info */}
      <div className="flex items-center">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="w-8 h-8 rounded-full mr-2"
          />
          <div className={`status-dot ${getStatusColor(user.status)}`}></div>
        </div>
        
        <div className="ml-2">
          <div className="font-medium">{user.username}</div>
          <div 
            className="text-xs text-text-muted cursor-pointer hover:text-text-primary"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            {getStatusLabel(user.status)}
          </div>
          
          {/* Status menu */}
          {showStatusMenu && (
            <div className="absolute bottom-12 left-3 bg-background-tertiary rounded-md shadow-lg p-2 w-48 z-10">
              <div className="text-sm font-medium mb-2 text-text-muted">SET STATUS</div>
              <div 
                className="flex items-center p-2 hover:bg-background-secondary rounded cursor-pointer"
                onClick={() => handleStatusChange('available')}
              >
                <div className="w-3 h-3 rounded-full bg-accent-available mr-2"></div>
                <span>Available</span>
              </div>
              <div 
                className="flex items-center p-2 hover:bg-background-secondary rounded cursor-pointer"
                onClick={() => handleStatusChange('busy')}
              >
                <div className="w-3 h-3 rounded-full bg-accent-busy mr-2"></div>
                <span>Do Not Disturb</span>
              </div>
              <div 
                className="flex items-center p-2 hover:bg-background-secondary rounded cursor-pointer"
                onClick={() => handleStatusChange('sleeping')}
              >
                <div className="w-3 h-3 rounded-full bg-accent-sleeping mr-2"></div>
                <span>Sleeping</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-3">
        <button 
          className={`p-2 rounded-md ${isMuted ? 'bg-accent-danger text-white' : 'text-text-secondary hover:bg-background-tertiary'}`}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        <button 
          className={`p-2 rounded-md ${isDeafened ? 'bg-accent-danger text-white' : 'text-text-secondary hover:bg-background-tertiary'}`}
          onClick={() => setIsDeafened(!isDeafened)}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? <HeadphonesOff size={20} /> : <Headphones size={20} />}
        </button>
        
        <button 
          className="p-2 rounded-md text-text-secondary hover:bg-background-tertiary"
          title="Settings"
        >
          <Settings size={20} />
        </button>
        
        <button 
          className="p-2 rounded-md text-accent-danger hover:bg-background-tertiary"
          onClick={logout}
          title="Log Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserBar;