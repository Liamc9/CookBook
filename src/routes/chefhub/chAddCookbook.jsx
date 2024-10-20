// IMPORTS
import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CookbookCard } from 'liamc9npm';
import './chAddCookbook.css';

export default function AddCookbook() {
    const [cuisine, setCuisine] = useState('');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [chef, setChef] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [addedRecipes, setAddedRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setChef(user.displayName || ''); // Set the chef name from the logged-in user's display name
        }
    }, []);

    const handleAddCookbook = async () => {
        try {
            const db = getFirestore();
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error('No user is logged in');
            }

            // Reference to the 'cookbooks' collection
            const cookbooksCollectionRef = collection(db, 'cookbooks');
            // Add a new cookbook document to the collection
            const cookbookDocRef = await addDoc(cookbooksCollectionRef, {
                cuisine,
                title,
                imageUrl,
                chef,
                recipes: addedRecipes.map(recipe => recipe.id),
            });
            console.log('Cookbook added successfully');

            // Add the new cookbook ID to the user's cookbooks array
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                cookbooks: arrayUnion(cookbookDocRef.id),
            });
            console.log('Cookbook ID added to user document');

            // Navigate back to the cookbooks page
            navigate('/chefhub/cookbooks');
        } catch (error) {
            console.error('Error adding cookbook:', error);
        }
    };

    const handleAddRecipe = async () => {
        try {
            const db = getFirestore();
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error('No user is logged in');
            }

            // Get user document
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const userRecipes = userData.recipes || [];
                const recipeId = prompt('Enter Recipe ID to add:');

                if (userRecipes.includes(recipeId)) {
                    // Add recipe to the addedRecipes array
                    const recipeDocRef = doc(db, 'recipes', recipeId);
                    const recipeDocSnap = await getDoc(recipeDocRef);
                    if (recipeDocSnap.exists()) {
                        const recipeData = recipeDocSnap.data();
                        setAddedRecipes(prevRecipes => [...prevRecipes, { id: recipeId, title: recipeData.title }]);
                    } else {
                        console.error('Recipe not found');
                    }
                } else {
                    console.error('Recipe ID not found in user recipes');
                }
            }
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    // HTML
    return (
        <div className="add-cookbook-container">
            <h2>Add New Cookbook</h2>
            {/* Preview of the CookbookCard as the user types */}
            <div className="cookbook-preview">
                <h3>Cookbook Preview</h3>
                <CookbookCard cookbook={{ cuisine, title, imageUrl, chef, numberOfRecipes: addedRecipes.length }} />
            </div>
            <div className="input-group">
                <label>Cuisine:</label>
                <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="Enter cuisine type"
                />
            </div>
            <div className="input-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter cookbook title"
                />
            </div>
            <div className="input-group">
                <label>Image URL:</label>
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                />
            </div>
            <button className="add-cookbook-button" onClick={handleAddCookbook}>Add Cookbook</button>

            {/* Recipes Section */}
            <div className="recipes-section">
                <h3>Recipes</h3>
                <button className="add-recipe-button" onClick={handleAddRecipe}>Add Recipe</button>
                <ul className="recipes-list">
                    {addedRecipes.map(recipe => (
                        <li key={recipe.id}>{recipe.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
