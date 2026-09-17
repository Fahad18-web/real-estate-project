import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/reviews`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getPropertyReviews: builder.query({
      query: (propertyId) => `/property/${propertyId}`,
      providesTags: (result, error, propertyId) => [{ type: 'Reviews', id: propertyId }],
    }),
    addReview: builder.mutation({
      query: ({ propertyId, rating, comment }) => ({
        url: `/property/${propertyId}`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { propertyId }) => [{ type: 'Reviews', id: propertyId }],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetPropertyReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
