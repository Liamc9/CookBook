// IMPORTS
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase-config";

// CREATE FUNCTION
export default function AddCookbookModal({ isModalOpen, closeModal }) {
  // STATE VARIABLES
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');

  // JAVASCRIPT LOGIC
  useEffect(() => {
    // Lock body scroll when modal is open
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    }
    // Re-enable body scroll when modal is closed
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]); // Dependency array ensures effect runs only when `isModalOpen` changes

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !color) {
      setError('Please fill in both fields.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;


    const userDocRef = doc(db, "users", 'LzWLxrHTYQ3CBRt4fx4S');

    try {
      await updateDoc(userDocRef, {
        cookbooks: arrayUnion({ name, color })
      });
      closeModal(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding cookbook: ", error);
      setError('Error adding cookbook.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`rounded-lg bg-white shadow-lg h-[400px] w-[90%] md:w-[500px]`}>
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute right-4 top-0 text-lg text-gray-500"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
          <div className="m-8 my-4 md:my-8 md:mt-4">
            <h2 className="text-2xl font-bold mb-4">Add New Cookbook</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Cookbook
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
