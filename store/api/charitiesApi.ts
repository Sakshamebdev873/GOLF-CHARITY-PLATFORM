import { apiSlice } from "./apiSlice";

export interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  websiteUrl: string | null;
  category: string | null;
  isFeatured: boolean;
  _count: { userSelections: number; donations: number };
}

export const charitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCharities: builder.query<{ success: boolean; data: Charity[] }, { search?: string; category?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.set("search", params.search);
        if (params?.category) queryParams.set("category", params.category);
        const qs = queryParams.toString();
        return `/charities${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Charities"],
    }),

    getFeaturedCharities: builder.query<{ success: boolean; data: Charity[] }, void>({
      query: () => "/charities/featured",
      providesTags: ["Charities"],
    }),

    getCharityBySlug: builder.query<{ success: boolean; data: Charity }, string>({
      query: (slug) => `/charities/slug/${slug}`,
      providesTags: ["Charities"],
    }),
  }),
});

export const { useGetCharitiesQuery, useGetFeaturedCharitiesQuery, useGetCharityBySlugQuery } = charitiesApi;