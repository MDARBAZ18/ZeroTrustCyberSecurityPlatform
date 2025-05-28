import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getContractInstance } from '../blockchain/contract';

// Types
type EventType = 'UserRegistered' | 'RoleAssigned' | 'MFAVerified' | 'ActionLogged' | 'AnomalyFlagged';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
type DataSource = 'on-chain' | 'off-chain';

export interface SecurityEvent {
  id: string;
  type: EventType;
  address: string;
  timestamp: number;
  data: Record<string, any>;
  severity: Severity;
  source: DataSource;
}

export interface AnomalyReport {
  id: string;
  address: string;
  timestamp: number;
  type: string;
  severity: Severity;
  description: string;
  mitigated: boolean;
  source: DataSource;
}

export interface AuditLog {
  id: string;
  address: string;
  action: string;
  timestamp: number;
  details: string;
  source: DataSource;
}

export interface UserStatus {
  address: string;
  role: string;
  registered: boolean;
  lastActivity: number;
  mfaVerified: boolean;
  source: DataSource;
}

type SecurityDataContextType = {
  events: SecurityEvent[];
  anomalies: AnomalyReport[];
  auditLogs: AuditLog[];
  users: UserStatus[];
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  refreshData: () => void;
  loading: boolean;
  addUser: (address: string, role: string) => void;
  assignRole: (address: string, newRole: string) => void;
  monitorUserAction: (address: string, action: string, requiredRole: string) => void;
  createThreat: (threat: Omit<AnomalyReport, 'id' | 'timestamp' | 'source'>) => void;
  mitigateThreat: (threatId: string) => void;
  deleteThreat: (threatId: string) => void;
};

type SecurityDataProviderProps = {
  children: ReactNode;
};

// Create context
const SecurityDataContext = createContext<SecurityDataContextType>({
  events: [],
  anomalies: [],
  auditLogs: [],
  users: [],
  dataSource: 'off-chain',
  setDataSource: () => {},
  refreshData: () => {},
  loading: false,
  addUser: () => {},
  assignRole: () => {},
  monitorUserAction: () => {},
  createThreat: () => {},
  mitigateThreat: () => {},
  deleteThreat: () => {},
});

// Helper to generate mock data
const generateMockData = () => {
  const addresses = [
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097'
  ];

  const eventTypes: EventType[] = ['UserRegistered', 'RoleAssigned', 'MFAVerified', 'ActionLogged', 'AnomalyFlagged'];
  const severities: Severity[] = ['low', 'medium', 'high', 'critical'];
  const roles = ['Admin', 'Manager', 'Auditor', 'Guest'];
  const anomalyTypes = [
    'Multiple Failed Login Attempts',
    'Unusual Access Pattern',
    'Role Escalation Attempt',
    'MFA Bypass Attempt',
    'Unauthorized Contract Call'
  ];

  const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randomTimestamp = () => Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);

  const events: SecurityEvent[] = Array.from({ length: 50 }, (_, i) => ({
    id: `evt-${i}`,
    type: getRandom(eventTypes),
    address: getRandom(addresses),
    timestamp: randomTimestamp(),
    data: {},
    severity: getRandom(severities),
    source: 'off-chain',
  }));

  const anomalies: AnomalyReport[] = Array.from({ length: 15 }, (_, i) => ({
    id: `anm-${i}`,
    address: getRandom(addresses),
    timestamp: randomTimestamp(),
    type: getRandom(anomalyTypes),
    severity: getRandom(severities),
    description: `Detected possible ${getRandom(anomalyTypes).toLowerCase()} from address ${getRandom(addresses).substring(0, 10)}...`,
    mitigated: Math.random() > 0.6,
    source: 'off-chain',
  }));

  const auditLogs: AuditLog[] = Array.from({ length: 100 }, (_, i) => ({
    id: `log-${i}`,
    address: getRandom(addresses),
    action: getRandom(['Contract deployed', 'User registered', 'Role changed', 'Contract call', 'MFA verified']),
    timestamp: randomTimestamp(),
    details: `Detail information for action`,
    source: 'off-chain',
  }));

  const users: UserStatus[] = addresses.map((address) => ({
    address,
    role: getRandom(roles),
    registered: Math.random() > 0.1,
    lastActivity: randomTimestamp(),
    mfaVerified: Math.random() > 0.2,
    source: 'off-chain',
  }));

  return { events, anomalies, auditLogs, users };
};

// ✅ Provider component (fixed)
export const SecurityDataProvider = ({ children }: SecurityDataProviderProps) => {
  // Separate states for off-chain and on-chain data
  const [offChainData, setOffChainData] = useState({
    events: [] as SecurityEvent[],
    anomalies: [] as AnomalyReport[],
    auditLogs: [] as AuditLog[],
    users: [] as UserStatus[]
  });

  const [onChainData, setOnChainData] = useState({
    events: [] as SecurityEvent[],
    anomalies: [] as AnomalyReport[],
    auditLogs: [] as AuditLog[],
    users: [] as UserStatus[]
  });

  const [dataSource, setDataSource] = useState<DataSource>('off-chain');
  const [loading, setLoading] = useState<boolean>(true);

  // Current data based on selected source
  const currentData = dataSource === 'off-chain' ? offChainData : onChainData;

  // Add blockchain event listeners
  useEffect(() => {
    if (dataSource === 'on-chain') {
      const setupListeners = async () => {
        try {
          const contract = await getContractInstance();

          // Listen for UserRegistered events
          contract.on("UserRegistered", (user: string, role: string) => {
            console.log("🔵 New user registered:", user, role);
            refreshOnChainData(); // Only refresh on-chain data
          });

          // Listen for RoleAssigned events
          contract.on("RoleAssigned", (user: string, oldRole: string, newRole: string) => {
            console.log("🔵 Role changed for:", user, oldRole, "->", newRole);
            refreshOnChainData();
          });

          // Listen for MFAVerified events
          contract.on("MFAVerified", (user: string, success: boolean) => {
            console.log("🔵 MFA verification:", user, success ? "✅" : "❌");
            refreshOnChainData();
          });

          // Listen for AnomalyDetected events
          contract.on("AnomalyDetected", (id: number, user: string, anomalyType: string) => {
            console.log("🚨 Anomaly detected:", id, user, anomalyType);
            refreshOnChainData();
          });

        } catch (error) {
          console.error("Failed to setup blockchain listeners:", error);
        }
      };

      setupListeners();
      return () => {
        const cleanup = async () => {
          const contract = await getContractInstance();
          contract.removeAllListeners();
        };
        cleanup();
      };
    }
  }, [dataSource]);

  // Function to refresh only on-chain data
  const refreshOnChainData = async () => {
    try {
      console.log("🔄 Refreshing on-chain data...");
      const contract = await getContractInstance();
      
      // Helper function to convert blockchain timestamp to JS timestamp
      const convertTimestamp = (blockchainTimestamp: bigint | number): number => {
        // Blockchain timestamps are in seconds, JS timestamps are in milliseconds
        return Number(blockchainTimestamp) * 1000;
      };
      
      // Fetch users from blockchain
      const users = await contract.getUsers();
      const mappedUsers = users.map((user: any) => ({
        address: user.addr.toString(),
        role: user.role.toString(),
        registered: Boolean(user.registered),
        lastActivity: convertTimestamp(user.lastActivity),
        mfaVerified: Boolean(user.mfaVerified),
        source: 'on-chain' as DataSource
      }));

      // Fetch events
      const events = await contract.getEvents();
      const mappedEvents = events.map((event: any) => ({
        id: `evt-${Number(event.timestamp)}`,
        type: event.eventType.toString() as EventType,
        address: event.addr.toString(),
        timestamp: convertTimestamp(event.timestamp),
        data: JSON.parse(event.data),
        severity: event.severity.toString() as Severity,
        source: 'on-chain' as DataSource
      }));

      // Fetch anomalies
      const anomalies = await contract.getAnomalies();
      const mappedAnomalies = anomalies.map((anomaly: any) => ({
        id: `anm-${Number(anomaly.id)}`,
        address: anomaly.addr.toString(),
        timestamp: convertTimestamp(anomaly.timestamp),
        type: anomaly.anomalyType.toString(),
        severity: anomaly.severity.toString() as Severity,
        description: anomaly.description.toString(),
        mitigated: Boolean(anomaly.mitigated),
        source: 'on-chain' as DataSource
      }));

      // Fetch audit logs
      const logs = await contract.getAuditLogs();
      const mappedLogs = logs.map((log: any) => ({
        id: `log-${Number(log.id)}`,
        address: log.addr.toString(),
        action: log.action.toString(),
        timestamp: convertTimestamp(log.timestamp),
        details: log.details.toString(),
        source: 'on-chain' as DataSource
      }));

      // Update only on-chain data
      setOnChainData({
        events: mappedEvents,
        anomalies: mappedAnomalies,
        auditLogs: mappedLogs,
        users: mappedUsers
      });

    } catch (error) {
      console.error('❌ Error fetching on-chain data:', error);
    }
  };

  // Function to refresh only off-chain data
  const refreshOffChainData = () => {
    const mockData = generateMockData();
    setOffChainData({
      events: mockData.events.map(e => ({ ...e, source: 'off-chain' })),
      anomalies: mockData.anomalies.map(a => ({ ...a, source: 'off-chain' })),
      auditLogs: mockData.auditLogs.map(l => ({ ...l, source: 'off-chain' })),
      users: mockData.users.map(u => ({ ...u, source: 'off-chain' }))
    });
  };

  // Main refresh function that updates data based on source
  const refreshData = async () => {
    setLoading(true);
    try {
      if (dataSource === 'on-chain') {
        await refreshOnChainData();
      } else {
        refreshOffChainData();
      }
    } catch (error) {
      console.error('❌ Error in refreshData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data when source changes
  useEffect(() => {
    refreshData();
  }, [dataSource]);

  // Function to create a new threat
  const createThreat = (threat: Omit<AnomalyReport, 'id' | 'timestamp' | 'source'>) => {
    if (dataSource === 'on-chain') {
      const newThreat: AnomalyReport = {
        ...threat,
        id: `anm-${Date.now()}`,
        timestamp: Date.now(),
        source: 'on-chain' as DataSource
      };
      setOnChainData(prev => ({
        ...prev,
        anomalies: [...prev.anomalies, newThreat]
      }));
    }
  };

  // Function to mitigate a threat
  const mitigateThreat = (threatId: string) => {
    if (dataSource === 'on-chain') {
      setOnChainData(prev => ({
        ...prev,
        anomalies: prev.anomalies.map(threat => 
          threat.id === threatId 
            ? { ...threat, mitigated: true }
            : threat
        )
      }));
    }
  };

  // Function to delete a threat
  const deleteThreat = (threatId: string) => {
    if (dataSource === 'on-chain') {
      setOnChainData(prev => ({
        ...prev,
        anomalies: prev.anomalies.filter(threat => threat.id !== threatId)
      }));
    }
  };

  // Function to add a new user
  const addUser = async (address: string, role: string) => {
    if (dataSource === 'on-chain') {
      try {
        console.log("🔄 Getting contract instance...");
        const contract = await getContractInstance();
        
        console.log("📝 Calling registerUser on contract...");
        console.log("Parameters:", { address, role });
        
        // Call the registerUser function from the contract
        const tx = await contract.registerUser(address, role);
        
        console.log("⏳ Waiting for transaction to be mined...", {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          nonce: tx.nonce
        });
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        
        if (receipt) {
          console.log("✅ Transaction mined!", {
            hash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed?.toString() || '0',
            status: receipt.status
          });
        }

        // The event listener will trigger refreshData
        console.log("🔄 Waiting for event listener to trigger refresh...");
      } catch (error: any) {
        console.error("❌ Contract error:", {
          message: error.message,
          code: error.code,
          data: error.data,
          transaction: error.transaction
        });
        
        // Check for specific error types
        if (error.code === 'ACTION_REJECTED') {
          throw new Error('Transaction was rejected by user');
        } else if (error.message.includes('user already registered')) {
          throw new Error('This address is already registered');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
          throw new Error('Insufficient funds for gas. Please make sure you have enough Sepolia ETH');
        } else if (error.message.includes('nonce')) {
          throw new Error('Transaction nonce error. Please reset your MetaMask account');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please make sure you are connected to Sepolia');
        } else {
          throw new Error(error.message || 'Failed to register user on blockchain');
        }
      }
    } else {
      const newUser: UserStatus = {
        address,
        role,
        registered: true,
        lastActivity: Date.now(),
        mfaVerified: false,
        source: dataSource
      };
      setOffChainData(prev => ({
        ...prev,
        users: [...prev.users, newUser]
      }));
      
      // Add event
      const event: SecurityEvent = {
        id: `evt-${Date.now()}`,
        type: 'UserRegistered',
        address,
        timestamp: Date.now(),
        data: { role },
        severity: 'low',
        source: dataSource
      };
      setOffChainData(prev => ({
        ...prev,
        events: [...prev.events, event]
      }));
    }
  };

  // Function to assign a new role
  const assignRole = (address: string, newRole: string) => {
    setOnChainData(prev => ({
      ...prev,
      users: prev.users.map(user => {
        if (user.address === address) {
          // Add event
          const event: SecurityEvent = {
            id: `evt-${Date.now()}`,
            type: 'RoleAssigned',
            address,
            timestamp: Date.now(),
            data: { oldRole: user.role, newRole },
            severity: 'medium',
            source: dataSource
          };
          setOnChainData(prev => ({
            ...prev,
            events: [...prev.events, event]
          }));
          
          return { ...user, role: newRole };
        }
        return user;
      })
    }));
  };

  // Function to monitor user actions and create threats if needed
  const monitorUserAction = (address: string, action: string, requiredRole: string) => {
    const user = currentData.users.find(u => u.address === address);
    
    if (!user) {
      // Unregistered user trying to perform action
      if (dataSource === 'on-chain') {
        const threat: AnomalyReport = {
          id: `anm-${Date.now()}`,
          address,
          timestamp: Date.now(),
          type: 'Unauthorized Access Attempt',
          severity: 'high',
          description: `Unregistered user attempted to ${action}`,
          mitigated: false,
          source: 'on-chain'
        };
        setOnChainData(prev => ({
          ...prev,
          anomalies: [...prev.anomalies, threat]
        }));
      }
      return;
    }

    // Check if user has required role
    const roleHierarchy = {
      'Admin': ['Admin', 'Manager', 'Auditor', 'Guest'],
      'Manager': ['Manager', 'Auditor', 'Guest'],
      'Auditor': ['Auditor', 'Guest'],
      'Guest': ['Guest']
    };

    const userRoles = roleHierarchy[user.role as keyof typeof roleHierarchy] || [];
    if (!userRoles.includes(requiredRole)) {
      // User doesn't have required role
      if (dataSource === 'on-chain') {
        const threat: AnomalyReport = {
          id: `anm-${Date.now()}`,
          address,
          timestamp: Date.now(),
          type: 'Role Escalation Attempt',
          severity: 'critical',
          description: `User with role ${user.role} attempted to perform ${action} which requires ${requiredRole} role`,
          mitigated: false,
          source: 'on-chain'
        };
        setOnChainData(prev => ({
          ...prev,
          anomalies: [...prev.anomalies, threat]
        }));
      }
    }

    // Add audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      address,
      action,
      timestamp: Date.now(),
      details: `User attempted to ${action}`,
      source: dataSource
    };
    setOnChainData(prev => ({
      ...prev,
      auditLogs: [...prev.auditLogs, log]
    }));
  };

  const value = {
    events: currentData.events,
    anomalies: currentData.anomalies,
    auditLogs: currentData.auditLogs,
    users: currentData.users,
    dataSource,
    setDataSource,
    refreshData,
    loading,
    addUser,
    assignRole,
    monitorUserAction,
    createThreat,
    mitigateThreat,
    deleteThreat
  };

  return (
    <SecurityDataContext.Provider value={value}>
      {children}
    </SecurityDataContext.Provider>
  );
};

// Custom hook
export const useSecurityData = () => useContext(SecurityDataContext);
