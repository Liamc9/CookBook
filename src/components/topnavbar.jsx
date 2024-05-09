// IMPORTS
import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Import the signOut function from Firebase
import { doc, getDoc } from "firebase/firestore";
import Logo from "../assets/Logo.png";

// CREATE FUNCTION
export default function NavBar() {
  // STATE VAIRABLES
  const [user, loading, error] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for the dropdown
  const [userPhoto, setUserPhoto] = useState("");

  // JAVASCRIPT LOGIC
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setUserPhoto(docSnap.data().photoURL);
        } else {
          console.log("No such user document!");
        }
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    setDropdownOpen(false); // Close the dropdown when signing out
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // HTML
  return (
    <>
      <head></head>
      <body>
        <div className="absolute top-0 z-30 w-full">
          <nav className="bg-white shadow">
            <div className=" flex items-center justify-between px-2 md:px-6">
              <div className="flex flex-row items-center pb-2 pt-2 md:pt-4">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-[30px] w-[30px]"
                  style={{ objectFit: "cover" }}
                />
                <a className=" ml-1 text-3xl font-bold text-gray-800" href="/">
                  <p>Lettz</p>
                </a>
              </div>
              <div className="flex w-[30%] justify-end text-center">
                {!loading &&
                  !error &&
                  (user ? (
                    <div ref={dropdownRef}>
                      <button
                        className="h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none md:h-[55px] md:w-[55px]"
                        onClick={toggleDropdown}
                      >
                        <img
                          src={
                            userPhoto ||
                            "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                          }
                          alt="User"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-4 z-50 mt-2 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow">
                          <ul className=" text-sm text-gray-700">
                            <li>
                              <Link
                                to="/profile"
                                className="block px-4 py-4 hover:bg-gray-100 "
                                onClick={toggleDropdown}
                              >
                                Profile
                              </Link>
                            </li>
                          </ul>
                          <ul className=" text-sm text-gray-700">
                            <li>
                              <Link
                                to="/contactus"
                                className="block px-4 py-4 hover:bg-gray-100 "
                                onClick={toggleDropdown}
                              >
                                Contact Us
                              </Link>
                            </li>
                          </ul>
                          <div className="">
                            <button
                              onClick={handleSignOut}
                              className="block w-full px-4 py-4 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="w-28 transform rounded-md bg-purple-500 px-1 py-1 font-medium text-white transition-colors duration-200 hover:bg-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-300 md:px-2 md:py-2"
                    >
                      Sign In
                    </Link>
                  ))}
              </div>
            </div>
          </nav>
        </div>
      </body>
    </>
  );
}
