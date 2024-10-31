import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase-config"; // Adjust the import path as needed
import { RecipeCard, CookbookCard, BottomDrawer } from "liamc9npm"; // Imported BottomDrawer
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import SubscriptionModal from "../components/subscriptionmodal";
import StripePaymentDisplay from "../components/stripePaymentDisplay";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [cookbooks, setCookbooks] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams(); // Get the user ID from the URL parameters
  const [isProfileOwner, setIsProfileOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // To store current user data
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to handle drawer

  // Drawer open handler
  const openDrawer = () => setIsDrawerOpen(true);
  
  // Drawer close handler (linked to the `onClose` argType)
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      setCurrentUser(user);

      if (user) {
        const isOwner = userId ? userId === user.uid : true;
        setIsProfileOwner(isOwner);

        const userDocRef = doc(db, "users", userId || user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            await fetchRecipes(data.Recipes || []);
            await fetchCookbooks(data.cookbooks || []);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
      setLoading(false);
    };

    const fetchRecipes = async (Recipes) => {
      if (Recipes.length === 0) return;

      const recipesRef = collection(db, "recipes");
      const recipesQuery = query(recipesRef, where("__name__", "in", Recipes));

      try {
        const recipeDocs = await getDocs(recipesQuery);
        const fetchedRecipes = recipeDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    const fetchCookbooks = async (Cookbooks) => {
      if (Cookbooks.length === 0) return;

      const cookbooksRef = collection(db, "cookbooks");
      const cookbooksQuery = query(cookbooksRef, where("__name__", "in", Cookbooks));

      try {
        const cookbooksDocs = await getDocs(cookbooksQuery);
        const fetchedCookbooks = cookbooksDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCookbooks(fetchedCookbooks);
      } catch (error) {
        console.error("Error fetching cookbooks: ", error);
      }
    };
  
    fetchUserData();
  }, [userId]);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div className="p-4 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onCardClick={() => navigate(`/recipeswipepage/${recipe.id}`)}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cookbooks.map((cookbook) => (
                <CookbookCard
                  key={cookbook.id}
                  cookbook={cookbook}
                  onCardClick={() => navigate(`/cookbooks/${cookbook.id}`)}
                />
              ))}
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

  if (userData && userData.chef === false && isProfileOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Become a Chef</h1>
        <p className="mb-4 text-center text-lg text-gray-700">
          Sign up to be a chef and share your amazing recipes with the world!
        </p>
        <button
          onClick={() => navigate("/chef-signup")}
          className="px-4 py-2 bg-custom-brown text-white rounded-md hover:bg-custom-brown-dark transition"
        >
          Sign Up to be a Chef
        </button>
      </div>
    );
  }

  return (
    <div className="relative mt-12 mb-20 flex min-h-screen w-full flex-col items-center">
      {/* Profile and cover image */}
      <div className="aspect-[10/4] w-full">
        <div className="h-full w-full">
          <div className="relative flex h-full w-full">
            {isProfileOwner && (
              <Link to="/editprofile" className="absolute right-2 top-2 z-20 rounded-full bg-white p-2 text-custom-brown">
                <FontAwesomeIcon icon={faUserEdit} className="text-custom-brown" />
              </Link>
            )}
            <img
              src={userData.coverPhoto}
              className="absolute h-full w-full object-cover"
              alt="Cover"
            />
            <div className="z-10 flex w-[30%] items-center justify-center">
              <img
                src={userData.profilePic}
                className="aspect-[1/1] w-[80%] rounded-full border-2 border-white"
                alt="Profile"
              />
            </div>
            <div className="flex w-[60%] flex-col">
              <div className="flex h-[50%]"></div>
              <div className="z-20 flex flex-col text-lg font-semibold text-white md:text-xl">
                <p>
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm font-normal md:text-lg mb-2">
                  {userData.categories}
                </p>
                {/* Social and subscription */}
                <div className="absolute bottom-2 right-2 flex flex-row gap-2">
                  <div className="px-1 bg-blue-500 items-center justify-center rounded">
                    <FontAwesomeIcon icon={faFacebook} className="text-white" />
                  </div>
                  <div className="px-1 bg-blue-300 items-center justify-center rounded">
                    <FontAwesomeIcon icon={faTwitter} className="text-white" />
                  </div>
                  <div className="px-1 bg-red-500 items-center justify-center rounded">
                    <FontAwesomeIcon icon={faYoutube} className="text-white" />
                  </div>
                  <div className="px-1 bg-black items-center justify-center rounded">
                    <FontAwesomeIcon icon={faTiktok} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 h-[50%] w-full bg-gray-500 opacity-50"></div>
          </div>
        </div>
        {!isProfileOwner && (
            <button
              onClick={openDrawer}
              className="absolute top-2 right-2 px-2 py-2 bg-white text-custom-brown shadow-lg border border-gray-300 font-semibold rounded-md hover:bg-gray-300 transition"
            >
              Subscribe $19.99
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex w-full justify-center bg-white shadow-lg">
        <div className="flex border-b border-gray-200 w-full">
          <button
            onClick={() => handleTabClick(1)}
            className={`relative py-4 text-sm font-medium focus:outline-none transition duration-300 w-full ${
              activeTab === 1 ? 'text-custom-brown' : 'text-gray-500 hover:text-custom-brown'
            }`}
          >
            All Recipes
            {activeTab === 1 && (
              <span className="absolute left-0 bottom-0 h-1 w-full bg-custom-brown animate-slideIn"></span>
            )}
          </button>
          <button
            onClick={() => handleTabClick(2)}
            className={`relative py-4 text-sm font-medium focus:outline-none transition duration-300 w-full ${
              activeTab === 2 ? 'text-custom-brown' : 'text-gray-500 hover:text-custom-brown'
            }`}
          >
            Cookbooks
            {activeTab === 2 && (
              <span className="absolute left-0 bottom-0 h-1 w-full bg-custom-brown animate-slideIn"></span>
            )}
          </button>
        </div>
      </div>

      {getTabContent()}

      <SubscriptionModal
        isModalOpen={isSubscriptionModalOpen}
        closeModal={() => setIsSubscriptionModalOpen(false)}
        profileUserId={userId} // Pass the profile user ID
        currentUserId={currentUser?.uid} // Pass the current user ID
      />

      {/* Bottom Drawer */}
      <BottomDrawer isOpen={isDrawerOpen} onClose={closeDrawer} >
        <div className = 'p-4'>
      {/*<button
          onClick={closeDrawer}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Close Drawer
        </button>*/}
        <h2 className="text-xl font-bold mb-4">Subscribe to {userData.name} for $19.99 per month</h2>
        <StripePaymentDisplay
  useCustomer={true}
  customerEmail="liam12crowley@gmail.com"
  attachPaymentMethod={true}
  currency="eur" // Specify the currency here
  destinationAccount="acct_1PP14o4CfuQN95oo" // Specify the Stripe Connect account ID if blank the payment just goes to me
/>       
</div>
      </BottomDrawer>
    </div>
  );
}
