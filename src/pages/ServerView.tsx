import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Hash, Volume2, User, Phone, PhoneOff, Monitor, MicOff, Mic } from 'lucide-react';
import { useServersStore } from '../stores/serversStore';
import { useMessagesStore } from '../stores/messagesStore';
import { useVoiceStore } from '../stores/voiceStore';

const ServerView: React.FC = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const { activeServer, activeChannel } = useServersStore();
  const { messages, sendMessage } = useMessagesStore();
  const { 
    isConnected, 
    isScreenSharing,
    isMuted,
    users,
    connect, 
    disconnect, 
    toggleMute,
    toggleScreenShare 
  } = useVoiceStore();
  
  const [messageInput, setMessageInput] = useState('');
  
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [isConnected, disconnect]);
  
  if (!activeServer || !activeChannel) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">Select a channel to start chatting</p>
      </div>
    );
  }
  
  const channelMessages = messages[activeChannel.id] || [];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(activeChannel.id, messageInput);
    setMessageInput('');
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const handleVoiceToggle = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect(activeChannel.id);
    }
  };
  
  const handleScreenShare = async () => {
    await toggleScreenShare();
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-background-secondary flex justify-between items-center">
        <div className="flex items-center">
          {activeChannel.type === 'text' ? (
            <Hash size={20} className="mr-2 text-text-muted" />
          ) : (
            <Volume2 size={20} className="mr-2 text-text-muted" />
          )}
          <h2 className="text-lg font-bold">{activeChannel.name}</h2>
        </div>
        
        {activeChannel.type === 'voice' && (
          <div className="flex items-center space-x-2">
            <button
              className={`btn ${isMuted ? 'btn-danger' : 'btn-secondary'}`}
              onClick={toggleMute}
              disabled={!isConnected}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            
            <button
              className={`btn ${isScreenSharing ? 'btn-danger' : 'btn-secondary'}`}
              onClick={handleScreenShare}
              disabled={!isConnected}
            >
              <Monitor size={18} />
            </button>
            
            <button
              className={`btn ${isConnected ? 'btn-danger' : 'btn-primary'}`}
              onClick={handleVoiceToggle}
            >
              {isConnected ? (
                <>
                  <PhoneOff size={18} className="mr-2" />
                  Leave Call
                </>
              ) : (
                <>
                  <Phone size={18} className="mr-2" />
                  Join Call
                </>
              )}
            </button>
          </div>
        )}
      </header>
      
      {activeChannel.type === 'text' ? (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {channelMessages.length > 0 ? (
              <div className="space-y-4">
                {channelMessages.map((message) => (
                  <div key={message.id} className="flex group">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.username}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <h4 className="font-medium mr-2">{message.sender.username}</h4>
                        <span className="text-text-muted text-xs">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-text-primary">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                <Hash size={48} className="mb-4 text-text-muted" />
                <h3 className="text-xl font-bold mb-2">Welcome to #{activeChannel.name}!</h3>
                <p>This is the start of the #{activeChannel.name} channel.</p>
                <p>Send a message to start the conversation.</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-background-secondary">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                className="input-field flex-1 mr-2"
                placeholder={`Message #${activeChannel.name}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={!messageInput.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex h-full">
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {isConnected ? (
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div className="bg-background-secondary p-4 rounded-full relative">
                    <Volume2 size={48} className="text-accent-primary animate-pulse-slow" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Voice Channel: {activeChannel.name}</h3>
                <p className="text-text-secondary mb-6">
                  {isScreenSharing ? "You're sharing your screen" : "You're in a voice call"}
                </p>
                
                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    className={`btn ${isMuted ? 'btn-danger' : 'btn-secondary'} mr-2`}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  
                  <button
                    className={`btn ${isScreenSharing ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={handleScreenShare}
                  >
                    <Monitor size={18} className="mr-2" />
                    {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                  </button>
                </div>
                
                <button 
                  className="btn btn-danger"
                  onClick={handleVoiceToggle}
                >
                  <PhoneOff size={18} className="mr-2" />
                  Leave Call
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div className="bg-background-secondary p-4 rounded-full">
                    <Volume2 size={48} className="text-text-muted" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Voice Channel: {activeChannel.name}</h3>
                <p className="text-text-secondary mb-6">Join the voice channel to chat with others</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleVoiceToggle}
                >
                  <Phone size={18} className="mr-2" />
                  Join Voice Channel
                </button>
              </div>
            )}
          </div>
          
          {/* Voice Users Sidebar */}
          <div className="w-60 bg-background-secondary p-4 border-l border-background">
            <h3 className="text-sm font-semibold text-text-muted uppercase mb-4">
              Voice Connected • {users.length}
            </h3>
            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="flex items-center p-2 rounded hover:bg-background">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center">
                      <User size={20} className="text-text-muted" />
                    </div>
                    {user.isSpeaking && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="ml-2 flex-1">
                    <div className="text-sm font-medium flex items-center">
                      {user.username}
                      {user.isMuted && <MicOff size={14} className="ml-1 text-text-muted" />}
                    </div>
                    {user.isScreenSharing && (
                      <div className="text-xs text-text-muted flex items-center">
                        <Monitor size={12} className="mr-1" />
                        Sharing screen
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerView;