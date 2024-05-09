// IMPORTS
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

// CREATE FUNCTION
export default function ExampleComponent() {
    // STATE VAIRABLES
    const [state, setState] = useState(0)

    // JAVASCRIPT LOGIC
    useEffect(() => {
        setState(state + 1)
    }, [])

    // HTML
    return (
        <>
            <head></head>
            <body>
            <div className="fixed inset-x-0 bottom-0 bg-white shadow-md">
            <hr></hr>
            <div className="flex justify-between max-w-md mx-auto">
                <Link to="/feed" className="tab flex-1 text-center p-4 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    Feed
                </Link>
                <Link to="/subscribing" className="tab flex-1 text-center p-4 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    Subscribing
                </Link>
                <Link to="/addrecipe" className="tab flex-1 text-center p-4 text-gray-500 hover:text-custom-brown text-4xl hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faPlusSquare} />
                </Link>
                <Link to="/mycookbook" className="tab flex-1 text-center p-4 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    My Cookbook
                </Link>
                <Link to="/profile" className="tab flex-1 text-center p-4 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    Profile
                </Link>
            </div>
        </div>
            </body>
        </>
    )
}