import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SUBSCRIBER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Rehydrate user from cookie on page load
function getSavedUser(): User | null {
  try {
    const saved = Cookies.get("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const token = Cookies.get("token") || null;
const user = getSavedUser();

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      Cookies.set("token", action.payload.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(action.payload.user), { expires: 7 });
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      Cookies.set("user", JSON.stringify(action.payload), { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove("token");
      Cookies.remove("user");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;