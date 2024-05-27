import { useState, useEffect } from "react";
import VideoGallery from "./videopage";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Adjust the import path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import SubscriptionModal from "../components/subscriptionmodal";

export default function Profile() {
  // STATE VARIABLES
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
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
      
      default:
        return <div className="p-4 text-center">Content for Tab 1</div>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-12 flex min-h-screen w-full flex-col items-center">
      <div className="aspect-[10/4] w-full">
        <div className="h-full w-full">
          <div className="relative flex h-full w-full">
            <Link to="/editprofile" className="absolute right-2 top-2 z-20 rounded-full bg-white p-2 text-custom-brown">
        <FontAwesomeIcon icon={faUserEdit} className="text-custom-brown" />
      </Link>
            <img
              src={userData.coverPhoto}
              className="absolute h-full w-full object-cover"
              alt="Cover"
            />
            <div className="z-10 flex w-[30%] items-center justify-center">
              <img
                src={userData.profilePic}
                className=" aspect-[1/1] w-[80%] rounded-full border-2 border-white"
                alt="Profile"
              />
            </div>
            <div className="flex w-[60%] flex-col">
              <div className="flex h-[50%]"></div>
              <div className="z-20 flex flex-col text-lg font-semibold text-white md:text-xl">
                <p>
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm font-normal md:text-lg">
                  {userData.firstName} {userData.lastName}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 h-[50%] w-full bg-gray-500 opacity-50"></div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between p-4">
        <div className="flex flex-row gap-2">
          <div className="p-1 bg-gray-500 items-center justify-center">
            <FontAwesomeIcon icon={faFacebook} className="text-white" />
          </div>
          <div className="p-1 bg-gray-500 items-center justify-center">
            <FontAwesomeIcon icon={faTwitter} className="text-white" />
          </div>
          <div className="p-1 bg-gray-500 items-center justify-center">
            <FontAwesomeIcon icon={faYoutube} className="text-white" />
          </div>
          <div className="p-1 bg-gray-500 items-center justify-center">
            <FontAwesomeIcon icon={faTiktok} className="text-white" />
          </div>
        </div>
        <button onClick={() => setIsSubscriptionModalOpen(true)} className="flex items-center justify-center rounded bg-custom-brown p-1 text-center text-white">
          + Subscribe
        </button>
      </div>
      
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
        
      </div>
      {/* Dynamic Content Based on Active Tab */}
      {getTabContent()}
      <SubscriptionModal isModalOpen={isSubscriptionModalOpen} closeModal={() => setIsSubscriptionModalOpen(false)} />
    </div>
  );
}
