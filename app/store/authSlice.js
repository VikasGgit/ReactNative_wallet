import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/login', credentials);
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log(userData);
      const response = await axiosInstance.post('/users/register', userData);
      return response.data.message;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, isLoading: false, error: null },
  reducers: { logout: (state) => { state.token = null; AsyncStorage.removeItem('token'); } },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.isLoading = false; state.token = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
