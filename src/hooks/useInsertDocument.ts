import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";
import documentType from "../types/documentType";

interface reducerProps {
  loading: boolean;
  error: string | null;
}

interface actionProps {
  type: "LOADING" | "INSERTED_DOC" | "ERROR";
  payload?: string;
}

const insertReducer = (state: reducerProps, action: actionProps) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
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

const useInsertDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer(insertReducer, {
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

  const insertDocument = async (document: documentType) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };

      await addDoc(collection(db, docCollection), newDocument);

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { insertDocument, response };
};

export default useInsertDocument;
