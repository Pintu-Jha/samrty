import React from 'react';
import {SafeAreaView} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import store from './api/store/store';
import {toastConfig} from './config/toastConfig';
import AppStack from './navigations/index';
import {AppContextProviders} from './provider/AppContextProviders';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Provider store={store}>
          <AppContextProviders>
            <AppStack />
            <Toast config={toastConfig} />
          </AppContextProviders>
        </Provider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
