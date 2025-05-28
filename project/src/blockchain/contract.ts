import { ethers } from "ethers";
import contractABI from "../../artifacts/contracts/ZeroTrustIAM.sol/ZeroTrustIAM.json";

// Contract address (deployed on Sepolia testnet)
const CONTRACT_ADDRESS = "0xB4801c10221F067400e8BFdA39181bCC55Aa7D78";
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

// Function to ensure MetaMask is connected
async function ensureMetaMaskConnected() {
  const provider = window.ethereum;
  
  if (!provider?.request || typeof provider.request !== 'function') {
    throw new Error("MetaMask not found! Please install MetaMask browser extension.");
  }

  try {
    // Request account access
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("No accounts found. Please connect to MetaMask.");
    }
    
    const currentAccount = accounts[0];
    console.log("🦊 Connected to MetaMask account:", currentAccount);

    // Get current chain ID
    const chainId = await provider.request({ method: 'eth_chainId' });
    console.log("Current chain ID:", chainId);

    // Switch to Sepolia if not already on it
    if (chainId !== SEPOLIA_CHAIN_ID) {
      console.log("Switching to Sepolia network...");
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
        console.log("✅ Successfully switched to Sepolia network");
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          console.log("Sepolia network not found, adding it...");
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                },
              ],
            });
            console.log("✅ Successfully added Sepolia network");
          } catch (addError) {
            console.error("❌ Failed to add Sepolia network:", addError);
            throw new Error("Failed to add Sepolia network to MetaMask");
          }
        } else {
          console.error("❌ Failed to switch to Sepolia:", switchError);
          throw new Error("Failed to switch to Sepolia network");
        }
      }
    }

    return currentAccount;
  } catch (error) {
    console.error("❌ Failed to connect to MetaMask:", error);
    throw error;
  }
}

// Contract interface
export type IZeroTrustContract = ethers.Contract & {
  // User Management
  registerUser: (user: string, role: string) => Promise<ethers.ContractTransactionResponse>;
  assignRole: (user: string, newRole: string) => Promise<ethers.ContractTransactionResponse>;
  verifyMFA: (user: string) => Promise<ethers.ContractTransactionResponse>;
  
  // Data Access
  getEvents: () => Promise<{
    eventType: string;
    addr: string;
    timestamp: bigint;
    data: string;
    severity: string;
  }[]>;
  getAnomalies: () => Promise<{
    id: bigint;
    addr: string;
    timestamp: bigint;
    anomalyType: string;
    severity: string;
    description: string;
    mitigated: boolean;
  }[]>;
  getAuditLogs: () => Promise<{
    id: bigint;
    addr: string;
    action: string;
    timestamp: bigint;
    details: string;
  }[]>;
  getUsers: () => Promise<{
    addr: string;
    role: string;
    registered: boolean;
    lastActivity: bigint;
    mfaVerified: boolean;
  }[]>;
  
  // Anomaly Management
  reportAnomaly: (
    user: string,
    anomalyType: string,
    severity: string,
    description: string
  ) => Promise<ethers.ContractTransactionResponse>;
  mitigateAnomaly: (anomalyId: number) => Promise<ethers.ContractTransactionResponse>;
  
  // Audit Logging
  logAction: (action: string, details: string) => Promise<ethers.ContractTransactionResponse>;
};

export async function getContractInstance(): Promise<IZeroTrustContract> {
  await ensureMetaMaskConnected();

  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not available");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log("🔄 Creating contract instance...");
    console.log("📄 Contract address:", CONTRACT_ADDRESS);
    console.log("👛 Signer address:", await signer.getAddress());
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI.abi,
      signer
    ) as IZeroTrustContract;

    // Verify contract is deployed
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      throw new Error('Contract not deployed at this address!');
    }

    console.log("✅ Contract instance created successfully");
    return contract;
  } catch (error) {
    console.error("❌ Failed to create contract instance:", error);
    throw error;
  }
}
