import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { initializeApp } from '../api/slice/initialization';
import LoadingScreen from '../components/common/Loader';
import { useAppDispatch, useAppSelector } from '../components/hooks/index';
import { navigationRef } from '../NavigationServies';
import { SplashScreen } from '../screens';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';

const Stack = createNativeStackNavigator();

function AppStack() {
  const dispatch = useAppDispatch();
  const [showSplash, setShowSplash] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const {isAuthenticated} = useAppSelector(state => state.auth);
  useEffect(() => {
    const initialize = async () => {
      try {
        await dispatch(initializeApp()).unwrap();
      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        setInitialized(true);
      }
    };
    initialize();
  }, [dispatch]);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }
  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          animation: 'slide_from_right',
        }}>
        {isAuthenticated ? MainStack(Stack) : AuthStack(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
