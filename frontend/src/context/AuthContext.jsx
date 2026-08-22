import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCurrentUser, loginUser } from '../api/auth';

const TOKEN_STORAGE_KEY = 'accessToken';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState(() => Boolean(sessionStorage.getItem(TOKEN_STORAGE_KEY)));
  const hydratedToken = useRef(null);

  const loadAuthenticatedUser = useCallback(async () => {
    const currentUser = await getCurrentUser();
    const safeProfile = {
      userId: currentUser.userId,
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department,
    };
    setProfile(safeProfile);
    setRole(currentUser.role);
    return { ...safeProfile, role: currentUser.role };
  }, []);

  useEffect(() => {
    // Remove the previous implementation's role-bearing browser storage.
    localStorage.removeItem('authUser');

    if (!token) {
      setIsLoading(false);
      return;
    }

    // React Strict Mode runs effects twice in development. Hydrate each token once.
    if (hydratedToken.current === token) {
      return;
    }
    hydratedToken.current = token;

    loadAuthenticatedUser()
      .catch(() => {
        hydratedToken.current = null;
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setProfile(null);
        setRole(null);
      })
      .finally(() => setIsLoading(false));
  }, [token, loadAuthenticatedUser]);

  async function login(credentials) {
    const data = await loginUser(credentials);
    const accessToken = data?.accessToken;

    if (!accessToken) {
      throw new Error('Unable to sign in. Please try again.');
    }

    sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    // login() performs the initial hydration below, so the effect skips this token.
    hydratedToken.current = accessToken;
    setToken(accessToken);
    setIsLoading(true);

    try {
      return await loadAuthenticatedUser();
    } catch (error) {
      hydratedToken.current = null;
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setProfile(null);
      setRole(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    hydratedToken.current = null;
    setProfile(null);
    setRole(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }

  const user = profile && role ? { ...profile, role } : null;

  const value = useMemo(
    () => ({
      user,
      role,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [user, role, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
