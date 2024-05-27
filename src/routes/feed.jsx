// IMPORTS
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";


// CREATE FUNCTION
export default function Feed() {
  // STATE VARIABLES
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

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
