// IMPORTS
import { useState, useEffect } from 'react'
import { CookbookCard } from 'liamc9npm'
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import './chCookbooks.css';

export default function ChCookbooks() {
    const [cookbooks, setCookbooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCookbooks = async () => {
            // Initialize Firestore and Auth instances
            console.log('Initializing Firestore and Auth instances');
            const db = getFirestore();
            const auth = getAuth();
            const user = auth.currentUser; // Get the currently logged-in user

            if (user) {
                console.log('User is logged in:', user.uid);
                try {
                    // Get user document reference from Firestore
                    console.log('Fetching user document from Firestore');
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef); // Fetch the user document snapshot

                    if (userDocSnap.exists()) {
                        console.log('User document exists');
                        // Extract user data from the document snapshot
                        const userData = userDocSnap.data();
                        console.log('User data:', userData);

                        // Get the array of cookbook IDs from user data, default to empty array if not present
                        const cookbookIds = userData.cookbooks || [];
                        console.log('Cookbook IDs:', cookbookIds);

                        // Reference to the 'cookbooks' collection
                        const cookbooksCollectionRef = collection(db, 'cookbooks');
                        // Create an array of promises to fetch each cookbook document by its ID
                        console.log('Fetching cookbooks from Firestore');
                        const cookbookPromises = cookbookIds.map(id => getDoc(doc(cookbooksCollectionRef, id)));
                        // Wait for all cookbook documents to be fetched
                        const cookbookDocs = await Promise.all(cookbookPromises);
                        console.log('Fetched cookbook documents:', cookbookDocs);

                        // Extract data from each document and add its ID
                        const cookbookData = cookbookDocs.map(doc => ({ id: doc.id, ...doc.data() }));
                        console.log('Cookbook data:', cookbookData);

                        // Update state with the fetched cookbooks
                        setCookbooks(cookbookData);
                    } else {
                        console.log('User document does not exist');
                    }
                } catch (error) {
                    // Log any errors that occur during the fetch process
                    console.error('Error fetching cookbooks:', error);
                }
            } else {
                console.log('No user is logged in');
            }
        };

        // Call the function to fetch cookbooks when the component mounts
        console.log('Calling fetchCookbooks');
        fetchCookbooks();
    }, []);

    // HTML
    return (
        <div className="ch-cookbooks-container">
            {/* Add Cookbook Button */}
            <div className="add-cookbook-button">
                <button onClick={() => navigate('/chefhub/cookbooks/addcookbook')}>Add Cookbook</button>
            </div>
            
            {/* Render a CookbookCard component for each cookbook in the state */}
            <div className="cookbook-cards">
                {cookbooks.map(cookbook => (
                    <CookbookCard key={cookbook.id} cookbook={cookbook} />
                ))}
            </div>
        </div>
    )
}