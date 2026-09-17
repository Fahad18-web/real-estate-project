import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const stored = sessionStorage.getItem('user');
    if (!stored) {
      localStorage.removeItem('user');
    }
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => {
  try {
    const stored = sessionStorage.getItem('accessToken');
    if (!stored) {
      localStorage.removeItem('accessToken');
    }
    return stored || null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  accessToken: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user) {
        state.user = user;
        sessionStorage.setItem('user', JSON.stringify(user));
      }
      if (accessToken) {
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        sessionStorage.setItem('accessToken', accessToken);
      }
      state.isLoading = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      sessionStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
