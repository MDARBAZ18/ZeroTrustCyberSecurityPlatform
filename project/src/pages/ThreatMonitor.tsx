import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangleIcon, 
  ShieldIcon, 
  BoxSelectIcon, 
  EyeIcon, 
  PieChartIcon, 
  BarChartIcon,
  ActivityIcon,
  DatabaseIcon,
  LinkIcon,
  RefreshCwIcon,
  FilterIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseIcon,
  PlayIcon
} from 'lucide-react';
import { useSecurityData, AnomalyReport } from '../contexts/SecurityDataContext';
import { format } from 'date-fns';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import SecurityMonitor from '../components/SecurityMonitor';

const ThreatMonitor: React.FC = () => {
  const { anomalies, loading, dataSource, setDataSource, refreshData } = useSecurityData();
  const [viewMode, setViewMode] = useState<'table' | 'pie' | 'bar' | 'monitor'>('monitor');
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyReport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<'30s' | '1m' | '5m'>('1m');
  const [refreshProgress, setRefreshProgress] = useState<number>(0);
  
  // Threat distribution by severity
  const severityData = [
    { name: 'Critical', value: anomalies.filter(a => a.severity === 'critical').length, color: '#E53E3E' },
    { name: 'High', value: anomalies.filter(a => a.severity === 'high').length, color: '#F56565' },
    { name: 'Medium', value: anomalies.filter(a => a.severity === 'medium').length, color: '#F6AD55' },
    { name: 'Low', value: anomalies.filter(a => a.severity === 'low').length, color: '#3B7AE9' },
  ].filter(item => item.value > 0);
  
  // Threat distribution by type
  const anomalyTypes = [...new Set(anomalies.map(a => a.type))];
  const typeData = anomalyTypes.map(type => {
    const count = anomalies.filter(a => a.type === type).length;
    return { name: type, value: count };
  });
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger-500';
      case 'high': return 'text-danger-400';
      case 'medium': return 'text-warning-500';
      case 'low': return 'text-primary-500';
      default: return 'text-slate-400';
    }
  };
  
  // Get severity badge class
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'badge-danger';
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-primary';
      default: return 'bg-dark-700 text-slate-300';
    }
  };
  
  // Handle anomaly selection
  const handleAnomalyClick = (anomaly: AnomalyReport) => {
    setSelectedAnomaly(anomaly);
  };
  
  // Close anomaly details
  const closeAnomalyDetails = () => {
    setSelectedAnomaly(null);
  };

  // Handle data source change
  const handleDataSourceChange = async () => {
    if (dataSource === 'off-chain') {
      try {
        setConnecting(true);
        setError(null);
        
        // Check if MetaMask is installed
        if (!window.ethereum) {
          throw new Error("MetaMask not found! Please install MetaMask browser extension.");
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Switch to Sepolia network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                },
              ],
            });
          } else {
            throw switchError;
          }
        }

        setDataSource('on-chain');
        await refreshData();
      } catch (err: any) {
        console.error('Failed to connect to blockchain:', err);
        setError(err);
        setDataSource('off-chain');
      } finally {
        setConnecting(false);
      }
    } else {
      setDataSource('off-chain');
    }
  };

  // Enhanced error display with auto-dismiss
  const renderError = (): React.ReactNode => {
    if (!error) return null;

    // Auto-dismiss error after 5 seconds
    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timer);
      }
    }, [error]);

    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 relative">
        <button 
          onClick={() => setError(null)}
          className="absolute top-2 right-2 text-red-400 hover:text-red-300"
        >
          <XCircleIcon size={16} />
        </button>
        <div className="flex items-center text-red-500 mb-2">
          <AlertTriangleIcon size={20} className="mr-2" />
          <h3 className="font-medium">
            {error.name === 'ConnectionError' ? 'Connection Error' : 'Error'}
          </h3>
        </div>
        <p className="text-red-400 text-sm">{error.message}</p>
        {error.name === 'ConnectionError' && (
          <div className="mt-2 text-xs text-red-400/80">
            <p>Troubleshooting steps:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Check your internet connection</li>
              <li>Verify your wallet is connected</li>
              <li>Ensure you're on the correct network</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Enhanced refresh handling with better error categorization
  const handleRefresh = useCallback(async () => {
    try {
      setError(null);
      await refreshData();
      setLastRefreshed(new Date());
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2000);
    } catch (err: any) {
      // Categorize errors for better user feedback
      let enhancedError: Error;
      
      if (err.message?.includes('network')) {
        enhancedError = Object.assign(new Error('Unable to connect to the network. Please check your internet connection.'), {
          name: 'ConnectionError'
        });
      } else if (err.message?.includes('wallet') || err.message?.includes('MetaMask')) {
        enhancedError = Object.assign(new Error('Wallet connection issue. Please check if your wallet is properly connected.'), {
          name: 'WalletError'
        });
      } else if (err.message?.includes('contract')) {
        enhancedError = Object.assign(new Error('Smart contract interaction failed. Please try again or contact support.'), {
          name: 'ContractError'
        });
      } else {
        enhancedError = Object.assign(new Error(err.message || 'An unexpected error occurred while refreshing data.'), {
          name: 'UnknownError'
        });
      }
      
      setError(enhancedError);
      console.error('Refresh failed:', err);
    }
  }, [refreshData]);

  // Add refresh confirmation for auto-refresh disable
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autoRefresh) {
        e.preventDefault();
        e.returnValue = 'Changes you made may not be saved.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [autoRefresh]);

  // Simulate progress during refresh
  useEffect(() => {
    if (loading) {
      setRefreshProgress(0);
      const interval = setInterval(() => {
        setRefreshProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90% until actually complete
          return prev + Math.random() * 30; // Random progress increments
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setRefreshProgress(100);
      const timeout = setTimeout(() => setRefreshProgress(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Content based on view mode
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <ActivityIcon size={24} className="text-primary-500 animate-spin" />
          <span className="ml-2 text-slate-400">Loading threats...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <AlertTriangleIcon size={32} className="mx-auto text-danger-500 mb-2" />
          <h3 className="text-lg font-medium mb-1">Blockchain Error</h3>
          <p className="text-slate-400">{error.message}</p>
          <p className="text-sm text-slate-500 mt-2">Please check your wallet connection and try again</p>
        </div>
      );
    }

    if (anomalies.length === 0) {
      return (
        <div className="text-center py-10">
          <ShieldIcon size={32} className="mx-auto text-success-500 mb-2" />
          <h3 className="text-lg font-medium mb-1">No threats detected</h3>
          <p className="text-slate-400">
            {dataSource === 'on-chain' 
              ? "No threats have been recorded on the blockchain"
              : "Your system is currently secure"}
          </p>
        </div>
      );
    }

    if (viewMode === 'monitor') {
      return <SecurityMonitor />;
    }

    if (viewMode === 'table') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-dark-700">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium hidden md:table-cell">Address</th>
                <th className="pb-3 font-medium hidden md:table-cell">Timestamp</th>
                <th className="pb-3 font-medium text-right">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {anomalies.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-dark-700/50">
                  <td className="py-3 text-slate-300">{anomaly.id}</td>
                  <td className="py-3 text-slate-300">{anomaly.type}</td>
                  <td className="py-3">
                    <span className={`badge ${getSeverityBadgeClass(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="py-3 hidden md:table-cell text-slate-300">
                    {`${anomaly.address.substring(0, 6)}...${anomaly.address.substring(anomaly.address.length - 4)}`}
                  </td>
                  <td className="py-3 hidden md:table-cell text-slate-400">
                    {format(new Date(anomaly.timestamp), 'MMM d, h:mm a')}
                  </td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      anomaly.mitigated 
                        ? 'bg-success-500/20 text-success-300' 
                        : 'bg-danger-500/20 text-danger-300'
                    }`}>
                      {anomaly.mitigated ? 'Mitigated' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      className="btn btn-secondary p-1.5"
                      onClick={() => handleAnomalyClick(anomaly)}
                    >
                      <EyeIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (viewMode === 'pie') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Severity Distribution */}
          <div>
            <h3 className="text-md font-medium mb-4 text-center">Distribution by Severity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label={(entry) => entry.name}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderColor: '#334155',
                      color: '#E2E8F0',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Type Distribution */}
          <div>
            <h3 className="text-md font-medium mb-4 text-center">Distribution by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label={(entry) => entry.name}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderColor: '#334155',
                      color: '#E2E8F0',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-md font-medium mb-4 text-center">Threat Distribution by Type</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  borderColor: '#334155',
                  color: '#E2E8F0',
                  borderRadius: '4px'
                }}
              />
              <Bar dataKey="value" fill="#3B7AE9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow2" />
      </div>
      <div className="relative z-10 p-4 lg:p-8 max-w-[1920px] mx-auto">
        <div className="bg-dark-800/60 backdrop-blur-2xl rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-slate-100 to-pink-400 animate-gradient-text mb-2">Threat Monitoring</h1>
          <p className="text-slate-400 text-lg">Live threat detection and analytics.</p>
        </div>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 z-50">
          {(loading || refreshProgress > 0) && (
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ 
                width: `${refreshProgress}%`,
                opacity: loading || refreshProgress === 100 ? 1 : 0
              }}
            />
          )}
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <AlertTriangleIcon className="text-warning-500" />
                Threat Monitor
              </h1>
              <p className="text-slate-400 mt-2">
                Real-time security monitoring and threat detection
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors relative
                         ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                         ${refreshSuccess ? 'bg-success-500/20 text-success-400 border border-success-500/30' : 'bg-dark-800 hover:bg-dark-700 border border-dark-700'}`}
              >
                <RefreshCwIcon 
                  size={16} 
                  className={`mr-2 transition-transform ${loading ? 'animate-spin' : ''} ${refreshSuccess ? 'text-success-400' : ''}`} 
                />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>

            <button
              onClick={handleDataSourceChange}
              disabled={connecting}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                         ${dataSource === 'on-chain' 
                           ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30' 
                           : 'bg-dark-800 hover:bg-dark-700 border border-dark-700'}`}
              >
                <DatabaseIcon size={16} className="mr-2" />
                {dataSource === 'on-chain' ? 'On-Chain' : 'Off-Chain'}
            </button>
            </div>
          </div>

          {/* Control Panel */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* View Mode */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">View Mode</h3>
              <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('monitor')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    viewMode === 'monitor'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  <ActivityIcon size={14} className="mr-1.5" />
              Monitor
            </button>
            <button
              onClick={() => setViewMode('table')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    viewMode === 'table'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  <BoxSelectIcon size={14} className="mr-1.5" />
              Table
            </button>
            <button
              onClick={() => setViewMode('pie')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    viewMode === 'pie'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  <PieChartIcon size={14} className="mr-1.5" />
                  Pie
                </button>
                <button
                  onClick={() => setViewMode('bar')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    viewMode === 'bar'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  <BarChartIcon size={14} className="mr-1.5" />
                  Bar
                </button>
              </div>
            </div>

            {/* Time Range */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Time Range</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTimeRange('24h')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    timeRange === '24h'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  <ClockIcon size={14} className="mr-1.5" />
                  24h
                </button>
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    timeRange === '7d'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  7d
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    timeRange === '30d'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  30d
                </button>
                <button
                  onClick={() => setTimeRange('all')}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    timeRange === 'all'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Severity Filter */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Severity</h3>
              <div className="flex flex-wrap gap-2">
                {['critical', 'high', 'medium', 'low'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => {
                      if (severityFilter.includes(severity)) {
                        setSeverityFilter(severityFilter.filter(s => s !== severity));
                      } else {
                        setSeverityFilter([...severityFilter, severity]);
                      }
                    }}
                    className={`flex items-center px-3 py-1.5 rounded text-sm ${
                      severityFilter.includes(severity)
                        ? `bg-${getSeverityColor(severity).replace('text-', '')}/20 ${getSeverityColor(severity)} border border-${getSeverityColor(severity).replace('text-', '')}/30`
                        : 'bg-dark-700 text-slate-300 border border-dark-600 hover:bg-dark-600'
                    }`}
                  >
                    {severityFilter.includes(severity) ? (
                      <CheckCircleIcon size={14} className="mr-1.5" />
                    ) : (
                      <XCircleIcon size={14} className="mr-1.5" />
                    )}
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary-400">
                    {anomalies.length}
                  </div>
                  <div className="text-xs text-slate-400">Total Threats</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning-400">
                    {anomalies.filter(a => a.severity === 'critical' || a.severity === 'high').length}
                  </div>
                  <div className="text-xs text-slate-400">Critical/High</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {renderError()}

        {/* Main Content */}
        <div className="bg-dark-800 rounded-lg border border-dark-700">
        {renderContent()}
        </div>

        {/* Auto-refresh indicator */}
        {autoRefresh && (
          <div className="mt-2 text-sm text-slate-400 flex items-center">
            <span>
              Auto-refresh every {refreshInterval}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatMonitor;