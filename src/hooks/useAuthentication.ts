import { useEffect, useState } from "react";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { userType } from "../types/userType";
import { app } from "../firebase/config";

const useAuthentication = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // cleanup
  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const auth: Auth = getAuth(app);

  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }

  const createUser = async (data: userType) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, { displayName: data.displayName });

      setLoading(false);
      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);

      let typeOfError = "";

      if (error.message.includes("weak-password")) {
        typeOfError = "A senha precisa ter pelo menos 6 caracteres.";
      } else if (error.message.includes("email-already")) {
        typeOfError = "E-mail já cadastrado.";
      } else {
        typeOfError = "Ocorreu um erro, por favor, tente novamente mais tarde.";
      }

      setLoading(false);
      setError(typeOfError);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { auth, createUser, error, loading };
};

export default useAuthentication;
