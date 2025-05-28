import { useEffect } from 'react';
import { contract } from '../services/web3';

export const useContractEvents = () => {
  useEffect(() => {
    const roleAssignedListener = contract.events.RoleAssigned({}, (error, event) => {
      if (!error) {
        console.log("🔔 RoleAssigned Event:", event.returnValues);
      }
    });

    const mfaVerifiedListener = contract.events.MFAVerified({}, (error, event) => {
      if (!error) {
        console.log("🔐 MFAVerified Event:", event.returnValues);
      }
    });

    const logCreatedListener = contract.events.LogCreated({}, (error, event) => {
      if (!error) {
        console.log("📜 LogCreated Event:", event.returnValues);
      }
    });

    return () => {
      roleAssignedListener.unsubscribe();
      mfaVerifiedListener.unsubscribe();
      logCreatedListener.unsubscribe();
    };
  }, []);
};
