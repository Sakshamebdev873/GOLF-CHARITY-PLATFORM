import { apiSlice } from "./apiSlice";

export interface CreateSubscriptionRequest {
  plan: "MONTHLY" | "YEARLY";
  charityId: string;
  charityPercentage: number;
}

export const subscriptionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<any, CreateSubscriptionRequest>({
      query: (data) => ({
        url: "/subscriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription", "User"],
    }),

    getMySubscription: builder.query<any, void>({
      query: () => "/subscriptions/me",
      providesTags: ["Subscription"],
    }),

    cancelSubscription: builder.mutation<any, void>({
      query: () => ({
        url: "/subscriptions/me/cancel",
        method: "POST",
      }),
      invalidatesTags: ["Subscription", "User"],
    }),

    updateSubscription: builder.mutation<any, { charityPercentage: number }>({
      query: (data) => ({
        url: "/subscriptions/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetMySubscriptionQuery,
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation,
} = subscriptionsApi;