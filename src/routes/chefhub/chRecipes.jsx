import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RecipeCard } from 'liamc9npm';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ChRecipesContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
    font-weight: 700;
`;

const PageTitle = styled.h1`
  font-size: 2em;
  margin: 0;
`;

const AddRecipeButton = styled.button`
  padding: 10px 20px;      
  background-color: ${'var(--color-primary)'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${'var(--color-primary-dark)'};
  }
`;

const RecipeCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

export default function ChRecipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      console.log('Initializing Firestore and Auth instances');
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        console.log('User is logged in:', user.uid);
        try {
          console.log('Fetching user document from Firestore');
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            console.log('User document exists');
            const userData = userDocSnap.data();
            console.log('User data:', userData);

            const recipeIds = userData.recipes || [];
            console.log('Recipe IDs:', recipeIds);

            const recipesCollectionRef = collection(db, 'recipes');
            console.log('Fetching recipes from Firestore');
            const recipePromises = recipeIds.map(id => getDoc(doc(recipesCollectionRef, id)));
            const recipeDocs = await Promise.all(recipePromises);
            console.log('Fetched recipe documents:', recipeDocs);

            const recipeData = recipeDocs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Recipe data:', recipeData);

            setRecipes(recipeData);
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      } else {
        console.log('No user is logged in');
      }
    };

    console.log('Calling fetchRecipes');
    fetchRecipes();
  }, []);

  return (
    <ChRecipesContainer>
      <Header>
        <PageTitle>Recipes</PageTitle>
        <AddRecipeButton onClick={() => navigate('/chefhub/recipes/addnewrecipe')}>
          Add Recipe
        </AddRecipeButton>
      </Header>

      <RecipeCards>
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </RecipeCards>
    </ChRecipesContainer>
  );
}
