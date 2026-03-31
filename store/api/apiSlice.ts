import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Subscription",
    "Scores",
    "Draws",
    "DrawEntries",
    "Charities",
    "CharitySelection",
    "Donations",
    "Winners",
    "Notifications",
    "Admin",
    "Config",
    "Payments",
  ],
  endpoints: () => ({}),
});