import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/bookings`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Bookings'],
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Bookings'],
    }),
    getMyBookings: builder.query({
      query: () => '/my-bookings',
      providesTags: ['Bookings'],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Bookings'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
} = bookingApi;
