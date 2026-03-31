import { apiSlice } from "./apiSlice";

// ── Winners ──
export const winnersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyWinnings: builder.query<any, void>({
      query: () => "/winners/me",
      providesTags: ["Winners"],
    }),

    uploadProof: builder.mutation<any, { id: string; proofImageUrl: string }>({
      query: ({ id, proofImageUrl }) => ({
        url: `/winners/${id}/proof`,
        method: "PATCH",
        body: { proofImageUrl },
      }),
      invalidatesTags: ["Winners"],
    }),
  }),
});

// ── Donations ──
export const donationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDonation: builder.mutation<any, { charityId: string; amountInCents: number }>({
      query: (data) => ({
        url: "/donations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Donations"],
    }),

    getMyDonations: builder.query<any, void>({
      query: () => "/donations/me",
      providesTags: ["Donations"],
    }),
  }),
});

// ── Notifications ──
export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<any, void>({
      query: () => "/notifications/me",
      providesTags: ["Notifications"],
    }),

    markAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

// ── Charity Selections ──
export const charitySelectionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyCharitySelection: builder.query<any, void>({
      query: () => "/charity-selections/me",
      providesTags: ["CharitySelection"],
    }),

    selectCharity: builder.mutation<any, { charityId: string; contributionPercent: number }>({
      query: (data) => ({
        url: "/charity-selections",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CharitySelection", "User"],
    }),
  }),
});

export const { useGetMyWinningsQuery, useUploadProofMutation } = winnersApi;
export const { useCreateDonationMutation, useGetMyDonationsQuery } = donationsApi;
export const { useGetMyNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } = notificationsApi;
export const { useGetMyCharitySelectionQuery, useSelectCharityMutation } = charitySelectionsApi;