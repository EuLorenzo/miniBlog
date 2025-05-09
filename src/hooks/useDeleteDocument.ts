import { doc, deleteDoc } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";

interface reducerProps {
  loading: boolean;
  error: string | null;
}

interface actionProps {
  type: "LOADING" | "DELETED_DOC" | "ERROR";
  payload?: string;
}

const deleteReducer = (state: reducerProps, action: actionProps) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      if (action.payload) {
        return { loading: false, error: action.payload };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const useDeleteDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer(deleteReducer, {
    loading: false,
    error: null,
  });

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action: actionProps) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const deleteDocument = async (id: string) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      await deleteDoc(doc(db, docCollection, id));

      checkCancelBeforeDispatch({
        type: "DELETED_DOC",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      checkCancelBeforeDispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { deleteDocument, response };
};

export default useDeleteDocument;
