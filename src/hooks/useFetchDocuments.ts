import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import documentType from "../types/documentType";

interface useFetchDocumentsProps {
  docCollection: string;
  search?: string | null;
  uid?: string;
}

const useFetchDocuments = ({
  docCollection,
  search = null,
  uid,
}: useFetchDocumentsProps) => {
  const [documents, setDocuments] = useState<documentType[] | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (cancelled) return;

      setLoading(true);

      const collectionRef = await collection(db, docCollection);

      try {
        let q;
        if (search) {
          q = await query(
            collectionRef,
            where("tags", "array-contains", search),
            orderBy("createdAt", "desc")
          );
        } else if (uid) {
          q = await query(
            collectionRef,
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          );
        } else {
          q = await query(collectionRef, orderBy("createdAt", "desc"));
        }

        await onSnapshot(q, (querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => {
              const data = doc.data();
              const obj: documentType = {
                id: doc.id,
                title: data.title,
                body: data.body,
                createdBy: data.createdBy,
                image: data.image,
                tags: data.tags,
                uid: data.uid,
              };
              return obj;
            })
          );
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
      }

      setLoading(false);
    }

    loadData();
  }, [docCollection, search, uid, cancelled]);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { documents, loading, error };
};

export default useFetchDocuments;
