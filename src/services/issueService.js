import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'issues';

/**
 * Service to handle Issue CRUD operations in Firestore.
 */
export const issueService = {
    /**
     * Creates a new issue in the Firestore 'issues' collection.
     * Initializes status to 'Open' and adds a server timestamp.
     *
     * @param {Object} issueData - The issue payload (title, description, etc.).
     * @returns {Promise<string>} The ID of the newly created document.
     */
    async createIssue(issueData) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...issueData,
                createdAt: serverTimestamp(),
                status: 'Open'
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding document: ', error);
            throw error;
        }
    },

    /**
     * Fetches all issues ordered by creation date (descending).
     * Note: Use subscribeIssues for real-time updates.
     *
     * @returns {Promise<Array<Object>>} List of issue documents.
     */
    async getAllIssues() {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    /**
     * Sets up a real-time listener for the 'issues' collection.
     * 
     * @param {Function} callback - Function to call with the updated list of issues.
     * @returns {Function} Unsubscribe function to clean up the listener.
     */
    subscribeIssues(callback) {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const issues = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            callback(issues);
        });
    },

    /**
     * Updates the status of a specific issue.
     * 
     * @param {string} issueId - The ID of the issue to update.
     * @param {string} newStatus - The new status ('Open', 'In Progress', 'Done').
     * @returns {Promise<void>}
     */
    async updateStatus(issueId, newStatus) {
        const issueRef = doc(db, COLLECTION_NAME, issueId);
        await updateDoc(issueRef, {
            status: newStatus
        });
    }
};
