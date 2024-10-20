import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from './routes/root'
import Feed from './routes/feed'
import Profile from './routes/profile'
import Subscribinglist from './routes/subscribinglist'
import AddRecipe from './routes/addRecipe/addRecipe'
import Editprofile from './routes/editprofile'
import ChefSignup from './routes/chefSignup'
import CookbookPage from './routes/CookbookPage'
import RecipeSwipePage from './routes/RecipeSwipePage'
import ChCookbooks from './routes/chefhub/chCookbooks'
import ChAddCookbook from './routes/chefhub/chAddCookbook'
import ChDashboard from './routes/chefhub/chDashboard'
import ChRecipes from './routes/chefhub/chRecipes'
import LoginSignupPage from './routes/login'

const router = createBrowserRouter([
    {
        path: '',
        element: <Root />,
        children: [
            {
                index: true, // This makes it the default route for the parent path
                element: <Navigate to="/feed" replace />, // Redirect to /search
            },
            {
                path: 'login',
                element: <LoginSignupPage />,
            },
            {
                path: 'feed',
                element: <Feed />,
            },
            {
                path: '/profile/:userId',
                element: <Profile />,
            },
            {
                path: 'subscribing',
                element: <Subscribinglist />,
            },
            {
                path: 'addrecipe',
                element: <AddRecipe />,
            },
              {
                path: "editprofile",
                element: <Editprofile />,
                },
                {
                    path: "chefSignup",
                    element: <ChefSignup />,
                },
                {
                    path: '/cookbooks/:cookbookId',
                    element: <CookbookPage />,
                },
                {
                    path: '/recipeswipepage/:docId',
                    element: <RecipeSwipePage />,
                },
                {
                    path: '/chefhub/cookbooks',
                    element: <ChCookbooks />,
                },
                {
                    path: '/chefhub/cookbooks/addcookbook',
                    element: <ChAddCookbook />,
                },
                {
                    path: '/chefhub/recipes/addrecipe',
                    element: <AddRecipe />,
                },
                {
                    path: '/chefhub/recipes',
                    element: <ChRecipes />,
                },
                
                {
                    path: '/chefhub/dashboard',
                    element: <ChDashboard />,
                }
                
        ],
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
