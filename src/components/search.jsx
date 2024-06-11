// IMPORTS
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// CREATE FUNCTION
export default function Search() {
  // STATE VARIABLES
  const [searchQuery, setSearchQuery] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  // Handle input changes
  const handleInputChange = async (event) => {
    const queryInput = event.target.value;
    setSearchQuery(queryInput);

    if (queryInput.trim() === "") {
      setMatchingUsers([]);
      setDropdownVisible(false);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", ">=", queryInput),
        where("username", "<=", queryInput + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);

      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      setMatchingUsers(users);
      setDropdownVisible(true);
    } catch (error) {
      console.error("Error searching for users:", error);
      setError("An error occurred while searching. Please try again.");
    }
  };

  // Handle click on a dropdown item
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setDropdownVisible(false);
    setSearchQuery("");
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Search logic is handled in handleInputChange
  };

  // HTML
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="w-full rounded-lg bg-white p-4 flex items-center">
        <input
          type="text"
          name="search"
          id="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search by username..."
          className="flex-1 border border-gray-300 rounded-l-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition duration-300"
        >
          Search
        </button>
      </form>

      {dropdownVisible && matchingUsers.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white shadow-lg border border-gray-200 rounded-lg max-h-60 overflow-y-auto z-10">
          {matchingUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition duration-200"
            >
              <img
                src={user.profilePic || "https://via.placeholder.com/50"}
                alt={`${user.username}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="ml-3 text-gray-800 font-medium">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
