import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to Date object if needed
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setData(items);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  const add = async (item) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: new Date()
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const update = async (id, item) => {
    try {
      await updateDoc(doc(db, collectionName, id), item);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { data, loading, error, add, remove, update };
}
