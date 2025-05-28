import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThreatSummaryCard from '../components/dashboard/ThreatSummaryCard';
import RecentEventsCard from '../components/dashboard/RecentEventsCard';
import UserStatusCard from '../components/dashboard/UserStatusCard';
import SystemHealthCard from '../components/dashboard/SystemHealthCard';
import ThreatMonitor from "../pages/ThreatMonitor";
import { 
  ShieldIcon, 
  ActivityIcon, 
  AlertTriangleIcon, 
  UsersIcon, 
  LockIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  MonitorIcon,
  NetworkIcon,
  ServerIcon,
  ShieldOffIcon,
  ChevronRightIcon,
  Gauge
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useSecurityData } from '../contexts/SecurityDataContext';
import { getContractInstance } from '../blockchain/contract';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

const Dashboard: React.FC = () => {
  const { isConnected, userRole } = useWallet();
  const { dataSource, events, anomalies } = useSecurityData();
  const navigate = useNavigate();

  const handleVerifyMFA = async () => {
    try {
      const contract = await getContractInstance();
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const userAddress = Array.isArray(accounts) ? accounts[0] : accounts;
      const tx = await contract.verifyMFA(userAddress);
      await tx.wait();
      console.log("✅ MFA verified on-chain");
    } catch (error) {
      console.error("❌ MFA verification failed:", error);
    }
  };

  // Quick stats calculation
  const stats = {
    activeThreats: anomalies.filter(a => !a.mitigated).length,
    totalEvents: events.length,
    criticalAlerts: anomalies.filter(a => a.severity === 'critical').length,
    securityScore: Math.floor(Math.random() * 20 + 80)
  };

  // Calculate security status
  const getSecurityStatus = () => {
    if (stats.criticalAlerts > 5) return 'critical';
    if (stats.activeThreats > 10) return 'warning';
    return 'secure';
  };

  const securityStatus = getSecurityStatus();

  // Redirect to connect page if not connected
  React.useEffect(() => {
    if (!isConnected) {
      navigate('/connect');
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-x-hidden">
      {/* Animated Soft Glow Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow2" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-2xl animate-pulse-slow3" />
      </div>
      {/* Main Content */}
      <div className="relative z-10">
        {isConnected && (
          <div className="p-4 lg:p-6 space-y-8 max-w-[1920px] mx-auto">
            {/* Command Center Header */}
            <div className="bg-dark-800/60 backdrop-blur-2xl rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl relative overflow-hidden animate-fade-in">
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow2" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative">
                <div className="flex items-center space-x-8">
                  <div className={`relative p-5 rounded-3xl shadow-xl border-2 border-current transform hover:scale-105 transition-all duration-300 animate-glow ${
                    securityStatus === 'secure' ? 'bg-green-500/10 text-green-400 border-green-400/40' :
                    securityStatus === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-400/40' :
                    'bg-red-500/10 text-red-400 border-red-400/40'
                  }`}>
                    {securityStatus === 'secure' ? <ShieldCheckIcon size={40} /> :
                     securityStatus === 'warning' ? <AlertTriangleIcon size={40} /> :
                     <ShieldOffIcon size={40} />}
                    <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-current animate-ping" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-4">
                      <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-slate-100 to-pink-400 animate-gradient-text">Security Command Center</h2>
                      <div className="flex items-center px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
                        <span className="text-xs text-green-400">Live</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 space-x-6">
                      <p className="text-slate-400 text-lg">Status: <span className={`font-bold ${
                        securityStatus === 'secure' ? 'text-green-400' :
                        securityStatus === 'warning' ? 'text-amber-400' :
                        'text-red-400'
                      }`}>{
                        securityStatus === 'secure' ? 'Protected' :
                        securityStatus === 'warning' ? 'Warning' :
                        'Critical'
                      }</span></p>
                      <div className="w-px h-6 bg-dark-600/50" />
                      <div className="flex items-center space-x-2">
                        <Gauge className="text-primary-400 animate-spin-slow" size={20} />
                        <span className="text-slate-400 text-lg">Security Score: </span>
                        <span className="font-bold text-primary-400 text-xl animate-gradient-text">{stats.securityScore}%</span>
                      </div>
                      <div className="w-px h-6 bg-dark-600/50" />
                      <p className="text-slate-400 flex items-center text-lg">
                        <ActivityIcon size={20} className="mr-2 text-primary-400 animate-bounce" />
                        Last updated: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-base text-slate-400">Access Level</p>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-300 animate-gradient-text">{userRole}</p>
                  </div>
                  <button onClick={handleVerifyMFA} 
                    className="px-7 py-3 bg-dark-700/40 hover:bg-primary-500/10 rounded-2xl transition-all flex items-center space-x-3 border-2 border-primary-500/20 group relative overflow-hidden shadow-lg animate-fade-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <LockIcon size={22} className="text-primary-400 group-hover:rotate-12 transition-transform relative animate-shake" />
                    <span className="relative font-semibold tracking-wide">Verify MFA</span>
                    <ChevronRightIcon size={18} className="text-slate-500 group-hover:translate-x-1 transition-transform relative" />
                  </button>
                </div>
              </div>
            </div>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {[
                {
                  icon: <NetworkIcon size={28} className="text-blue-400 animate-pulse" />,
                  title: "Network Status",
                  value: "Connected",
                  subValue: "Latency: 45ms",
                  bgColor: "blue",
                  glowColor: "rgba(59, 130, 246, 0.15)"
                },
                {
                  icon: <ServerIcon size={28} className="text-green-400 animate-pulse" />,
                  title: "System Health",
                  value: "Optimal",
                  subValue: "CPU: 23% | RAM: 45%",
                  bgColor: "green",
                  glowColor: "rgba(34, 197, 94, 0.15)"
                },
                {
                  icon: <ActivityIcon size={28} className="text-amber-400 animate-pulse" />,
                  title: "Active Sessions",
                  value: stats.totalEvents.toString(),
                  subValue: "Last 24 hours",
                  bgColor: "amber",
                  glowColor: "rgba(251, 191, 36, 0.15)"
                },
                {
                  icon: <AlertTriangleIcon size={28} className="text-red-400 animate-pulse" />,
                  title: "Active Threats",
                  value: stats.activeThreats.toString(),
                  subValue: "Requiring attention",
                  bgColor: "red",
                  glowColor: "rgba(239, 68, 68, 0.15)"
                }
              ].map((stat, index) => (
                <div key={index} className="group relative bg-dark-800/60 hover:bg-dark-800/80 backdrop-blur-2xl rounded-2xl border-2 border-primary-500/10 p-7 transition-all duration-300 overflow-hidden shadow-xl animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-dark-700/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl transition-opacity" style={{ backgroundColor: stat.glowColor }} />
                  <div className="relative flex items-start space-x-5">
                    <div className={`p-4 bg-${stat.bgColor}-500/10 rounded-xl group-hover:scale-110 transition-transform shadow-lg`} style={{ boxShadow: `0 8px 24px -4px ${stat.glowColor}` }}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-base text-slate-400 font-semibold">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300 animate-gradient-text">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.subValue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Main Monitoring Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              {/* Left Column - Threat Monitor */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-dark-800/60 backdrop-blur-2xl rounded-2xl border-2 border-primary-500/10 overflow-hidden shadow-2xl relative animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent pointer-events-none" />
                  <div className="p-5 border-b border-dark-700/50 flex items-center justify-between relative">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-500/10 rounded-lg shadow-lg shadow-primary-500/20 animate-pulse">
                        <MonitorIcon className="text-primary-400" size={24} />
                      </div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 animate-gradient-text">Live Threat Monitor</h3>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center px-3 py-1.5 rounded-full bg-dark-700/30 border border-dark-600/30">
                        <div className={`h-2 w-2 rounded-full ${dataSource === 'on-chain' ? 'bg-green-500' : 'bg-blue-500'} mr-2 animate-pulse`} />
                        <span className="text-slate-400">{dataSource === 'on-chain' ? 'Blockchain' : 'Simulated'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 relative">
                    <ThreatMonitor />
                  </div>
                </div>
                <div className="bg-dark-800/60 backdrop-blur-2xl rounded-2xl border-2 border-primary-500/10 overflow-hidden shadow-2xl relative animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent pointer-events-none" />
                  <div className="p-5 border-b border-dark-700/50 relative">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-500/10 rounded-lg shadow-lg shadow-primary-500/20 animate-pulse">
                        <UsersIcon className="text-primary-400" size={24} />
                      </div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 animate-gradient-text">User Activity Map</h3>
                    </div>
                  </div>
                  <div className="p-5 relative">
                    <UserStatusCard />
                  </div>
                </div>
              </div>
              {/* Right Column - Events & System Health */}
              <div className="space-y-8">
                <div className="bg-dark-800/60 backdrop-blur-2xl rounded-2xl border-2 border-primary-500/10 overflow-hidden shadow-2xl relative animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent pointer-events-none" />
                  <div className="p-5 border-b border-dark-700/50 relative">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-500/10 rounded-lg shadow-lg shadow-primary-500/20 animate-pulse">
                        <ActivityIcon className="text-primary-400" size={24} />
                      </div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 animate-gradient-text">Recent Events</h3>
                    </div>
                  </div>
                  <div className="p-5 relative">
                    <RecentEventsCard />
                  </div>
                </div>
                <div className="bg-dark-800/60 backdrop-blur-2xl rounded-2xl border-2 border-primary-500/10 overflow-hidden shadow-2xl relative animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent pointer-events-none" />
                  <div className="p-5 border-b border-dark-700/50 relative">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-500/10 rounded-lg shadow-lg shadow-primary-500/20 animate-pulse">
                        <BarChart3Icon className="text-primary-400" size={24} />
                      </div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 animate-gradient-text">System Metrics</h3>
                    </div>
                  </div>
                  <div className="p-5 relative">
                    <SystemHealthCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
