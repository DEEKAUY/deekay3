import React, { useState } from 'react';
import { Hash, Volume2, Plus, Settings } from 'lucide-react';
import { Server, Channel } from '../types';
import { useServersStore } from '../stores/serversStore';

interface ChannelSidebarProps {
  server: Server;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ server }) => {
  const { activeChannel, setActiveChannel, addChannel } = useServersStore();
  const [showAddChannel, setShowAddChannel] = useState(false);
  
  const handleChannelClick = (channelId: string) => {
    setActiveChannel(channelId);
  };
  
  const handleAddChannel = () => {
    setShowAddChannel(true);
  };
  
  const createChannel = (name: string, type: 'text' | 'voice') => {
    addChannel(server.id, name, type);
    setShowAddChannel(false);
  };
  
  // Group channels by type
  const textChannels = server.channels.filter(c => c.type === 'text');
  const voiceChannels = server.channels.filter(c => c.type === 'voice');
  
  const ChannelItem = ({ channel }: { channel: Channel }) => {
    const isActive = activeChannel?.id === channel.id;
    
    return (
      <div
        className={`channel-item ${isActive ? 'channel-item-active' : ''}`}
        onClick={() => handleChannelClick(channel.id)}
      >
        {channel.type === 'text' ? (
          <Hash size={18} className="mr-2 text-text-muted" />
        ) : (
          <Volume2 size={18} className="mr-2 text-text-muted" />
        )}
        <span>{channel.name}</span>
      </div>
    );
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-3">
      {/* Text channels */}
      <div className="mb-4">
        <div className="flex justify-between items-center px-2 mb-1">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Text Channels
          </h3>
          <button 
            className="text-text-muted hover:text-text-primary"
            onClick={handleAddChannel}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {textChannels.map((channel) => (
            <ChannelItem key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
      
      {/* Voice channels */}
      <div>
        <div className="flex justify-between items-center px-2 mb-1">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Voice Channels
          </h3>
          <button 
            className="text-text-muted hover:text-text-primary"
            onClick={handleAddChannel}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {voiceChannels.map((channel) => (
            <ChannelItem key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
      
      {/* Server settings */}
      {server.ownerId === '1' && (
        <div className="mt-auto pt-4">
          <div className="channel-item">
            <Settings size={18} className="mr-2 text-text-muted" />
            <span>Server Settings</span>
          </div>
        </div>
      )}
      
      {/* Add Channel Modal */}
      {showAddChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-secondary rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Create Channel</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const channelName = formData.get('channelName') as string;
                const channelType = formData.get('channelType') as 'text' | 'voice';
                
                if (channelName) {
                  createChannel(channelName, channelType);
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  CHANNEL TYPE
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="channelType" value="text" className="mr-2" defaultChecked />
                    <Hash size={18} className="mr-1" />
                    Text
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="channelType" value="voice" className="mr-2" />
                    <Volume2 size={18} className="mr-1" />
                    Voice
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="channelName" className="block text-sm font-medium text-text-secondary mb-1">
                  CHANNEL NAME
                </label>
                <input 
                  type="text"
                  id="channelName"
                  name="channelName"
                  className="input-field"
                  placeholder="new-channel"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddChannel(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelSidebar;