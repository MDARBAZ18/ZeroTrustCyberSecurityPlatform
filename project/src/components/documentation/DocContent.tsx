import React from 'react';
import {
  Shield,
  Lock,
  Key,
  Users,
  AlertTriangle,
  Code,
  Terminal,
  Cpu,
  Network,
  Layers,
  Database,
  Server,
  CheckIcon,
  ArrowRightIcon,
  ShieldIcon,
  UsersIcon,
  ServerIcon,
  GitBranch,
  FileText,
  Settings,
  Workflow
} from 'lucide-react';

interface DocContentProps {
  activeSection: string;
}

// Add the contract code example
const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ZeroTrustIAM {
    // Role definitions
    enum Role { Guest, Auditor, Manager, Admin }
    
    // User structure
    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
        bool mfaVerified;
        uint256 lastActivity;
    }
    
    // Storage
    mapping(address => User) public users;
    address[] public registeredUsers;
    address public owner;
    
    // Events
    event UserRegistered(address indexed user, Role role);
    event RoleAssigned(address indexed user, Role oldRole, Role newRole);
    event MFAVerified(address indexed user, bool success);
    event ActionLogged(address indexed user, string action);
    event AnomalyFlagged(address indexed user, string anomalyType);
    
    // Constructor and functions...
}`;

const DocContent: React.FC<DocContentProps> = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">System Overview</h2>
            <p className="text-slate-300 leading-relaxed">
              The Blockchain Security Monitoring System is a comprehensive solution that combines blockchain technology 
              with AI-powered security monitoring. It provides real-time threat detection, role-based access control, 
              and immutable audit trails for enterprise security management.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <ShieldIcon size={18} className="text-primary-500 mr-2" />
                  Blockchain Benefits
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Immutable audit trail
                  </li>
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Decentralized access control
                  </li>
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Transparent security policies
                  </li>
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Tamper-proof event logging
                  </li>
                </ul>
              </div>

              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <ServerIcon size={18} className="text-primary-500 mr-2" />
                  AI Benefits
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Pattern recognition for threats
                  </li>
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Anomaly detection
                  </li>
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Predictive security measures
                  </li>
                  <li className="flex items-center">
                    <CheckIcon size={14} className="text-primary-500 mr-2" />
                    Automated response recommendations
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Real-time Monitoring',
                    icon: <AlertTriangle size={20} className="text-warning-500" />,
                    description: 'Continuous monitoring of security events and anomalies'
                  },
                  {
                    title: 'Smart Contracts',
                    icon: <Code size={20} className="text-primary-500" />,
                    description: 'Automated enforcement of security policies'
                  },
                  {
                    title: 'AI Analytics',
                    icon: <Cpu size={20} className="text-success-500" />,
                    description: 'Advanced threat detection and analysis'
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-dark-600 rounded-lg mr-3">
                        {feature.icon}
                      </div>
                      <h4 className="font-medium">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">System Architecture</h2>
            <p className="text-slate-300 leading-relaxed">
              The system follows a modern, layered architecture that combines blockchain technology with traditional 
              security monitoring systems. Each component is designed for scalability, resilience, and real-time performance.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Architecture Layers</h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Frontend Layer',
                    icon: <Layers size={20} className="text-primary-500" />,
                    items: ['React Dashboard', 'Real-time Updates', 'Interactive Monitoring']
                  },
                  {
                    title: 'Integration Layer',
                    icon: <Network size={20} className="text-success-500" />,
                    items: ['REST API Gateway', 'WebSocket Server', 'Blockchain RPC Interface']
                  },
                  {
                    title: 'Core Services',
                    icon: <Server size={20} className="text-warning-500" />,
                    items: ['Security Monitor Service', 'Authentication Service', 'Smart Contract Listener']
                  },
                  {
                    title: 'Data Layer',
                    icon: <Database size={20} className="text-danger-500" />,
                    items: ['Blockchain Node', 'PostgreSQL Database', 'Redis Cache']
                  }
                ].map((layer, index) => (
                  <div key={index} className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-dark-600 rounded-lg mr-3">
                        {layer.icon}
                      </div>
                      <h4 className="font-medium">{layer.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {layer.items.map((item, i) => (
                        <li key={i} className="flex items-center text-sm text-slate-300">
                          <CheckIcon size={14} className="text-primary-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Data Flow</h3>
              <div className="bg-dark-700 rounded-lg p-6">
                <ol className="space-y-4">
                  {[
                    'User interacts with the frontend application',
                    'Frontend communicates with backend services and blockchain',
                    'Backend processes requests and maintains event database',
                    'Smart contract manages access control and events',
                    'AI system analyzes patterns and detects anomalies',
                    'Real-time updates are pushed to frontend via WebSocket'
                  ].map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-slate-300">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Key Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Frontend Application',
                    description: 'React-based dashboard with real-time monitoring capabilities',
                    icon: <Layers size={20} className="text-primary-500" />
                  },
                  {
                    title: 'Backend Services',
                    description: 'Node.js microservices for processing and analysis',
                    icon: <Server size={20} className="text-success-500" />
                  },
                  {
                    title: 'Smart Contracts',
                    description: 'Solidity contracts for access control and event logging',
                    icon: <Code size={20} className="text-warning-500" />
                  },
                  {
                    title: 'AI System',
                    description: 'Machine learning models for threat detection',
                    icon: <Cpu size={20} className="text-danger-500" />
                  }
                ].map((component, index) => (
                  <div key={index} className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-dark-600 rounded-lg mr-3">
                        {component.icon}
                      </div>
                      <h4 className="font-medium">{component.title}</h4>
                    </div>
                    <p className="text-sm text-slate-400">{component.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'smart-contract':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Smart Contract</h2>
            <p className="text-slate-300 leading-relaxed">
              The ZeroTrust platform is powered by a Solidity smart contract deployed on the Ethereum Sepolia testnet. 
              This contract manages user roles, access control, and security events in a decentralized manner.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Key Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'registerUser',
                    params: '(address, role)',
                    description: 'Registers a new user with the specified role'
                  },
                  {
                    name: 'assignRole',
                    params: '(address, newRole)',
                    description: 'Changes a user\'s role to a new role'
                  },
                  {
                    name: 'verifyMFA',
                    params: '(address)',
                    description: 'Verifies MFA for a user'
                  },
                  {
                    name: 'flagAnomaly',
                    params: '(address, anomalyType)',
                    description: 'Flags an anomaly for a specific user'
                  }
                ].map((func, index) => (
                  <div key={index} className="bg-dark-700 p-4 rounded-lg">
                    <h4 className="font-medium text-primary-400">
                      {func.name}
                      <span className="text-slate-400">{func.params}</span>
                    </h4>
                    <p className="text-sm text-slate-300 mt-2">{func.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  'UserRegistered',
                  'RoleAssigned',
                  'MFAVerified',
                  'ActionLogged',
                  'AnomalyFlagged'
                ].map((event, index) => (
                  <div key={index} className="bg-dark-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                      <h4 className="font-medium text-sm">{event}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Contract Code</h3>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Code size={16} className="text-primary-400" />
                    <span className="text-sm font-medium">ZeroTrustIAM.sol</span>
                  </div>
                  <div className="text-xs text-slate-500">Solidity ^0.8.17</div>
                </div>
                <pre className="text-sm text-slate-300 font-mono whitespace-pre overflow-x-auto">
                  {contractCode}
                </pre>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Deployment</h3>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Network</span>
                    <span className="text-sm font-medium">Sepolia Testnet</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Chain ID</span>
                    <span className="text-sm font-medium">11155111</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Contract Address</span>
                    <code className="text-xs bg-dark-600 px-2 py-1 rounded">
                      0xB4801c10221F067400e8BFdA39181bCC55Aa7D78
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Security Model</h2>
            <p className="text-slate-300 leading-relaxed">
              The ZeroTrust Platform implements a comprehensive security model that combines blockchain-based access control 
              with AI-powered monitoring to ensure system integrity and protect against threats.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Zero Trust Principles</h3>
              <div className="bg-dark-700 rounded-lg p-4 mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-medium">Verify Explicitly</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Always authenticate and authorize based on all available data points
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-medium">Use Least Privilege Access</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Limit user access with Just-In-Time and Just-Enough-Access
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-medium">Assume Breach</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Minimize blast radius and segment access. Verify end-to-end encryption.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4">Blockchain Security Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-700 p-4 rounded-lg">
                  <h4 className="font-medium">Immutable Audit Trail</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    All security events are recorded on the blockchain and cannot be altered
                  </p>
                </div>
                <div className="bg-dark-700 p-4 rounded-lg">
                  <h4 className="font-medium">Cryptographic Identity</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Users are identified by their cryptographic wallet addresses
                  </p>
                </div>
                <div className="bg-dark-700 p-4 rounded-lg">
                  <h4 className="font-medium">Role-Based Smart Contract</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Access control is enforced by immutable smart contract logic
                  </p>
                </div>
                <div className="bg-dark-700 p-4 rounded-lg">
                  <h4 className="font-medium">Multi-Factor Authentication</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Combines wallet signatures with additional verification
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">AI Monitoring Capabilities</h3>
              <div className="bg-dark-700 rounded-lg p-4 mb-6">
                <p className="text-slate-300 mb-4">
                  The platform uses AI algorithms to analyze patterns and detect anomalies in user behavior and system activity.
                </p>

                <h4 className="font-medium mb-2">Types of anomalies detected:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-dark-600 p-3 rounded-lg border border-dark-500">
                    <span className="text-sm">Multiple Failed Login Attempts</span>
                  </div>
                  <div className="bg-dark-600 p-3 rounded-lg border border-dark-500">
                    <span className="text-sm">Unusual Access Patterns</span>
                  </div>
                  <div className="bg-dark-600 p-3 rounded-lg border border-dark-500">
                    <span className="text-sm">Role Escalation Attempts</span>
                  </div>
                  <div className="bg-dark-600 p-3 rounded-lg border border-dark-500">
                    <span className="text-sm">MFA Bypass Attempts</span>
                  </div>
                  <div className="bg-dark-600 p-3 rounded-lg border border-dark-500">
                    <span className="text-sm">Unusual Transaction Patterns</span>
                  </div>
                  <div className="bg-dark-600 p-3 rounded-lg border border-dark-500">
                    <span className="text-sm">Unauthorized Contract Calls</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Response Framework</h3>
              <p className="text-slate-300 mb-4">
                When threats are detected, the system follows a structured response framework:
              </p>

              <ol className="space-y-2 mb-6">
                <li className="flex items-start bg-dark-700 p-3 rounded-lg">
                  <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium">Detection</h4>
                    <p className="text-sm text-slate-400">System identifies potential threat and classifies severity</p>
                  </div>
                </li>
                <li className="flex items-start bg-dark-700 p-3 rounded-lg">
                  <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium">Notification</h4>
                    <p className="text-sm text-slate-400">Alerts are generated for relevant users (Admin, Manager)</p>
                  </div>
                </li>
                <li className="flex items-start bg-dark-700 p-3 rounded-lg">
                  <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium">Containment</h4>
                    <p className="text-sm text-slate-400">System takes automatic containment actions based on threat type</p>
                  </div>
                </li>
                <li className="flex items-start bg-dark-700 p-3 rounded-lg">
                  <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-medium">Mitigation</h4>
                    <p className="text-sm text-slate-400">Admin users can implement mitigation measures</p>
                  </div>
                </li>
                <li className="flex items-start bg-dark-700 p-3 rounded-lg">
                  <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</div>
                  <div>
                    <h4 className="font-medium">Documentation</h4>
                    <p className="text-sm text-slate-400">All response actions are logged and immutably recorded</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        );

      case 'roles':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">User Roles & Permissions</h2>
            <p className="text-slate-300 leading-relaxed">
              The ZeroTrust platform implements a role-based access control (RBAC) system through the smart contract. 
              Each role has specific permissions and capabilities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Admin Role */}
              <div className="bg-dark-700 rounded-lg p-4 border-l-4 border-danger-500">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-danger-500/20 rounded-full mr-3">
                    <UsersIcon size={18} className="text-danger-500" />
                  </div>
                  <h3 className="text-lg font-medium">Admin</h3>
                </div>
                
                <p className="text-sm text-slate-300 mb-3">
                  System administrators with full access to all platform features and management capabilities.
                </p>
                
                <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Permissions</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Register new users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Assign roles to users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Flag anomalies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Access all dashboard features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Modify system settings</span>
                  </li>
                </ul>
              </div>
              
              {/* Manager Role */}
              <div className="bg-dark-700 rounded-lg p-4 border-l-4 border-warning-500">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-warning-500/20 rounded-full mr-3">
                    <UsersIcon size={18} className="text-warning-500" />
                  </div>
                  <h3 className="text-lg font-medium">Manager</h3>
                </div>
                
                <p className="text-sm text-slate-300 mb-3">
                  Users with elevated privileges who can manage certain aspects of the system but have limited administrative power.
                </p>
                
                <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Permissions</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>View all users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>View and respond to anomalies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Access most dashboard features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-warning-500 mr-2 mt-0.5" />
                    <span>Cannot register new users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-warning-500 mr-2 mt-0.5" />
                    <span>Cannot assign roles</span>
                  </li>
                </ul>
              </div>
              
              {/* Auditor Role */}
              <div className="bg-dark-700 rounded-lg p-4 border-l-4 border-primary-500">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-primary-500/20 rounded-full mr-3">
                    <UsersIcon size={18} className="text-primary-500" />
                  </div>
                  <h3 className="text-lg font-medium">Auditor</h3>
                </div>
                
                <p className="text-sm text-slate-300 mb-3">
                  Users with read-only access responsible for monitoring and reviewing system activity.
                </p>
                
                <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Permissions</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>View all events and logs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>View threats and anomalies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Generate reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-warning-500 mr-2 mt-0.5" />
                    <span>Read-only access (no modifications)</span>
                  </li>
                </ul>
              </div>
              
              {/* Guest Role */}
              <div className="bg-dark-700 rounded-lg p-4 border-l-4 border-slate-500">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-slate-500/20 rounded-full mr-3">
                    <UsersIcon size={18} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium">Guest</h3>
                </div>
                
                <p className="text-sm text-slate-300 mb-3">
                  Basic users with minimal access to the system, typically for demonstration or limited viewing.
                </p>
                
                <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Permissions</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>View basic dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-success-500 mr-2 mt-0.5" />
                    <span>Access documentation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-warning-500 mr-2 mt-0.5" />
                    <span>Cannot view detailed events</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-warning-500 mr-2 mt-0.5" />
                    <span>No access to user management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={14} className="text-warning-500 mr-2 mt-0.5" />
                    <span>No access to threat details</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Role Assignment</h3>
              <p className="text-slate-300 leading-relaxed">
                Roles are assigned through the smart contract's <code>registerUser</code> and <code>assignRole</code> functions. 
                Only Admin users can assign roles to others. When a user connects their wallet for the first time, they are 
                assigned the Guest role by default until an Admin promotes them.
              </p>
            </div>
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">System Monitoring</h2>
            <p className="text-slate-300 leading-relaxed">
              The platform provides comprehensive real-time monitoring capabilities to track system health, 
              user activities, and security events. The monitoring system combines blockchain event tracking 
              with AI-powered analytics.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Real-time Dashboards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Security Overview',
                    metrics: [
                      'Active Users',
                      'Security Events',
                      'Threat Level',
                      'System Health'
                    ],
                    icon: <Shield size={20} className="text-primary-500" />
                  },
                  {
                    title: 'User Activity',
                    metrics: [
                      'Login Attempts',
                      'Role Changes',
                      'Access Patterns',
                      'MFA Status'
                    ],
                    icon: <Users size={20} className="text-success-500" />
                  },
                  {
                    title: 'Smart Contract',
                    metrics: [
                      'Contract Events',
                      'Gas Usage',
                      'Function Calls',
                      'State Changes'
                    ],
                    icon: <Code size={20} className="text-warning-500" />
                  },
                  {
                    title: 'System Metrics',
                    metrics: [
                      'Response Time',
                      'API Usage',
                      'Error Rates',
                      'Resource Usage'
                    ],
                    icon: <Cpu size={20} className="text-danger-500" />
                  }
                ].map((dashboard, index) => (
                  <div key={index} className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-dark-600 rounded-lg mr-3">
                        {dashboard.icon}
                      </div>
                      <h4 className="font-medium">{dashboard.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {dashboard.metrics.map((metric, i) => (
                        <li key={i} className="flex items-center text-sm text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Alert System</h3>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="space-y-4">
                  <h4 className="font-medium mb-2">Alert Severity Levels</h4>
                  <div className="space-y-3">
                    {[
                      {
                        level: 'Critical',
                        color: 'danger',
                        description: 'Immediate action required - Major security threat detected'
                      },
                      {
                        level: 'High',
                        color: 'warning',
                        description: 'Urgent attention needed - Potential security risk identified'
                      },
                      {
                        level: 'Medium',
                        color: 'primary',
                        description: 'Investigation required - Unusual activity detected'
                      },
                      {
                        level: 'Low',
                        color: 'success',
                        description: 'Monitoring advised - Minor anomaly detected'
                      }
                    ].map((alert, index) => (
                      <div key={index} className="flex items-center justify-between bg-dark-600 p-3 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full bg-${alert.color}-500 mr-3`}></div>
                          <span className="font-medium">{alert.level}</span>
                        </div>
                        <span className="text-sm text-slate-400">{alert.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Monitoring Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Real-time Updates',
                    description: 'Live monitoring of all system events and metrics',
                    icon: <Network size={20} className="text-primary-500" />
                  },
                  {
                    title: 'Historical Analysis',
                    description: 'Track trends and patterns over time',
                    icon: <GitBranch size={20} className="text-success-500" />
                  },
                  {
                    title: 'Custom Alerts',
                    description: 'Configure alert rules and thresholds',
                    icon: <AlertTriangle size={20} className="text-warning-500" />
                  },
                  {
                    title: 'Performance Metrics',
                    description: 'Monitor system and API performance',
                    icon: <Workflow size={20} className="text-danger-500" />
                  },
                  {
                    title: 'Audit Logs',
                    description: 'Detailed logs of all system activities',
                    icon: <FileText size={20} className="text-primary-500" />
                  },
                  {
                    title: 'Custom Reports',
                    description: 'Generate detailed monitoring reports',
                    icon: <Settings size={20} className="text-success-500" />
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-dark-600 rounded-lg mr-3">
                        {feature.icon}
                      </div>
                      <h4 className="font-medium">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Data Retention</h3>
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-slate-300 mb-4">
                  The monitoring system retains data according to the following schedule:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      type: 'Real-time Metrics',
                      retention: '24 hours at full resolution'
                    },
                    {
                      type: 'Hourly Aggregates',
                      retention: '30 days'
                    },
                    {
                      type: 'Daily Aggregates',
                      retention: '1 year'
                    },
                    {
                      type: 'Security Events',
                      retention: 'Permanent (blockchain)'
                    }
                  ].map((policy, index) => (
                    <div key={index} className="flex items-center justify-between bg-dark-600 p-3 rounded-lg">
                      <span className="font-medium">{policy.type}</span>
                      <span className="text-sm text-slate-400">{policy.retention}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">API Reference</h2>
            <p className="text-slate-300 leading-relaxed">
              The platform provides a comprehensive REST API for integration with external systems. 
              All endpoints require authentication and follow standard HTTP conventions.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Authentication</h3>
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-slate-300 mb-4">
                  Authentication is handled through JWT tokens. Include the token in the Authorization header:
                </p>
                <pre className="bg-dark-600 p-3 rounded-lg text-sm font-mono text-slate-300">
                  Authorization: Bearer {'<your-jwt-token>'}
                </pre>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <div className="space-y-4">
                {[
                  {
                    method: 'POST',
                    endpoint: '/api/v1/users',
                    description: 'Register a new user',
                    request: {
                      address: 'string',
                      role: 'Role'
                    },
                    response: {
                      id: 'string',
                      address: 'string',
                      role: 'Role',
                      createdAt: 'timestamp'
                    }
                  },
                  {
                    method: 'PUT',
                    endpoint: '/api/v1/users/{address}/role',
                    description: 'Update user role',
                    request: {
                      role: 'Role'
                    },
                    response: {
                      address: 'string',
                      role: 'Role',
                      updatedAt: 'timestamp'
                    }
                  },
                  {
                    method: 'GET',
                    endpoint: '/api/v1/users/{address}',
                    description: 'Get user details',
                    response: {
                      address: 'string',
                      role: 'Role',
                      isActive: 'boolean',
                      lastActivity: 'timestamp'
                    }
                  }
                ].map((api, index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium
                          ${api.method === 'GET' ? 'bg-success-500/20 text-success-400' :
                            api.method === 'POST' ? 'bg-primary-500/20 text-primary-400' :
                            'bg-warning-500/20 text-warning-400'}`}>
                          {api.method}
                        </span>
                        <code className="text-sm">{api.endpoint}</code>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{api.description}</p>
                    {api.request && (
                      <div className="mb-3">
                        <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Request Body</h4>
                        <pre className="bg-dark-600 p-2 rounded text-xs">
                          {JSON.stringify(api.request, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Response</h4>
                      <pre className="bg-dark-600 p-2 rounded text-xs">
                        {JSON.stringify(api.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Security Events</h3>
              <div className="space-y-4">
                {[
                  {
                    method: 'POST',
                    endpoint: '/api/v1/events',
                    description: 'Create security event',
                    request: {
                      type: 'string',
                      severity: 'high | medium | low',
                      details: 'object'
                    }
                  },
                  {
                    method: 'GET',
                    endpoint: '/api/v1/events',
                    description: 'List security events',
                    query: {
                      from: 'timestamp',
                      to: 'timestamp',
                      severity: 'string',
                      limit: 'number'
                    }
                  },
                  {
                    method: 'GET',
                    endpoint: '/api/v1/events/{id}',
                    description: 'Get event details'
                  }
                ].map((api, index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium
                          ${api.method === 'GET' ? 'bg-success-500/20 text-success-400' :
                            api.method === 'POST' ? 'bg-primary-500/20 text-primary-400' :
                            'bg-warning-500/20 text-warning-400'}`}>
                          {api.method}
                        </span>
                        <code className="text-sm">{api.endpoint}</code>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{api.description}</p>
                    {api.request && (
                      <div className="mb-3">
                        <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Request Body</h4>
                        <pre className="bg-dark-600 p-2 rounded text-xs">
                          {JSON.stringify(api.request, null, 2)}
                        </pre>
                      </div>
                    )}
                    {api.query && (
                      <div className="mb-3">
                        <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Query Parameters</h4>
                        <pre className="bg-dark-600 p-2 rounded text-xs">
                          {JSON.stringify(api.query, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Rate Limiting</h3>
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-slate-300 mb-4">
                  API requests are rate limited based on the client's IP address and API key. The current limits are:
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                    <span>100 requests per minute for authenticated users</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                    <span>20 requests per minute for unauthenticated users</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Error Handling</h3>
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-slate-300 mb-4">
                  The API uses standard HTTP status codes and returns error responses in the following format:
                </p>
                <pre className="bg-dark-600 p-3 rounded-lg text-sm font-mono text-slate-300">
{`{
  "error": {
    "code": "string",
    "message": "string",
    "details": object (optional)
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderContent()}
    </div>
  );
};

export default DocContent; 