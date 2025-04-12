import { createAsyncThunk } from '@reduxjs/toolkit';
import { loadAuthState } from './authSlice';
import { getSelectedDomain, loadDomain } from './domainSlice';
import { loadThemeFromStorage } from './themeSlice';

export const initializeApp = createAsyncThunk(
  'app/initializeApp',
  async (_, {dispatch}) => {
    try {
      console.log('Initializing app...');
      await dispatch(getSelectedDomain()).unwrap();
      await dispatch(loadDomain()).unwrap();
      await dispatch(loadAuthState()).unwrap();
      await dispatch(loadThemeFromStorage()).unwrap();
    } catch (error) {
      console.error('Error during app initialization:', error);
      throw error; // Re-throw the error to handle it in the calling component
    }
  },
);
