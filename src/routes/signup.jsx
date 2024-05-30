import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Create a new user with email and password
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== reenterPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;


      await updateProfile(user, {
        displayName: `${username}`,
      });
      await sendEmailVerification(user);

      // Additional user data including university name and emblem
      const userData = {
        email: email,
        username: username,
        chef: false,
      };
      await setDoc(doc(db, "users", user.uid), userData);
      await signOut(auth);
      console.log("User created and signed out successfully");
      setIsSignupComplete(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  if (isSignupComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center px-2">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 px-4 shadow-md sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900">
            Signup Successful!
          </h2>
          <p>
            Please check your email <strong>{email}</strong> for a verification
            link to activate your account.
          </p>
          <p className="mt-4">
            <Link
              to="/login"
              className="font-medium text-custom-brown hover:text-custom-brown"
            >
              Return to Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex min-h-screen items-center justify-center px-2 pb-10">
      <div className="mt-10 w-full max-w-md rounded-lg border bg-white p-6 pt-4 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Sign up for an account
        </h2>
        {error && (
          <p className="mb-2 text-center text-sm text-red-500">{error}</p>
        )}
        <form onSubmit={handleSignup}>
          <div className="space-y-3">
              <div className="relative  font-sans">
                <input
                  name="username"
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 text-base outline-none focus:border-b-4 focus:border-custom-brown focus:border-b-custom-brown"
                />
                <label
                  htmlFor="username"
                  className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white p-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${username ? "ml-5 translate-y-[-70%] scale-90 px-1 py-0" : ""}`}
                >
                  Username
                </label>
              </div>
            <div className="relative my-4  font-sans">
                <input
                  name="email"
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 text-base outline-none focus:border-b-4 focus:border-custom-brown focus:border-b-custom-brown"
                />
                <label
                  htmlFor="email"
                  className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white p-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${email ? "ml-5 translate-y-[-70%] scale-90 px-1 py-0" : ""}`}
                >
                  Email
                </label>
              </div>
              <div className="relative my-4  font-sans">
                <input
                  name="password"
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 text-base outline-none focus:border-b-4 focus:border-custom-brown focus:border-b-custom-brown"
                />
                <label
                  htmlFor="password"
                  className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white p-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${password ? "ml-5 translate-y-[-70%] scale-90 px-1 py-0" : ""}`}
                >
                  Password
                </label>
              </div>
              <div className="relative my-4  font-sans">
                <input
                  name="reenterpassword"
                  id="reenterpassword"
                  type="password"
                  required
                  value={reenterPassword}
                  onChange={(e) => setReenterPassword(e.target.value)}
                  className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 text-base outline-none focus:border-b-4 focus:border-custom-brown focus:border-b-custom-brown"
                />
                <label
                  htmlFor="reenterpassword"
                  className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white p-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${reenterPassword ? "ml-5 translate-y-[-70%] scale-90 px-1 py-0" : ""}`}
                >
                  Re-enter Password
                </label>
              </div>
            
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox cursor-pointer"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <span className="ml-2">
                  I accept the{" "}
                  <Link
                    to="/terms"
                    className="text-custom-brown hover:text-custom-brown"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-custom-brown hover:text-custom-brown"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="hover:bg-custom-brown-700 group relative flex w-full justify-center rounded-md border border-transparent bg-custom-brown px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="mr-2 animate-spin"
                  />{" "}
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-custom-brown hover:text-custom-brown"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
