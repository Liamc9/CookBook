// IMPORTS
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase-config'; // Adjust the import path as needed

// CREATE FUNCTION
export default function EditProfile() {
  // STATE VARIABLES
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    profilePic: '',
    coverPhoto: '',
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
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
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUserData({
      ...userData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('No user is logged in.');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    try {
      let profilePicUrl = userData.profilePic;
      let coverPhotoUrl = userData.coverPhoto;

      // Handle profile picture upload
      if (userData.profilePic instanceof File) {
        const profilePicRef = ref(storage, `users/${user.uid}/profilePic`);
        await uploadBytes(profilePicRef, userData.profilePic);
        profilePicUrl = await getDownloadURL(profilePicRef);
      }

      // Handle cover photo upload
      if (userData.coverPhoto instanceof File) {
        const coverPhotoRef = ref(storage, `users/${user.uid}/coverPhoto`);
        await uploadBytes(coverPhotoRef, userData.coverPhoto);
        coverPhotoUrl = await getDownloadURL(coverPhotoRef);
      }

      await updateDoc(userDocRef, {
        ...userData,
        profilePic: profilePicUrl,
        coverPhoto: coverPhotoUrl,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile: ', error);
      setError('Error updating profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile my-20">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="relative font-sans my-4">
          <input
            name="firstName"
            id="firstName"
            type="text"
            required
            value={userData.firstName}
            onChange={handleChange}
            className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2.5 text-base outline-none focus:border-b-4 focus:border-custom-brown"
          />
          <label
            htmlFor="firstName"
            className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white p-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${userData.firstName ? "ml-5 -translate-y-[70%] scale-90 px-1 py-0" : ""}`}
          >
            First Name
          </label>
        </div>
        <div className="relative font-sans my-4">
          <input
            name="lastName"
            id="lastName"
            type="text"
            required
            value={userData.lastName}
            onChange={handleChange}
            className="peer w-full rounded-lg border-2 border-gray-300 bg-transparent p-2.5 text-base outline-none focus:border-b-4 focus:border-custom-brown"
          />
          <label
            htmlFor="lastName"
            className={`pointer-events-none absolute left-0 m-1 ml-2.5 transform bg-white p-1.5 text-base text-gray-500 transition-transform duration-300 ease-in-out peer-focus:ml-5 peer-focus:-translate-y-[70%] peer-focus:scale-90 peer-focus:px-1 peer-focus:py-0 peer-focus:text-custom-brown ${userData.lastName ? "ml-5 -translate-y-[70%] scale-90 px-1 py-0" : ""}`}
          >
            Last Name
          </label>
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePic">
          Profile Picture
        </label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          onChange={handleFileChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coverPhoto">
          Cover Photo
        </label>
        <input
          type="file"
          id="coverPhoto"
          name="coverPhoto"
          onChange={handleFileChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categories">
          Categories
        </label>
        <select
          id="categories"
          name="categories"
          value={userData.categories}
          onChange={handleChange}
          multiple
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Category1">Category1</option>
          <option value="Category2">Category2</option>
          <option value="Category3">Category3</option>
          {/* Add more categories as needed */}
        </select>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
