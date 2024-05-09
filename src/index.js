import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from './routes/root'
import ExampleRoute from './routes/exampleRoute'

const router = createBrowserRouter([
    {
        path: '',
        element: <Root />,
        children: [
            {
                index: true, // This makes it the default route for the parent path
                element: <Navigate to="/search" replace />, // Redirect to /search
            },
            {
                path: 'search',
                element: <ExampleRoute />,
            },
            {
                path: 'login',
                element: <ExampleRoute />,
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
