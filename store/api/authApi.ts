import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({ url: "/auth/login", method: "POST", body: credentials }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<any, { email: string; password: string; firstName: string; lastName: string }>({
      query: (data) => ({ url: "/auth/register", method: "POST", body: data }),
    }),
    verifyEmail: builder.mutation<any, { token: string }>({
      query: (data) => ({ url: "/auth/verify-email", method: "POST", body: data }),
    }),
    resendVerification: builder.mutation<any, { email: string }>({
      query: (data) => ({ url: "/auth/resend-verification", method: "POST", body: data }),
    }),
    getProfile: builder.query<any, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useGetProfileQuery,
} = authApi;