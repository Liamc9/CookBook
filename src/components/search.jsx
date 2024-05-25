// IMPORTS
import { useState, useEffect } from "react";



// CREATE FUNCTION
export default function Search() {
  // STATE VARIABLES
  const [searchQuery, setSearchQuery] = useState("");

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
          className="w-full rounded-lg bg-white p-4 shadow-md"
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
       
      </body>
    </>
  );
}
