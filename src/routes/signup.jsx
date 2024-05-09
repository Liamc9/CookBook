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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

      const formattedFirstName = capitalizeFirstLetter(firstName);
      const formattedLastName = capitalizeFirstLetter(lastName);

      await updateProfile(user, {
        displayName: `${formattedFirstName} ${formattedLastName}`,
      });
      await sendEmailVerification(user);

      // Additional user data including university name and emblem
      const userData = {
        email: email,
        firstName: formattedFirstName,
        lastName: formattedLastName,
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for an account
        </h2>
        {error && (
          <p className="mb-2 text-center text-sm text-red-500">{error}</p>
        )}
        <form onSubmit={handleSignup}>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="items-left flex flex-col">
                <p className="text-sm font-semibold text-gray-700">
                  First Name
                </p>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="items-left flex flex-col">
                <p className="text-sm font-semibold text-gray-700">Last Name</p>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="items-left flex flex-col">
              <p className="text-sm font-semibold text-gray-700">Email</p>
              <input
                id="email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="items-left flex flex-col">
              <p className="text-sm font-semibold text-gray-700">Password</p>
              <input
                id="password"
                type="password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="items-left flex flex-col">
              <p className="text-sm font-semibold text-gray-700">
                Re-enter Password
              </p>
              <input
                id="reenterPassword"
                type="password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Re-enter Password"
                onChange={(e) => setReenterPassword(e.target.value)}
              />
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
