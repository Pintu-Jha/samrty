import React from 'react';
import NetworkConnectivityOverlay from '../components/common/NetworkConnectivityOverlay';
import { NetworkStatusProvider } from './NetworkStatusProvider';
import SocketProvider from './SocketProvider';

export function AppContextProviders({ children }) {
  return (
    <NetworkStatusProvider>
      <SocketProvider>
        <NetworkConnectivityOverlay>
          {children}
        </NetworkConnectivityOverlay>
      </SocketProvider>
    </NetworkStatusProvider>
  );
}

export default AppContextProviders;