// Firebase Connection Status Monitor
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from './firebase-config.js';

class FirebaseConnectionMonitor {
    constructor() {
        this.isOnline = navigator.onLine;
        this.isFirebaseConnected = false;
        this.statusIndicator = null;
        this.init();
    }

    init() {
        this.createStatusIndicator();
        this.setupEventListeners();
        this.monitorFirebaseConnection();
        this.checkInitialConnection();
    }

    createStatusIndicator() {
        // Crear el indicador de estado
        const indicator = document.createElement('div');
        indicator.id = 'firebase-status-indicator';
        indicator.innerHTML = `
            <div class="status-icon">
                <span class="icon">🔥</span>
                <span class="status-text">Conectando...</span>
            </div>
            <div class="status-tooltip">
                <span id="connection-status">Verificando conexión...</span>
            </div>
        `;

        // Estilos CSS
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 8px 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
        `;

        // Estilos para el contenido
        const style = document.createElement('style');
        style.textContent = `
            #firebase-status-indicator .status-icon {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            #firebase-status-indicator .icon {
                font-size: 16px;
                transition: all 0.3s ease;
            }

            #firebase-status-indicator .status-text {
                font-size: 12px;
                transition: all 0.3s ease;
            }

            #firebase-status-indicator .status-tooltip {
                position: absolute;
                bottom: -35px;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 8px;
                border-radius: 6px;
                font-size: 11px;
                text-align: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                pointer-events: none;
            }

            #firebase-status-indicator:hover .status-tooltip {
                opacity: 1;
                visibility: visible;
            }

            /* Estados */
            #firebase-status-indicator.connected {
                background: rgba(16, 185, 129, 0.1);
                border-color: rgba(16, 185, 129, 0.3);
                color: #10b981;
            }

            #firebase-status-indicator.disconnected {
                background: rgba(239, 68, 68, 0.1);
                border-color: rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }

            #firebase-status-indicator.connecting {
                background: rgba(59, 130, 246, 0.1);
                border-color: rgba(59, 130, 246, 0.3);
                color: #3b82f6;
            }

            #firebase-status-indicator.connected .icon {
                animation: pulse 2s infinite;
            }

            #firebase-status-indicator.connecting .icon {
                animation: spin 1s linear infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Responsive */
            @media (max-width: 768px) {
                #firebase-status-indicator {
                    top: 10px;
                    left: 10px;
                    font-size: 12px;
                    padding: 6px 8px;
                    min-width: 100px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(indicator);
        this.statusIndicator = indicator;
    }

    setupEventListeners() {
        // Escuchar cambios en la conexión a internet
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.checkFirebaseConnection();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateStatus('disconnected', 'Sin conexión', 'No hay conexión a internet');
        });

        // Click en el indicador para mostrar más información
        if (this.statusIndicator) {
            this.statusIndicator.addEventListener('click', () => {
                this.showConnectionInfo();
            });
        }
    }

    async checkInitialConnection() {
        await this.checkFirebaseConnection();
    }

    async checkFirebaseConnection() {
        if (!this.isOnline) {
            this.updateStatus('disconnected', 'Sin conexión', 'No hay conexión a internet');
            return;
        }

        this.updateStatus('connecting', 'Conectando...', 'Verificando conexión con Firebase');

        try {
            // Intentar una operación simple en Firestore
            const testDoc = await db._delegate._databaseId;
            if (testDoc) {
                this.isFirebaseConnected = true;
                this.updateStatus('connected', 'Conectado', 'Conectado a Firebase');
            }
        } catch (error) {
            console.error('Error conectando a Firebase:', error);
            this.isFirebaseConnected = false;
            this.updateStatus('disconnected', 'Error', 'Error conectando a Firebase');
        }
    }

    monitorFirebaseConnection() {
        // Verificar conexión cada 30 segundos
        setInterval(() => {
            if (this.isOnline) {
                this.checkFirebaseConnection();
            }
        }, 30000);

        // Verificar conexión cuando la ventana vuelve a ser visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isOnline) {
                this.checkFirebaseConnection();
            }
        });
    }

    updateStatus(status, text, tooltip) {
        if (!this.statusIndicator) return;

        const statusText = this.statusIndicator.querySelector('.status-text');
        const statusTooltip = this.statusIndicator.querySelector('#connection-status');

        // Actualizar clases
        this.statusIndicator.className = '';
        this.statusIndicator.classList.add(status);

        // Actualizar texto
        if (statusText) statusText.textContent = text;
        if (statusTooltip) statusTooltip.textContent = tooltip;

        // Actualizar icono según el estado
        const icon = this.statusIndicator.querySelector('.icon');
        if (icon) {
            switch (status) {
                case 'connected':
                    icon.textContent = '🔥';
                    break;
                case 'connecting':
                    icon.textContent = '⚡';
                    break;
                case 'disconnected':
                    icon.textContent = '❌';
                    break;
                default:
                    icon.textContent = '🔥';
            }
        }

        // Vibrar en dispositivos móviles si cambia el estado
        if ('vibrate' in navigator && this.previousStatus !== status) {
            navigator.vibrate(50);
        }
        
        this.previousStatus = status;
    }

    showConnectionInfo() {
        const info = `
📊 Estado de la conexión:
• Internet: ${this.isOnline ? '✅ Conectado' : '❌ Desconectado'}
• Firebase: ${this.isFirebaseConnected ? '✅ Conectado' : '❌ Desconectado'}
• Última verificación: ${new Date().toLocaleTimeString()}
• Navegador: ${navigator.onLine ? 'Online' : 'Offline'}
        `;

        // Mostrar en consola
        console.log(info);

        // Crear notificación temporal
        this.showNotification(
            this.isFirebaseConnected ? 'Firebase conectado correctamente' : 'Problemas de conexión con Firebase',
            this.isFirebaseConnected ? 'success' : 'warning'
        );
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `firebase-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            font-family: 'Inter', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Método público para forzar verificación
    forceCheck() {
        this.checkFirebaseConnection();
    }

    // Método para ocultar/mostrar el indicador
    toggle(show = true) {
        if (this.statusIndicator) {
            this.statusIndicator.style.display = show ? 'block' : 'none';
        }
    }
}

export default FirebaseConnectionMonitor;
