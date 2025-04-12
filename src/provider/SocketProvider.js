import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';
import { io } from 'socket.io-client';
import { useAppSelector } from '../components/hooks';

// Custom UUID generator for React Native
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const SOCKET_CONFIG = {
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 5000,
  TIMEOUT: 10000, 
  DEFAULT_NAMESPACE: '/',
  HEARTBEAT_INTERVAL: 30000,
  DEBUG: __DEV__,
};

const initialSocketState = {
  connected: false,
  connecting: false,
  connectionAttempts: 0,
  lastConnected: null,
  disconnectReason: null,
  error: null,
  pingTime: null,
  serverTime: null,
  latency: null,
  pendingRequests: {},
  eventQueue: [],
  namespaces: {},
  statusByNamespace: {},
};

const socketReducer = (state, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case 'CONNECTING':
      return { 
        ...state, 
        connecting: true,
        connectionAttempts: state.connectionAttempts + 1,
      };
      
    case 'CONNECTED':
      return { 
        ...state, 
        connected: true, 
        connecting: false,
        connectionAttempts: 0,
        lastConnected: new Date().toISOString(),
        error: null,
        disconnectReason: null,
        eventQueue: [], 
      };
      
    case 'DISCONNECTED':
      return { 
        ...state, 
        connected: false, 
        connecting: false,
        disconnectReason: payload,
      };
      
    case 'ERROR':
      return { 
        ...state, 
        error: payload, 
        connected: false,
        connecting: false,
      };
      
    case 'SET_LATENCY':
      return {
        ...state,
        latency: payload,
      };
      
    case 'SET_SERVER_TIME':
      return {
        ...state,
        serverTime: payload,
      };
      
    case 'PING_TIME':
      return {
        ...state,
        pingTime: payload,
      };
      
    case 'ADD_PENDING_REQUEST':
      return {
        ...state,
        pendingRequests: {
          ...state.pendingRequests,
          [payload.id]: {
            id: payload.id,
            event: payload.event,
            timestamp: Date.now(),
            timeout: payload.timeout,
            callback: payload.callback,
          }
        }
      };
      
    case 'REMOVE_PENDING_REQUEST':
      const { [payload]: removed, ...remainingRequests } = state.pendingRequests;
      return {
        ...state,
        pendingRequests: remainingRequests
      };
      
    case 'QUEUE_EVENT':
      return {
        ...state,
        eventQueue: [...state.eventQueue, payload]
      };
      
    case 'CLEAR_EVENT_QUEUE':
      return {
        ...state,
        eventQueue: []
      };
      
    case 'NAMESPACE_CONNECTED':
      return {
        ...state,
        namespaces: {
          ...state.namespaces,
          [payload.namespace]: payload.socket
        },
        statusByNamespace: {
          ...state.statusByNamespace,
          [payload.namespace]: {
            connected: true,
            error: null
          }
        }
      };
      
    case 'NAMESPACE_DISCONNECTED':
      return {
        ...state,
        statusByNamespace: {
          ...state.statusByNamespace,
          [payload.namespace]: {
            connected: false,
            error: payload.error || null
          }
        }
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

const SocketContext = createContext(null);

export const SocketProvider = ({ children, config = {}, onConnect, onDisconnect }) => {
  const socketConfig = { ...SOCKET_CONFIG, ...config };
  const logTimeRef = useRef({});
 
  const [state, dispatch] = useReducer(socketReducer, initialSocketState);
 
  const domainState = useAppSelector(state => state.domains.selectedDomain?.domain);
  const token = useAppSelector(state => state.auth.user?.authToken);
  
  const socketRef = useRef(null);
  const namespacesRef = useRef({});
  const timeoutIdsRef = useRef({});
  const heartbeatIntervalRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const eventListenersRef = useRef({});
  
  const logDebug = useCallback((...args) => {
    if (socketConfig.DEBUG) {
      const logMessage = args.join(' ');
      const now = Date.now();
      const lastLogTime = logTimeRef.current[logMessage] || 0;
      
      if (now - lastLogTime > 2000) {
        console.log(`[SocketProvider ${new Date().toISOString()}]`, ...args);
        logTimeRef.current[logMessage] = now;
        
        // Clean up old log entries every 100 logs
        if (Object.keys(logTimeRef.current).length > 100) {
          const cutoffTime = now - 60000; // 1 minute
          for (const key in logTimeRef.current) {
            if (logTimeRef.current[key] < cutoffTime) {
              delete logTimeRef.current[key];
            }
          }
        }
      }
    }
  }, [socketConfig.DEBUG]);
  
  const logError = useCallback((...args) => {
    console.error(`[SocketProvider ERROR ${new Date().toISOString()}]`, ...args);
  }, []);

  const getReconnectionDelay = useCallback(() => {
    const { connectionAttempts } = state;
    const { RECONNECTION_DELAY, RECONNECTION_DELAY_MAX } = socketConfig;
    
    const delay = Math.min(
      RECONNECTION_DELAY_MAX,
      RECONNECTION_DELAY * Math.pow(1.5, connectionAttempts)
    );
    
    return delay + (Math.random() * 1000);
  }, [state.connectionAttempts, socketConfig]);

  const clearAllTimeouts = useCallback(() => {
    Object.values(timeoutIdsRef.current).forEach(id => clearTimeout(id));
    timeoutIdsRef.current = {};
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const setupHeartbeat = useCallback((socket) => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      const startTime = Date.now();
      dispatch({ type: 'PING_TIME', payload: startTime });
      
      socket.emit('ping', { clientTime: startTime }, (response) => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        dispatch({ type: 'SET_LATENCY', payload: latency });
        
        if (response && response.serverTime) {
          dispatch({ type: 'SET_SERVER_TIME', payload: response.serverTime });
        }
      });
    }, socketConfig.HEARTBEAT_INTERVAL);
  }, [socketConfig.HEARTBEAT_INTERVAL]);

  // Forward declarations for functions that reference each other
  const handleResponse = useCallback(() => {}, []);
  const scheduleReconnect = useCallback(() => {}, []);
  const processEventQueue = useCallback(() => {}, []);
  const emitEvent = useCallback(() => {}, []);
  const connectToNamespace = useCallback(() => {}, []);

  const initializeSocket = useCallback(() => {
    if (socketRef.current || !domainState || !token) {
      return false;
    }
    
    try {
      dispatch({ type: 'CONNECTING' });
      logDebug('Initializing socket connection to', domainState);
      
      socketRef.current = io(domainState, {
        withCredentials: true,
        auth: { token },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: false,
        timeout: socketConfig.TIMEOUT,
        query: {
          clientVersion: '1.0.0',
          connectionId: generateUUID()
        }
      });
      
      const socket = socketRef.current;
      
      socket.on('connect', () => {
        logDebug('Socket connected with ID:', socket.id);
        dispatch({ type: 'CONNECTED' });
        processEventQueue();
        setupHeartbeat(socket);
        
        if (typeof onConnect === 'function') {
          onConnect();
        }
      });
      
      socket.on('disconnect', (reason) => {
        logDebug('Socket disconnected. Reason:', reason);
        dispatch({ type: 'DISCONNECTED', payload: reason });
        
        if (typeof onDisconnect === 'function') {
          onDisconnect(reason);
        }
        
        if (
          reason === 'io server disconnect' || 
          reason === 'io client disconnect'
        ) {
          logDebug('Explicit disconnection, not attempting reconnect');
        } else {
          scheduleReconnect();
        }
      });
      
      socket.on('connect_error', (err) => {
        logError('Socket connection error:', err);
        dispatch({ type: 'ERROR', payload: err.message });
        scheduleReconnect();
      });
      
      socket.on('error', (err) => {
        logError('Socket error:', err);
        dispatch({ type: 'ERROR', payload: err.message || 'Unknown socket error' });
      });
      
      socket.on('response', handleResponse);
      
      return true;
    } catch (error) {
      logError('Failed to initialize socket:', error);
      dispatch({ type: 'ERROR', payload: error.message });
      scheduleReconnect();
      return false;
    }
  }, [domainState, token, logDebug, logError, setupHeartbeat, handleResponse, scheduleReconnect, processEventQueue, onConnect, onDisconnect]);

  // Re-assign the real implementations of the forward-declared functions
  
  handleResponse.current = useCallback((response) => {
    const { requestId, error, data } = response;
    
    if (!requestId || !state.pendingRequests[requestId]) {
      logDebug('Received response for unknown request:', requestId);
      return;
    }
    
    const pendingRequest = state.pendingRequests[requestId];
    
    if (timeoutIdsRef.current[requestId]) {
      clearTimeout(timeoutIdsRef.current[requestId]);
      delete timeoutIdsRef.current[requestId];
    }
    
    const callback = pendingRequest.callback;
    if (typeof callback === 'function') {
      if (error) {
        callback(new Error(error), null);
      } else {
        callback(null, data);
      }
    }
    
    dispatch({ type: 'REMOVE_PENDING_REQUEST', payload: requestId });
  }, [state.pendingRequests, logDebug]);

  scheduleReconnect.current = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (state.connectionAttempts >= socketConfig.RECONNECTION_ATTEMPTS) {
      logDebug('Maximum reconnection attempts reached');
      return;
    }
    
    const delay = getReconnectionDelay();
    logDebug(`Scheduling reconnection in ${Math.round(delay/1000)}s`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      
      initializeSocket();
    }, delay);
  }, [state.connectionAttempts, getReconnectionDelay, initializeSocket, logDebug, socketConfig.RECONNECTION_ATTEMPTS]);

  connectToNamespace.current = useCallback((namespace) => {
    if (!socketRef.current || !socketRef.current.connected) {
      logDebug(`Cannot connect to namespace ${namespace}: Main socket not connected`);
      return null;
    }
    
    if (namespacesRef.current[namespace]) {
      return namespacesRef.current[namespace];
    }
    
    try {
      logDebug(`Connecting to namespace: ${namespace}`);
      const nsSocket = io(`${domainState}${namespace}`, {
        withCredentials: true,
        auth: { token },
        transports: ['websocket', 'polling'],
      });
      
      nsSocket.on('connect', () => {
        logDebug(`Connected to namespace: ${namespace}`);
        dispatch({ 
          type: 'NAMESPACE_CONNECTED', 
          payload: { namespace, socket: nsSocket } 
        });
      });
      
      nsSocket.on('disconnect', (reason) => {
        logDebug(`Disconnected from namespace: ${namespace}. Reason: ${reason}`);
        dispatch({ 
          type: 'NAMESPACE_DISCONNECTED', 
          payload: { namespace, reason } 
        });
      });
      
      nsSocket.on('error', (err) => {
        logError(`Error in namespace ${namespace}:`, err);
        dispatch({ 
          type: 'NAMESPACE_DISCONNECTED', 
          payload: { namespace, error: err.message } 
        });
      });
      
      namespacesRef.current[namespace] = nsSocket;
      return nsSocket;
    } catch (error) {
      logError(`Failed to connect to namespace ${namespace}:`, error);
      dispatch({ 
        type: 'NAMESPACE_DISCONNECTED', 
        payload: { namespace, error: error.message } 
      });
      return null;
    }
  }, [domainState, token, logDebug, logError]);

  emitEvent.current = useCallback((event, data = {}, options = {}) => {
    const {
      namespace = SOCKET_CONFIG.DEFAULT_NAMESPACE,
      timeout = SOCKET_CONFIG.TIMEOUT,
      queueIfDisconnected = true,
      requestResponse = false
    } = options;
    
    let targetSocket;
    if (namespace === SOCKET_CONFIG.DEFAULT_NAMESPACE) {
      targetSocket = socketRef.current;
    } else {
      targetSocket = namespacesRef.current[namespace] || connectToNamespace(namespace);
    }
    
    if ((!targetSocket || !targetSocket.connected) && queueIfDisconnected) {
      logDebug(`Socket disconnected, queueing event: ${event}`);
      dispatch({
        type: 'QUEUE_EVENT',
        payload: { event, data, options }
      });
      return false;
    }
    
    if (!targetSocket || !targetSocket.connected) {
      logDebug(`Socket disconnected, not emitting event: ${event}`);
      return false;
    }
    
    try {
      if (requestResponse) {
        const requestId = generateUUID();
        
        return new Promise((resolve, reject) => {
          timeoutIdsRef.current[requestId] = setTimeout(() => {
            dispatch({ type: 'REMOVE_PENDING_REQUEST', payload: requestId });
            delete timeoutIdsRef.current[requestId];
            reject(new Error(`Request timeout for event: ${event}`));
          }, timeout);
          
          dispatch({
            type: 'ADD_PENDING_REQUEST',
            payload: {
              id: requestId,
              event,
              timeout,
              callback: (err, responseData) => {
                if (err) reject(err);
                else resolve(responseData);
              }
            }
          });
          
          targetSocket.emit(event, { ...data, requestId });
        });
      } else {
        targetSocket.emit(event, data);
        return true;
      }
    } catch (error) {
      logError(`Error emitting event ${event}:`, error);
      return false;
    }
  }, [connectToNamespace, logDebug, logError]);

  processEventQueue.current = useCallback(() => {
    if (!state.connected || !socketRef.current) return;
    
    const { eventQueue } = state;
    if (eventQueue.length === 0) return;
    
    logDebug(`Processing ${eventQueue.length} queued events`);
    
    eventQueue.forEach(queuedEvent => {
      const { event, data, options } = queuedEvent;
      emitEvent(event, data, options);
    });
    
    dispatch({ type: 'CLEAR_EVENT_QUEUE' });
  }, [state.connected, state.eventQueue, emitEvent, logDebug]);

  const disconnectFromNamespace = useCallback((namespace) => {
    if (!namespacesRef.current[namespace]) {
      return false;
    }
    
    try {
      namespacesRef.current[namespace].disconnect();
      delete namespacesRef.current[namespace];
      
      dispatch({
        type: 'NAMESPACE_DISCONNECTED',
        payload: { namespace }
      });
      
      return true;
    } catch (error) {
      logError(`Error disconnecting from namespace ${namespace}:`, error);
      return false;
    }
  }, [logError]);

  const addEventListener = useCallback((event, callback, options = {}) => {
    const { namespace = SOCKET_CONFIG.DEFAULT_NAMESPACE } = options;
    
    let targetSocket;
    if (namespace === SOCKET_CONFIG.DEFAULT_NAMESPACE) {
      targetSocket = socketRef.current;
    } else {
      targetSocket = namespacesRef.current[namespace];
    }
    
    if (!targetSocket) {
      logDebug(`Cannot add listener for event "${event}": socket not available`);
      return () => {};
    }
    
    const listenerId = `${namespace}:${event}:${generateUUID()}`;
    
    const safeCallback = (...args) => {
      try {
        callback(...args);
      } catch (error) {
        logError(`Error in event listener for "${event}":`, error);
      }
    };
    
    if (!eventListenersRef.current[namespace]) {
      eventListenersRef.current[namespace] = {};
    }
    if (!eventListenersRef.current[namespace][event]) {
      eventListenersRef.current[namespace][event] = {};
    }
    
    eventListenersRef.current[namespace][event][listenerId] = safeCallback;
    
    targetSocket.on(event, safeCallback);
    
    return () => {
      if (
        targetSocket && 
        eventListenersRef.current[namespace]?.[event]?.[listenerId]
      ) {
        targetSocket.off(event, eventListenersRef.current[namespace][event][listenerId]);
        delete eventListenersRef.current[namespace][event][listenerId];
      }
    };
  }, [logDebug, logError]);

  const disconnectAll = useCallback(() => {
    clearAllTimeouts();
    
    Object.keys(namespacesRef.current).forEach(namespace => {
      try {
        if (namespacesRef.current[namespace]) {
          namespacesRef.current[namespace].disconnect();
        }
      } catch (e) {
        logError(`Error disconnecting namespace ${namespace}:`, e);
      }
    });
    namespacesRef.current = {};
    
    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
      } catch (e) {
        logError('Error disconnecting main socket:', e);
      }
      socketRef.current = null;
    }
    
    dispatch({ type: 'DISCONNECTED', payload: 'Manual disconnect' });
  }, [clearAllTimeouts, logError]);

  const reconnectAll = useCallback(() => {
    disconnectAll();
    return initializeSocket();
  }, [disconnectAll, initializeSocket]);

  useEffect(() => {
    if (domainState && token) {
      initializeSocket();
    } else {
      disconnectAll();
    }

    return () => {
      disconnectAll();
    };
  }, [domainState, token, initializeSocket, disconnectAll]);

  const contextValue = useMemo(() => ({
    connected: state.connected,
    connecting: state.connecting,
    error: state.error,
    lastConnected: state.lastConnected,
    disconnectReason: state.disconnectReason,
    connectionAttempts: state.connectionAttempts,
    pingTime: state.pingTime,
    serverTime: state.serverTime,
    latency: state.latency,
    eventQueueLength: state.eventQueue.length,
    pendingRequestsCount: Object.keys(state.pendingRequests).length,
    namespaceStatus: state.statusByNamespace,
    
    getSocket: () => socketRef.current,
    getNamespaceSocket: (namespace) => namespacesRef.current[namespace],
    connect: initializeSocket,
    disconnect: disconnectAll,
    reconnect: reconnectAll,
    
    connectToNamespace,
    disconnectFromNamespace,
    
    emitEvent,
    addEventListener,
    
    request: (event, data, options = {}) => {
      return emitEvent(event, data, { ...options, requestResponse: true });
    },
    
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    getDebugState: () => ({ ...state }),
  }), [
    state,
    initializeSocket,
    disconnectAll,
    reconnectAll,
    connectToNamespace,
    disconnectFromNamespace,
    emitEvent,
    addEventListener
  ]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const withSocket = (Component) => {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props) => {
    const socket = useSocket();
    return <Component {...props} socket={socket} />;
  };
  
  WrappedComponent.displayName = `withSocket(${displayName})`;
  return WrappedComponent;
};

export default SocketProvider;