import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faUser } from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function BottomNavbar() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });
        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="fixed inset-x-0 bottom-0 bg-white shadow-md z-30 border-t border-gray-300">
            <div className="flex justify-around text-sm py-3">
                <Link to="/feed" className="flex-1 text-center text-gray-500 hover:text-custom-brown transition duration-300 ease-in-out">
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faHome} size="lg" />
                        <span className="mt-1">Feed</span>
                    </div>
                </Link>
                <Link to="/subscribing" className="flex-1 text-center text-gray-500 hover:text-custom-brown transition duration-300 ease-in-out">
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faNewspaper} size="lg" />
                        <span className="mt-1">Subscribing</span>
                    </div>
                </Link>
               
                    <Link to={`/more`} className="flex-1 text-center text-gray-500 hover:text-custom-brown transition duration-300 ease-in-out">
                        <div className="flex flex-col items-center">
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <span className="mt-1">More</span>
                        </div>
                    </Link>
               
            </div>
        </div>
    );
}
