import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  mobileMenuOpen: boolean;
  authModalOpen: boolean;
  authModalView: "login" | "register";
}

const initialState: UIState = {
  mobileMenuOpen: false,
  authModalOpen: false,
  authModalView: "login",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    openAuthModal: (state, action: PayloadAction<"login" | "register">) => {
      state.authModalOpen = true;
      state.authModalView = action.payload;
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false;
    },
    setAuthModalView: (state, action: PayloadAction<"login" | "register">) => {
      state.authModalView = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  openAuthModal,
  closeAuthModal,
  setAuthModalView,
} = uiSlice.actions;
export default uiSlice.reducer;