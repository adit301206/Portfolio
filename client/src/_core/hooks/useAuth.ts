export function useAuth() {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
  };
}

export default useAuth;