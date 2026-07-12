import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try { return localStorage.getItem('ux-mosaic-logged-in') === 'true'; } catch { return false; }
  });

  const logIn = () => {
    setIsLoggedIn(true);
    try { localStorage.setItem('ux-mosaic-logged-in', 'true'); } catch {}
  };

  const logOut = () => {
    setIsLoggedIn(false);
    try { localStorage.removeItem('ux-mosaic-logged-in'); } catch {}
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
