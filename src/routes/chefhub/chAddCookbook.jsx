// IMPORTS
import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CookbookCard, Input } from 'liamc9npm';
import { ChevronLeftIcon } from '../../assets/Icons';
import styled from 'styled-components';

// STYLED COMPONENTS
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 0;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const PageTitle = styled.h2`
    font-size: 30px;
    font-weight: 500;
`;

const AddCookbookContainer = styled.div`
    padding: 20px;
    max-width: 600px;
    margin-bottom: 100px;
    border-radius: 10px;
`;

const CookbookPreview = styled.div`
    margin-bottom: 30px;
`;

const InputGroup = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`;

const AddCookbookButton = styled.button`
    padding: 10px 20px;
    background-color: #B08B5B;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

const RecipesSection = styled.div`
    margin-top: 20px;
    padding: 10px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    position: relative;
`;

const AddRecipeButton = styled.button`
    padding: 10px 20px;
    background-color: #000000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: absolute;
    top: 10px;
    right: 10px;

    &:hover {
        background-color: #1976D2;
    }
`;

const RecipesList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-top: 50px;
`;

const RecipeItem = styled.li`
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
        border-bottom: none;
    }
`;

const StickyBanner = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    padding: 15px;
    display: flex;
    justify-content: end;
    align-items: center;
    z-index: 1000;
`;

// COMPONENT
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
        <>
            <Header>
                <BackButton onClick={() => navigate(-1)}><ChevronLeftIcon className='w-6 h-6'/></BackButton>
                <PageTitle>Add Cookbook</PageTitle>
            </Header>
            <AddCookbookContainer>
                <CookbookPreview>
                    <CookbookCard cookbook={{ cuisine, title, imageUrl, chef, numberOfRecipes: addedRecipes.length }} />
                </CookbookPreview>
                <InputGroup>
                    <Input
                        type="text"
                        name='title'
                        value={title}
                        label='Title'
                        color='#B08B5B'
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Input
                        type="text"
                        name='cuisine'
                        value={cuisine}
                        label='Cuisine'
                        color='#B08B5B'
                        onChange={(e) => setCuisine(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Input
                        type="text"
                        name='imageurl'
                        value={imageUrl}
                        label='ImageUrl'
                        color='#B08B5B'
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </InputGroup>

                {/* Recipes Section */}
                <RecipesSection>
                    <h3>Recipes</h3>
                    <AddRecipeButton onClick={handleAddRecipe}>Add Recipe</AddRecipeButton>
                    <RecipesList>
                        {addedRecipes.map(recipe => (
                            <RecipeItem key={recipe.id}>{recipe.title}</RecipeItem>
                        ))}
                    </RecipesList>
                </RecipesSection>
            </AddCookbookContainer>

            <StickyBanner>
                <AddCookbookButton onClick={handleAddCookbook}>Add Cookbook</AddCookbookButton>
            </StickyBanner>
        </>
    );
}
