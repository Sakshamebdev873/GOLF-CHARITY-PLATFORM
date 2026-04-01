import { apiSlice } from "./apiSlice";

export const subscriptionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation<any, { plan: "MONTHLY" | "YEARLY"; charityId: string; charityPercentage: number }>({
      query: (data) => ({ url: "/subscriptions/checkout", method: "POST", body: data }),
    }),
    confirmCheckout: builder.mutation<any, { sessionId: string }>({
      query: (data) => ({ url: "/subscriptions/confirm", method: "POST", body: data }),
      invalidatesTags: ["Subscription", "User"],
    }),
    getMySubscription: builder.query<any, void>({
      query: () => "/subscriptions/me",
      providesTags: ["Subscription"],
    }),
    cancelSubscription: builder.mutation<any, void>({
      query: () => ({ url: "/subscriptions/me/cancel", method: "POST" }),
      invalidatesTags: ["Subscription", "User"],
    }),
    updateSubscription: builder.mutation<any, { charityPercentage: number }>({
      query: (data) => ({ url: "/subscriptions/me", method: "PATCH", body: data }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  useConfirmCheckoutMutation,
  useGetMySubscriptionQuery,
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation,
} = subscriptionsApi;