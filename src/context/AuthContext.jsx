import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

/**
 * Custom hook to access the authentication context.
 * @returns {Object} The auth context value containing currentUser, login, signup, logout.
 */
export function useAuth() {
    return useContext(AuthContext);
}

/**
 * Provider component for Firebase Authentication.
 * Manages the global authentication state and exposes auth methods.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Registers a new user with email and password.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<UserCredential>}
     */
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    /**
     * Logs in an existing user.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<UserCredential>}
     */
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    /**
     * Logs out the current user.
     * @returns {Promise<void>}
     */
    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

