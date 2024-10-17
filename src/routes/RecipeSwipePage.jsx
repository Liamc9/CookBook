// IMPORTS
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For accessing docId from URL
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Import Firestore configuration
import RecipeSwipeComponent from '../components/RecipeSwipeComponent';

// CREATE FUNCTION
export default function RecipeSwipePage() {
  // STATE VARIABLES
  const { docId } = useParams(); // Get docId from URL
  const [recipe, setRecipe] = useState(null); // State to hold fetched recipe
  const [loading, setLoading] = useState(true); // State to manage loading

  // useEffect to fetch recipe from Firestore
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeDocRef = doc(db, 'recipes', docId); // Firestore reference
        const recipeDoc = await getDoc(recipeDocRef); // Fetch document

        if (recipeDoc.exists()) {
          setRecipe(recipeDoc.data()); // Set recipe state with fetched data
        } else {
          console.error('Recipe not found!');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    if (docId) {
      fetchRecipe();
    }
  }, [docId]);

  // HTML
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        {loading ? (
          <div>Loading recipe...</div> // Loading state
        ) : recipe ? (
          <div className="w-full h-full max-w-screen-md">
            <RecipeSwipeComponent recipe={recipe} /> {/* Pass fetched recipe to component */}
          </div>
        ) : (
          <div>Recipe not found</div> // Fallback if no recipe is found
        )}
      </div>
    </>
  );
}
