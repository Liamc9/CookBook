// LoginPage.js
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../firebase-config";
import SignupPage from "./signup"; // Import SignupPage for modal switching

const LoginPage = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false); // Toggle for Signup page

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetEmailSent(false);
    setIsLoading(true);
    try {
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user.emailVerified) {
        closeModal(); // Close modal after successful login
      } else {
        await auth.signOut();
        setError("Your email is not verified. Please verify your email.");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError("Invalid email or password. Please try again.");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      setResetEmailSent(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError("");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
      setResetEmailSent(false);
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

  // If showSignUp is true, render the SignupPage component
  if (showSignUp) {
    return <SignupPage closeModal={closeModal} setShowSignUp={setShowSignUp} />;
  }

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
        {resetEmailSent && (
          <p className="mt-2 text-sm text-green-500">
            A password reset email has been sent to {email}.
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-custom-brown"
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-custom-brown px-4 py-2 text-white font-medium hover:bg-custom-brown focus:ring-2 focus:ring-custom-brown"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => setShowSignUp(true)}
              className="font-medium text-custom-brown hover:text-custom-brown"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
