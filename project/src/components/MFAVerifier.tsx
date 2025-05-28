import { useState, useEffect } from "react";
import { getContractInstance } from "../blockchain/contract";

// Add ethereum to the Window type for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: Array<unknown> }) => Promise<unknown>;
      // Add other properties/methods as needed
    };
  }
}

export default function MFAVerifier() {
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  // 🔍 Load wallet + contract info on mount
  useEffect(() => {
    async function check() {
      try {
        const contract = await getContractInstance();
        if (!window.ethereum) {
          throw new Error("Ethereum provider not found. Please install MetaMask.");
        }
        const [address] = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
        setUserAddress(address);
        console.log("👛 Connected wallet:", address);
        console.log("📄 Contract address:", contract.target);
      } catch (err) {
        console.error("Wallet not connected", err);
      }
    }
    check();
  }, []);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const contract = await getContractInstance();
      const tx = await contract.verifyMFA(userAddress); // Only wallet address as param
      await tx.wait();
      alert("✅ MFA Verified on-chain");
    } catch (err) {
      console.error("❌ MFA verification failed:", err);
      alert("❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 bg-white rounded shadow">
      <div className="text-gray-700">
        <strong>Wallet:</strong> {userAddress || "Not connected"}
      </div>
      <button
        onClick={handleVerify}
        disabled={loading || !userAddress}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify MFA"}
      </button>
    </div>
  );
}
