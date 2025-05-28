import React, { useEffect, useState } from 'react';
import { useSecurityData } from '../contexts/SecurityDataContext';
import { format } from 'date-fns';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  User,
  Shield,
  Activity,
  AlertOctagon,
  FileText,
  ChevronRight,
  Lock,
  UserX,
  KeyRound
} from 'lucide-react';

const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.7);
  }
`;

const SecurityMonitor: React.FC = () => {
  const { 
    events, 
    anomalies, 
    auditLogs, 
    users,
    monitorUserAction,
    dataSource
  } = useSecurityData();

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedAddress, setExpandedAddress] = useState<string | null>(null);

  useEffect(() => {
    // Add custom scrollbar styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Helper function to format timestamps consistently
  const formatTimestamp = (timestamp: number): string => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss');
    } catch (error) {
      console.error('Error formatting timestamp:', timestamp, error);
      return 'Invalid Date';
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'medium':
        return <Shield className="w-5 h-5 text-yellow-400" />;
      case 'low':
        return <Activity className="w-5 h-5 text-blue-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-gray-400" />;
    }
  };

  // Get card background color class
  const getCardBgClass = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-900/20 border-red-800/30 hover:bg-red-900/30 shadow-lg shadow-red-900/30';
      case 'high':
        return 'bg-orange-900/20 border-orange-800/30 hover:bg-orange-900/30 shadow-lg shadow-orange-900/30';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-800/30 hover:bg-yellow-900/30 shadow-lg shadow-yellow-900/30';
      case 'low':
        return 'bg-blue-900/20 border-blue-800/30 hover:bg-blue-900/30 shadow-lg shadow-blue-900/30';
      default:
        return 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/60 shadow-lg shadow-gray-900/30';
    }
  };

  // Test scenarios with icons
  const testScenarios = [
    {
      name: "Guest Trying Admin Panel",
      action: "ACCESS_ADMIN_PANEL",
      requiredRole: "Admin",
      description: "Guest trying to access admin settings",
      icon: <Lock className="w-4 h-4" />
    },
    {
      name: "Manager Trying System Config",
      action: "MODIFY_SYSTEM_CONFIG",
      requiredRole: "Admin",
      description: "Manager attempting to modify system configuration",
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: "Guest Trying User Management",
      action: "MANAGE_USERS",
      requiredRole: "Manager",
      description: "Guest attempting to manage users",
      icon: <UserX className="w-4 h-4" />
    },
    {
      name: "Multiple Failed MFA",
      action: "MULTIPLE_MFA_ATTEMPTS",
      requiredRole: "User",
      description: "Multiple failed MFA verification attempts",
      icon: <KeyRound className="w-4 h-4" />
    }
  ];

  // Function to simulate unauthorized access
  const simulateUnauthorizedAccess = async (userAddress: string, scenario: typeof testScenarios[0]) => {
    try {
      console.log(`🔒 Simulating: ${scenario.name}`);
      console.log(`👤 User: ${userAddress}`);
      console.log(`🎯 Required Role: ${scenario.requiredRole}`);
      
      await monitorUserAction(
        userAddress,
        scenario.action,
        scenario.requiredRole
      );
      
      console.log('✅ Action monitored successfully');
    } catch (error) {
      console.error('❌ Failed to monitor action:', error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Security Monitor</h2>
          <p className="text-gray-400 mt-1">Real-time threat detection and monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1.5 rounded-full flex items-center space-x-2 ${
            dataSource === 'on-chain' ? 'bg-green-900/20 text-green-400 shadow-lg shadow-green-900/20' : 'bg-blue-900/20 text-blue-400 shadow-lg shadow-blue-900/20'
          }`}>
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">{dataSource === 'on-chain' ? 'On-Chain' : 'Off-Chain'} Mode</span>
          </div>
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/30 overflow-hidden shadow-xl shadow-gray-900/50">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between cursor-pointer"
             onClick={() => setSelectedSection(selectedSection === 'scenarios' ? null : 'scenarios')}>
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-200">Test Unauthorized Access</h3>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${
            selectedSection === 'scenarios' ? 'rotate-90' : ''
          }`} />
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${
          selectedSection === 'scenarios' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {users
              .filter(user => user.role !== 'Admin')
              .map((user) => (
                <div key={user.address} 
                     className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-800/70 transition-colors shadow-lg shadow-gray-900/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="font-medium text-gray-200 cursor-pointer select-none"
                         onClick={() => setExpandedAddress(expandedAddress === user.address ? null : user.address)}>
                      {user.role} ({expandedAddress === user.address ? user.address : `${user.address.substring(0, 6)}...${user.address.slice(-4)}`})
                    </div>
                  </div>
                  <div className="space-y-2">
                    {testScenarios.map((scenario) => (
                      <button
                        key={scenario.name}
                        onClick={() => simulateUnauthorizedAccess(user.address, scenario)}
                        className="w-full px-4 py-3 text-left bg-blue-900/50 text-gray-100 rounded-lg 
                                 hover:bg-blue-800/50 transition-colors flex items-center justify-between 
                                 border border-blue-700/30 group shadow-md shadow-blue-900/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                            {scenario.icon}
                          </div>
                          <span>{scenario.name}</span>
                        </div>
                        <span className="text-sm bg-blue-800/50 px-2 py-1 rounded border border-blue-700/30">
                          Test
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Threats */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/30 overflow-hidden shadow-xl shadow-gray-900/50">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between cursor-pointer"
             onClick={() => setSelectedSection(selectedSection === 'threats' ? null : 'threats')}>
          <div className="flex items-center space-x-3">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-gray-200">Active Threats</h3>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${
            selectedSection === 'threats' ? 'rotate-90' : ''
          }`} />
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${
          selectedSection === 'threats' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {anomalies
              .filter(anomaly => !anomaly.mitigated)
              .map((anomaly) => (
                <div key={anomaly.id} 
                     className={`p-4 rounded-lg border transition-colors shadow-lg ${getCardBgClass(anomaly.severity)} ${
                       anomaly.severity === 'critical' ? 'shadow-red-900/30' :
                       anomaly.severity === 'high' ? 'shadow-orange-900/30' :
                       anomaly.severity === 'medium' ? 'shadow-yellow-900/30' :
                       'shadow-blue-900/30'
                     }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(anomaly.severity)}
                      <span className="font-medium text-red-400">{anomaly.type}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      anomaly.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      anomaly.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <div className="text-sm text-red-300">{anomaly.description}</div>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{anomaly.address.substring(0, 6)}...{anomaly.address.slice(-4)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimestamp(anomaly.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/30 overflow-hidden shadow-xl shadow-gray-900/50">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between cursor-pointer"
             onClick={() => setSelectedSection(selectedSection === 'events' ? null : 'events')}>
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-200">Recent Security Events</h3>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${
            selectedSection === 'events' ? 'rotate-90' : ''
          }`} />
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${
          selectedSection === 'events' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {events.map((event) => (
              <div key={event.id} 
                   className={`p-4 rounded-lg border transition-colors shadow-lg ${getCardBgClass(event.severity)} ${
                     event.severity === 'critical' ? 'shadow-red-900/30' :
                     event.severity === 'high' ? 'shadow-orange-900/30' :
                     event.severity === 'medium' ? 'shadow-yellow-900/30' :
                     'shadow-blue-900/30'
                   }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(event.severity)}
                    <span className="font-medium text-gray-200">{event.type}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {event.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{event.address.substring(0, 6)}...{event.address.slice(-4)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimestamp(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/30 overflow-hidden shadow-xl shadow-gray-900/50">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between cursor-pointer"
             onClick={() => setSelectedSection(selectedSection === 'audit' ? null : 'audit')}>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-200">Audit Log</h3>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${
            selectedSection === 'audit' ? 'rotate-90' : ''
          }`} />
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${
          selectedSection === 'audit' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {auditLogs.map((log) => (
              <div key={log.id} 
                   className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg 
                            hover:bg-gray-800/70 transition-colors shadow-lg shadow-gray-900/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <div className="font-medium text-gray-200">{log.action}</div>
                </div>
                <div className="text-sm text-gray-400 ml-7">{log.details}</div>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{log.address.substring(0, 6)}...{log.address.slice(-4)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default SecurityMonitor;