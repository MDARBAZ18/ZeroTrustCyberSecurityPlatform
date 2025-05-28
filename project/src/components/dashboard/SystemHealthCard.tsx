import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ActivityIcon, CheckCircleIcon, ServerIcon } from 'lucide-react';

// Mock data for the chart
const data = [
  { name: '00:00', value: 98 },
  { name: '03:00', value: 96 },
  { name: '06:00', value: 99 },
  { name: '09:00', value: 97 },
  { name: '12:00', value: 95 },
  { name: '15:00', value: 99 },
  { name: '18:00', value: 100 },
  { name: '21:00', value: 99 },
  { name: 'Now', value: 100 },
];

const SystemHealthCard: React.FC = () => {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">System Health</h3>
        <div className="bg-dark-700 rounded-full p-1.5">
          <ServerIcon size={20} className="text-success-500" />
        </div>
      </div>
      
      {/* System Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-700 rounded-lg p-3">
          <div className="flex items-center">
            <CheckCircleIcon className="text-success-500 mr-2" size={20} />
            <span className="text-sm text-slate-300">Contract Status</span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-xl font-semibold">Active</span>
            <span className="text-xs text-success-400 ml-2">Healthy</span>
          </div>
        </div>
        
        <div className="bg-dark-700 rounded-lg p-3">
          <div className="flex items-center">
            <ActivityIcon className="text-primary-500 mr-2" size={20} />
            <span className="text-sm text-slate-300">Response Time</span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-xl font-semibold">124ms</span>
            <span className="text-xs text-success-400 ml-2">Optimal</span>
          </div>
        </div>
      </div>
      
      {/* Performance Chart */}
      <h4 className="text-sm font-medium text-slate-400 mb-2">System Performance (24h)</h4>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={0} barSize={20}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              domain={[85, 100]}
              tickCount={4}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                borderColor: '#334155',
                color: '#E2E8F0',
                fontSize: '12px',
                borderRadius: '4px'
              }}
            />
            <Bar dataKey="value" fill="#3B7AE9" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemHealthCard;