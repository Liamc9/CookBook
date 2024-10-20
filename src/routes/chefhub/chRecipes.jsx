// IMPORTS
import { useState, useEffect } from 'react'
import { RecipeCard } from 'liamc9npm'
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import './chRecipes.css';

export default function ChRecipes() {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            // Initialize Firestore and Auth instances
            console.log('Initializing Firestore and Auth instances');
            const db = getFirestore();
            const auth = getAuth();
            const user = auth.currentUser; // Get the currently logged-in user

            if (user) {
                console.log('User is logged in:', user.uid);
                try {
                    // Get user document reference from Firestore
                    console.log('Fetching user document from Firestore');
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef); // Fetch the user document snapshot

                    if (userDocSnap.exists()) {
                        console.log('User document exists');
                        // Extract user data from the document snapshot
                        const userData = userDocSnap.data();
                        console.log('User data:', userData);

                        // Get the array of recipe IDs from user data, default to empty array if not present
                        const recipeIds = userData.recipes || [];
                        console.log('Recipe IDs:', recipeIds);

                        // Reference to the 'recipes' collection
                        const recipesCollectionRef = collection(db, 'recipes');
                        // Create an array of promises to fetch each recipe document by its ID
                        console.log('Fetching recipes from Firestore');
                        const recipePromises = recipeIds.map(id => getDoc(doc(recipesCollectionRef, id)));
                        // Wait for all recipe documents to be fetched
                        const recipeDocs = await Promise.all(recipePromises);
                        console.log('Fetched recipe documents:', recipeDocs);

                        // Extract data from each document and add its ID
                        const recipeData = recipeDocs.map(doc => ({ id: doc.id, ...doc.data() }));
                        console.log('Recipe data:', recipeData);

                        // Update state with the fetched recipes
                        setRecipes(recipeData);
                    } else {
                        console.log('User document does not exist');
                    }
                } catch (error) {
                    // Log any errors that occur during the fetch process
                    console.error('Error fetching recipes:', error);
                }
            } else {
                console.log('No user is logged in');
            }
        };

        // Call the function to fetch recipes when the component mounts
        console.log('Calling fetchRecipes');
        fetchRecipes();
    }, []);

    // HTML
    return (
        <div className="ch-recipes-container">
            {/* Add Recipe Button */}
            <div className="add-recipe-button">
                <button onClick={() => navigate('/chefhub/recipes/addrecipe')}>Add Recipe</button>
            </div>
            
            {/* Render a RecipeCard component for each recipe in the state */}
            <div className="recipe-cards">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    )
}
