// Inicializador global de indicadores Firebase
import FirebaseConnectionMonitor from './firebase-connection-monitor.js';
import SyncStatusIndicator from './sync-status-indicator.js';

// Inicializar indicadores globales
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no están ya inicializados
    if (!window.firebaseConnectionMonitor) {
        window.firebaseConnectionMonitor = new FirebaseConnectionMonitor();
    }
    
    if (!window.syncIndicator) {
        window.syncIndicator = new SyncStatusIndicator();
    }
    
    console.log('🔥 Indicadores Firebase inicializados');
});

// Exportar para uso en otros módulos
export { FirebaseConnectionMonitor, SyncStatusIndicator };
