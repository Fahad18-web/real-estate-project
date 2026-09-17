import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Properties', 'Property', 'SavedProperties', 'AgentProperties'],
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params) => {
        const cleanParams = Object.fromEntries(
          Object.entries(params || {}).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        );
        return {
          url: '/properties',
          params: cleanParams,
        };
      },
      providesTags: (result) =>
        result?.data?.properties
          ? [
              ...result.data.properties.map(({ _id }) => ({ type: 'Properties', id: _id })),
              { type: 'Properties', id: 'LIST' },
            ]
          : [{ type: 'Properties', id: 'LIST' }],
    }),
    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    getAgentProperties: builder.query({
      query: () => '/properties/agent/listings',
      providesTags: ['AgentProperties'],
    }),
    createProperty: builder.mutation({
      query: (formData) => ({
        url: '/properties',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Properties', id: 'LIST' }, 'AgentProperties'],
    }),
    updateProperty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Properties', id },
        { type: 'Property', id },
        'AgentProperties',
      ],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Properties', id: 'LIST' }, 'AgentProperties'],
    }),
    getSavedProperties: builder.query({
      query: () => '/users/saved-properties',
      providesTags: ['SavedProperties'],
    }),
    saveProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/users/saved-properties/${propertyId}`,
        method: 'POST',
      }),
      invalidatesTags: ['SavedProperties'],
    }),
    unsaveProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/users/saved-properties/${propertyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedProperties'],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetAgentPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetSavedPropertiesQuery,
  useSavePropertyMutation,
  useUnsavePropertyMutation,
} = propertyApi;
