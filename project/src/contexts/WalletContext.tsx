import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Types for ethereum window object
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

// Types
type WalletContextType = {
  account: string | null;
  isConnected: boolean;
  isAdmin: boolean;
  userRole: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  chainId: string | null;
  isConnecting: boolean;
};

type WalletProviderProps = {
  children: ReactNode;
};

// Create context
const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnected: false,
  isAdmin: false,
  userRole: 'Guest',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  provider: null,
  chainId: null,
  isConnecting: false,
});

// Provider component
export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('Guest');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Connect wallet
  const connectWallet = async () => {
    if (isConnecting) return; // Prevent multiple requests
    setIsConnecting(true);
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const network = await newProvider.getNetwork();
        
        setAccount(accounts[0]);
        setIsConnected(true);
        setProvider(newProvider);
        setChainId(network.chainId.toString());
        
        // Always set as Admin role
        setUserRole('Admin');
        setIsAdmin(true);
        
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setIsConnecting(false);
      console.error('Please install MetaMask!');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setProvider(null);
    setChainId(null);
    setUserRole('Guest');
    setIsAdmin(false);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [account]);

  // Context value
  const value = {
    account,
    isConnected,
    isAdmin,
    userRole,
    connectWallet,
    disconnectWallet,
    provider,
    chainId,
    isConnecting,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

// Custom hook
export const useWallet = () => useContext(WalletContext);