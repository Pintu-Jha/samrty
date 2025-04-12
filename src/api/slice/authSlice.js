import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Initial state for auth management
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Constants for AsyncStorage keys
export const STORAGE_KEYS = {
  USER: 'user',
  ACCESS_TOKEN: 'accessToken',
  FULL_NAME: 'full_name',
  EMAIL: 'email',
  MOBILE_NO: 'mobile_no',
  ROLES: 'roles',
  API_KEY: 'api_key',
  API_SECRET: 'api_secret',
  WHATSAPP_DISPLAY_NAME: 'whatsapp_display_name',
  WHATSAPP_NUMBER: 'whatsapp_number',
};

// Thunk to handle user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, {rejectWithValue, getState}) => {
    try {
      const {selectedDomain} = getState().domains;
      
      if (!selectedDomain || !selectedDomain.domain) {
        throw new Error('Domain not set');
      }
      const response = await fetch(
        `${selectedDomain.domain}/api/method/frappe_whatsapp.login.app_login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        },
      );
      console.log(response);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Login failed. Please check your credentials.',
        );
      }

      const data = await response.json();
      

      if (data.message === 'Logged In') {
        const {key_details, user_details, role_details, whatsapp_details} =
          data;
        const user = {
          fullName: data.full_name,
          email: user_details[0].email,
          mobileNo: user_details[0].mobile_no,
          roles: role_details.map(role => role.role),
          apiKey: key_details.api_key,
          apiSecret: key_details.api_secret,
          authToken: key_details.auth_token,
          whatsappDisplayName: whatsapp_details.whatsapp_display_name,
          whatsappNumber: whatsapp_details.whatsapp_number,
        };

        const userStorageData = [
          [STORAGE_KEYS.USER, JSON.stringify(user)],
          [STORAGE_KEYS.ACCESS_TOKEN, key_details.auth_token],
          [STORAGE_KEYS.FULL_NAME, data.full_name],
          [STORAGE_KEYS.EMAIL, user_details[0].email],
          [STORAGE_KEYS.MOBILE_NO, user_details[0].mobile_no],
          [
            STORAGE_KEYS.ROLES,
            JSON.stringify(role_details.map(role => role.role)),
          ],
          [STORAGE_KEYS.API_KEY, key_details.api_key],
          [STORAGE_KEYS.API_SECRET, key_details.api_secret],
          [
            STORAGE_KEYS.WHATSAPP_DISPLAY_NAME,
            whatsapp_details.whatsapp_display_name,
          ],
          [STORAGE_KEYS.WHATSAPP_NUMBER, whatsapp_details.whatsapp_number],
        ];

        await AsyncStorage.multiSet(userStorageData);
        return user;
      } else {
        throw new Error('Login failed. Invalid response from the server.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      return rejectWithValue(error.message || 'Login failed');
    }
  },
);

// Thunk to load authentication state from AsyncStorage
export const loadAuthState = createAsyncThunk(
  'auth/loadAuthState',
  async (_, {rejectWithValue}) => {
    try {
      const [userStr, accessToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      ]);
      if (userStr && accessToken) {
        try {
          const user = JSON.parse(userStr);

          return {user, isAuthenticated: true};
        } catch (error) {
          console.error('Failed to parse user data:', error.message);
          throw new Error('Corrupted user data in storage');
        }
      }

      return {user: null, isAuthenticated: false};
    } catch (error) {
      console.error('Error loading auth state:', error.message);
      return rejectWithValue('Failed to load authentication state');
    }
  },
);

// Thunk to handle logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const keysToRemove = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keysToRemove);
      dispatch(logout());
    } catch (error) {
      console.error('Failed to logout user:', error.message);
      return rejectWithValue('Logout failed');
    }
  },
);

// Slice to handle authentication state
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadAuthState.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      })
      .addCase(loadAuthState.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const {logout, setAuthState} = authSlice.actions;
export default authSlice.reducer;
