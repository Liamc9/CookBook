// IMPORTS
import { useState, useEffect } from "react";

// CREATE FUNCTION
export default function Feed() {
  // STATE VARIABLES
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="flex h-screen flex-col items-center justify-center gap-4 overflow-y-scroll ">
          <div className="h-40 w-[90%] rounded border shadow-md">
            These are the cards on your feed can be for you or following
          </div>
          <div className="h-40 w-[90%] rounded border shadow-md">
            These are the cards on your feed can be for you or following
          </div>
          <div className="h-40 w-[90%] rounded border shadow-md">
            These are the cards on your feed can be for you or following
          </div>
          <div className="h-40 w-[90%] rounded border shadow-md">
            These are the cards on your feed can be for you or following
          </div>
        </div>
      </body>
    </>
  );
}
