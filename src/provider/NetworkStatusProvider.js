import React, { createContext, useContext, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Network state management
const initialNetworkState = {
  isConnected: null,
  isInternetReachable: null,
  type: null,
  details: null,
  lastChecked: null,
  isRetrying: false,
  retryAttempts: 0,
  isOfflineModeActive: false,
};

const networkReducer = (state, action) => {
  switch (action.type) {
    case 'CONNECTION_CHANGE':
      return {
        ...state,
        isConnected: action.payload.isConnected,
        isInternetReachable: action.payload.isInternetReachable,
        type: action.payload.type,
        details: action.payload.details,
        lastChecked: new Date().toISOString(),
        retryAttempts: action.payload.isConnected ? 0 : state.retryAttempts,
      };
    case 'START_RETRY':
      return {
        ...state,
        isRetrying: true,
        retryAttempts: state.retryAttempts + 1,
      };
    case 'END_RETRY':
      return {
        ...state,
        isRetrying: false,
      };
    case 'SET_OFFLINE_MODE':
      return {
        ...state,
        isOfflineModeActive: action.payload,
      };
    default:
      return state;
  }
};

const NetworkContext = createContext(null);

export const NetworkStatusProvider = ({ children }) => {
  const [state, dispatch] = useReducer(networkReducer, initialNetworkState);
  const unsubscribeRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const isFirstCheckRef = useRef(true);
  const pendingReachabilityCheckRef = useRef(false);
  const lastNetStateRef = useRef(null);
  const throttleTimerRef = useRef(null);

  // Log network status changes in development - throttled to avoid spam
  const logNetworkChange = useCallback((newState) => {
    if (__DEV__) {
      // Don't log during initialization flood - wait for steady state
      if (throttleTimerRef.current) {
        return;
      }
      
      // Create a simple string representation for comparison
      const stateKey = `${newState.isConnected}-${newState.isInternetReachable}-${newState.type}`;
      const lastStateKey = lastNetStateRef.current;
      
      // Only log if something meaningful changed
      if (stateKey !== lastStateKey) {
        console.log(
          `[Network] Status: ${newState.isConnected ? 'Connected' : 'Disconnected'}, ` +
          `Type: ${newState.type}, ` +
          `Internet Reachable: ${newState.isInternetReachable}`
        );
        if (newState.details) {
          console.log(`[Network] Details:`, newState.details);
        }
        
        // Remember this state to avoid duplicate logs
        lastNetStateRef.current = stateKey;
        
        // Throttle additional logs for 2 seconds
        throttleTimerRef.current = setTimeout(() => {
          throttleTimerRef.current = null;
        }, 2000);
      }
    }
  }, []);

  // Check internet reachability manually
  const checkInternetReachability = useCallback(async () => {
    if (!state.isConnected) return false;
    if (pendingReachabilityCheckRef.current) return state.isInternetReachable;

    pendingReachabilityCheckRef.current = true;
    try {
      // Try to fetch a small resource to confirm internet connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      
      clearTimeout(timeoutId);
      pendingReachabilityCheckRef.current = false;
      return response.status === 204;
    } catch (error) {
      if (__DEV__ && !error.toString().includes('aborted')) {
        console.warn('[Network] Internet reachability check failed:', error);
      }
      pendingReachabilityCheckRef.current = false;
      return false;
    }
  }, [state.isConnected, state.isInternetReachable]);

  // Force a network state refresh
  const refreshNetworkStatus = useCallback(async () => {
    if (pendingReachabilityCheckRef.current) return state.isConnected && state.isInternetReachable;
    
    try {
      dispatch({ type: 'START_RETRY' });
      const netState = await NetInfo.fetch();
      
      // Check actual internet reachability if connected
      let isInternetReachable = netState.isInternetReachable;
      if (netState.isConnected && (isInternetReachable === null || isInternetReachable === undefined)) {
        isInternetReachable = await checkInternetReachability();
      }
      
      // Only dispatch if values actually changed to prevent unnecessary re-renders
      if (
        netState.isConnected !== state.isConnected ||
        isInternetReachable !== state.isInternetReachable || 
        netState.type !== state.type ||
        isFirstCheckRef.current
      ) {
        dispatch({
          type: 'CONNECTION_CHANGE',
          payload: {
            ...netState,
            isInternetReachable,
          },
        });
        
        logNetworkChange({
          ...netState,
          isInternetReachable,
        });
        
        isFirstCheckRef.current = false;
      }
      
      return netState.isConnected && isInternetReachable;
    } catch (error) {
      console.error('[Network] Failed to refresh network status:', error);
      return false;
    } finally {
      dispatch({ type: 'END_RETRY' });
    }
  }, [state.isConnected, state.isInternetReachable, state.type, checkInternetReachability, logNetworkChange]);

  // Schedule retry with exponential backoff
  const scheduleRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    // Calculate backoff time (1s, 2s, 4s, 8s, 16s, max 30s)
    const delayMs = Math.min(
      30000,
      1000 * Math.pow(2, Math.min(4, state.retryAttempts))
    );
    
    if (__DEV__ && !throttleTimerRef.current) {
      console.log(`[Network] Scheduling connectivity retry in ${delayMs/1000}s`);
      // Throttle additional logs
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;
      }, 2000);
    }
    
    retryTimeoutRef.current = setTimeout(() => {
      refreshNetworkStatus();
    }, delayMs);
  }, [state.retryAttempts, refreshNetworkStatus]);

  // Toggle offline mode (used when you want to work offline deliberately)
  const setOfflineMode = useCallback((isActive) => {
    dispatch({ type: 'SET_OFFLINE_MODE', payload: isActive });
  }, []);

  // Initialize network monitoring
  useEffect(() => {
    // Initial check - delay to avoid initialization flood
    setTimeout(() => {
      refreshNetworkStatus();
    }, 500);
    
    // Subscribe to network info updates 
    unsubscribeRef.current = NetInfo.addEventListener((netState) => {
      // Don't process duplicate updates
      if (
        netState.isConnected === state.isConnected &&
        netState.isInternetReachable === state.isInternetReachable &&
        netState.type === state.type &&
        !isFirstCheckRef.current
      ) {
        return;
      }
      
      // Check actual internet reachability
      if (netState.isConnected && 
         (netState.isInternetReachable === null || netState.isInternetReachable === undefined)
      ) {
        if (!pendingReachabilityCheckRef.current) {
          checkInternetReachability().then(isReachable => {
            // Double check the state hasn't changed while we were checking
            if (state.isConnected === netState.isConnected && 
                state.type === netState.type &&
                !isFirstCheckRef.current) {
              // Only update the reachability part
              dispatch({
                type: 'CONNECTION_CHANGE',
                payload: {
                  ...netState,
                  isInternetReachable: isReachable,
                },
              });
              
              logNetworkChange({
                ...netState,
                isInternetReachable: isReachable,
              });
            }
            
            // If not actually reachable despite being connected, schedule retry
            if (!isReachable) {
              scheduleRetry();
            }
            
            isFirstCheckRef.current = false;
          });
        }
      } else {
        dispatch({
          type: 'CONNECTION_CHANGE',
          payload: netState,
        });
        
        logNetworkChange(netState);
        
        // Schedule retry if no connection
        if (!netState.isConnected || netState.isInternetReachable === false) {
          scheduleRetry();
        }
        
        isFirstCheckRef.current = false;
      }
    });
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Expose network info and control functions
  const networkContext = useMemo(() => ({
    // Network state
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    isRetrying: state.isRetrying,
    isOfflineModeActive: state.isOfflineModeActive,
    networkType: state.type,
    connectionDetails: state.details,
    lastChecked: state.lastChecked,
    
    // Computed properties
    isNetworkAvailable: state.isConnected && state.isInternetReachable && !state.isOfflineModeActive,
    isCellular: state.type === 'cellular',
    isWifi: state.type === 'wifi',
    isExpensive: state.details?.isConnectionExpensive || state.type === 'cellular',
    
    // Functions
    refreshNetworkStatus,
    setOfflineMode,
    getNetInfo: () => NetInfo.fetch(),
  }), [
    state,
    refreshNetworkStatus,
    setOfflineMode,
  ]);

  return (
    <NetworkContext.Provider value={networkContext}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkStatus = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
};