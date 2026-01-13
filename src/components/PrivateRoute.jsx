import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Higher-order component to protect routes that require authentication.
 * Redirects unauthenticated users to the Login page.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected component to render
 */
export default function PrivateRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // Show loading spinner while Firebase checks auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
            </div>
        );
    }

    return currentUser ? children : <Navigate to="/login" />;
}
