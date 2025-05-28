import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  AlertTriangleIcon, 
  ActivityIcon, 
  FileTextIcon, 
  UsersIcon, 
  ClipboardListIcon,
  ShieldIcon
} from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

const Sidebar: React.FC = () => {
  const { isConnected, userRole } = useWallet();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon size={20} /> },
    { name: 'Events', path: '/events', icon: <ActivityIcon size={20} /> },
    { name: 'Threat Monitor', path: '/threats', icon: <AlertTriangleIcon size={20} /> },
  ];
  
  const adminItems = [
    { name: 'User Management', path: '/users', icon: <UsersIcon size={20} /> },
  ];
  
  const additionalItems = [
    { name: 'Audit Trail', path: '/audit', icon: <ClipboardListIcon size={20} /> },
    { name: 'Documentation', path: '/docs', icon: <FileTextIcon size={20} /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 min-h-screen bg-gradient-to-b from-dark-900/80 to-dark-950/90 border-r border-dark-700 shadow-glow backdrop-blur-lg sidebar-glass">
      {/* Logo */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <ShieldIcon className="text-primary-500 drop-shadow-glow animate-sidebar-icon" size={32} />
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-0 tracking-wide">ZeroTrust</h1>
            <p className="text-xs text-slate-400 font-semibold">Blockchain + AI Security</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link group relative ${isActive ? 'active sidebar-active' : ''}`
              }
              end={item.path === '/'}
            >
              <span className="sidebar-accent-bar" />
              <span className="group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="font-semibold tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </div>
        
        {/* Admin Section (conditional) */}
        {isConnected && (userRole === 'Admin' || userRole === 'Manager') && (
          <>
            <div className="mt-10 mb-3">
              <p className="px-4 text-xs font-bold uppercase tracking-widest text-primary-400/80">Administration</p>
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link group relative ${isActive ? 'active sidebar-active' : ''}`
                  }
                >
                  <span className="sidebar-accent-bar" />
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="font-semibold tracking-wide">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </>
        )}
        
        {/* Additional Links */}
        <div className="mt-10 mb-3">
          <p className="px-4 text-xs font-bold uppercase tracking-widest text-primary-400/80">Additional</p>
        </div>
        <div className="space-y-1">
          {additionalItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link group relative ${isActive ? 'active sidebar-active' : ''}`
              }
            >
              <span className="sidebar-accent-bar" />
              <span className="group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="font-semibold tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      
      {/* Version */}
      <div className="p-4 border-t border-dark-700 text-xs text-slate-500">
        <p>Version 0.1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;