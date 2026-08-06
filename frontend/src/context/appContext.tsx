import { createContext, useState, type ReactNode } from "react";

export interface AppContextType {
  token: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const login = (newToken: string, userId: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userId);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
  };

  return (
    <AppContext.Provider value={{ token, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}
