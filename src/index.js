import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from './routes/root'
import Signup from './routes/signup'
import Login from './routes/login'
import Feed from './routes/feed'
import CreatorsPage from './routes/creatorspage'
import Search from './routes/search'
import Mycookbook from './routes/mycookbook'
import Profile from './routes/profile'
import Subscribinglist from './routes/subscribinglist'
import Addrecipe from './routes/addrecipe'
import Recipe from './routes/recipepage'
import ImageGallery from './routes/imagepage'
import VideoGallery from './routes/videopage'
import Videoscroll from './routes/videoscroll'

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
                path: 'search',
                element: <Search />,
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
                path: "recipe",
                element: <Recipe />,
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
        ],
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
