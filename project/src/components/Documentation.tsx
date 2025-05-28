import React, { useState } from 'react';
import {
  Book,
  Shield,
  Lock,
  Key,
  Users,
  AlertTriangle,
  FileText,
  ChevronRight,
  ExternalLink,
  Code,
  Terminal,
  Cpu,
  Network,
  Search,
  Eye,
  EyeOff,
  Layers,
  Database,
  Server,
  GitBranch,
  Workflow,
  Settings
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: JSX.Element;
  content: string;
  code?: string;
}

const Documentation: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCode, setShowCode] = useState<Record<string, boolean>>({});

  const sections: DocSection[] = [
    {
      id: 'overview',
      title: 'System Overview',
      icon: <Shield className="w-5 h-5" />,
      content: `The Blockchain Security Monitoring System is a comprehensive solution for real-time threat detection and security monitoring in blockchain environments. It combines on-chain and off-chain data sources to provide a complete security picture.`,
      code: `// Example system configuration
{
  "mode": "hybrid",
  "dataSource": {
    "onChain": "ethereum",
    "offChain": "securityLogs"
  },
  "monitoring": {
    "interval": 1000,
    "retryAttempts": 3
  }
}`
    },
    {
      id: 'authentication',
      title: 'Authentication & Access',
      icon: <Lock className="w-5 h-5" />,
      content: `Multi-factor authentication (MFA) and role-based access control (RBAC) ensure secure system access. Each user is assigned specific roles that determine their access levels and permissions.`,
      code: `// Role-based access example
const roles = {
  admin: ['all'],
  manager: ['read', 'write', 'monitor'],
  auditor: ['read', 'monitor'],
  user: ['read']
};`
    },
    {
      id: 'monitoring',
      title: 'Threat Monitoring',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `Real-time monitoring of security events with four severity levels: Critical, High, Medium, and Low. The system uses AI-powered anomaly detection to identify potential threats.`,
      code: `// Threat detection logic
async function detectThreats(event) {
  const severity = await analyzeThreat(event);
  if (severity >= CRITICAL_THRESHOLD) {
    await notifySecurityTeam(event);
    await initiateAutoResponse(event);
  }
}`
    },
    {
      id: 'blockchain',
      title: 'Blockchain Integration',
      icon: <Network className="w-5 h-5" />,
      content: `Seamless integration with Ethereum blockchain for monitoring smart contract interactions, transaction patterns, and on-chain security events.`,
      code: `// Smart contract monitoring
contract.on("SecurityEvent", async (
  eventType,
  severity,
  address
) => {
  console.log("Security Event Detected");
  await processSecurityEvent({
    type: eventType,
    severity,
    address
  });
});`
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: <Code className="w-5 h-5" />,
      content: `RESTful API endpoints for system integration and automation. Supports both JSON-RPC and REST protocols with comprehensive authentication and rate limiting.`,
      code: `// API endpoint example
POST /api/v1/security/events
{
  "type": "ANOMALY_DETECTED",
  "severity": "HIGH",
  "source": "smart_contract",
  "details": {
    "contract": "0x...",
    "function": "transfer",
    "params": {}
  }
}`
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      icon: <Layers className="w-5 h-5" />,
      content: `The system follows a layered microservices architecture with clear separation of concerns. Each component is designed for scalability, resilience, and real-time performance.

Key Components:
1. Data Layer
   - Blockchain Node Integration
   - Off-chain Database (PostgreSQL)
   - Event Queue System (Redis)

2. Core Services
   - Security Monitor Service
   - Authentication Service
   - Smart Contract Listener
   - Alert Management System

3. Integration Layer
   - REST API Gateway
   - WebSocket Server
   - Blockchain RPC Interface

4. Frontend Layer
   - React Dashboard
   - Real-time Updates
   - Interactive Monitoring

System Flow:
1. Data Collection
   - Smart contract events monitoring
   - Off-chain security logs
   - User activity tracking
   - Network traffic analysis

2. Processing Pipeline
   - Event normalization
   - Threat detection algorithms
   - Machine learning models
   - Pattern recognition

3. Response System
   - Alert generation
   - Automated responses
   - Incident management
   - Audit logging

4. Monitoring & Reporting
   - Real-time dashboards
   - Threat analytics
   - Performance metrics
   - Compliance reporting`,
      code: `// System Architecture Components
const systemArchitecture = {
  dataLayer: {
    blockchain: {
      node: 'Ethereum Node',
      protocols: ['JSON-RPC', 'WebSocket'],
      events: ['SecurityEvent', 'UserAction']
    },
    database: {
      primary: 'PostgreSQL',
      cache: 'Redis',
      replication: true
    },
    queue: {
      service: 'Redis Pub/Sub',
      channels: ['alerts', 'logs', 'metrics']
    }
  },
  services: {
    security: {
      monitors: ['ContractMonitor', 'NetworkMonitor'],
      detectors: ['AnomalyDetector', 'ThreatAnalyzer'],
      response: ['AlertManager', 'AutoResponse']
    },
    authentication: {
      providers: ['Web3', 'OAuth2', 'MFA'],
      roles: ['Admin', 'Manager', 'Auditor']
    },
    integration: {
      api: 'REST/GraphQL Gateway',
      websocket: 'Socket.io Server',
      rpc: 'Web3 Provider'
    }
  },
  frontend: {
    framework: 'React',
    features: ['RealTime', 'Interactive', 'Responsive'],
    components: ['Dashboard', 'Monitoring', 'Analytics']
  }
};

// Event Processing Pipeline
class SecurityEventPipeline {
  async process(event) {
    // 1. Event Collection
    const normalizedEvent = await this.normalizeEvent(event);
    
    // 2. Threat Analysis
    const threatLevel = await this.analyzeThreat(normalizedEvent);
    
    // 3. Pattern Recognition
    const patterns = await this.detectPatterns(normalizedEvent);
    
    // 4. Response Generation
    if (threatLevel > THRESHOLD) {
      await this.generateAlert(normalizedEvent, patterns);
      await this.initiateResponse(threatLevel);
    }
    
    // 5. Audit Logging
    await this.logAudit({
      event: normalizedEvent,
      threat: threatLevel,
      patterns,
      timestamp: Date.now()
    });
  }
}`
    },
    {
      id: 'deployment',
      title: 'Deployment Architecture',
      icon: <Server className="w-5 h-5" />,
      content: `The system utilizes a modern cloud-native deployment architecture with high availability and fault tolerance.

Infrastructure Components:
1. Container Orchestration
   - Kubernetes Clusters
   - Docker Containers
   - Service Mesh

2. Cloud Services
   - Load Balancers
   - Auto-scaling Groups
   - Managed Databases

3. Security Infrastructure
   - WAF (Web Application Firewall)
   - DDoS Protection
   - Network Isolation

4. Monitoring Stack
   - Prometheus Metrics
   - Grafana Dashboards
   - ELK Stack for Logs

Deployment Flow:
1. CI/CD Pipeline
   - Automated Testing
   - Security Scanning
   - Container Building
   - Deployment Automation

2. Scaling Strategy
   - Horizontal Pod Scaling
   - Database Replication
   - Cache Distribution
   - Load Distribution

3. Backup & Recovery
   - Automated Backups
   - Disaster Recovery
   - Data Replication
   - State Management`,
      code: `// Deployment Configuration
const deployment = {
  kubernetes: {
    clusters: ['production', 'staging'],
    resources: {
      monitoring: {
        replicas: 3,
        cpu: '2',
        memory: '4Gi'
      },
      security: {
        replicas: 5,
        cpu: '4',
        memory: '8Gi'
      }
    },
    networking: {
      ingress: 'nginx',
      serviceMesh: 'istio'
    }
  },
  scaling: {
    metrics: [
      'CPU_UTILIZATION',
      'MEMORY_USAGE',
      'REQUEST_COUNT'
    ],
    thresholds: {
      cpu: 80,
      memory: 85,
      requests: 1000
    }
  },
  security: {
    network: {
      allowedCIDRs: ['10.0.0.0/8'],
      ports: [443, 8080, 9090]
    },
    encryption: {
      transit: true,
      rest: true,
      keys: 'vault'
    }
  }
};

// High Availability Setup
class HADeployment {
  async configure() {
    // 1. Configure Load Balancer
    await this.setupLoadBalancer({
      algorithm: 'round-robin',
      healthCheck: '/health',
      ssl: true
    });

    // 2. Setup Auto-scaling
    await this.configureAutoscaling({
      min: 3,
      max: 10,
      metrics: ['cpu', 'memory']
    });

    // 3. Configure Monitoring
    await this.setupMonitoring({
      metrics: true,
      logging: true,
      alerting: true
    });

    // 4. Setup Backup
    await this.configureBackup({
      schedule: '0 */4 * * *',
      retention: '30d',
      type: 'incremental'
    });
  }
}`
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCode = (sectionId: string) => {
    setShowCode(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Book className="w-6 h-6 text-purple-400" />
            Documentation
          </h1>
          <p className="text-gray-400 mt-1">
            Complete guide to the Blockchain Security Monitoring System
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-900/50 border border-gray-700 rounded-lg
                     text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500
                     focus:ring-1 focus:ring-purple-500 shadow-lg shadow-purple-900/20"
          />
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSections.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border border-gray-700 bg-gray-800/30 overflow-hidden
                     shadow-xl shadow-gray-900/50 hover:shadow-gray-900/70 transition-all
                     hover:border-gray-600"
          >
            {/* Section Header */}
            <div
              className="p-4 border-b border-gray-700 flex items-center justify-between cursor-pointer
                       hover:bg-gray-800/50 transition-colors"
              onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gray-900/50 text-purple-400">
                  {section.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-200">{section.title}</h2>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transform transition-transform duration-200
                         ${selectedSection === section.id ? 'rotate-90' : ''}`}
              />
            </div>

            {/* Section Content */}
            <div
              className={`transition-all duration-300 ease-in-out
                       ${selectedSection === section.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="p-4 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>

                {section.code && (
                  <div className="relative">
                    <div className="absolute right-4 top-4 z-10">
                      <button
                        onClick={() => toggleCode(section.id)}
                        className="p-2 rounded-lg bg-gray-900/50 text-gray-400 hover:text-purple-400
                                 transition-colors"
                      >
                        {showCode[section.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre
                      className={`rounded-lg bg-gray-900/50 border border-gray-700 p-4 text-sm
                              font-mono text-gray-300 overflow-x-auto transition-all duration-300
                              ${showCode[section.id] ? 'max-h-[500px] opacity-100' : 'max-h-12 opacity-70'}`}
                    >
                      <code>{section.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/30 p-4 shadow-lg shadow-gray-900/30">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-purple-400" />
          Quick Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Terminal className="w-4 h-4" />, text: "CLI Reference" },
            { icon: <Cpu className="w-4 h-4" />, text: "System Architecture" },
            { icon: <Key className="w-4 h-4" />, text: "Security Best Practices" },
            { icon: <Users className="w-4 h-4" />, text: "User Management" }
          ].map((link, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/50
                       border border-gray-700 text-gray-300 hover:text-purple-400
                       hover:border-purple-500 transition-colors shadow-md shadow-gray-900/20"
            >
              {link.icon}
              <span>{link.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation; 