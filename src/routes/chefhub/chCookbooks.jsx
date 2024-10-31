import { useState, useEffect } from 'react';
import { CookbookCard } from 'liamc9npm';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
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

const Title = styled.h1`
  font-size: 2rem;
`;

const AddCookbookButton = styled.div`
  button {
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
  }
`;

const CookbookCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

export default function ChCookbooks() {
  const [cookbooks, setCookbooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCookbooks = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const cookbookIds = userData.cookbooks || [];
            const cookbooksCollectionRef = collection(db, 'cookbooks');
            const cookbookPromises = cookbookIds.map(id => getDoc(doc(cookbooksCollectionRef, id)));
            const cookbookDocs = await Promise.all(cookbookPromises);
            const cookbookData = cookbookDocs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCookbooks(cookbookData);
          }
        } catch (error) {
          console.error('Error fetching cookbooks:', error);
        }
      }
    };

    fetchCookbooks();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Cookbooks</Title>
        <AddCookbookButton>
          <button onClick={() => navigate('/chefhub/cookbooks/addcookbook')}>Add Cookbook</button>
        </AddCookbookButton>
      </Header>
      <CookbookCards>
        {cookbooks.map(cookbook => (
          <CookbookCard key={cookbook.id} cookbook={cookbook} />
        ))}
      </CookbookCards>
    </Container>
  );
}