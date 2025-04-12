import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNetworkStatus } from '../../provider/NetworkStatusProvider';
import { useSocket } from '../../provider/SocketProvider';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { useAppSelector } from '../hooks';
import TextComponent from './TextComponent';

const IS_DEVELOPMENT = false;

const NetworkConnectivityOverlay = ({children}) => {
  const {isNetworkAvailable, refreshNetworkStatus, networkType} =
    useNetworkStatus();
  const {
    connected: socketConnected,
    connecting: socketConnecting,
    error: socketError,
    reconnect: reconnectSocket,
    reconnectToServer,
    isServerReconnecting,
  } = useSocket();
  // Get authentication state
  const {isAuthenticated: isLoggedIn} = useAppSelector(state => state.auth);

  const [showOverlay, setShowOverlay] = useState(false);
  const [message, setMessage] = useState('');
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [retryingButton, setRetryingButton] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const statusCheckTimerRef = useRef(null);
  const visibilityTimerRef = useRef(null);
  const autoHideTimerRef = useRef(null);
  const retryButtonTimeoutRef = useRef(null);

  useEffect(() => {
    // If user is not logged in, don't show overlay
    if (!isLoggedIn) {
      setShowOverlay(false);
      return;
    }

    clearTimeout(visibilityTimerRef.current);
    clearTimeout(autoHideTimerRef.current);

    const updateConnectionStatus = () => {
      if (!isNetworkAvailable) {
        setMessage('No internet connection');
        setShowRetryButton(true);
        setShowOverlay(true);
      } else if (socketConnecting || isServerReconnecting) {
        setMessage('Connecting to server...');
        setShowRetryButton(false);
        setShowOverlay(true);
      } else if (!socketConnected && isNetworkAvailable) {
        setMessage('Unable to connect to server');
        setShowRetryButton(true);
        setShowOverlay(true);
      } else {
        if (showOverlay) {
          setMessage('Connection restored');
          visibilityTimerRef.current = setTimeout(() => {
            setShowOverlay(false);
          }, 2000);
        } else {
          setShowOverlay(false);
        }
      }

      // Reset button loading state if connection is restored
      if (socketConnected) {
        setRetryingButton(false);
      }
    };

    if (
      !isNetworkAvailable ||
      !socketConnected ||
      socketConnecting ||
      isServerReconnecting
    ) {
      visibilityTimerRef.current = setTimeout(() => {
        updateConnectionStatus();
      }, 1500);
    } else {
      updateConnectionStatus();
    }

    if (showOverlay && isNetworkAvailable && !socketConnected) {
      autoHideTimerRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 7000);
    }

    return () => {
      clearTimeout(visibilityTimerRef.current);
      clearTimeout(autoHideTimerRef.current);
    };
  }, [
    isLoggedIn,
    isNetworkAvailable,
    socketConnected,
    socketConnecting,
    showOverlay,
    isServerReconnecting,
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: showOverlay ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: showOverlay ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showOverlay, slideAnim, fadeAnim]);

  useEffect(() => {
    // Only check network status if user is logged in
    if (isLoggedIn && showOverlay && !isNetworkAvailable) {
      const checkInterval = 15000;
      statusCheckTimerRef.current = setInterval(() => {
        refreshNetworkStatus();
      }, checkInterval);
    } else {
      clearInterval(statusCheckTimerRef.current);
    }

    return () => {
      clearInterval(statusCheckTimerRef.current);
    };
  }, [showOverlay, isNetworkAvailable, refreshNetworkStatus, isLoggedIn]);

  useEffect(() => {
    return () => {
      clearTimeout(retryButtonTimeoutRef.current);
    };
  }, []);

  const handleRetry = () => {
    setRetryingButton(true);

    refreshNetworkStatus().then(networkAvailable => {
      if (networkAvailable) {
        if (!socketConnected) {
          if (typeof reconnectToServer === 'function') {
            reconnectToServer();
          } else {
            reconnectSocket();
          }
          retryButtonTimeoutRef.current = setTimeout(() => {
            if (!socketConnected) {
              setRetryingButton(false);
            }
          }, 10000);
        }
      } else {
        retryButtonTimeoutRef.current = setTimeout(() => {
          setRetryingButton(false);
        }, 1500);
      }
    });
  };

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  const overlayStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
    opacity: fadeAnim,
  };

  const getBackgroundColor = () => {
    if (!isNetworkAvailable) {
      return '#e53935'; // Red for no network
    } else if (socketConnecting || isServerReconnecting) {
      return '#fb8c00'; // Orange for connecting/reconnecting
    } else if (!socketConnected) {
      return '#f57c00'; // Light orange for disconnected
    } else {
      return '#43a047'; // Green when connection is restored
    }
  };

  return (
    <View style={styles.container}>
      {children}

      {isLoggedIn && (
        <Animated.View
          style={[
            styles.devOverlay,
            {backgroundColor: getBackgroundColor()},
            overlayStyle,
          ]}>
          <View style={styles.content}>
            <View style={styles.messageContainer}>
              <TextComponent text={message} style={styles.message} />
            </View>

            {showRetryButton && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                disabled={retryingButton}>
                {retryingButton ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <TextComponent text="Retry" style={styles.retryText} />
                )}
              </TouchableOpacity>
            )}

            {/* Only show the Details button in development mode */}
            {IS_DEVELOPMENT && (
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={toggleDetails}>
                <TextComponent
                  text={showDetails ? 'Hide Details' : 'Details'}
                  style={styles.detailsButtonText}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Only show the technical details when in development mode */}
          {IS_DEVELOPMENT && showDetails && (
            <View style={styles.detailsContainer}>
              <TextComponent
                text={`Network: ${
                  isNetworkAvailable ? 'Available' : 'Unavailable'
                }`}
                style={styles.detailText}
              />
              <TextComponent
                text={`Connection: ${networkType || 'Unknown'}`}
                style={styles.detailText}
              />
              <TextComponent
                text={`Socket: ${
                  socketConnected
                    ? 'Connected'
                    : socketConnecting
                    ? 'Connecting'
                    : 'Disconnected'
                }`}
                style={styles.detailText}
              />
              {isServerReconnecting && (
                <TextComponent
                  text="Server Reconnection: In Progress"
                  style={styles.detailText}
                />
              )}
              {socketError && (
                <TextComponent
                  text={`Error: ${socketError}`}
                  style={styles.detailText}
                />
              )}
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  devOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontWeight: '600',
    fontSize: textScale(14),
  },
  retryButton: {
    paddingHorizontal: spacing.PADDING_12,
    paddingVertical: spacing.PADDING_6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: spacing.RADIUS_4,
    marginHorizontal: spacing.MARGIN_10,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: textScale(12),
  },
  detailsButton: {
    paddingHorizontal: spacing.PADDING_8,
    paddingVertical: spacing.PADDING_4,
  },
  detailsButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: textScale(12),
  },
  detailsContainer: {
    marginTop: spacing.MARGIN_8,
    paddingTop: spacing.PADDING_8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailText: {
    color: '#fff',
    fontSize: textScale(12),
    marginBottom: spacing.MARGIN_4,
  },
});

export default NetworkConnectivityOverlay;
