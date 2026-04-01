"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser, logout } from "@/store/slices/authSlice";
import { useGetProfileQuery } from "@/store/api/authApi";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((s) => s.auth);

  // Only fetch profile if we have a token
  const { data, error } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data?.data) {
      // Refresh user data from server
      dispatch(
        setUser({
          id: data.data.id,
          email: data.data.email,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          role: data.data.role,
        })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    // If token exists but API returns 401, token is invalid
    if (error && "status" in error && error.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  return <>{children}</>;
}