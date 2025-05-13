import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";

interface reducerProps {
  loading: boolean;
  error: string | null;
}

interface actionProps {
  type: "LOADING" | "UPDATED_DOC" | "ERROR";
  payload?: string;
}

const updateReducer = (state: reducerProps, action: actionProps) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
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

const useUpdateDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer(updateReducer, {
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

  const updateDocument = async (
    uid: string,
    data: {
      title: string;
      image: string;
      body: string;
      tags: string[];
      uid: string;
      createdBy: string;
    }
  ) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const docRef = await doc(db, docCollection, uid);
      await updateDoc(docRef, data);

      checkCancelBeforeDispatch({
        type: "UPDATED_DOC",
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

  return { updateDocument, response };
};

export default useUpdateDocument;
