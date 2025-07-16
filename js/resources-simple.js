// 🔗 Gestor de Recursos Simple - Ale Gallo Gaming Universe
// Sistema simplificado para gestionar recursos dinámicamente

class SimpleResourceManager {
    constructor() {
        this.resources = [];
        this.isEditMode = false;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadResources();
        this.updateCategorySelect();
    }

    setupEventListeners() {
        // Formulario de recursos
        const resourceForm = document.getElementById('new-resource-form');
        if (resourceForm) {
            resourceForm.addEventListener('submit', (e) => this.handleResourceSubmit(e));
        }

        // Formulario de categorías
        const categoryForm = document.getElementById('new-category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => this.handleCategorySubmit(e));
        }
    }

    loadResources() {
        // Intentar cargar desde Firebase
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            this.loadFromFirebase();
        } else {
            this.loadFromLocalStorage();
        }
    }

    loadFromFirebase() {
        try {
            firebase.database().ref('resources').on('value', (snapshot) => {
                this.resources = [];
                const data = snapshot.val();
                
                if (data) {
                    Object.keys(data).forEach(key => {
                        this.resources.push({
                            id: key,
                            ...data[key]
                        });
                    });
                }
                
                this.renderResources();
            });
        } catch (error) {
            console.error('Error cargando desde Firebase:', error);
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('gaming-resources');
        if (saved) {
            this.resources = JSON.parse(saved);
        } else {
            this.resources = this.getDefaultResources();
            this.saveToLocalStorage();
        }
        this.renderResources();
    }

    saveToLocalStorage() {
        localStorage.setItem('gaming-resources', JSON.stringify(this.resources));
    }

    getDefaultResources() {
        return [
            {
                id: '1',
                title: 'Steam Store',
                url: 'https://store.steampowered.com/',
                category: 'gaming',
                description: 'Plataforma principal de juegos PC',
                icon: '🎮',
                timestamp: Date.now()
            },
            {
                id: '2',
                title: 'Epic Games Store',
                url: 'https://www.epicgames.com/',
                category: 'gaming',
                description: 'Tienda de juegos con ofertas semanales',
                icon: '🎮',
                timestamp: Date.now()
            },
            {
                id: '3',
                title: 'Unity Engine',
                url: 'https://unity.com/',
                category: 'desarrollo',
                description: 'Motor de juegos multiplataforma',
                icon: '💻',
                timestamp: Date.now()
            },
            {
                id: '4',
                title: 'OBS Studio',
                url: 'https://obsproject.com/',
                category: 'streaming',
                description: 'Software gratuito para streaming',
                icon: '📺',
                timestamp: Date.now()
            }
        ];
    }

    updateCategorySelect() {
        const select = document.getElementById('resource-category');
        if (!select) return;
        
        // Mantener las opciones predefinidas
        const categories = [
            { id: 'gaming', name: 'Gaming', icon: '🎮' },
            { id: 'desarrollo', name: 'Desarrollo', icon: '💻' },
            { id: 'streaming', name: 'Streaming', icon: '📺' },
            { id: 'noticias', name: 'Noticias', icon: '📰' },
            { id: 'hardware', name: 'Hardware', icon: '🔧' },
            { id: 'comunidad', name: 'Comunidad', icon: '👥' },
            { id: 'herramientas', name: 'Herramientas', icon: '🛠️' },
            { id: 'otros', name: 'Otros', icon: '📂' }
        ];
        
        // Limpiar y agregar opciones
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.icon} ${cat.name}`;
            select.appendChild(option);
        });
    }

    handleResourceSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const resourceData = {
            id: Date.now().toString(),
            title: formData.get('title'),
            url: formData.get('url'),
            category: formData.get('category'),
            description: formData.get('description') || '',
            icon: formData.get('icon') || '🔗',
            timestamp: Date.now()
        };
        
        this.addResource(resourceData);
        this.hideAddResourceForm();
        e.target.reset();
    }

    handleCategorySubmit(e) {
        e.preventDefault();
        this.showNotification('✅ Usa las categorías predefinidas por ahora');
        this.hideAddCategoryForm();
        e.target.reset();
    }

    addResource(resourceData) {
        this.resources.push(resourceData);
        
        // Guardar en Firebase si está disponible
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            try {
                firebase.database().ref('resources').push(resourceData);
            } catch (error) {
                console.error('Error guardando en Firebase:', error);
            }
        }
        
        this.saveToLocalStorage();
        this.renderResources();
        this.showNotification('✅ Recurso agregado correctamente');
    }

    deleteResource(resourceId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
            return;
        }
        
        this.resources = this.resources.filter(r => r.id !== resourceId);
        
        // Eliminar de Firebase si está disponible
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            try {
                firebase.database().ref('resources/' + resourceId).remove();
            } catch (error) {
                console.error('Error eliminando de Firebase:', error);
            }
        }
        
        this.saveToLocalStorage();
        this.renderResources();
        this.showNotification('✅ Recurso eliminado');
    }

    renderResources() {
        const container = document.getElementById('resources-container');
        const noResourcesMsg = document.getElementById('no-resources');
        
        if (!container) return;
        
        // Filtrar recursos
        const filteredResources = this.currentFilter === 'all' 
            ? this.resources 
            : this.resources.filter(resource => resource.category === this.currentFilter);
        
        if (filteredResources.length === 0) {
            container.style.display = 'none';
            if (noResourcesMsg) noResourcesMsg.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        if (noResourcesMsg) noResourcesMsg.style.display = 'none';
        
        // Agrupar recursos por categoría
        const groupedResources = {};
        filteredResources.forEach(resource => {
            if (!groupedResources[resource.category]) {
                groupedResources[resource.category] = [];
            }
            groupedResources[resource.category].push(resource);
        });
        
        // Generar HTML
        container.innerHTML = '';
        Object.keys(groupedResources).forEach(category => {
            const categoryCard = this.createCategoryCard(category, groupedResources[category]);
            container.appendChild(categoryCard);
        });
    }

    createCategoryCard(categoryId, resources) {
        const categoryInfo = this.getCategoryInfo(categoryId);
        
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-category', categoryId);
        
        const resourcesList = resources.map(resource => {
            return `
                <li class="resource-item">
                    <div class="resource-content">
                        <a href="${resource.url}" target="_blank" style="color: #4a90e2; text-decoration: none; font-weight: 500;">
                            ${resource.icon || '🔗'} ${resource.title}
                        </a>
                        ${resource.description ? `<p class="resource-description">${resource.description}</p>` : ''}
                    </div>
                    ${this.isEditMode ? `
                        <div class="resource-actions">
                            <button onclick="resourceManager.deleteResource('${resource.id}')" class="btn-small btn-danger">🗑️</button>
                        </div>
                    ` : ''}
                </li>
            `;
        }).join('');
        
        card.innerHTML = `
            <div class="card-info">
                <h3>${categoryInfo.icon} ${categoryInfo.name}</h3>
                <ul class="resources-list">
                    ${resourcesList}
                </ul>
            </div>
        `;
        
        return card;
    }

    getCategoryInfo(categoryId) {
        const categories = {
            gaming: { name: 'Gaming', icon: '🎮' },
            desarrollo: { name: 'Desarrollo', icon: '💻' },
            streaming: { name: 'Streaming', icon: '📺' },
            noticias: { name: 'Noticias', icon: '📰' },
            hardware: { name: 'Hardware', icon: '🔧' },
            comunidad: { name: 'Comunidad', icon: '👥' },
            herramientas: { name: 'Herramientas', icon: '🛠️' },
            otros: { name: 'Otros', icon: '📂' }
        };
        
        return categories[categoryId] || { name: categoryId, icon: '📂' };
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4a90e2;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.opacity = '1', 100);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Métodos públicos para los botones
    showAddResourceForm() {
        document.getElementById('add-resource-form').style.display = 'block';
        document.getElementById('add-category-form').style.display = 'none';
    }

    hideAddResourceForm() {
        document.getElementById('add-resource-form').style.display = 'none';
    }

    showAddCategoryForm() {
        document.getElementById('add-category-form').style.display = 'block';
        document.getElementById('add-resource-form').style.display = 'none';
    }

    hideAddCategoryForm() {
        document.getElementById('add-category-form').style.display = 'none';
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const btn = document.getElementById('editModeBtn');
        
        if (this.isEditMode) {
            btn.textContent = '👁️ Modo Vista';
            btn.classList.add('active');
        } else {
            btn.textContent = '✏️ Modo Edición';
            btn.classList.remove('active');
        }
        
        this.renderResources();
    }

    filterResources(filter) {
        this.currentFilter = filter;
        
        // Actualizar botones activos
        document.querySelectorAll('.filter-buttons button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });
        
        this.renderResources();
    }
}

// Instanciar el gestor cuando se carga la página
let resourceManager;

document.addEventListener('DOMContentLoaded', function() {
    resourceManager = new SimpleResourceManager();
});

// Funciones globales para los botones HTML
function showAddResourceForm() {
    resourceManager.showAddResourceForm();
}

function hideAddResourceForm() {
    resourceManager.hideAddResourceForm();
}

function showAddCategoryForm() {
    resourceManager.showAddCategoryForm();
}

function hideAddCategoryForm() {
    resourceManager.hideAddCategoryForm();
}

function toggleEditMode() {
    resourceManager.toggleEditMode();
}

function filterResources(filter) {
    resourceManager.filterResources(filter);
}

// Estilos adicionales
const styles = `
    .resources-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .resource-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    
    .resource-item:hover {
        background: rgba(74, 144, 226, 0.1);
        border-radius: 8px;
        padding-left: 1rem;
    }
    
    .resource-item:last-child {
        border-bottom: none;
    }
    
    .resource-content {
        flex: 1;
    }
    
    .resource-description {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin: 0.25rem 0 0 0;
        font-style: italic;
    }
    
    .resource-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .btn-small {
        padding: 0.3rem 0.6rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    }
    
    .btn-danger {
        background: #e74c3c;
        color: white;
    }
    
    .btn-danger:hover {
        background: #c0392b;
        transform: scale(1.05);
    }
    
    .filter-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .filter-buttons button {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    
    .filter-buttons button.active {
        background: var(--primary-color) !important;
        color: white !important;
        border-color: var(--primary-color) !important;
    }
    
    .content-form {
        margin-bottom: 2rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
