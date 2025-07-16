// Firebase Database Service
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc,
    query,
    orderBy,
    onSnapshot,
    enableNetwork,
    disableNetwork,
    connectFirestoreEmulator
} from 'firebase/firestore';
import { db } from './firebase-config.js';

class FirebaseService {
    constructor() {
        this.resourcesCollection = 'resources';
        this.notesCollection = 'notes';
        this.isConnected = false;
        this.connectionListeners = [];
        this.setupConnectionMonitoring();
    }

    setupConnectionMonitoring() {
        // Verificar conexión inicial
        this.checkConnection();
        
        // Escuchar cambios de conexión
        window.addEventListener('online', () => {
            this.handleOnline();
        });
        
        window.addEventListener('offline', () => {
            this.handleOffline();
        });
    }

    async checkConnection() {
        try {
            // Intentar una operación simple para verificar conexión
            const testQuery = query(collection(db, this.resourcesCollection));
            await getDocs(testQuery);
            this.isConnected = true;
            this.notifyConnectionChange(true);
        } catch (error) {
            console.warn('Firebase connection check failed:', error);
            this.isConnected = false;
            this.notifyConnectionChange(false);
        }
    }

    async handleOnline() {
        try {
            await enableNetwork(db);
            this.isConnected = true;
            this.notifyConnectionChange(true);
            console.log('🔥 Firebase back online');
        } catch (error) {
            console.error('Error enabling Firebase network:', error);
        }
    }

    async handleOffline() {
        try {
            await disableNetwork(db);
            this.isConnected = false;
            this.notifyConnectionChange(false);
            console.log('⚠️ Firebase offline');
        } catch (error) {
            console.error('Error disabling Firebase network:', error);
        }
    }

    onConnectionChange(callback) {
        this.connectionListeners.push(callback);
    }

    notifyConnectionChange(isConnected) {
        this.connectionListeners.forEach(callback => callback(isConnected));
    }

    // RECURSOS
    async addResource(resource) {
        try {
            const docRef = await addDoc(collection(db, this.resourcesCollection), {
                title: resource.title,
                url: resource.url,
                description: resource.description,
                category: resource.category,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Recurso agregado con ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error agregando recurso: ', error);
            throw error;
        }
    }

    async getResources() {
        try {
            const q = query(collection(db, this.resourcesCollection), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const resources = [];
            
            querySnapshot.forEach((doc) => {
                resources.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return resources;
        } catch (error) {
            console.error('Error obteniendo recursos: ', error);
            throw error;
        }
    }

    async deleteResource(id) {
        try {
            await deleteDoc(doc(db, this.resourcesCollection, id));
            console.log('Recurso eliminado');
        } catch (error) {
            console.error('Error eliminando recurso: ', error);
            throw error;
        }
    }

    async updateResource(id, updates) {
        try {
            const resourceRef = doc(db, this.resourcesCollection, id);
            await updateDoc(resourceRef, {
                ...updates,
                updatedAt: new Date()
            });
            console.log('Recurso actualizado');
        } catch (error) {
            console.error('Error actualizando recurso: ', error);
            throw error;
        }
    }

    // NOTAS
    async addNote(note) {
        try {
            const docRef = await addDoc(collection(db, this.notesCollection), {
                title: note.title,
                content: note.content,
                category: note.category || 'general',
                tags: note.tags || [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Nota agregada con ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error agregando nota: ', error);
            throw error;
        }
    }

    async getNotes() {
        try {
            const q = query(collection(db, this.notesCollection), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const notes = [];
            
            querySnapshot.forEach((doc) => {
                notes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return notes;
        } catch (error) {
            console.error('Error obteniendo notas: ', error);
            throw error;
        }
    }

    async deleteNote(id) {
        try {
            await deleteDoc(doc(db, this.notesCollection, id));
            console.log('Nota eliminada');
        } catch (error) {
            console.error('Error eliminando nota: ', error);
            throw error;
        }
    }

    async updateNote(id, updates) {
        try {
            const noteRef = doc(db, this.notesCollection, id);
            await updateDoc(noteRef, {
                ...updates,
                updatedAt: new Date()
            });
            console.log('Nota actualizada');
        } catch (error) {
            console.error('Error actualizando nota: ', error);
            throw error;
        }
    }

    // TIEMPO REAL
    onResourcesUpdate(callback) {
        const q = query(collection(db, this.resourcesCollection), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
            const resources = [];
            querySnapshot.forEach((doc) => {
                resources.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(resources);
        });
    }

    onNotesUpdate(callback) {
        const q = query(collection(db, this.notesCollection), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
            const notes = [];
            querySnapshot.forEach((doc) => {
                notes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(notes);
        });
    }
}

export default FirebaseService;
