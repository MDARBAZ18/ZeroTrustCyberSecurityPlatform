import React from 'react';
import { ActivityIcon, ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSecurityData, SecurityEvent } from '../../contexts/SecurityDataContext';
import { format } from 'date-fns';

// Helper to get event icon and color
const getEventDetails = (eventType: string) => {
  switch (eventType) {
    case 'UserRegistered':
      return { color: 'text-primary-500', bg: 'bg-primary-500/10' };
    case 'RoleAssigned':
      return { color: 'text-warning-500', bg: 'bg-warning-500/10' };
    case 'MFAVerified':
      return { color: 'text-success-500', bg: 'bg-success-500/10' };
    case 'ActionLogged':
      return { color: 'text-slate-400', bg: 'bg-slate-500/10' };
    case 'AnomalyFlagged':
      return { color: 'text-danger-500', bg: 'bg-danger-500/10' };
    default:
      return { color: 'text-slate-400', bg: 'bg-slate-500/10' };
  }
};

// Helper to format event message
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

const RecentEventsCard: React.FC = () => {
  const { events } = useSecurityData();
  
  // Get most recent events
  const recentEvents = [...events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
  
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Recent Events</h3>
        <div className="bg-dark-700 rounded-full p-1.5">
          <ActivityIcon size={20} className="text-primary-500" />
        </div>
      </div>
      
      <div className="space-y-3">
        {recentEvents.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No events recorded yet</p>
        ) : (
          recentEvents.map((event) => {
            const { color, bg } = getEventDetails(event.type);
            const message = formatEventMessage(event);
            const formattedTime = format(new Date(event.timestamp), 'MMM d, h:mm a');
            
            return (
              <div key={event.id} className="flex items-start space-x-3 p-2 hover:bg-dark-700 rounded-md transition-colors">
                <div className={`mt-0.5 p-1.5 rounded-md ${bg}`}>
                  <ActivityIcon size={14} className={color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{message}</p>
                  <p className="text-xs text-slate-500">{formattedTime}</p>
                </div>
                
                {event.severity === 'critical' && (
                  <span className="badge badge-danger">Critical</span>
                )}
                {event.severity === 'high' && (
                  <span className="badge badge-danger">High</span>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-dark-700">
        <Link 
          to="/events" 
          className="flex items-center justify-center text-sm text-primary-400 hover:text-primary-300"
        >
          <span>View all events</span>
          <ChevronRightIcon size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default RecentEventsCard;