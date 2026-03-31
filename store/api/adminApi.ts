import { apiSlice } from "./apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<any, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Admin"],
    }),
    getAdminReports: builder.query<any, void>({
      query: () => "/admin/reports",
      providesTags: ["Admin"],
    }),
    // Users
    getAdminUsers: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params.page) qp.set("page", String(params.page));
        if (params.limit) qp.set("limit", String(params.limit));
        if (params.search) qp.set("search", params.search);
        return `/users?${qp.toString()}`;
      },
      providesTags: ["Admin"],
    }),
    toggleUserActive: builder.mutation<any, string>({
      query: (id) => ({ url: `/users/${id}/toggle-active`, method: "PATCH" }),
      invalidatesTags: ["Admin"],
    }),
    // Draws
    getAdminDraws: builder.query<any, void>({
      query: () => "/draws",
      providesTags: ["Draws"],
    }),
    getAdminDraw: builder.query<any, string>({
      query: (id) => `/draws/${id}`,
      providesTags: ["Draws"],
    }),
    createDraw: builder.mutation<any, { drawDate: string; monthYear: string; type: string }>({
      query: (data) => ({ url: "/draws", method: "POST", body: data }),
      invalidatesTags: ["Draws"],
    }),
    simulateDraw: builder.mutation<any, string>({
      query: (id) => ({ url: `/draws/${id}/simulate`, method: "POST" }),
      invalidatesTags: ["Draws"],
    }),
    executeDraw: builder.mutation<any, string>({
      query: (id) => ({ url: `/draws/${id}/execute`, method: "POST" }),
      invalidatesTags: ["Draws", "Winners"],
    }),
    // Charities admin
    getAdminCharities: builder.query<any, void>({
      query: () => "/charities/admin",
      providesTags: ["Charities"],
    }),
    createCharity: builder.mutation<any, any>({
      query: (data) => ({ url: "/charities", method: "POST", body: data }),
      invalidatesTags: ["Charities"],
    }),
    updateCharity: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/charities/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Charities"],
    }),
    deleteCharity: builder.mutation<any, string>({
      query: (id) => ({ url: `/charities/${id}`, method: "DELETE" }),
      invalidatesTags: ["Charities"],
    }),
    // Winners admin
    getAdminWinners: builder.query<any, { status?: string }>({
      query: (params) => `/winners${params.status ? `?status=${params.status}` : ""}`,
      providesTags: ["Winners"],
    }),
    verifyWinner: builder.mutation<any, { id: string; verificationStatus: string; adminNotes?: string }>({
      query: ({ id, ...body }) => ({ url: `/winners/${id}/verify`, method: "PATCH", body }),
      invalidatesTags: ["Winners"],
    }),
    updatePayout: builder.mutation<any, { id: string; payoutStatus: string }>({
      query: ({ id, ...body }) => ({ url: `/winners/${id}/payout`, method: "PATCH", body }),
      invalidatesTags: ["Winners"],
    }),
    deleteDraw: builder.mutation<any, string>({
      query: (id) => ({ url: `/draws/${id}`, method: "DELETE" }),
      invalidatesTags: ["Draws"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery, useGetAdminReportsQuery,
  useGetAdminUsersQuery, useToggleUserActiveMutation,
  useGetAdminDrawsQuery, useGetAdminDrawQuery, useCreateDrawMutation, useSimulateDrawMutation, useExecuteDrawMutation,
  useGetAdminCharitiesQuery, useCreateCharityMutation, useUpdateCharityMutation, useDeleteCharityMutation,
  useGetAdminWinnersQuery, useVerifyWinnerMutation, useUpdatePayoutMutation,useDeleteDrawMutation,
} = adminApi;