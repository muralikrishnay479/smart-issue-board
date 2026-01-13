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

export const issueService = {
    // Add new issue
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

    // Get all issues (subscribe usually better, but for single fetch)
    async getAllIssues() {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // Subscribe to issues (Realtime)
    subscribeIssues(callback) {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const issues = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert timestamp to Date object if needed
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            callback(issues);
        });
    },

    // Update issue status
    async updateStatus(issueId, newStatus) {
        const issueRef = doc(db, COLLECTION_NAME, issueId);
        await updateDoc(issueRef, {
            status: newStatus
        });
    }
};
