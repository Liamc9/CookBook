import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const navigate = useNavigate();

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    // Clear previous messages and set loading state
    setError(""); // Clear any existing error messages
    setResetEmailSent(false); // Clear the reset email sent notification
    setIsLoading(true); // Set loading to true
    try {
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userCredential.user.emailVerified) {
        navigate("/");
      } else {
        await auth.signOut();
        setError(
          "Your email is not verified. Please verify your email before logging in.",
        );
      }
      setIsLoading(false); // Reset loading state after completion
    } catch (error) {
      setIsLoading(false); // Reset loading state in case of error
      setError("Invalid email or password. Please try again.");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      setResetEmailSent(false); // Ensure reset email sent is false
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true); // Set to true only if email is successfully sent
      setError(""); // Clear any existing error messages
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
      setResetEmailSent(false); // Set to false if there is an error
    }
  };

  // Render the login form
  return (
    <div className="mt-8 flex min-h-screen items-center justify-center px-2">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 px-4 shadow-md sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Sign in to your account
        </h2>
        {resetEmailSent && (
          <p className="mt-2 text-center text-sm text-green-500">
            A password reset email has been sent to {email}.
          </p>
        )}
        {error && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}
        <form className="mt-4 space-y-4" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="relative font-sans">
                <input
                  name="email"
                  id="email"
                  type="email"
                  autoComplete="email"
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
              <div className="relative font-sans">
                <input
                  name="password"
                  id="password"
                  type="password"
                  autoComplete="current-password"
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
                className="ml-2 block text-sm text-gray-900 sm:text-base"
              >
                {" "}
                Remember me{" "}
              </label>
            </div>
            <div className="text-sm sm:text-base">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-custom-brown hover:text-custom-brown"
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-custom-brown px-4 py-2 text-sm font-medium text-white hover:bg-custom-brown focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-custom-brown hover:text-custom-brown"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
