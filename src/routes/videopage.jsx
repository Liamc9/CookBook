import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function VideoGallery() {
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

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="max-w-md overflow-hidden rounded shadow-lg"
            >
              <video controls className="w-full">
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {video.name && (
                <div className="px-6 py-4">
                  <div className="mb-2 text-xl font-bold">{video.name}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
