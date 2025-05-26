import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ServerSidebar from '../components/ServerSidebar';
import ChannelSidebar from '../components/ChannelSidebar';
import UserBar from '../components/UserBar';
import { useServersStore } from '../stores/serversStore';
import { useAuthStore } from '../stores/authStore';

const MainLayout: React.FC = () => {
  const { activeServer } = useServersStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState<string | null>(null);

  // Handle creating a new server
  const handleCreateServer = () => {
    setShowModal('createServer');
  };

  // Close any open modal
  const closeModal = () => {
    setShowModal(null);
  };
  
  return (
    <div className="flex h-screen">
      {/* Servers sidebar */}
      <ServerSidebar onCreateServer={handleCreateServer} />
      
      {/* Channels sidebar - Only show if an active server is selected */}
      {activeServer && (
        <div className="w-60 bg-background-secondary flex flex-col">
          <div className="p-4 shadow-md">
            <h2 className="text-lg font-bold truncate">{activeServer.name}</h2>
          </div>
          <ChannelSidebar server={activeServer} />
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto bg-background-tertiary">
          <Outlet />
        </main>
        
        {/* User status bar */}
        {user && <UserBar user={user} />}
      </div>
      
      {/* Create Server Modal */}
      {showModal === 'createServer' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-secondary rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Create a Server</h2>
            <p className="text-text-secondary mb-4">
              Your server is where you and your friends hang out. Make yours and start talking.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const serverName = formData.get('serverName') as string;
                
                if (serverName) {
                  useServersStore.getState().createServer(serverName);
                  closeModal();
                }
              }}
            >
              <div className="mb-4">
                <label htmlFor="serverName" className="block text-sm font-medium text-text-secondary mb-1">
                  SERVER NAME
                </label>
                <input 
                  type="text"
                  id="serverName"
                  name="serverName"
                  className="input-field"
                  placeholder="Enter server name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;