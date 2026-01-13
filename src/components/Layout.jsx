import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { userService } from '../services/userService';
import { useEffect } from 'react';

/**
 * Main application layout wrapper.
 * Provides the persistent navigation bar and handles user session synchronization.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content to display
 */
export default function Layout({ children }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Effect hook to ensure the current authenticated user exists in the Firestore 'users' collection.
     * This acts as a self-healing mechanism for older accounts created before the user directory was implemented.
     */
    useEffect(() => {
        if (currentUser) {
            userService.createUserDocument(currentUser.uid, currentUser.email)
                .catch(err => console.error("Failed to sync user to directory", err));
        }
    }, [currentUser]);

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to log out');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toaster position="top-right" />
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <LayoutDashboard className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">Smart Issue Board</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                                <User className="h-4 w-4 mr-2" />
                                {currentUser?.email}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
