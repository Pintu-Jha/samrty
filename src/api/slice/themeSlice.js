import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Initial state for theme management
const initialState = {
  theme: 'light', // Default theme
};

// Thunk to load theme from AsyncStorage
export const loadThemeFromStorage = createAsyncThunk(
  'theme/loadThemeFromStorage',
  async (_, {rejectWithValue}) => {
    try {
      const savedTheme = await AsyncStorage.getItem('app-theme');
      return savedTheme || 'light';
    } catch (error) {
      return rejectWithValue('Failed to load theme from storage');
    }
  },
);

// Slice to handle theme state
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: state => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      AsyncStorage.setItem('app-theme', newTheme); // Ensure this doesn't indirectly trigger state updates
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
      AsyncStorage.setItem('app-theme', action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadThemeFromStorage.fulfilled, (state, action) => {
        state.theme = action.payload;
      })
      .addCase(loadThemeFromStorage.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export const {toggleTheme, setTheme} = themeSlice.actions;
export default themeSlice.reducer;
