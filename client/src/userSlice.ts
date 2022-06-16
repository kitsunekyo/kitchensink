import { User } from "@kitchensink/api-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  value: User | null;
}

const initialState: UserState = {
  value: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
