// Domain Slice for managing domain information
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Initial state for domain management
const domainInitialState = {
  domains: [],
  isSaveUrl: false,
  selectedDomain: null,
  loading: false,
  error: null,
};

// Thunk to set the domain in AsyncStorage
export const setDomain = createAsyncThunk(
  'domain/setDomain',
  async (domain, {rejectWithValue}) => {
    try {
      const existingDomains =
        JSON.parse(await AsyncStorage.getItem('domains')) || [];
      const newDomain = {key: Date.now().toString(), domain};
      const updatedDomains = [...existingDomains, newDomain];
      await AsyncStorage.setItem('domains', JSON.stringify(updatedDomains));

      return newDomain;
    } catch (error) {
      return rejectWithValue('Failed to set domain');
    }
  },
);

// Thunk to load the domain from AsyncStorage
export const loadDomain = createAsyncThunk(
  'domain/loadDomain',
  async (_, {rejectWithValue}) => {
    try {
      const domains = JSON.parse(await AsyncStorage.getItem('domains')) || [];
      return domains;
    } catch (error) {
      return rejectWithValue('Failed to load domain');
    }
  },
);

// Thunk to remove a domain from AsyncStorage
export const removeDomain = createAsyncThunk(
  'domain/removeDomain',
  async (key, {rejectWithValue, getState}) => {
    try {
      const existingDomains =
        JSON.parse(await AsyncStorage.getItem('domains')) || [];

      const updatedDomains = existingDomains.filter(item => item.key !== key);

      // Get the current selectedDomain from the state
      const {selectedDomain} = getState().domains;

      // If the removed domain is the selectedDomain, clear it
      if (selectedDomain?.key === key) {
        await AsyncStorage.removeItem('selected_base_url');
      }

      await AsyncStorage.setItem('domains', JSON.stringify(updatedDomains));

      return updatedDomains;
    } catch (error) {
      return rejectWithValue('Failed to remove domain');
    }
  },
);

// Thunk to select a URL and update the domain in AsyncStorage
export const selectUrl = createAsyncThunk(
  'domain/selectUrl',
  async (key, {rejectWithValue}) => {
    try {
      const existingDomains =
        JSON.parse(await AsyncStorage.getItem('domains')) || [];
      const selectedDomain = existingDomains.find(domain => domain.key === key);
      if (selectedDomain) {
        await AsyncStorage.setItem(
          'selected_base_url',
          JSON.stringify(selectedDomain),
        );
        console.log(`URL stored: ${JSON.stringify(selectedDomain)}`);
        return selectedDomain;
      } else {
        throw new Error('Domain not found');
      }
    } catch (error) {
      console.error('Error storing URL:', error);
      return rejectWithValue('Failed to select domain');
    }
  },
);

// Thunk to get the selected domain from AsyncStorage
export const getSelectedDomain = createAsyncThunk(
  'domain/getSelectedDomain',
  async (_, {rejectWithValue}) => {
    try {
      const selectedDomain = await AsyncStorage.getItem('selected_base_url');
      return JSON.parse(selectedDomain);
    } catch (error) {
      return rejectWithValue('Failed to get selected domain');
    }
  },
);

// Thunk to update an existing domain in AsyncStorage
export const updateDomain = createAsyncThunk(
  'domain/updateDomain',
  async ({key, newDomain}, {rejectWithValue}) => {
    try {
      const existingDomains =
        JSON.parse(await AsyncStorage.getItem('domains')) || [];

      let updatedDomains;

      if (existingDomains.length === 0) {
        // If there are no existing domains, add the new domain as a fresh entry
        updatedDomains = [{key, domain: newDomain}];
      } else {
        // Otherwise, update the domain with the matching key
        updatedDomains = existingDomains.map(item =>
          item.key === key ? {...item, domain: newDomain} : item,
        );
      }

      // Save the updated domains to AsyncStorage
      await AsyncStorage.setItem('domains', JSON.stringify(updatedDomains));

      return updatedDomains;
    } catch (error) {
      return rejectWithValue('Failed to update domain');
    }
  },
);

// Slice to handle domain state
const domainSlice = createSlice({
  name: 'domain',
  initialState: domainInitialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Load domain cases
      .addCase(loadDomain.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = action.payload;
      })
      .addCase(loadDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove domain cases
      .addCase(removeDomain.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = action.payload.updatedDomains;
        // Clear the selectedDomain if it was removed
        if (action.payload.clearedSelectedDomain) {
          state.selectedDomain = null;
          state.isSaveUrl = false;
        }
      })
      .addCase(removeDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Select URL cases
      .addCase(selectUrl.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.isSaveUrl = true;
        state.selectedDomain = action.payload || null;
      })
      .addCase(selectUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get selected domain cases
      .addCase(getSelectedDomain.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSelectedDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDomain = action.payload;
        state.isSaveUrl = !!action.payload;
      })
      .addCase(getSelectedDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update domain cases
      .addCase(updateDomain.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = action.payload;
      })
      .addCase(updateDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default domainSlice.reducer;
