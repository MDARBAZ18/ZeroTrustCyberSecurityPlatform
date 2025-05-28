import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  FileText,
  Settings,
  Menu,
  X,
  ChevronRight,
  Bell,
  User,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications] = useState([
    { id: 1, text: "Critical threat detected", type: "critical" },
    { id: 2, text: "New security event", type: "warning" },
    { id: 3, text: "System update available", type: "info" }
  ]);

  const menuItems = [
    { icon: <Shield className="w-5 h-5" />, text: "Security Monitor", active: true },
    { icon: <AlertTriangle className="w-5 h-5" />, text: "Threat Analysis" },
    { icon: <FileText className="w-5 h-5" />, text: "Documentation" },
    { icon: <Settings className="w-5 h-5" />, text: "Settings" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 transition-all duration-300 z-20
                   border-r border-gray-700 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <span className={`font-bold text-xl transition-opacity duration-300
                          ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              BlockGuard
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all
                       ${item.active 
                         ? 'bg-purple-900/30 text-purple-400 border border-purple-700/50' 
                         : 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200'}`}
            >
              {item.icon}
              <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                {item.text}
              </span>
              {item.active && (
                <ChevronRight className={`w-4 h-4 ml-auto transition-opacity duration-300
                                     ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 px-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Security Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
              </button>
              
              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl
                            hidden group-hover:block">
                <div className="p-2 space-y-2">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.type === 'critical' ? 'bg-red-900/30 border-red-700/50' :
                        notification.type === 'warning' ? 'bg-yellow-900/30 border-yellow-700/50' :
                        'bg-blue-900/30 border-blue-700/50'
                      } border`}
                    >
                      {notification.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <User className="w-5 h-5" />
              <span>Admin</span>
            </button>

            {/* Logout */}
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-red-400
                           hover:text-red-300">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 