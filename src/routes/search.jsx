import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Search() {
  // State variables
 

  // HTML
  return (
    <>
      <head>
        <title>Search Page</title>
      </head>
      <body>
        <div className="mt-14 flex min-h-screen flex-col items-center bg-gray-100">
          
          <p>Search for creators here and it links to their <Link to="/creatorspage">creators page</Link> </p>
        </div>
      </body>
    </>
  );
}
