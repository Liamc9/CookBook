import { useState, useEffect } from "react";
import VideoGallery from "./videopage";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Adjust the import path as needed

export default function Profile() {
  // STATE VARIABLES
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1); // 1 for Tab 1, 2 for Tab 2, 3 for Tab 3

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle tab click
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  // Determine which content to display based on the active tab
  const getTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div className="p-4 text-center">
            This will be like a social media style feed where the creators post
            are
            <VideoGallery />
          </div>
        );
      case 2:
        return (
          <div className="p-4 text-center">
            This will be the CookBook where the creators recipes are. You have
            to subscribe to see.
          </div>
        );
      case 3:
        return (
          <div className="p-4 text-center mb-[200px] flex flex-col w-full gap-4">
            <div className="rounded-lg border border-gray-300 p-4">
              <p className="mb-2">Subscribe for free</p>
              <Link
                to="/pricing"
                className="bg-custom-brown text-white px-4 py-2 rounded-lg text-sm hover:text-custom-brown"
              >
                Subscribe Free
              </Link>
            </div>
            <div className="rounded-lg border border-gray-300 p-4">
              <p className="mb-2">Get the exclusive subscription</p>
              <Link
                to="/pricing"
                className="bg-custom-brown text-white px-4 py-2 rounded-lg text-sm hover:text-custom-brown"
              >
                Subscribe $10
              </Link>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-center">Content for Tab 1</div>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div  className="relative h-64 w-full items-center bg-gray-200">
        <img src={userData.coverPhoto} className="absolute h-full w-full object-cover" />
        <img src={userData.profilePic} className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 translate-y-1/4 overflow-hidden rounded-full border-4 border-black" />
      </div>
      {userData ? (
        <>
          <h1 className="mt-10 text-3xl font-bold">{userData.firstName} {userData.lastName}</h1>
        </>
      ) : (
        <h1 className="mt-10 text-3xl font-bold">User</h1>
      )}
      <Link to='/editprofile' className='text-custom-brown'>Edit Profile</Link>
      {/* Tabs Section */}
      <div className="flex w-full items-center justify-around bg-white px-4 py-2 shadow-lg">
        <div
          onClick={() => handleTabClick(1)}
          className="tab cursor-pointer text-center"
        >
          <p className="text-sm text-gray-700 hover:text-custom-brown">
            My Feed
          </p>
        </div>
        <div
          onClick={() => handleTabClick(2)}
          className="tab cursor-pointer text-center"
        >
          <p className="text-sm text-gray-700 hover:text-custom-brown">
            Cookbook
          </p>
        </div>
        <div
          onClick={() => handleTabClick(3)}
          className="tab cursor-pointer text-center"
        >
          <p className="text-sm text-gray-700 hover:text-custom-brown">
            Pricing
          </p>
        </div>
      </div>
      {/* Dynamic Content Based on Active Tab */}
      {getTabContent()}
    </div>
  );
}
