import { User } from "firebase/auth";
import { createContext, ReactNode } from "react";

const AuthContext = createContext({});
export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
  value: User | null | undefined;
}

export const AuthProvider = ({ children, value }: AuthProviderProps) => {
  return (
    <AuthContext.Provider value={{ value }}>{children}</AuthContext.Provider>
  );
};
