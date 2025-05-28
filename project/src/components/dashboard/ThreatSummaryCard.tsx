import React from 'react';
import { AlertTriangleIcon, ShieldAlertIcon, ShieldCheckIcon, TrendingUpIcon, ActivityIcon } from 'lucide-react';
import { useSecurityData } from '../../contexts/SecurityDataContext';

const ThreatSummaryCard: React.FC = () => {
  const { anomalies } = useSecurityData();
  
  // Calculate threat metrics
  const criticalThreats = anomalies.filter(a => a.severity === 'critical').length;
  const highThreats = anomalies.filter(a => a.severity === 'high').length;
  const mediumThreats = anomalies.filter(a => a.severity === 'medium').length;
  const lowThreats = anomalies.filter(a => a.severity === 'low').length;
  const mitigatedThreats = anomalies.filter(a => a.mitigated).length;
  
  // Total threats
  const totalThreats = anomalies.length;
  const activeThreats = totalThreats - mitigatedThreats;
  
  // Percentage of mitigated threats
  const mitigationRate = totalThreats ? Math.round((mitigatedThreats / totalThreats) * 100) : 0;
  
  return (
    <div className="relative">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-warning-500/10 rounded-lg shadow-lg shadow-warning-500/20">
            <AlertTriangleIcon size={20} className="text-warning-400" />
          </div>
          <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-warning-300 to-slate-400">
            Threat Summary
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center px-3 py-1.5 rounded-full bg-dark-700/30 border border-dark-600/30">
            <ActivityIcon size={14} className="text-primary-400 mr-2 animate-pulse" />
            <span className="text-slate-400">Real-time</span>
          </div>
        </div>
      </div>
      
      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="group relative bg-dark-800/40 hover:bg-dark-800/60 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-dark-700/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl transition-opacity bg-danger-500/10"></div>
          <div className="relative">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-danger-500/10 rounded-lg shadow-lg shadow-danger-500/20 mr-2 group-hover:scale-110 transition-transform">
                <ShieldAlertIcon className="text-danger-500" size={16} />
              </div>
              <span className="text-sm text-slate-300">Active Threats</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">{activeThreats}</span>
              {activeThreats > 0 && (
                <span className="text-xs text-danger-400 animate-pulse">Requires Action</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="group relative bg-dark-800/40 hover:bg-dark-800/60 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-dark-700/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl transition-opacity bg-success-500/10"></div>
          <div className="relative">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-success-500/10 rounded-lg shadow-lg shadow-success-500/20 mr-2 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="text-success-500" size={16} />
              </div>
              <span className="text-sm text-slate-300">Mitigated</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">{mitigatedThreats}</span>
              <span className="text-xs text-success-400">
                {mitigationRate}% Success
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Threat Distribution */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Threat Distribution</h4>
        <div className="relative h-4 rounded-full overflow-hidden bg-dark-800/50 border border-dark-700/50 shadow-lg">
          {criticalThreats > 0 && (
            <div 
              className="absolute h-full bg-gradient-to-r from-danger-600 to-danger-500 animate-pulse-threat" 
              style={{ width: `${(criticalThreats / totalThreats) * 100}%`, left: '0%' }}
            />
          )}
          {highThreats > 0 && (
            <div 
              className="absolute h-full bg-gradient-to-r from-danger-500 to-danger-400" 
              style={{ width: `${(highThreats / totalThreats) * 100}%`, left: `${(criticalThreats / totalThreats) * 100}%` }}
            />
          )}
          {mediumThreats > 0 && (
            <div 
              className="absolute h-full bg-gradient-to-r from-warning-500 to-warning-400" 
              style={{ width: `${(mediumThreats / totalThreats) * 100}%`, left: `${((criticalThreats + highThreats) / totalThreats) * 100}%` }}
            />
          )}
          {lowThreats > 0 && (
            <div 
              className="absolute h-full bg-gradient-to-r from-primary-500 to-primary-400" 
              style={{ width: `${(lowThreats / totalThreats) * 100}%`, left: `${((criticalThreats + highThreats + mediumThreats) / totalThreats) * 100}%` }}
            />
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Critical', count: criticalThreats, color: 'danger-600', glowColor: 'rgba(239, 68, 68, 0.2)' },
          { label: 'High', count: highThreats, color: 'danger-500', glowColor: 'rgba(239, 68, 68, 0.15)' },
          { label: 'Medium', count: mediumThreats, color: 'warning-500', glowColor: 'rgba(251, 191, 36, 0.15)' },
          { label: 'Low', count: lowThreats, color: 'primary-500', glowColor: 'rgba(59, 130, 246, 0.15)' }
        ].map((item, index) => (
          <div key={index} className="flex items-center group">
            <div 
              className={`h-2.5 w-2.5 bg-${item.color} rounded-sm mr-2 group-hover:scale-125 transition-transform shadow-lg`}
              style={{ boxShadow: `0 4px 12px -2px ${item.glowColor}` }}
            ></div>
            <span className="text-xs text-slate-300">{item.label} ({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatSummaryCard;