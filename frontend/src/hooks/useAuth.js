import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const isAgent = user?.role === 'agent' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isAgent,
    isAdmin,
  };
};
