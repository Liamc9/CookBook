// IMPORTS
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// CREATE FUNCTION
export default function SubscriptionModal({ isModalOpen, closeModal }) {
  // STATE VARIABLES
  const [state, setState] = useState('');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`rounded-lg bg-white shadow-lg h-[400px] w-[400px]`}> {/* CHANGE THE HEIGHT AND WIDTH OF MODAL HERE */}
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute right-4 top-0 text-lg text-gray-500"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
          <div className="m-8 my-4 md:my-8 md:mt-4">
            <div>
            <div className="mb-[200px] flex w-full flex-col gap-4 p-4 text-center">
            <div className="rounded-lg border border-gray-300 p-4">
              <p className="mb-2">Subscribe for free</p>
              <Link
                to="/pricing"
                className="rounded-lg bg-custom-brown px-4 py-2 text-sm text-white hover:text-custom-brown"
              >
                Subscribe Free
              </Link>
            </div>
            <div className="rounded-lg border border-gray-300 p-4">
              <p className="mb-2">Get the exclusive subscription</p>
              <Link
                to="/pricing"
                className="rounded-lg bg-custom-brown px-4 py-2 text-sm text-white hover:text-custom-brown"
              >
                Subscribe $10
              </Link>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}