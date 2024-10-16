// CookbookPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase-config"; // Adjust the import path as needed
import CookbookCard from "../components/CookbookCard"; // Import your CookbookCard component

export default function CookbookPage() {
  const { cookbookId } = useParams(); // Get the cookbook ID from the URL
  const [cookbookData, setCookbookData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCookbookData = async () => {
      if (!cookbookId) return;

      const cookbookDocRef = doc(db, "cookbooks", cookbookId);
      try {
        const cookbookDoc = await getDoc(cookbookDocRef);
        if (cookbookDoc.exists()) {
          setCookbookData({ id: cookbookDoc.id, ...cookbookDoc.data() });
        } else {
          console.error("No such cookbook found!");
        }
      } catch (error) {
        console.error("Error fetching cookbook data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCookbookData();
  }, [cookbookId]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!cookbookData || !cookbookData.recipes || cookbookData.recipes.length === 0) return;

      const recipesRef = collection(db, "recipes");
      const recipesQuery = query(recipesRef, where("__name__", "in", cookbookData.recipes));

      try {
        const recipeDocs = await getDocs(recipesQuery);
        const fetchedRecipes = recipeDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    fetchRecipes();
  }, [cookbookData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cookbookData) {
    return <div>Cookbook not found.</div>;
  }

  console.log("Cookbook Data:", cookbookData);
  console.log("Recipes:", recipes);

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      {/* Cookbook Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{cookbookData.title}</h1>
        <p className="text-gray-700 mb-2">
          <strong>Cuisine:</strong> {cookbookData.cuisine}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Chef:</strong> {cookbookData.chef}
        </p>
        {cookbookData.imageUrl && (
          <img
            src={cookbookData.imageUrl}
            alt={cookbookData.title}
            className="w-full h-64 object-cover rounded"
          />
        )}
      </div>

      {/* Recipes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <CookbookCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
