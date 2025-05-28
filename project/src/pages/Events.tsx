import React, { useState } from 'react';
import { useSecurityData, SecurityEvent } from '../contexts/SecurityDataContext';
import { AlertTriangleIcon, SearchIcon, FilterIcon, ActivityIcon } from 'lucide-react';
import { format } from 'date-fns';

// Format event message based on type
const formatEventMessage = (event: SecurityEvent) => {
  const addressShort = `${event.address.substring(0, 6)}...${event.address.substring(event.address.length - 4)}`;
  
  switch (event.type) {
    case 'UserRegistered':
      return `User ${addressShort} registered as ${event.data.role}`;
    case 'RoleAssigned':
      return `${addressShort} role changed from ${event.data.oldRole} to ${event.data.newRole}`;
    case 'MFAVerified':
      return `MFA ${event.data.success ? 'verified' : 'failed'} for ${addressShort}`;
    case 'ActionLogged':
      return `${addressShort} performed ${event.data.action} action`;
    case 'AnomalyFlagged':
      return `Anomaly detected: ${event.data.anomalyType} from ${addressShort}`;
    default:
      return `Unknown event from ${addressShort}`;
  }
};

// Get event icon class based on type
const getEventIconClass = (eventType: string) => {
  switch (eventType) {
    case 'UserRegistered':
      return 'text-primary-500 bg-primary-500/10';
    case 'RoleAssigned':
      return 'text-warning-500 bg-warning-500/10';
    case 'MFAVerified':
      return 'text-success-500 bg-success-500/10';
    case 'ActionLogged':
      return 'text-slate-400 bg-slate-500/10';
    case 'AnomalyFlagged':
      return 'text-danger-500 bg-danger-500/10';
    default:
      return 'text-slate-400 bg-slate-500/10';
  }
};

// Get severity badge class
const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'badge-danger';
    case 'high':
      return 'badge-danger';
    case 'medium':
      return 'badge-warning';
    case 'low':
      return 'badge-primary';
    default:
      return 'bg-dark-700 text-slate-300';
  }
};

const Events: React.FC = () => {
  const { events, loading } = useSecurityData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  
  // Event types for filtering
  const eventTypes = ['UserRegistered', 'RoleAssigned', 'MFAVerified', 'ActionLogged', 'AnomalyFlagged'];
  const severityLevels = ['critical', 'high', 'medium', 'low'];
  
  // Toggle event type filter
  const toggleEventType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  // Toggle severity filter
  const toggleSeverity = (severity: string) => {
    if (selectedSeverity.includes(severity)) {
      setSelectedSeverity(selectedSeverity.filter(s => s !== severity));
    } else {
      setSelectedSeverity([...selectedSeverity, severity]);
    }
  };
  
  // Filter events
  const filteredEvents = events
    .filter(event => {
      // Apply search query
      if (searchQuery) {
        const message = formatEventMessage(event);
        return message.toLowerCase().includes(searchQuery.toLowerCase()) ||
               event.address.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(event => {
      // Apply event type filter
      if (selectedTypes.length === 0) return true;
      return selectedTypes.includes(event.type);
    })
    .filter(event => {
      // Apply severity filter
      if (selectedSeverity.length === 0) return true;
      return selectedSeverity.includes(event.severity);
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow2" />
      </div>
      <div className="relative z-10 p-4 lg:p-8 max-w-[1920px] mx-auto">
        <div className="bg-dark-800/60 backdrop-blur-2xl rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-slate-100 to-pink-400 animate-gradient-text mb-2">Events</h1>
          <p className="text-slate-400 text-lg">All system and security events in real time.</p>
        </div>
        
        {/* Filters */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="input pl-10 w-full"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative group">
                <button className="btn btn-secondary flex items-center gap-1">
                  <FilterIcon size={18} />
                  <span>Event Type</span>
                </button>
                
                <div className="absolute z-10 right-0 mt-2 w-60 bg-dark-800 border border-dark-700 rounded-md shadow-lg hidden group-hover:block animate-fade-in">
                  <div className="p-2">
                    {eventTypes.map(type => (
                      <label key={type} className="flex items-center p-2 hover:bg-dark-700 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleEventType(type)}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <button className="btn btn-secondary flex items-center gap-1">
                  <AlertTriangleIcon size={18} />
                  <span>Severity</span>
                </button>
                
                <div className="absolute z-10 right-0 mt-2 w-40 bg-dark-800 border border-dark-700 rounded-md shadow-lg hidden group-hover:block animate-fade-in">
                  <div className="p-2">
                    {severityLevels.map(severity => (
                      <label key={severity} className="flex items-center p-2 hover:bg-dark-700 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedSeverity.includes(severity)}
                          onChange={() => toggleSeverity(severity)}
                        />
                        <span className="text-sm capitalize">{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <ActivityIcon size={24} className="text-primary-500 animate-spin" />
              <span className="ml-2 text-slate-400">Loading events...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-10">
              <AlertTriangleIcon size={32} className="mx-auto text-slate-400 mb-2" />
              <h3 className="text-lg font-medium mb-1">No events found</h3>
              <p className="text-slate-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700"></div>
              
              {/* Events */}
              <div className="space-y-4">
                {filteredEvents.map(event => (
                  <div key={event.id} className="relative pl-14 pr-4 py-3 hover:bg-dark-700/50 rounded-lg transition-colors">
                    {/* Timeline dot */}
                    <div className={`absolute left-4 top-4 h-5 w-5 rounded-full ${getEventIconClass(event.type)} flex items-center justify-center`}>
                      <ActivityIcon size={12} />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm md:text-base font-medium">
                          {formatEventMessage(event)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {format(new Date(event.timestamp), 'MMM d, yyyy h:mm:ss a')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2 md:mt-0">
                        <span className={`badge ${getSeverityBadgeClass(event.severity)}`}>
                          {event.severity}
                        </span>
                        <span className={`badge ${
                          event.source === 'on-chain' 
                            ? 'bg-primary-500/20 text-primary-300' 
                            : 'bg-slate-500/20 text-slate-300'
                        }`}>
                          {event.source === 'on-chain' ? 'On-Chain' : 'Off-Chain'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;