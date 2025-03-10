import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function useAuthValue() {
  return useContext(AuthContext);
}

export default useAuthValue;
