import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  error: null,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { fetchUsersSuccess, fetchUsersFailure } = userSlice.actions;
export default userSlice.reducer;
