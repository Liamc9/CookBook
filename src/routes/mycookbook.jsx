// IMPORTS
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AddCookbookModal from "../components/addcookbookmodal";

// CREATE FUNCTION
export default function Mycookbook() {
  // STATE VARIABLES
  const [cookbooks, setCookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAddCookbookModalOpen, setIsAddCookbookModalOpen] = useState(false);
  const navigate = useNavigate();

  // JAVASCRIPT LOGIC
  useEffect(() => {
    const fetchCookbooks = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCookbooks(userData.cookbooks || []);
        }
      } catch (error) {
        console.error("Error fetching cookbooks: ", error);
      }
      setLoading(false);
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchCookbooks("LzWLxrHTYQ3CBRt4fx4S");
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleTap = (index, cookbook) => {
    if (hoveredIndex === index) {
      // If already hovered, navigate
      navigate(`/cookbook/${cookbook}`);
    } else {
      // Set the hovered index
      setHoveredIndex(index);
    }
  };

  return (
    <div className="mt-20 px-4">
      <div className="mx-auto mb-4 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">My Cookbooks</h1>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-custom-brown text-2xl font-bold text-white"
          onClick={() => setIsAddCookbookModalOpen(true)}
        >
          +
        </button>
      </div>
      <div className="flex space-x-4 overflow-x-auto rounded bg-gray-200 p-4">
        {cookbooks.length > 0 ? (
          cookbooks.map((cookbook, index) => (
            <div
              key={index}
              className={`group relative h-[254px] w-16 flex-none cursor-pointer items-center justify-center overflow-hidden rounded border border-gray-400 bg-custom-brown transition-all duration-500 ${hoveredIndex === index ? "hover:w-[300px]" : ""}`}
              onClick={() => handleTap(index, cookbook)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="-rotate-90 transform p-2 text-center tracking-widest text-white transition-all duration-500 group-hover:rotate-0">
                  {cookbook}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No cookbooks found.</p>
        )}
      </div>
      <AddCookbookModal
        isModalOpen={isAddCookbookModalOpen}
        closeModal={() => setIsAddCookbookModalOpen(false)}
      />
    </div>
  );
}
