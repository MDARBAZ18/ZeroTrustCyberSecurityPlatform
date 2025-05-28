import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { SecurityDataProvider } from './contexts/SecurityDataContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import ThreatMonitor from './pages/ThreatMonitor';
import Documentation from './pages/Documentation';
import WalletConnect from './pages/WalletConnect';
import UserManagement from './pages/UserManagement';
import AuditTrail from './pages/AuditTrail';
import VerifyMFA from './pages/VerifyMFA';

function App() {
  return (
    <Router>
      <WalletProvider>
        <SecurityDataProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="threats" element={<ThreatMonitor />} />
              <Route path="docs" element={<Documentation />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="audit" element={<AuditTrail />} />
              <Route path="connect" element={<WalletConnect />} />
              <Route path="verify-mfa" element={<VerifyMFA />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </SecurityDataProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;