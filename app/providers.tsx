"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#020617" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#020617" } },
        }}
      />
      {children}
    </Provider>
  );
}