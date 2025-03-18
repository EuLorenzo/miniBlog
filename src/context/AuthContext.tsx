import { User } from "firebase/auth";
import { createContext, ReactNode } from "react";

interface AuthContextProps {
  user: User | null | undefined;
}

const AuthContext = createContext({} as AuthContextProps);
export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
  user: User | null | undefined;
}

export const AuthProvider = ({ children, user }: AuthProviderProps) => {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
