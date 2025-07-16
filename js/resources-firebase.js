// JavaScript para recursos con Firebase
import FirebaseService from '../firebase-service.js';
import FirebaseConnectionMonitor from '../firebase-connection-monitor.js';
import SyncStatusIndicator from '../sync-status-indicator.js';

class ResourcesManager {
    constructor() {
        this.firebaseService = new FirebaseService();
        this.connectionMonitor = new FirebaseConnectionMonitor();
        this.syncIndicator = new SyncStatusIndicator();
        this.init();
    }

    async init() {
        console.log('Iniciando ResourcesManager con Firebase');
        
        // Configurar funcionalidad básica
        this.setupMobileMenu();
        this.setupModal();
        this.setupCategoryTabs();
        this.setupResourceForm();
        
        // Cargar recursos desde Firebase
        await this.loadResources();
        
        // Configurar actualizaciones en tiempo real
        this.setupRealtimeUpdates();
    }

    setupMobileMenu() {
        window.toggleMobileMenu = function() {
            const menu = document.getElementById('mobile-menu');
            const icon = document.getElementById('menu-icon');
            
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
                menu.classList.add('hide');
                icon.textContent = '☰';
                
                setTimeout(() => {
                    menu.classList.remove('hide');
                }, 300);
            } else {
                menu.classList.add('show');
                icon.textContent = '✕';
            }
        };
    }

    setupModal() {
        const modal = document.getElementById('resourceModal');
        const addBtn = document.getElementById('addResourceBtn');
        
        window.openModal = () => {
            if (modal) modal.style.display = 'flex';
        };
        
        window.closeModal = () => {
            if (modal) modal.style.display = 'none';
        };
        
        if (addBtn) {
            addBtn.addEventListener('click', () => window.openModal());
        }
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                window.closeModal();
            }
        });
    }

    setupCategoryTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Actualizar botones activos
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filtrar recursos por categoría
                this.filterResourcesByCategory(category);
            });
        });
    }

    setupResourceForm() {
        const form = document.getElementById('resourceForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addResource();
            });
        }
    }

    async addResource() {
        const form = document.getElementById('resourceForm');
        const formData = new FormData(form);
        
        const resource = {
            title: document.getElementById('title').value,
            url: document.getElementById('url').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value
        };

        // Mostrar indicador de sincronización
        this.syncIndicator.showSyncing();

        try {
            const id = await this.firebaseService.addResource(resource);
            console.log('Recurso agregado:', id);
            
            form.reset();
            window.closeModal();
            
            // Mostrar éxito en sincronización
            this.syncIndicator.showSuccess('Recurso guardado');
            
            // Mostrar notificación
            this.showNotification('Recurso agregado exitosamente', 'success');
            
        } catch (error) {
            console.error('Error agregando recurso:', error);
            this.syncIndicator.showError('Error al guardar');
            this.showNotification('Error al agregar recurso', 'error');
        }
    }

    async loadResources() {
        try {
            const resources = await this.firebaseService.getResources();
            this.displayResources(resources);
        } catch (error) {
            console.error('Error cargando recursos:', error);
            this.showNotification('Error cargando recursos', 'error');
        }
    }

    displayResources(resources) {
        // Limpiar contenedores existentes
        const devGrid = document.getElementById('dev-resources');
        const techGrid = document.getElementById('tech-resources');
        const toolsGrid = document.getElementById('tools-resources');
        
        if (devGrid) devGrid.innerHTML = '';
        if (techGrid) techGrid.innerHTML = '';
        if (toolsGrid) toolsGrid.innerHTML = '';

        resources.forEach(resource => {
            const resourceCard = this.createResourceCard(resource);
            
            // Determinar en qué grid colocar el recurso
            let targetGrid = null;
            if (resource.category === 'frontend' || resource.category === 'backend' || 
                resource.category === 'frameworks' || resource.category === 'databases') {
                targetGrid = devGrid;
            } else if (resource.category === 'cloud' || resource.category === 'ai' || 
                      resource.category === 'mobile' || resource.category === 'devops') {
                targetGrid = techGrid;
            } else if (resource.category === 'editors' || resource.category === 'design' || 
                      resource.category === 'testing' || resource.category === 'productivity') {
                targetGrid = toolsGrid;
            }
            
            if (targetGrid) {
                targetGrid.appendChild(resourceCard);
            }
        });
    }

    createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.dataset.id = resource.id;
        card.dataset.category = resource.category;
        
        card.innerHTML = `
            <h4>${resource.title}</h4>
            <p>${resource.description}</p>
            <div class="resource-actions">
                <a href="${resource.url}" target="_blank" class="btn-gaming secondary">Visitar</a>
                <button onclick="resourcesManager.deleteResource('${resource.id}')" class="btn-delete">🗑️</button>
            </div>
        `;
        
        return card;
    }

    async deleteResource(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
            this.syncIndicator.showSyncing();
            
            try {
                await this.firebaseService.deleteResource(id);
                this.syncIndicator.showSuccess('Recurso eliminado');
                this.showNotification('Recurso eliminado exitosamente', 'success');
            } catch (error) {
                console.error('Error eliminando recurso:', error);
                this.syncIndicator.showError('Error al eliminar');
                this.showNotification('Error eliminando recurso', 'error');
            }
        }
    }

    filterResourcesByCategory(category) {
        const devSection = document.getElementById('dev-section');
        const techSection = document.getElementById('tech-section');
        const toolsSection = document.getElementById('tools-section');
        
        if (category === 'all') {
            devSection.style.display = 'block';
            techSection.style.display = 'block';
            toolsSection.style.display = 'block';
        } else if (category === 'dev') {
            devSection.style.display = 'block';
            techSection.style.display = 'none';
            toolsSection.style.display = 'none';
        } else if (category === 'tech') {
            devSection.style.display = 'none';
            techSection.style.display = 'block';
            toolsSection.style.display = 'none';
        } else if (category === 'tools') {
            devSection.style.display = 'none';
            techSection.style.display = 'none';
            toolsSection.style.display = 'block';
        }
    }

    setupRealtimeUpdates() {
        // Configurar actualizaciones en tiempo real
        this.firebaseService.onResourcesUpdate((resources) => {
            this.displayResources(resources);
        });
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.resourcesManager = new ResourcesManager();
});

export default ResourcesManager;
