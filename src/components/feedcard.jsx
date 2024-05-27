// IMPORTS
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
// CREATE FUNCTION
export default function FeedCard({name, caption, video}) {
  // STATE VAIRABLES
  const [state, setState] = useState(0);

  // JAVASCRIPT LOGIC
  useEffect(() => {
    setState(state + 1);
  }, []);

  // HTML
  return (
    <>
      <head></head>
      <body>
        <div className="w-full aspect-[1/1]">
          <div className="relative h-full w-full overflow-hidden rounded-lg border shadow-lg">
            <div className="absolute left-2 top-2 flex w-full flex-row gap-2 ">
              <div className=" h-8 w-8 rounded-full bg-blue-500"></div>
              <p className="flex items-center text-lg text-white">
                {name}
              </p>
              <div className="flex flex-grow justify-end mr-4">
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-white text-xl"/>
              </div>
            </div>

            <div className="h-[70%]">
            <video controls className="w-full h-full object-cover overflow-hidden">
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
            </div>
            <div className="h-[30%] p-4">
              <div className="text-left flex flex-wrap gap-2">
                <Link to='/creatorspage' className="font-bold">{name}</Link><p>{caption}</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
