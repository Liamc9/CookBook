import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useSwipeable } from "react-swipeable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Videoscroll() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [yPos, setYPos] = useState(0); // Tracks the vertical position during swipe
  const [showPanel, setShowPanel] = useState(false); // State to manage the panel visibility

  const togglePanel = () => {
    setShowPanel(!showPanel); // Toggle panel visibility
  };

  const panelStyles = {
    transform: showPanel ? "translateX(0)" : "translateX(100%)", // Slide in and out effect
    transition: "transform 0.3s ease-in-out",
    width: "80%", // Panel covers most of the page
    height: "70%",
    position: "fixed",
    top: 90,
    right: 0,
    backgroundColor: "white",
    padding: "20px",
    boxSizing: "border-box",
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

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setYPos(eventData.deltaY); // Update vertical position during swipe
    },
    onSwiped: (eventData) => {
      finalizeSwipe(eventData.dir === "Up" ? 1 : -1);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const finalizeSwipe = (delta) => {
    let newIndex = activeIndex + delta;
    if (newIndex < 0 || newIndex >= videos.length) {
      setYPos(0); // Reset Y position if swipe is invalid
      return;
    }
    setActiveIndex(newIndex);
    setYPos(0); // Reset Y position after swipe
  };

  const getNextIndex = (index) => (index + 1) % videos.length; // Ensures looping of videos

  return (
    <div {...handlers} className="h-screen overflow-hidden">
      {loading ? (
        <p>Loading videos...</p>
      ) : (
        videos.length > 0 && (
          <div className="flex relative overflow-hidden h-[90%] w-full flex-col items-center justify-start">
            <div
              className=""
              style={{ transform: `translateY(${yPos}px)` }}
            >
              {/* Current video */}
              <p className="absolute left-10 top-20 z-30 text-4xl font-bold text-white">
                Step {activeIndex + 1}
              </p>

              <video
                key={videos[activeIndex].id}
                controls
                autoPlay
                loop
                className="h-full w-full object-cover"
              >
                <source src={videos[activeIndex].url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Next video */}
              <video
                key={videos[getNextIndex(activeIndex)].id}
                controls
                autoPlay
                loop
                className="h-full w-full object-cover"
              >
                <source
                  src={videos[getNextIndex(activeIndex)].url}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              {!showPanel && (
                <button
                  onClick={togglePanel}
                  className="absolute right-10 top-20 transform rounded p-2 text-gray-500 bg-white"
                  style={{ zIndex: 1001 }}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              )}
            </div>

            <div style={panelStyles}>
              <h2>Details Panel</h2>
              <p>{videos[activeIndex].description}</p>
              <button
                onClick={togglePanel}
                className="mt-4 rounded bg-red-500 p-2 text-white"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="absolute bottom-10 left-5 text-xl text-white">
              {videos[activeIndex].name}
            </div>
          </div>
        )
      )}
    </div>
  );
}
