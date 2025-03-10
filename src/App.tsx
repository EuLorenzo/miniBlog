import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import useAuthentication from "./hooks/useAuthentication";
import { onAuthStateChanged, User } from "firebase/auth";

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined || user === null;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <AuthProvider value={user}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
