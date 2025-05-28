import React, { useState } from 'react';
import { UserPlusIcon, XIcon, ShieldIcon, KeyIcon } from 'lucide-react';
import { useSecurityData } from '../contexts/SecurityDataContext';
import { ethers } from 'ethers';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { addUser, dataSource } = useSecurityData();
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('Guest');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = ['Admin', 'Manager', 'Auditor', 'Guest'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate address
    if (!ethers.isAddress(address)) {
      setError('Invalid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔵 Attempting to register user:", { address, role });
      await addUser(address, role);
      console.log("✅ User registration initiated");
      onClose();
    } catch (err: any) {
      console.error("❌ Registration error:", err);
      setError(err.message || 'Failed to register user. Please try again.');
      // Keep modal open on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-lg shadow-xl w-full max-w-md mx-4 relative overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-500/20 to-primary-700/20 p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          >
            <XIcon size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <UserPlusIcon size={24} className="text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Register New User</h2>
              <p className="text-slate-400 text-sm">Add a new user to the {dataSource === 'on-chain' ? 'blockchain' : 'system'}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Address Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Ethereum Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <KeyIcon size={16} className="text-slate-500" />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                    role === r
                      ? 'bg-primary-500/10 border-primary-500 text-primary-400'
                      : 'bg-dark-700 border-dark-600 text-slate-400 hover:border-primary-500/50'
                  } transition-all`}
                >
                  <ShieldIcon size={16} />
                  <span>{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-danger-500/10 border border-danger-500/20 rounded-lg p-3 text-sm text-danger-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlusIcon size={18} className="mr-2" />
                  Register User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationModal;