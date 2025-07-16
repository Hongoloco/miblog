// Gaming Content Manager - Gestión de contenido gaming con Firebase
import { FirebaseService } from './firebase-service.js';
import { FirebaseConnectionMonitor } from './firebase-connection-monitor.js';
import { SyncStatusIndicator } from './sync-status-indicator.js';

class GamingManager {
    constructor() {
        this.firebaseService = new FirebaseService();
        this.syncIndicator = new SyncStatusIndicator();
        this.collectionName = 'gaming-content';
        this.init();
    }

    init() {
        // Inicializar monitor de conexión
        const connectionMonitor = new FirebaseConnectionMonitor();
        connectionMonitor.startMonitoring();

        // Event listeners
        this.setupEventListeners();
        
        // Cargar contenido al iniciar
        this.loadGamingContent();
    }

    setupEventListeners() {
        const form = document.getElementById('gaming-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const gamingData = {
            title: formData.get('title'),
            category: formData.get('category'),
            rating: formData.get('rating') ? parseInt(formData.get('rating')) : null,
            description: formData.get('description'),
            url: formData.get('url'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            this.syncIndicator.show('Guardando contenido gaming...');
            await this.firebaseService.addDocument(this.collectionName, gamingData);
            this.syncIndicator.show('¡Contenido gaming guardado!', 'success');
            
            // Limpiar formulario y recargar lista
            e.target.reset();
            this.loadGamingContent();
        } catch (error) {
            console.error('Error guardando contenido gaming:', error);
            this.syncIndicator.show('Error al guardar contenido gaming', 'error');
        }
    }

    async loadGamingContent() {
        try {
            const contentList = document.getElementById('gaming-content-list');
            if (!contentList) return;

            this.syncIndicator.show('Cargando contenido gaming...');
            const content = await this.firebaseService.getDocuments(this.collectionName);
            
            contentList.innerHTML = '';
            
            if (content.length === 0) {
                contentList.innerHTML = '<p class="no-content">No hay contenido gaming guardado aún.</p>';
                this.syncIndicator.hide();
                return;
            }

            // Ordenar por fecha de creación (más reciente primero)
            content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            content.forEach(item => {
                const contentElement = this.createContentElement(item);
                contentList.appendChild(contentElement);
            });

            this.syncIndicator.hide();
        } catch (error) {
            console.error('Error cargando contenido gaming:', error);
            this.syncIndicator.show('Error al cargar contenido gaming', 'error');
        }
    }

    createContentElement(item) {
        const element = document.createElement('div');
        element.className = 'content-item';
        
        const categoryIcons = {
            'review': '⭐',
            'news': '📰',
            'setup': '🖥️',
            'tips': '💡',
            'opinion': '💭'
        };

        const categoryIcon = categoryIcons[item.category] || '🎮';
        const ratingStars = item.rating ? '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating) : '';

        element.innerHTML = `
            <div class="content-header">
                <h5>${categoryIcon} ${item.title}</h5>
                <div class="content-meta">
                    <span class="category">${item.category}</span>
                    ${item.rating ? `<span class="rating">${ratingStars}</span>` : ''}
                </div>
            </div>
            <p class="content-description">${item.description}</p>
            ${item.url ? `<a href="${item.url}" target="_blank" class="content-link">Ver enlace</a>` : ''}
            <div class="content-actions">
                <button class="btn-edit" onclick="gamingManager.editContent('${item.id}')">Editar</button>
                <button class="btn-delete" onclick="gamingManager.deleteContent('${item.id}')">Eliminar</button>
            </div>
            <small class="content-date">Creado: ${new Date(item.createdAt).toLocaleDateString()}</small>
        `;

        return element;
    }

    async deleteContent(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
            return;
        }

        try {
            this.syncIndicator.show('Eliminando contenido...');
            await this.firebaseService.deleteDocument(this.collectionName, id);
            this.syncIndicator.show('¡Contenido eliminado!', 'success');
            this.loadGamingContent();
        } catch (error) {
            console.error('Error eliminando contenido:', error);
            this.syncIndicator.show('Error al eliminar contenido', 'error');
        }
    }

    async editContent(id) {
        // Implementar edición de contenido
        console.log('Editando contenido:', id);
        // Por ahora, simplemente mostrar un mensaje
        alert('Función de edición en desarrollo');
    }
}

// Inicializar el manager cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.gamingManager = new GamingManager();
});

export { GamingManager };
