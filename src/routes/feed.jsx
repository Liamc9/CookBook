// IMPORTS
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import CookbookCard from '../components/CookbookCard'


// CREATE FUNCTION
export default function Feed() {
  // STATE VARIABLES
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipeData] = useState([]);

 
    
    
      useEffect(() => {
        const fetchRecipeData = async () => {
          const querySnapshot = await getDocs(collection(db, 'recipes'));
          let fetchedRecipes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRecipeData(fetchedRecipes);
        };
        fetchRecipeData();
      }, []);
    

  return (
    <>
      <head></head>
      <body className="flex flex-col justify-center items-center my-20">
        <div className="flex items-center ">
          {loading ? (
            <p>Loading videos...</p>
          ) : (
            <div className="flex flex-col gap-4 ">
              {recipe.map((recipe) => (
                <CookbookCard recipe={recipe} key={recipe.id} />
              ))
              }
              
            </div>
          )}
        </div>
      </body>
    </>
  );
}
