// Sistema de Diagnóstico y Guardado Firebase
class FirebaseManager {
    constructor() {
        this.isReady = false;
        this.database = null;
        this.connectionStatus = false;
        this.init();
    }
    
    init() {
        console.log('🔍 Iniciando diagnóstico Firebase...');
        
        // Verificar si Firebase está cargado
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK no está cargado');
            return;
        }
        
        console.log('✅ Firebase SDK cargado');
        
        // Verificar si está inicializado
        if (firebase.apps.length === 0) {
            console.error('❌ Firebase no está inicializado');
            return;
        }
        
        console.log('✅ Firebase inicializado');
        
        // Inicializar Database
        try {
            this.database = firebase.database();
            this.isReady = true;
            console.log('✅ Database conectada');
            
            // Monitorear conexión
            this.database.ref('.info/connected').on('value', (snapshot) => {
                this.connectionStatus = snapshot.val() === true;
                console.log(`🔥 Estado conexión: ${this.connectionStatus ? 'CONECTADO' : 'DESCONECTADO'}`);
            });
            
        } catch (error) {
            console.error('❌ Error conectando Database:', error);
        }
    }
    
    // Guardar datos de página
    savePage(pageData) {
        return new Promise((resolve, reject) => {
            if (!this.isReady || !this.connectionStatus) {
                reject(new Error('Firebase no está disponible'));
                return;
            }
            
            const saveData = {
                ...pageData,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                saved_at: new Date().toISOString()
            };
            
            this.database.ref('page-edits').push(saveData)
                .then((ref) => {
                    console.log('✅ Guardado en Firebase:', ref.key);
                    resolve(ref.key);
                })
                .catch((error) => {
                    console.error('❌ Error guardando:', error);
                    reject(error);
                });
        });
    }
    
    // Guardar mensaje de contacto
    saveContact(contactData) {
        return new Promise((resolve, reject) => {
            if (!this.isReady || !this.connectionStatus) {
                reject(new Error('Firebase no está disponible'));
                return;
            }
            
            const saveData = {
                ...contactData,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                received_at: new Date().toISOString()
            };
            
            this.database.ref('contact-messages').push(saveData)
                .then((ref) => {
                    console.log('✅ Mensaje guardado:', ref.key);
                    resolve(ref.key);
                })
                .catch((error) => {
                    console.error('❌ Error guardando mensaje:', error);
                    reject(error);
                });
        });
    }
    
    // Obtener datos guardados
    getPageData() {
        return new Promise((resolve, reject) => {
            if (!this.isReady || !this.connectionStatus) {
                reject(new Error('Firebase no está disponible'));
                return;
            }
            
            this.database.ref('page-edits').orderByChild('timestamp').limitToLast(10).once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
                    console.log('📄 Datos recuperados:', data);
                    resolve(data);
                })
                .catch((error) => {
                    console.error('❌ Error recuperando datos:', error);
                    reject(error);
                });
        });
    }
    
    // Test de conectividad
    testConnection() {
        return new Promise((resolve, reject) => {
            if (!this.isReady) {
                reject(new Error('Firebase no está inicializado'));
                return;
            }
            
            const testData = {
                test: 'connection_test',
                timestamp: Date.now()
            };
            
            this.database.ref('test-connection').set(testData)
                .then(() => {
                    console.log('✅ Test de conexión exitoso');
                    resolve(true);
                })
                .catch((error) => {
                    console.error('❌ Test de conexión fallido:', error);
                    reject(error);
                });
        });
    }
    
    // Obtener estado
    getStatus() {
        return {
            isReady: this.isReady,
            connectionStatus: this.connectionStatus,
            hasDatabase: this.database !== null
        };
    }
}

// Inicializar manager cuando el DOM esté listo
let firebaseManager;
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que Firebase se inicialice
    setTimeout(() => {
        firebaseManager = new FirebaseManager();
        
        // Hacer disponible globalmente
        window.firebaseManager = firebaseManager;
        
        // Test automático después de 2 segundos
        setTimeout(() => {
            firebaseManager.testConnection()
                .then(() => {
                    console.log('🎉 Sistema Firebase listo para usar');
                })
                .catch((error) => {
                    console.warn('⚠️ Firebase no disponible:', error.message);
                });
        }, 2000);
    }, 1000);
});
