// SignupPage.js
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

const SignupPage = ({ closeModal, setShowSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });
      await sendEmailVerification(user);

      const userData = {
        email: email,
        username: username,
      };
      await setDoc(doc(db, "users", user.uid), userData);
      await signOut(auth);

      setIsSignupComplete(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  // Modal inline styling
  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  if (isSignupComplete) {
    return (
      <div style={modalBackdropStyle}>
        <div style={modalContentStyle}>
          <h2 className="text-2xl font-extrabold text-gray-900">Signup Successful!</h2>
          <p>Please check your email <strong>{email}</strong> for a verification link to activate your account.</p>
          <div className="mt-4">
            <button
              onClick={() => setShowSignUp(false)}
              className="group relative flex w-full justify-center rounded-md bg-custom-brown px-4 py-2 text-white font-medium hover:bg-custom-brown focus:ring-2 focus:ring-custom-brown"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <h2 className="text-2xl font-bold text-gray-900">Sign up for an account</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <input
              name="username"
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 outline-none focus:border-b-4 focus:border-custom-brown"
            />
            <label
              htmlFor="username"
              className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white px-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${
                username ? "ml-5 -translate-y-[70%] scale-90 px-1 py-0" : ""
              }`}
            >
              Username
            </label>
          </div>
          <div className="relative">
            <input
              name="email"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 outline-none focus:border-b-4 focus:border-custom-brown"
            />
            <label
              htmlFor="email"
              className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white px-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${
                email ? "ml-5 -translate-y-[70%] scale-90 px-1 py-0" : ""
              }`}
            >
              Email
            </label>
          </div>
          <div className="relative">
            <input
              name="password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 outline-none focus:border-b-4 focus:border-custom-brown"
            />
            <label
              htmlFor="password"
              className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white px-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${
                password ? "ml-5 -translate-y-[70%] scale-90 px-1 py-0" : ""
              }`}
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              name="reenterpassword"
              id="reenterpassword"
              type="password"
              required
              value={reenterPassword}
              onChange={(e) => setReenterPassword(e.target.value)}
              className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2 outline-none focus:border-b-4 focus:border-custom-brown"
            />
            <label
              htmlFor="reenterpassword"
              className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white px-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${
                reenterPassword ? "ml-5 -translate-y-[70%] scale-90 px-1 py-0" : ""
              }`}
            >
              Re-enter Password
            </label>
          </div>
          <div className="text-left">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox cursor-pointer"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span className="ml-2 text-sm">
                I accept the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-custom-brown hover:text-custom-brown"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-custom-brown hover:text-custom-brown"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-custom-brown px-4 py-2 text-white font-medium hover:bg-custom-brown focus:ring-2 focus:ring-custom-brown"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => setShowSignUp(false)}
              className="font-medium text-custom-brown hover:text-custom-brown"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
