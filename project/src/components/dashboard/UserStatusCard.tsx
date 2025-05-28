import React from 'react';
import { UsersIcon, CheckIcon, XIcon } from 'lucide-react';
import { useSecurityData } from '../../contexts/SecurityDataContext';

// Helper to generate shorten address
const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const UserStatusCard: React.FC = () => {
  const { users } = useSecurityData();
  
  // Sort users by role importance
  const sortedUsers = [...users].sort((a, b) => {
    const roleOrder: Record<string, number> = {
      'Admin': 1,
      'Manager': 2,
      'Auditor': 3,
      'Guest': 4
    };
    
    return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
  });
  
  // Role colors
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Admin': return 'badge-danger';
      case 'Manager': return 'badge-warning';
      case 'Auditor': return 'badge-primary';
      default: return 'bg-dark-700 text-slate-300';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">User Status</h3>
        <div className="bg-dark-700 rounded-full p-1.5">
          <UsersIcon size={20} className="text-primary-500" />
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-dark-700">
              <th className="pb-2 font-medium">Address</th>
              <th className="pb-2 font-medium">Role</th>
              <th className="pb-2 font-medium text-center">MFA</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {sortedUsers.map((user) => (
              <tr key={user.address} className="hover:bg-dark-700/50">
                <td className="py-3 text-slate-300">{shortenAddress(user.address)}</td>
                <td className="py-3">
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 text-center">
                  {user.mfaVerified ? (
                    <CheckIcon size={16} className="inline text-success-500" />
                  ) : (
                    <XIcon size={16} className="inline text-danger-500" />
                  )}
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.registered ? 'bg-success-500/20 text-success-300' : 'bg-slate-500/20 text-slate-300'}`}>
                    {user.registered ? 'Active' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserStatusCard;