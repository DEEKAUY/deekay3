import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useServersStore } from '../stores/serversStore';
import { useAuthStore } from '../stores/authStore';
import RoosterLogo from '../components/RoosterLogo';

const Dashboard: React.FC = () => {
  const { servers } = useServersStore();
  const { user } = useAuthStore();
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-background-secondary">
        <h1 className="text-2xl font-bold flex items-center">
          <RoosterLogo className="w-8 h-8 mr-2" />
          Home
        </h1>
      </header>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Welcome Card */}
          <div className="bg-background-secondary rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-3">Welcome back, {user?.username}!</h2>
            <p className="text-text-secondary mb-4">
              Jump back into your conversations or start a new one.
            </p>
            <div className="flex space-x-4">
              <button className="btn btn-primary flex items-center">
                <MessageSquare size={18} className="mr-2" />
                Message a Friend
              </button>
            </div>
          </div>
          
          {/* Recent Servers */}
          <div className="bg-background-secondary rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-3">Your Servers</h2>
            {servers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {servers.map((server) => (
                  <div 
                    key={server.id}
                    className="flex flex-col items-center justify-center p-4 bg-background rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer"
                    onClick={() => useServersStore.getState().setActiveServer(server.id)}
                  >
                    <div className="text-2xl mb-2">{server.icon}</div>
                    <div className="text-sm font-medium truncate w-full text-center">{server.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">You haven't joined any servers yet.</p>
            )}
          </div>
          
          {/* AI Assistant */}
          <div className="bg-background-secondary rounded-lg p-6 shadow-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-3">Rooster Assistant</h2>
            <p className="text-text-secondary mb-4">
              I can help you navigate Rooster Chat, set up your server, or answer any questions.
            </p>
            <div className="bg-background p-4 rounded-lg">
              <div className="flex mb-4">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white">
                    🤖
                  </div>
                </div>
                <div className="bg-background-tertiary p-3 rounded-lg">
                  <p className="text-text-primary">
                    Hello! I'm Rooster Assistant. Ask me how to set up your server or manage your friends list!
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  className="input-field flex-1 mr-2"
                  placeholder="Ask Rooster Assistant..."
                />
                <button className="btn btn-primary">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;