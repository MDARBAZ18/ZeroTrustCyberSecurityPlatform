import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-dark-950 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-dark-900">
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;