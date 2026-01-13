import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'users';

/**
 * Service to handle user-related Firestore operations.
 */
export const userService = {
    /**
     * Creates or updates a user document in Firestore upon registration.
     * 
     * @param {string} uid - The Firebase Authentication User ID.
     * @param {string} email - The user's email address.
     * @returns {Promise<void>}
     */
    async createUserDocument(uid, email) {
        try {
            const userRef = doc(db, COLLECTION_NAME, uid);
            await setDoc(userRef, {
                email,
                createdAt: new Date()
            }, { merge: true });
        } catch (error) {
            console.error('Error creating user document:', error);
            throw error;
        }
    },

    /**
     * Retrieves all registered users from the 'users' collection.
     * Used for the "Assigned To" autocomplete feature.
     * 
     * @returns {Promise<Array<{uid: string, email: string}>>} List of user objects.
     */
    async getAllUsers() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('email'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
};

