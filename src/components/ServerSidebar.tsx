import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Users } from 'lucide-react';
import { useServersStore } from '../stores/serversStore';

interface ServerSidebarProps {
  onCreateServer: () => void;
}

const ServerSidebar: React.FC<ServerSidebarProps> = ({ onCreateServer }) => {
  const { servers, activeServer, setActiveServer } = useServersStore();
  const navigate = useNavigate();
  
  const handleServerClick = (serverId: string) => {
    setActiveServer(serverId);
    navigate(`/servers/${serverId}`);
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  const handleFriendsClick = () => {
    navigate('/friends');
  };
  
  return (
    <div className="w-20 bg-background flex flex-col items-center py-4 overflow-y-auto">
      {/* Home button */}
      <div 
        className={`sidebar-icon ${!activeServer ? 'bg-accent-primary rounded-2xl' : ''}`}
        onClick={handleHomeClick}
      >
        <Home size={24} />
        <span className="sidebar-tooltip">Home</span>
      </div>
      
      <div className="w-10 h-0.5 bg-background-secondary rounded-full my-2"></div>
      
      {/* Friends button */}
      <div 
        className="sidebar-icon"
        onClick={handleFriendsClick}
      >
        <Users size={24} />
        <span className="sidebar-tooltip">Friends</span>
      </div>
      
      <div className="w-10 h-0.5 bg-background-secondary rounded-full my-2"></div>
      
      {/* Server list */}
      <div className="flex flex-col items-center space-y-2 mt-2">
        {servers.map((server) => (
          <div
            key={server.id}
            className={`server-icon bg-background-secondary ${activeServer?.id === server.id ? 'bg-accent-primary text-white' : 'hover:bg-background-tertiary'}`}
            onClick={() => handleServerClick(server.id)}
          >
            <span className="text-xl">{server.icon}</span>
          </div>
        ))}
        
        {/* Add server button */}
        <div
          className="server-icon bg-background-secondary hover:bg-accent-success text-accent-success hover:text-white transition-all duration-200"
          onClick={onCreateServer}
        >
          <Plus size={24} />
        </div>
      </div>
    </div>
  );
};

export default ServerSidebar;