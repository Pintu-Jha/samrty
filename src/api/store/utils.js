import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../slice/authSlice';

const createBaseQuery = selectedDomain => {

  return fetchBaseQuery({
    baseUrl: selectedDomain,
    credentials: 'include',
    prepareHeaders: async headers => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          headers.set('Authorization', `${token}`);
        }
        // console.log("token",token);

        return headers;
      } catch (error) {
        console.error('Error retrieving token:', error);
        return headers;
      }
    },
  });
};

export const customBaseQuery = async (args, api, extraOptions) => {
  const state = api.getState();
  const selectedDomain = state?.domains?.selectedDomain?.domain;


  if (!selectedDomain) {
    console.warn('Selected domain is not defined');
    return { error: { status: 'FETCH_ERROR', error: 'Domain is not set' } };
  }

  const baseQuery = createBaseQuery(selectedDomain);

  if (typeof baseQuery !== 'function') {
    console.error('Base query is not initialized correctly');
    return {
      error: {
        status: 'FETCH_ERROR',
        error: 'Base query is not defined correctly',
      },
    };
  }

  return baseQuery(args, api, extraOptions);
};

