import React, { useState } from 'react';
import { useSecurityData, UserStatus } from '../contexts/SecurityDataContext';
import { useWallet } from '../contexts/WalletContext';
import { 
  UsersIcon, 
  ShieldIcon, 
  SearchIcon, 
  UserPlusIcon,
  EditIcon, 
  UserIcon,
  KeyIcon,
  XIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import UserRegistrationModal from '../components/UserRegistrationModal';

const UserManagement: React.FC = () => {
  const { users, loading, dataSource } = useSecurityData();
  const { isConnected, userRole } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const navigate = useNavigate();
  
  // If not admin or manager, redirect to dashboard
  React.useEffect(() => {
    if (isConnected && userRole !== 'Admin' && userRole !== 'Manager') {
      navigate('/');
    }
  }, [isConnected, userRole, navigate]);
  
  // Filter users
  const filteredUsers = users
    .filter(user => {
      if (searchQuery) {
        return user.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
               user.role.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by role importance
      const roleOrder: Record<string, number> = {
        'Admin': 1,
        'Manager': 2,
        'Auditor': 3,
        'Guest': 4
      };
      
      return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
    });

  // Role badge class
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Admin': return 'badge-danger';
      case 'Manager': return 'badge-warning';
      case 'Auditor': return 'badge-primary';
      default: return 'bg-dark-700 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow2" />
      </div>
      <div className="relative z-10 p-4 lg:p-8 max-w-[1920px] mx-auto">
        <div className="bg-dark-800/60 backdrop-blur-2xl rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-slate-100 to-pink-400 animate-gradient-text mb-2">User Management</h1>
          <p className="text-slate-400 text-lg">Manage users, roles, and permissions.</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">User Management</h1>
            <p className="text-slate-400">Manage user roles and permissions</p>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="btn btn-primary"
            disabled={!isConnected || (userRole !== 'Admin' && userRole !== 'Manager')}
          >
            <UserPlusIcon size={18} className="mr-2" />
            Add User
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by address or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Data Source:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                dataSource === 'on-chain' 
                  ? 'bg-primary-500/20 text-primary-300' 
                  : 'bg-slate-500/20 text-slate-300'
              }`}>
                {dataSource === 'on-chain' ? 'Blockchain' : 'Simulated'}
              </span>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-dark-800 rounded-lg border border-dark-700">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <UsersIcon size={32} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Users Found</h3>
              <p className="text-slate-400">
                {searchQuery 
                  ? 'Try adjusting your search query'
                  : dataSource === 'on-chain'
                    ? 'No users registered on the blockchain yet'
                    : 'No users in the system yet'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Address</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Activity</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">MFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.address} className="hover:bg-dark-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-dark-700 rounded-lg">
                            <UserIcon size={16} className="text-slate-400" />
                          </div>
                          <span className="font-mono text-sm text-slate-300">
                            {`${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.registered
                            ? 'bg-success-500/20 text-success-300'
                            : 'bg-slate-500/20 text-slate-300'
                        }`}>
                          {user.registered ? 'Registered' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {format(user.lastActivity, 'MMM d, h:mm a')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.mfaVerified
                            ? 'bg-success-500/20 text-success-300'
                            : 'bg-warning-500/20 text-warning-300'
                        }`}>
                          {user.mfaVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Registration Modal */}
        <UserRegistrationModal
          isOpen={showAddUser}
          onClose={() => setShowAddUser(false)}
        />
      </div>
    </div>
  );
};

export default UserManagement;