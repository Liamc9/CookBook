import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { RecipeCard } from 'liamc9npm';
import Search from '../components/search'; // Import the Search component

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");

  // Fetch recipes on mount or when filterQuery changes
  useEffect(() => {
    const fetchRecipeData = async () => {
      setLoading(true);
      try {
        let q;
        const recipesRef = collection(db, "recipes");
        if (filterQuery.trim() === "") {
          q = recipesRef; // Fetch all recipes
        } else {
          q = query(
            recipesRef,
            where("title", ">=", filterQuery),
            where("title", "<=", filterQuery + '\uf8ff')
          ); // Search recipes by title
        }

        const querySnapshot = await getDocs(q);
        let fetchedRecipes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeData();
  }, [filterQuery]);

  // Handle the recipe search from the Search component
  const handleSearchRecipes = (query) => {
    setFilterQuery(query);
  };

  return (
    <>
      <head></head>
      <body className="flex flex-col justify-center items-center my-20">
        {/* Include the Search component */}
        <div className="px-10 pb-10 w-full">
        <Search onSearchRecipes={handleSearchRecipes} />
        </div>
        <div className="flex items-center ">
          {loading ? (
            <p>Loading recipes...</p>
          ) : (
            <div className="flex flex-col gap-4 ">
              {recipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe.id} />
              ))}
            </div>
          )}
        </div>
      </body>
    </>
  );
}
