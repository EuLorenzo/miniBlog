import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import documentType from "../types/documentType";

interface useFetchDocumentProps {
  docCollection: string;
  id: string;
}

const useFetchDocument = ({ docCollection, id }: useFetchDocumentProps) => {
  const [document, setDocument] = useState<documentType | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      if (cancelled) return;

      setLoading(true);

      try {
        const docRef = await doc(db, docCollection, id);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data();

        setDocument(() => {
          const obj: documentType = {
            title: data?.title,
            body: data?.body,
            createdBy: data?.createdBy,
            image: data?.image,
            tags: data?.tags,
            uid: data?.uid,
          };
          return obj;
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      }

      setLoading(false);
    }

    loadDocument();
  }, [id, docCollection, cancelled]);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { document, loading, error };
};

export default useFetchDocument;
