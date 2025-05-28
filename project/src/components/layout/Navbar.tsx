import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MenuIcon, 
  BellIcon, 
  ShieldIcon, 
  WalletIcon,
  ChevronDownIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  ActivityIcon,
  AlertTriangleIcon,
  FileTextIcon,
  UsersIcon,
  ClipboardListIcon,
  DatabaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  SettingsIcon
} from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useSecurityData } from '../../contexts/SecurityDataContext';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dataSourceOpen, setDataSourceOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dataSourceRef = useRef<HTMLDivElement>(null);
  
  const { account, isConnected, connectWallet, disconnectWallet, userRole } = useWallet();
  const { dataSource, setDataSource } = useSecurityData();
  const location = useLocation();
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);
  
  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (dataSourceRef.current && !dataSourceRef.current.contains(event.target as Node)) {
        setDataSourceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Copy wallet address
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // View on explorer
  const viewOnExplorer = () => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`, '_blank');
    }
  };
  
  // Get page title from current location
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/events': return 'Event Timeline';
      case '/threats': return 'Threat Monitor';
      case '/users': return 'User Management';
      case '/audit': return 'Audit Trail';
      case '/docs': return 'Documentation';
      case '/connect': return 'Connect Wallet';
      default: return 'Dashboard';
    }
  };
  
  // Mobile navigation items
  const mobileNavItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon size={20} /> },
    { name: 'Events', path: '/events', icon: <ActivityIcon size={20} /> },
    { name: 'Threat Monitor', path: '/threats', icon: <AlertTriangleIcon size={20} /> },
    { name: 'User Management', path: '/users', icon: <UsersIcon size={20} /> },
    { name: 'Audit Trail', path: '/audit', icon: <ClipboardListIcon size={20} /> },
    { name: 'Documentation', path: '/docs', icon: <FileTextIcon size={20} /> },
  ];

  return (
    <header className="bg-dark-800 border-b border-dark-700 shadow-md">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Left: Mobile Menu Button & Logo (Mobile Only) */}
        <div className="flex items-center">
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={toggleMobileMenu}
          >
            <MenuIcon size={24} />
          </button>
          <div className="md:hidden flex items-center ml-2">
            <ShieldIcon className="text-primary-500" size={24} />
            <span className="ml-2 font-semibold">ZeroTrust</span>
          </div>
        </div>
        
        {/* Center: Page Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>
        
        {/* Right: Data Source Toggle, Notifications, Wallet */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Data Source Toggle */}
          <div className="hidden md:block relative" ref={dataSourceRef}>
            <button
              onClick={() => setDataSourceOpen(!dataSourceOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded border ${
                dataSourceOpen ? 'bg-dark-600 border-primary-500' : 'bg-dark-700 border-dark-600 hover:border-dark-500'
              }`}
            >
              <DatabaseIcon size={16} className={dataSource === 'on-chain' ? 'text-primary-400' : 'text-slate-400'} />
              <span className="text-sm font-medium">
                {dataSource === 'on-chain' ? 'On-Chain' : 'Off-Chain'}
              </span>
              <ChevronDownIcon size={16} className={`transform transition-transform duration-200 ${dataSourceOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dataSourceOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-md shadow-lg z-50 animate-slide-in">
                <div className="p-1">
                  <button
                    onClick={() => {
                      setDataSource('on-chain');
                      setDataSourceOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 p-2 text-sm rounded ${
                      dataSource === 'on-chain' ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-dark-700 text-slate-300'
                    }`}
                  >
                    <DatabaseIcon size={16} />
                    <span>On-Chain Data</span>
                    {dataSource === 'on-chain' && <CheckCircleIcon size={16} className="ml-auto" />}
                  </button>
                  <button
                    onClick={() => {
                      setDataSource('off-chain');
                      setDataSourceOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 p-2 text-sm rounded ${
                      dataSource === 'off-chain' ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-dark-700 text-slate-300'
                    }`}
                  >
                    <DatabaseIcon size={16} />
                    <span>Off-Chain Data</span>
                    {dataSource === 'off-chain' && <CheckCircleIcon size={16} className="ml-auto" />}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className={`p-2 rounded-full transition-colors relative ${
                notificationsOpen ? 'bg-dark-600 text-primary-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
              }`}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <div className="relative">
                <BellIcon size={20} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                  3
                </span>
              </div>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-dark-800 border border-dark-700 rounded-md shadow-lg z-50 animate-slide-in">
                <div className="p-3 border-b border-dark-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <button className="text-xs text-primary-400 hover:text-primary-300">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="p-3 border-b border-dark-700 hover:bg-dark-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-danger-500/20 rounded-full">
                        <AlertTriangleIcon size={16} className="text-danger-400" />
                      </div>
                      <div className="flex-1">
                    <p className="text-sm font-semibold text-danger-400">Critical Anomaly Detected</p>
                        <p className="text-xs text-slate-400 mt-1">Unusual access pattern detected from address 0x123...456. Multiple failed authentication attempts observed.</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-500">5 minutes ago</p>
                          <button className="text-xs text-primary-400 hover:text-primary-300">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b border-dark-700 hover:bg-dark-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-warning-500/20 rounded-full">
                        <UserIcon size={16} className="text-warning-400" />
                      </div>
                      <div className="flex-1">
                    <p className="text-sm font-semibold text-warning-400">New Role Assignment</p>
                        <p className="text-xs text-slate-400 mt-1">User 0x789...abc has been assigned the Manager role by the admin.</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-500">2 hours ago</p>
                          <button className="text-xs text-primary-400 hover:text-primary-300">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-dark-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-500/20 rounded-full">
                        <ShieldIcon size={16} className="text-primary-400" />
                      </div>
                      <div className="flex-1">
                    <p className="text-sm font-semibold text-primary-400">System Update</p>
                        <p className="text-xs text-slate-400 mt-1">Security policies have been updated successfully. New rules are now in effect.</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-500">1 day ago</p>
                          <button className="text-xs text-primary-400 hover:text-primary-300">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-dark-700">
                  <button className="w-full text-center text-sm text-primary-400 hover:text-primary-300 p-1">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Wallet Connection */}
          {!isConnected ? (
            <Link
              to="/connect"
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              <WalletIcon size={16} />
              <span>Connect</span>
            </Link>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                className={`flex items-center space-x-2 px-3 py-1.5 rounded border transition-colors ${
                  userMenuOpen ? 'bg-dark-600 border-primary-500' : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                }`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="p-1 bg-primary-500/20 rounded-full">
                  <UserIcon size={14} className="text-primary-400" />
                </div>
                <span className="hidden md:inline-block text-sm font-medium">
                  {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
                </span>
                <ChevronDownIcon size={16} className={`transform transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-dark-800 border border-dark-700 rounded-md shadow-lg z-50 animate-slide-in">
                  <div className="p-4 border-b border-dark-700">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-500/20 rounded-full">
                        <UserIcon size={20} className="text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{userRole}</p>
                        <p className="text-sm text-slate-400 mt-0.5 break-all">
                          {account}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={copyAddress}
                            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-300"
                          >
                            <CopyIcon size={12} />
                            <span>{copiedAddress ? 'Copied!' : 'Copy Address'}</span>
                          </button>
                          <button
                            onClick={viewOnExplorer}
                            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-300"
                          >
                            <ExternalLinkIcon size={12} />
                            <span>View on Explorer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-2 p-2 text-sm text-slate-400 hover:bg-dark-700 rounded">
                      <SettingsIcon size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-2 p-2 text-sm text-danger-400 hover:bg-dark-700 rounded"
                      onClick={disconnectWallet}
                    >
                      <LogOutIcon size={16} />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-800 animate-slide-in">
          <nav className="px-4 py-2 border-t border-dark-700">
            {mobileNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 p-3 hover:bg-dark-700 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Mobile Data Source Toggle */}
            <div className="flex items-center space-x-2 p-3">
              <span className="text-sm text-slate-400">Data Source:</span>
              <select
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value as 'on-chain' | 'off-chain')}
                className="bg-dark-700 border border-dark-600 rounded px-2 py-1 text-white"
              >
                <option value="on-chain">On-Chain</option>
                <option value="off-chain">Off-Chain</option>
              </select>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;