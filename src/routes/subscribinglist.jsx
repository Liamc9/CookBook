// IMPORTS
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import Chefcard from "../components/chefcard";
import Search from "../components/search";

// CREATE FUNCTION
export default function Subscribinglist() {
  // STATE VARIABLES
  const [subscribingIds, setSubscribingIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the ID of the logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        const userDoc = await getDoc(doc(db, "users", 'LzWLxrHTYQ3CBRt4fx4S'));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSubscribingIds(userData.subscribing || []);
          console.log('uvuy',userData.subscribing);
        }
      setLoading(false);
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // HTML
  return (
    <div>
      <div className="mt-20 mx-auto w-[90%]">
        <Search />
        
        <div className=" mt-10 flex h-screen flex-col gap-4  ">
        <h1 className=" text-xl font-bold">Subscribed</h1>
          {subscribingIds.length > 0 ? (
            subscribingIds.map((chefid) => (
              <Chefcard key={chefid} chefid={chefid} />
            ))
          ) : (
            <p className="text-center">You are not subscribed to any creators.</p>
          )}
        </div>
      </div>
    </div>
  );
}
