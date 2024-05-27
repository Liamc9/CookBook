// IMPORTS
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import FeedCard from "../components/feedcard";



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
        <div className="p-4 mt-20 overflow-y-scroll">
          {loading ? (
            <p>Loading videos...</p>
          ) : (
            <div className="flex h-screen flex-col gap-4 ">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className=""
                >
                              <FeedCard name= "John Doe" caption="This is a caption" video={video.url}/>
               
                </div>
              ))}
            </div>
          )}
        </div>
      </body>
    </>
  );
}
