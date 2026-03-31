import { apiSlice } from "./apiSlice";

export interface Draw {
  id: string;
  drawDate: string;
  monthYear: string;
  status: string;
  type: string;
  winningNumbers: number[];
  totalPoolCents: number;
  publishedAt: string;
  _count: { winners?: number; entries?: number };
}

export const drawsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedDraws: builder.query<{ success: boolean; data: Draw[] }, void>({
      query: () => "/draws/published",
      providesTags: ["Draws"],
    }),

    getUpcomingDraws: builder.query<{ success: boolean; data: Draw[] }, void>({
      query: () => "/draws/upcoming",
      providesTags: ["Draws"],
    }),

    enterDraw: builder.mutation<any, { drawId: string }>({
      query: (data) => ({
        url: "/draw-entries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DrawEntries", "Draws"],
    }),

    getMyEntries: builder.query<any, void>({
      query: () => "/draw-entries/me",
      providesTags: ["DrawEntries"],
    }),
  }),
});

export const {
  useGetPublishedDrawsQuery,
  useGetUpcomingDrawsQuery,
  useEnterDrawMutation,
  useGetMyEntriesQuery,
} = drawsApi;