// AuthContext.js
import React, { createContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase-config';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider value={{ currentUser, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
