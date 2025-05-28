import React, { useState } from 'react';
import { useSecurityData } from '../contexts/SecurityDataContext';

export const ThreatManager = () => {
  const { createThreat, mitigateThreat, deleteThreat, anomalies, dataSource } = useSecurityData();
  const [newThreat, setNewThreat] = useState({
    address: '',
    type: '',
    severity: 'medium',
    description: ''
  });

  const handleCreateThreat = () => {
    createThreat({
      address: newThreat.address || '0x' + Math.random().toString(16).slice(2, 42),
      type: newThreat.type || 'Custom Threat',
      severity: newThreat.severity as any,
      description: newThreat.description || 'Manually created threat',
      mitigated: false
    });
    setNewThreat({ address: '', type: '', severity: 'medium', description: '' });
  };

  if (dataSource !== 'on-chain') {
    return <div className="p-4">Switch to on-chain mode to manage threats</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Manage Threats</h2>
      
      {/* Create new threat form */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Threat Type"
          value={newThreat.type}
          onChange={(e) => setNewThreat(prev => ({ ...prev, type: e.target.value }))}
          className="border p-2 rounded"
        />
        <select
          value={newThreat.severity}
          onChange={(e) => setNewThreat(prev => ({ ...prev, severity: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <textarea
          placeholder="Description"
          value={newThreat.description}
          onChange={(e) => setNewThreat(prev => ({ ...prev, description: e.target.value }))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleCreateThreat}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Threat
        </button>
      </div>

      {/* List of threats */}
      <div className="space-y-2">
        <h3 className="font-bold">Current Threats</h3>
        {anomalies.map(threat => (
          <div key={threat.id} className="border p-2 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{threat.type}</p>
                <p className="text-sm text-gray-600">{threat.description}</p>
                <p className="text-sm">Severity: {threat.severity}</p>
                <p className="text-sm">Status: {threat.mitigated ? 'Mitigated' : 'Active'}</p>
              </div>
              <div className="space-x-2">
                {!threat.mitigated && (
                  <button
                    onClick={() => mitigateThreat(threat.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Mitigate
                  </button>
                )}
                <button
                  onClick={() => deleteThreat(threat.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 