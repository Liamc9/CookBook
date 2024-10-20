import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/topnavbar";
import BottomTabs from "../components/bottomnavbar";
import { useEffect, useState } from "react";
import LoginPage from "./login";
import { auth } from "../firebase-config";
import BottomNavbarCh from "../components/bottomnavbarch";

export default function Root() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up Firebase authentication state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set user if authenticated
      setLoading(false); // Stop loading once auth check is done
    });

    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  // Scroll to top whenever the location.pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Conditionally hide top navbar on specific paths
  const shouldHideTopNav = () => {
    const pathsToHide = ["/updatecarddetails", "/recipeswipepage"];
    return pathsToHide.some((path) => location.pathname.startsWith(path));
  };

  const shouldHideBottomNav = () => {
    const pathsToHide = ["/updatecarddetails", "/profile", "/recipeswipepage"];
    return pathsToHide.some((path) => location.pathname.startsWith(path));
  };

  // Determine which bottom component to render
  const getBottomComponent = () => {
    if (location.pathname.startsWith("/chefhub")) {
      return <BottomNavbarCh />;
    } else {
      return <BottomTabs />;
    }
  };

  // Function to close the modal after login
  const closeModal = () => {
    // Modal will automatically close when user is authenticated
  };

  // Render a loading spinner while authentication is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the NavBar for both authenticated and unauthenticated users
  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white">
      
      {user ? (
        <>
        {!shouldHideTopNav() && <NavBar />}
          <Outlet /> {/* Renders the current route's component */}
          {!shouldHideBottomNav() && getBottomComponent()}
        </>
      ) : (
        <LoginPage closeModal={closeModal} />
      )}
    </div>
  );
}
