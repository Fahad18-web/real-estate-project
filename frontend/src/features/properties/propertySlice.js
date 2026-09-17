import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    city: '',
    type: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    search: '',
    sortBy: 'newest',
    page: 1,
  },
  savedPropertyIds: [],
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
    },
    setSavedProperties: (state, action) => {
      state.savedPropertyIds = action.payload;
    },
    toggleSavedPropertyLocal: (state, action) => {
      const id = action.payload;
      if (state.savedPropertyIds.includes(id)) {
        state.savedPropertyIds = state.savedPropertyIds.filter((pId) => pId !== id);
      } else {
        state.savedPropertyIds.push(id);
      }
    },
  },
});

export const {
  setFilter,
  setPage,
  resetFilters,
  setSavedProperties,
  toggleSavedPropertyLocal,
} = propertySlice.actions;

export default propertySlice.reducer;
