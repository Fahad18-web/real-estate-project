import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import propertyReducer from '../features/properties/propertySlice';
import { authApi } from '../features/auth/authApi';
import { propertyApi } from '../features/properties/propertyApi';
import { bookingApi } from '../features/bookings/bookingApi';
import { reviewApi } from '../features/reviews/reviewApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    [authApi.reducerPath]: authApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      propertyApi.middleware,
      bookingApi.middleware,
      reviewApi.middleware
    ),
});

export default store;
