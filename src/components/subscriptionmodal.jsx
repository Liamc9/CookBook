import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase-config"; // Adjust the import path as needed

export default function SubscriptionModal({ isModalOpen, closeModal, profileUserId, currentUserId }) {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubscribe = async () => {
    if (!profileUserId || !currentUserId) {
      alert("Invalid user information.");
      return;
    }

    try {
      // Add the profile user ID to the current user's subscribing array
      const currentUserDocRef = doc(db, "users", currentUserId);
      await updateDoc(currentUserDocRef, {
        subscribing: arrayUnion(profileUserId),
      });

      // Add the current user ID to the profile user's subscribers array
      const profileUserDocRef = doc(db, "users", profileUserId);
      await updateDoc(profileUserDocRef, {
        subscribers: arrayUnion(currentUserId),
      });

      alert("Subscribed successfully!");
      closeModal();
    } catch (error) {
      console.error("Error subscribing: ", error);
      alert("An error occurred while subscribing. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white shadow-lg h-[400px] w-[400px]">
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute right-4 top-0 text-lg text-gray-500"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
          <div className="m-8 my-4 md:my-8 md:mt-4">
            <div className="mb-[200px] flex w-full flex-col gap-4 p-4 text-center">
              <p className="mb-4 text-lg font-semibold">Subscribe to get the latest updates!</p>
              <button
                onClick={handleSubscribe}
                className="rounded-lg bg-custom-brown px-4 py-2 text-sm text-white hover:bg-custom-brown-dark transition"
              >
                Subscribe for Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
