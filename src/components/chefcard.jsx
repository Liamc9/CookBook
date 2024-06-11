// IMPORTS
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

// CREATE FUNCTION
export default function Chefcard({ chefid }) {
  // STATE VARIABLES
  const [Chef, setChef] = useState(null);

  // JAVASCRIPT LOGIC
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", chefid));
        setChef(userDoc.data());
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };
    fetchUser();
  }, [chefid]);

  if (!Chef) {
    return <div>Loading...</div>;
  }

  // HTML
  return (
    <div className=" flex">
      <div className="w-full aspect-[10/3]">
        <div key={chefid} className="w-full h-full">
          <Link to={`/profile/${chefid}`} className="relative flex w-full h-full overflow-hidden rounded-xl">
            <img
              src={Chef.coverPhoto}
              className="absolute h-full w-full object-cover"
              alt="Cover"
            />
            <div className="flex w-[30%] z-10 items-center justify-center">
              <img
                src={Chef.profilePic}
                className=" aspect-[1/1] w-[80%] rounded-full border-2 border-white"
                alt="Profile"
              />
            </div>
            <div className="flex w-[60%] flex-col">
              <div className="flex h-[50%]"></div>
              <div className="flex flex-col md:text-xl text-sm font-semibold text-white z-20">
                <p>{Chef.username}</p>
                <p className="font-normal text-xs md:text-lg">{Chef.categories}</p>
              </div>
            </div>
            <div className="absolute bottom-0 h-[50%] w-full bg-gray-500 opacity-50"></div>
            <div className="absolute right-2 top-2 bg-white rounded p-1 text-blue-500 text-xs">Subscribed</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
