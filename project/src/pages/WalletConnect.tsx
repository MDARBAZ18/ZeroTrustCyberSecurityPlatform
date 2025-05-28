import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import styles from '../styles/WalletConnect.module.css';
import { WalletIcon, ShieldIcon, CheckCircleIcon, AlertTriangleIcon, LockIcon, ArrowRightIcon } from 'lucide-react';

const WalletConnect: React.FC = () => {
  const { account, isConnected, connectWallet, disconnectWallet, userRole, isConnecting } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await connectWallet();
      navigate('/');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Animated background */}
      <div className={styles.particles}>
        {/* Hexagonal Grid */}
        <div className={styles.hexGrid}>
          {[...Array(20)].map((_, index) => (
            <div key={index} className={styles.hexagon} />
          ))}
        </div>
        
        {/* Glowing orbs */}
        <div className={styles.orb} style={{ '--hue': '240deg' } as React.CSSProperties}></div>
        <div className={styles.orb} style={{ '--hue': '280deg' } as React.CSSProperties}></div>
        <div className={styles.orb} style={{ '--hue': '320deg' } as React.CSSProperties}></div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <WalletIcon size={32} className={styles.icon} />
          <div className={styles.iconRing}></div>
        </div>
        
        <h1 className={styles.title}>
          <span className={styles.titleGradient}>Connect</span> Your Wallet
        </h1>
        
        <p className={styles.description}>
          Access the next-gen blockchain security monitoring system
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <ShieldIcon size={20} />
            <span>Enhanced Security</span>
          </div>
          <div className={styles.feature}>
            <CheckCircleIcon size={20} />
            <span>Real-time Monitoring</span>
          </div>
          <div className={styles.feature}>
            <LockIcon size={20} />
            <span>Secure Access</span>
          </div>
        </div>
        
        <button onClick={handleConnect} className={styles.connectButton} disabled={isConnecting}>
          <span>Connect MetaMask</span>
          <ArrowRightIcon size={20} className={styles.buttonIcon} />
        </button>
        
        <div className={styles.securityNote}>
          <AlertTriangleIcon size={16} className={styles.noteIcon} />
          <span>Your security is our top priority</span>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;