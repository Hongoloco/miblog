// Sync Status Indicator
class SyncStatusIndicator {
    constructor() {
        this.indicator = null;
        this.isVisible = false;
        this.syncQueue = [];
        this.createIndicator();
    }

    createIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'sync-indicator';
        indicator.innerHTML = `
            <span class="sync-icon">💾</span>
            <span class="sync-text">Guardado</span>
        `;
        
        document.body.appendChild(indicator);
        this.indicator = indicator;
    }

    show(message = 'Guardado', type = 'success') {
        if (!this.indicator) return;
        
        const icon = this.indicator.querySelector('.sync-icon');
        const text = this.indicator.querySelector('.sync-text');
        
        // Actualizar contenido
        text.textContent = message;
        
        // Actualizar icono según el tipo
        switch (type) {
            case 'syncing':
                icon.textContent = '🔄';
                break;
            case 'success':
                icon.textContent = '✅';
                break;
            case 'error':
                icon.textContent = '❌';
                break;
            default:
                icon.textContent = '💾';
        }
        
        // Actualizar clase
        this.indicator.className = `sync-indicator ${type} show`;
        this.isVisible = true;
        
        // Auto-ocultar después de 2 segundos (excepto para syncing)
        if (type !== 'syncing') {
            setTimeout(() => this.hide(), 2000);
        }
    }

    hide() {
        if (this.indicator) {
            this.indicator.classList.remove('show');
            this.isVisible = false;
        }
    }

    showSyncing() {
        this.show('Sincronizando...', 'syncing');
    }

    showSuccess(message = 'Guardado en la nube') {
        this.show(message, 'success');
    }

    showError(message = 'Error al guardar') {
        this.show(message, 'error');
    }

    // Método para agregar operaciones a la cola
    addToQueue(operation) {
        this.syncQueue.push(operation);
        if (this.syncQueue.length > 0) {
            this.showSyncing();
        }
    }

    // Método para remover operaciones de la cola
    removeFromQueue(operation) {
        const index = this.syncQueue.indexOf(operation);
        if (index > -1) {
            this.syncQueue.splice(index, 1);
        }
        
        if (this.syncQueue.length === 0) {
            this.showSuccess();
        }
    }

    // Método para mostrar error en la cola
    showQueueError() {
        this.syncQueue = [];
        this.showError('Error de sincronización');
    }
}

// Instancia global
window.syncIndicator = new SyncStatusIndicator();

export default SyncStatusIndicator;
