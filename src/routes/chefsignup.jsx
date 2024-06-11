import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config'; // Adjust the import paths as needed
import { useNavigate } from 'react-router-dom';

export default function ChefSignup() {
  const [categories, setCategories] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    setCoverPhoto(file);
    setCoverPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('No user is logged in!');
      setLoading(false);
      return;
    }

    try {
      const profilePicUrl = await uploadFile(profilePic, `profilePics/${user.uid}`);
      const coverPhotoUrl = await uploadFile(coverPhoto, `coverPhotos/${user.uid}`);

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        chef: true,
        categories,
        profilePic: profilePicUrl,
        coverPhoto: coverPhotoUrl,
        subscribers: [],
        recipes: [],
      });

      alert('Profile updated successfully!');
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.error('Error updating profile: ', error);
      alert('Error updating profile. Please try again.');
    }

    setLoading(false);
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;

    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 mb-20">
      <h1 className="text-2xl font-bold mb-4">Sign Up to be a Chef</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
        <label className="flex flex-col">
          <span className="mb-2 text-gray-700">Food Categories</span>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="e.g., Italian, Desserts"
            className="p-2 border rounded-md"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-2 text-gray-700">Profile Picture</span>
          {profilePicPreview ? (
            <img src={profilePicPreview} alt="Profile" className="w-full h-40 object-cover rounded-md mb-2" />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="p-2 border rounded-md"
              required
            />
          )}
        </label>
        <label className="flex flex-col">
          <span className="mb-2 text-gray-700">Cover Photo</span>
          {coverPhotoPreview ? (
            <img src={coverPhotoPreview} alt="Cover" className="w-full h-40 object-cover rounded-md mb-2" />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              className="p-2 border rounded-md"
              required
            />
          )}
        </label>
        <p>On the next page will be adding bank details for stripe and also the stripe id verification</p>
        <button
          type="submit"
          className={`px-4 py-2 bg-custom-brown text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-custom-brown-dark transition'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
