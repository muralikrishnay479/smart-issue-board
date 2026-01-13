import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/issueService';
import { findSimilarIssues } from '../utils/issueUtils';
import { Plus, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CreateIssueForm({ existingIssues, onClose }) {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        assignedTo: ''
    });
    const [showWarning, setShowWarning] = useState(false);
    const [similarIssues, setSimilarIssues] = useState([]);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        // 1. Check for similar issues first
        if (!showWarning) {
            const similar = findSimilarIssues(formData.title, existingIssues);
            if (similar.length > 0) {
                setSimilarIssues(similar);
                setShowWarning(true);
                return;
            }
        }

        // 2. Proceed to create
        await createIssue();
    }

    async function createIssue() {
        try {
            setLoading(true);
            await issueService.createIssue({
                ...formData,
                createdBy: currentUser.email,
                assignedTo: formData.assignedTo || currentUser.email // Default to self if empty
            });
            toast.success('Issue created successfully!');
            setFormData({ title: '', description: '', priority: 'Medium', assignedTo: '' });
            onClose(); // Close modal/form
        } catch (error) {
            console.error(error);
            toast.error('Failed to create issue');
        } finally {
            setLoading(false);
            setShowWarning(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Issue</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
                    >
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-800">Similar Issues Detected</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                    We found existing issues with similar titles. Are you sure you want to continue?
                                </p>
                                <ul className="mt-2 text-sm text-amber-800 list-disc list-inside">
                                    {similarIssues.map((issue) => (
                                        <li key={issue.id}>{issue.title}</li>
                                    ))}
                                </ul>
                                <div className="mt-3 flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={createIssue}
                                        className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-amber-200"
                                    >
                                        Yes, Create Anyway
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowWarning(false)}
                                        className="text-amber-700 hover:text-amber-900 text-sm font-medium px-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Fix login button"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        required
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the issue..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (Email)</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="developer@example.com"
                            value={formData.assignedTo}
                            onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Issue'}
                    </button>
                </div>
            </form>
        </div>
    );
}
