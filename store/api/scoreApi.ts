import { apiSlice } from "./apiSlice";

export interface AddScoreRequest {
  score: number;
  playedOn: string;
}

export interface GolfScore {
  id: string;
  score: number;
  playedOn: string;
  position: number;
}

export const scoresApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addScore: builder.mutation<any, AddScoreRequest>({
      query: (data) => ({
        url: "/scores",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Scores"],
    }),

    getMyScores: builder.query<{ success: boolean; data: GolfScore[] }, void>({
      query: () => "/scores/me",
      providesTags: ["Scores"],
    }),

    updateScore: builder.mutation<any, { id: string; data: Partial<AddScoreRequest> }>({
      query: ({ id, data }) => ({
        url: `/scores/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Scores"],
    }),
  }),
});

export const { useAddScoreMutation, useGetMyScoresQuery, useUpdateScoreMutation } = scoresApi;