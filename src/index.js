import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from './routes/root'
import Signup from './routes/signup'
import Login from './routes/login'
import Feed from './routes/feed'
import CreatorsPage from './routes/creatorspage'
import Mycookbook from './routes/mycookbook'
import Profile from './routes/profile'
import Subscribinglist from './routes/subscribinglist'
import Addrecipe from './routes/addrecipe'
import ImageGallery from './routes/imagepage'
import VideoGallery from './routes/videopage'
import Videoscroll from './routes/videoscroll'
import Recipeviewer from './components/creatorcard'
import Chefcard from './components/chefcard'
import Editprofile from './routes/editprofile'

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
                path: 'signup',
                element: <Signup />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'feed',
                element: <Feed />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'mycookbook',
                element: <Mycookbook />,
            },
            {
                path: 'subscribing',
                element: <Subscribinglist />,
            },
            {
                path: 'addrecipe',
                element: <Addrecipe />,
            },
            {
                path: "creatorspage/:id",
                element: <CreatorsPage />,
              },
             
              {
                path: "imagegallery",
                element: <ImageGallery />,
              },
              {
                path: "videogallery",
                element: <VideoGallery />,
              },
              {
                path: "videoscroll",
                element: <Videoscroll />,
              },
              {
                path: "recipeviewer",
                element: <Recipeviewer />,
              },
              {
              path: "chefcard",
              element: <Chefcard />,
              },
              {
                path: "editprofile",
                element: <Editprofile />,
                },
        ],
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
