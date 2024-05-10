// IMPORTS
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";


// CREATE FUNCTION
export default function Feed() {
  // STATE VARIABLES
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update component state (this might not be necessary depending on your use case)
  useEffect(() => {
    // Logic to perform on component mount
  }, []);

  // Handle input changes
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchQuery);
    // Here you might add logic to perform the search
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const videoSnapshot = await getDocs(collection(db, "files"));
      const videoList = videoSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setVideos(videoList);
      setLoading(false);
    };

    fetchVideos();
  }, []);
  // HTML
  return (
    <>
      <head></head>
      <body>
        <form
          onSubmit={handleSubmit}
          className="mt-20 w-full max-w-md rounded-lg bg-white p-4 shadow-md"
        >
          <div className="flex">
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Type here to search..."
              className="mr-0 flex-1 border-b border-l border-t border-gray-200 bg-white p-2 text-gray-800"
            />
            <button
              type="submit"
              className="rounded-r-lg border-b border-r border-t border-blue-500 bg-blue-500 p-2 px-4 text-white"
            >
              Search
            </button>
          </div>
        </form>
        <div className="p-4">
          {loading ? (
            <p>Loading videos...</p>
          ) : (
            <div className="flex h-screen flex-col items-center justify-center gap-4 overflow-y-scroll">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="max-w-md overflow-hidden rounded shadow-lg"
                >
                  <video controls className="w-full max-h-48 overflow-hidden">
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {video.name && (
                    <div className="px-6 py-4">
                      <div className="mb-2 text-xl font-bold">{video.name}
                      <p className="text-sm font-normal text-gray-700">The title should be the meal title and also there will be a caption</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </body>
    </>
  );
}
