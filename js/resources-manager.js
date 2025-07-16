// Resources Manager - Gestión de recursos con Firebase
import { FirebaseService } from './firebase-service.js';
import { FirebaseConnectionMonitor } from './firebase-connection-monitor.js';
import { SyncStatusIndicator } from './sync-status-indicator.js';

class ResourcesManager {
    constructor() {
        this.firebaseService = new FirebaseService();
        this.syncIndicator = new SyncStatusIndicator();
        this.collectionName = 'recursos';
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Inicializar monitor de conexión
        const connectionMonitor = new FirebaseConnectionMonitor();
        connectionMonitor.startMonitoring();

        // Event listeners
        this.setupEventListeners();
        
        // Cargar recursos al iniciar
        this.loadResources();
    }

    setupEventListeners() {
        // Form submit
        const form = document.getElementById('resources-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const resourceData = {
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            url: formData.get('url'),
            tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            this.syncIndicator.show('Guardando recurso...');
            await this.firebaseService.addDocument(this.collectionName, resourceData);
            this.syncIndicator.show('¡Recurso guardado!', 'success');
            
            // Limpiar formulario y recargar lista
            e.target.reset();
            this.loadResources();
        } catch (error) {
            console.error('Error guardando recurso:', error);
            this.syncIndicator.show('Error al guardar recurso', 'error');
        }
    }

    handleFilter(e) {
        // Remover clase active de todos los botones
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón clickeado
        e.target.classList.add('active');
        
        // Actualizar filtro actual
        this.currentFilter = e.target.dataset.category;
        
        // Filtrar recursos
        this.filterResources();
    }

    async loadResources() {
        try {
            const resourcesList = document.getElementById('resources-list');
            if (!resourcesList) return;

            this.syncIndicator.show('Cargando recursos...');
            const resources = await this.firebaseService.getDocuments(this.collectionName);
            
            this.allResources = resources; // Guardar todos los recursos
            this.displayResources(resources);
            
            this.syncIndicator.hide();
        } catch (error) {
            console.error('Error cargando recursos:', error);
            this.syncIndicator.show('Error al cargar recursos', 'error');
        }
    }

    filterResources() {
        if (!this.allResources) return;

        let filteredResources = this.allResources;
        
        if (this.currentFilter !== 'all') {
            filteredResources = this.allResources.filter(resource => 
                resource.category === this.currentFilter
            );
        }

        this.displayResources(filteredResources);
    }

    displayResources(resources) {
        const resourcesList = document.getElementById('resources-list');
        if (!resourcesList) return;

        // Limpiar lista existente (excepto filtros)
        const existingItems = resourcesList.querySelectorAll('.resource-item');
        existingItems.forEach(item => item.remove());
        
        if (resources.length === 0) {
            const noResourcesMsg = document.createElement('div');
            noResourcesMsg.className = 'no-content';
            noResourcesMsg.textContent = 'No hay recursos en esta categoría aún.';
            resourcesList.appendChild(noResourcesMsg);
            return;
        }

        // Ordenar por fecha de creación (más reciente primero)
        resources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        resources.forEach(resource => {
            const resourceElement = this.createResourceElement(resource);
            resourcesList.appendChild(resourceElement);
        });
    }

    createResourceElement(resource) {
        const element = document.createElement('div');
        element.className = 'resource-item content-item';
        
        const categoryIcons = {
            'desarrollo': '💻',
            'diseno': '🎨',
            'herramientas': '🛠️',
            'aprendizaje': '📚',
            'otros': '🔗'
        };

        const categoryIcon = categoryIcons[resource.category] || '🔗';
        const tagsHtml = resource.tags && resource.tags.length > 0 
            ? `<div class="resource-tags">${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
            : '';

        element.innerHTML = `
            <div class="content-header">
                <h5>${categoryIcon} ${resource.title}</h5>
                <span class="category">${resource.category}</span>
            </div>
            <p class="content-description">${resource.description}</p>
            ${tagsHtml}
            <div class="resource-links">
                <a href="${resource.url}" target="_blank" class="btn-primary">Visitar Recurso</a>
            </div>
            <div class="content-actions">
                <button class="btn-edit" onclick="resourcesManager.editResource('${resource.id}')">Editar</button>
                <button class="btn-delete" onclick="resourcesManager.deleteResource('${resource.id}')">Eliminar</button>
            </div>
            <small class="content-date">Agregado: ${new Date(resource.createdAt).toLocaleDateString()}</small>
        `;

        return element;
    }

    async deleteResource(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
            return;
        }

        try {
            this.syncIndicator.show('Eliminando recurso...');
            await this.firebaseService.deleteDocument(this.collectionName, id);
            this.syncIndicator.show('¡Recurso eliminado!', 'success');
            this.loadResources();
        } catch (error) {
            console.error('Error eliminando recurso:', error);
            this.syncIndicator.show('Error al eliminar recurso', 'error');
        }
    }

    async editResource(id) {
        // Implementar edición de recursos
        console.log('Editando recurso:', id);
        // Por ahora, simplemente mostrar un mensaje
        alert('Función de edición en desarrollo');
    }
}

// Inicializar el manager cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.resourcesManager = new ResourcesManager();
});

export { ResourcesManager };
