

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Fetch wallet data
export const fetchWallet = createAsyncThunk('wallet/fetchWallet', async () => {
  const response = await axiosInstance.get('/wallets');
  console.log(response.data);
  return response.data.wallet; // Return the wallet object directly
});

// Update wallet balance
export const updateWallet = createAsyncThunk(
  'wallet/updateWallet',
  async ({ amount, type, w_id, category1 }) => {
    const response = await axiosInstance.put(`/wallets/${w_id}/balance`, {
      amount,
      operation: type,
      category: category1
    });
    return response.data; // Return updated wallet data
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: { balance: 0, transactions: [], isLoading: false, w_id: null , err:null},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.fulfilled, (state, action) => {
        const wallet = action.payload;
        state.balance = wallet.balance;
        state.transactions = wallet.transactions || [];
        state.w_id = wallet.id;
      })
      .addCase(updateWallet.fulfilled, (state, action) => {
        const updatedWallet = action.payload;
        state.balance = updatedWallet.balance;
        state.transactions = updatedWallet.transactions;
      })
      .addCase(updateWallet.rejected, (state, action) => {
        state.err = action.payload;
      });
  },
});

export default walletSlice.reducer;

