import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const USERS = {
  caja: { password: "pos123", role: "pos" },
  cocina: { password: "kds123", role: "kitchen" },
  analytics: { password: "ana123", role: "analytics" },
};

type UserDetails = {
  username: string;
  role: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userRole: string;
  user: UserDetails | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setRedirectPath: (path: string) => void;
  redirectPath: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState<UserDetails | null>(null);
  const [redirectPath, setRedirectPath] = useState("/");
  const navigate = useNavigate();

  const login = (username: string, password: string): boolean => {
    const foundUser = USERS[username];
    if (foundUser && foundUser.password === password) {
      setIsAuthenticated(true);
      setUserRole(foundUser.role);
      setUser({ username, role: foundUser.role });
      navigate(redirectPath);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        user,
        login,
        logout,
        setRedirectPath,
        redirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
