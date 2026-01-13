import React from 'react';
import { issueService } from '../services/issueService';
import { isValidStatusTransition } from '../utils/issueUtils';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const PRIORITY_COLORS = {
    Low: 'bg-blue-50 text-blue-700',
    Medium: 'bg-orange-50 text-orange-700',
    High: 'bg-red-50 text-red-700'
};

const STATUS_COLORS = {
    'Open': 'bg-gray-100 text-gray-700 border-gray-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Done': 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

/**
 * Display component for a single issue.
 * Handles status updates and visualizes priority/status.
 * 
 * @param {Object} props
 * @param {Object} props.issue - The issue data object
 */
export default function IssueCard({ issue }) {

    async function handleStatusChange(e) {
        const newStatus = e.target.value;

        // Validate transition
        if (!isValidStatusTransition(issue.status, newStatus)) {
            toast.error('Please move this issue to In Progress before marking it Done.', {
                icon: '🚫'
            });
            // Reset select (force re-render or simply ignore, React defaultChecked tricky)
            e.target.value = issue.status;
            return;
        }

        try {
            await issueService.updateStatus(issue.id, newStatus);
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
                <span className={clsx(
                    'px-2.5 py-0.5 rounded-full text-xs font-medium',
                    PRIORITY_COLORS[issue.priority] || 'bg-gray-100 text-gray-700'
                )}>
                    {issue.priority}
                </span>
                <select
                    className={clsx(
                        'px-3 py-1 text-xs font-medium rounded-full border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500',
                        STATUS_COLORS[issue.status]
                    )}
                    value={issue.status}
                    onChange={handleStatusChange}
                >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center" title="Assigned To">
                        <User className="h-3.5 w-3.5 mr-1.5" />
                        <span className="truncate max-w-[100px]">{issue.assignedTo}</span>
                    </div>
                    <div className="flex items-center" title="Created At">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>{issue.createdAt ? formatDistanceToNow(issue.createdAt, { addSuffix: true }) : 'Just now'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
