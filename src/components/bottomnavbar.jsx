// IMPORTS
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faPlusSquare, faBookOpen, faUser } from '@fortawesome/free-solid-svg-icons';

// CREATE FUNCTION
export default function BottomNavbar() {
   
    // HTML
    return (
        <>
            <head></head>
            <body>
            <div className="fixed inset-x-0 bottom-0 bg-white shadow-md z-30">
            <hr></hr>
            <div className="flex text-sm">
                <Link to="/feed" className="tab flex-1 text-center p-2 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faHome} /> Feed
                </Link>
                <Link to="/subscribing" className="tab flex-1 text-center p-2 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faNewspaper} /> Subscribing
                </Link>
                <Link to="/addrecipe" className="tab flex-1 text-center p-2 text-gray-500 hover:text-custom-brown text-4xl hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faPlusSquare} />
                </Link>
                <Link to="/mycookbook" className="tab flex-1 text-center p-2 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faBookOpen} /> My Cookbook
                </Link>
                <Link to="/profile" className="tab flex-1 text-center p-2 text-gray-700 hover:text-custom-brown hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
            </div>
        </div>
            </body>
        </>
    )
}
