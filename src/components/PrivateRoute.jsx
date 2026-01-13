import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function PrivateRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) { // Wait for auth check
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
            </div>
        );
    }

    return currentUser ? children : <Navigate to="/login" />;
}
