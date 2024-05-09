// IMPORTS
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import kitchen from "../assets/kitchen.jpg"

// CREATE FUNCTION
export default function Subscribinglist() {
  // STATE VARIABLES
  const [state, setState] = useState(0);
  const navigate = useNavigate();

  // JAVASCRIPT LOGIC
  const handleCardClick = (creatorId) => {
    navigate(`/creatorspage/${creatorId}`);
  };

  // HTML
  return (
    <>
      <head></head>
      <body>
        <div className="mt-20">
          This will be the creators I am subscribing to so I can see their
          cookbooks
          <div className="flex h-screen flex-col items-center justify-center gap-4 overflow-y-scroll ">
          <div className="relative h-40 w-[90%] rounded border overflow-hidden shadow-md"
          onClick={() => handleCardClick(1)}
          >
            <p className="absolute text-4xl text-white font-bold">Creator 1</p>
            <img
              src={kitchen}
              className=""
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="relative h-40 w-[90%] rounded border overflow-hidden shadow-md"
          onClick={() => handleCardClick(1)}
          >
            <p className="absolute text-4xl text-white font-bold">Creator 2</p>
            <img
              src={kitchen}
              className=""
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="relative h-40 w-[90%] rounded border overflow-hidden shadow-md"
          onClick={() => handleCardClick(1)}
          >
            <p className="absolute text-4xl text-white font-bold">Creator 3</p>
            <img
              src={kitchen}
              className=""
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="relative h-40 w-[90%] rounded border overflow-hidden shadow-md"
          onClick={() => handleCardClick(1)}
          >
            <p className="absolute text-4xl text-white font-bold">Creator 4</p>
            <img
              src={kitchen}
              className=""
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="h-40 w-[90%] rounded border shadow-md">
            TCreator 2
          </div>
          <div className="h-40 w-[90%] rounded border shadow-md">
            Creator 3
          </div>
          <div className="h-40 w-[90%] rounded border shadow-md">
            Creator 4
          </div>
        </div>
        </div>
      </body>
    </>
  );
}
