// Gestor de recursos con iconos externos y edición completa
class ResourceManager {
    constructor() {
        this.resources = [];
        this.categories = [];
        this.editMode = false;
        this.currentEditId = null;
        this.iconServers = [
            'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0/sprites/brands.svg',
            'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0/sprites/solid.svg',
            'https://api.iconify.design',
            'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/'
        ];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.renderCategories();
        this.renderResources();
        this.populateCategoryDropdown();
    }

    setupEventListeners() {
        // Búsqueda en tiempo real
        const searchBox = document.getElementById('searchBox');
        searchBox.addEventListener('input', (e) => this.searchResources(e.target.value));

        // Formularios
        document.getElementById('resourceForm').addEventListener('submit', (e) => this.handleResourceSubmit(e));
        document.getElementById('categoryForm').addEventListener('submit', (e) => this.handleCategorySubmit(e));

        // Cerrar modales al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Tecla ESC para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Auto-preview de iconos
        document.getElementById('resourceIcon').addEventListener('input', (e) => {
            this.previewIcon(e.target.value);
        });

        // Búsqueda de iconos en línea
        const iconSearch = document.getElementById('iconSearch');
        let searchTimeout;
        iconSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchIconsOnline(e.target.value);
            }, 300);
        });

        // Ocultar resultados cuando se hace clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.icon-search-container')) {
                document.getElementById('iconSearchResults').classList.remove('show');
            }
        });
    }

    async searchIconsOnline(query) {
        const resultsContainer = document.getElementById('iconSearchResults');
        
        if (!query.trim()) {
            resultsContainer.classList.remove('show');
            return;
        }

        try {
            // Verificar si iconManager está disponible
            if (!window.iconManager) {
                console.warn('IconManager no está disponible');
                resultsContainer.innerHTML = '<div class="icon-search-item">Gestor de iconos no disponible</div>';
                resultsContainer.classList.add('show');
                return;
            }

            const results = await window.iconManager.searchIcons(query, 10);
            
            if (results.length === 0) {
                resultsContainer.innerHTML = '<div class="icon-search-item">No se encontraron iconos</div>';
            } else {
                resultsContainer.innerHTML = '';
                
                for (const icon of results) {
                    const iconHTML = await this.generateSearchIconHTML(icon);
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'icon-search-item';
                    itemDiv.innerHTML = `
                        <div class="icon-search-item-icon">${iconHTML}</div>
                        <div class="icon-search-item-name">${icon.name}</div>
                    `;
                    itemDiv.onclick = () => selectIconFromSearch(icon.name, icon.provider);
                    resultsContainer.appendChild(itemDiv);
                }
            }
            
            resultsContainer.classList.add('show');
        } catch (error) {
            console.error('Error buscando iconos:', error);
            resultsContainer.innerHTML = '<div class="icon-search-item">Error en la búsqueda</div>';
            resultsContainer.classList.add('show');
        }
    }

    async generateSearchIconHTML(icon) {
        try {
            if (icon.type === 'svg' && icon.url) {
                return `<img src="${icon.url}" alt="Icon" style="width: 20px; height: 20px;" onerror="this.outerHTML='🔗'">`;
            } else if (window.iconManager) {
                return window.iconManager.generateIconHTML(icon, '20px');
            }
            return '🔗';
        } catch (error) {
            console.error('Error generando HTML de icono:', error);
            return '🔗';
        }
    }

    async loadData() {
        try {
            // Cargar datos desde Firebase
            const db = firebase.database();
            
            // Cargar categorías
            const categoriesSnapshot = await db.ref('resources/categories').once('value');
            this.categories = categoriesSnapshot.val() || this.getDefaultCategories();

            // Cargar recursos
            const resourcesSnapshot = await db.ref('resources/items').once('value');
            this.resources = resourcesSnapshot.val() || [];

            // Si no hay datos, usar datos por defecto
            if (this.categories.length === 0) {
                this.categories = this.getDefaultCategories();
                await this.saveCategories();
            }

            if (this.resources.length === 0) {
                this.resources = this.getDefaultResources();
                await this.saveResources();
            }

        } catch (error) {
            console.error('Error cargando datos:', error);
            this.showNotification('Error al cargar datos', 'error');
            // Usar datos por defecto en caso de error
            this.categories = this.getDefaultCategories();
            this.resources = this.getDefaultResources();
        }
    }

    getDefaultCategories() {
        return [
            { id: 'work', name: 'Herramientas de Trabajo', icon: '💼' },
            { id: 'dev', name: 'Desarrollo', icon: '💻' },
            { id: 'education', name: 'Educación', icon: '📚' },
            { id: 'utilities', name: 'Utilidades', icon: '🔧' },
            { id: 'design', name: 'Diseño', icon: '🎨' },
            { id: 'social', name: 'Redes Sociales', icon: '🌐' }
        ];
    }

    getDefaultResources() {
        return [
            {
                id: 'gmail',
                name: 'Gmail',
                url: 'https://gmail.com',
                description: 'Correo electrónico personal',
                category: 'work',
                icon: '📧',
                created: Date.now()
            },
            {
                id: 'github',
                name: 'GitHub',
                url: 'https://github.com',
                description: 'Repositorios de código',
                category: 'dev',
                icon: '🐱',
                created: Date.now()
            },
            {
                id: 'vscode',
                name: 'Visual Studio Code',
                url: 'https://code.visualstudio.com',
                description: 'Editor de código',
                category: 'dev',
                icon: '🔧',
                created: Date.now()
            },
            {
                id: 'youtube',
                name: 'YouTube',
                url: 'https://youtube.com',
                description: 'Videos educativos',
                category: 'education',
                icon: '📹',
                created: Date.now()
            }
        ];
    }

    async saveCategories() {
        try {
            const db = firebase.database();
            await db.ref('resources/categories').set(this.categories);
        } catch (error) {
            console.error('Error guardando categorías:', error);
            this.showNotification('Error al guardar categorías', 'error');
        }
    }

    async saveResources() {
        try {
            const db = firebase.database();
            await db.ref('resources/items').set(this.resources);
        } catch (error) {
            console.error('Error guardando recursos:', error);
            this.showNotification('Error al guardar recursos', 'error');
        }
    }

    renderCategories() {
        const container = document.getElementById('resourceCategories');
        container.innerHTML = '';

        this.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'resource-category';
            categoryDiv.innerHTML = `
                <div class="category-header">
                    <h3 class="category-title">${category.icon} ${category.name}</h3>
                    <div class="category-actions">
                        <button class="action-btn edit" onclick="editCategory('${category.id}')" title="Editar categoría">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteCategory('${category.id}')" title="Eliminar categoría">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <ul class="resource-list" id="category-${category.id}">
                    <!-- Los recursos se cargarán aquí -->
                </ul>
            `;
            container.appendChild(categoryDiv);
        });
    }

    renderResources() {
        // Limpiar todas las listas
        this.categories.forEach(category => {
            const list = document.getElementById(`category-${category.id}`);
            if (list) list.innerHTML = '';
        });

        // Renderizar recursos por categoría
        this.resources.forEach(resource => {
            this.renderResource(resource);
        });
    }

    renderResource(resource) {
        const categoryList = document.getElementById(`category-${resource.category}`);
        if (!categoryList) return;

        const listItem = document.createElement('li');
        listItem.className = 'resource-item';
        listItem.dataset.resourceId = resource.id;
        
        // Crear el HTML básico primero
        listItem.innerHTML = `
            <div class="resource-content">
                <div class="resource-icon">🔗</div>
                <div class="resource-info">
                    <a href="${resource.url}" target="_blank" class="resource-name">${resource.name}</a>
                    <div class="resource-description">${resource.description || ''}</div>
                </div>
            </div>
            <div class="resource-actions">
                <button class="action-btn edit" onclick="editResource('${resource.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteResource('${resource.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-btn" onclick="copyResourceUrl('${resource.url}')" title="Copiar URL">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        `;

        categoryList.appendChild(listItem);

        // Generar icono de manera asíncrona
        this.generateIconElement(resource.icon).then(iconElement => {
            const iconContainer = listItem.querySelector('.resource-icon');
            if (iconContainer) {
                iconContainer.innerHTML = iconElement;
            }
        }).catch(error => {
            console.error('Error generando icono:', error);
            const iconContainer = listItem.querySelector('.resource-icon');
            if (iconContainer) {
                iconContainer.innerHTML = '🔗';
            }
        });
    }

    async generateIconElement(iconValue) {
        if (!iconValue) return '🔗';
        
        // Si es un emoji, devolverlo directamente
        if (this.isEmoji(iconValue)) {
            return iconValue;
        }
        
        // Si es una URL completa, usar como imagen
        if (iconValue.startsWith('http')) {
            return `<img src="${iconValue}" alt="Icon" style="width: 24px; height: 24px;" onerror="this.outerHTML='🔗'">`;
        }
        
        // Usar el gestor de iconos para obtener el icono
        try {
            if (!window.iconManager) {
                console.warn('IconManager no está disponible, usando icono por defecto');
                return '🔗';
            }
            
            const iconData = await window.iconManager.getIcon(iconValue);
            return window.iconManager.generateIconHTML(iconData, '24px') || '🔗';
        } catch (error) {
            console.error('Error obteniendo icono:', error);
            return '🔗';
        }
    }

    isEmoji(str) {
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        return emojiRegex.test(str);
    }

    getIconUrl(icon) {
        if (this.isEmoji(icon)) {
            return '';
        }
        
        // Si es una URL completa, devolverla
        if (icon.startsWith('http')) {
            return icon;
        }
        
        // Generar URL desde iconify
        return `https://api.iconify.design/${icon}.svg`;
    }

    async previewIcon(iconValue) {
        const preview = document.getElementById('iconPreview');
        if (!iconValue) {
            preview.innerHTML = '';
            return;
        }

        if (this.isEmoji(iconValue)) {
            preview.innerHTML = `<span style="font-size: 2rem;">${iconValue}</span><span>Emoji válido</span>`;
        } else if (iconValue.startsWith('http')) {
            preview.innerHTML = `<img src="${iconValue}" alt="Icon preview" style="width: 32px; height: 32px;" onerror="this.style.display='none'"><span>URL de imagen</span>`;
        } else {
            try {
                if (!window.iconManager) {
                    preview.innerHTML = `<span style="color: #ff9800;">⚠️ Gestor de iconos no disponible</span>`;
                    return;
                }
                
                const iconData = await window.iconManager.getIcon(iconValue);
                const iconHTML = window.iconManager.generateIconHTML(iconData, '32px');
                preview.innerHTML = `${iconHTML}<span>Icono externo: ${iconValue}</span>`;
            } catch (error) {
                console.error('Error previsualizando icono:', error);
                preview.innerHTML = `<span style="color: #f44336;">❌ Error: ${error.message}</span>`;
            }
        }
    }

    populateCategoryDropdown() {
        const select = document.getElementById('resourceCategory');
        select.innerHTML = '<option value="">Selecciona una categoría</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.icon} ${category.name}`;
            select.appendChild(option);
        });
    }

    searchResources(query) {
        const items = document.querySelectorAll('.resource-item');
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('.resource-name').textContent.toLowerCase();
            const description = item.querySelector('.resource-description').textContent.toLowerCase();
            
            if (name.includes(lowerQuery) || description.includes(lowerQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    async handleResourceSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: this.currentEditId || this.generateId(),
            name: document.getElementById('resourceName').value,
            url: document.getElementById('resourceUrl').value,
            category: document.getElementById('resourceCategory').value,
            description: document.getElementById('resourceDescription').value,
            icon: document.getElementById('resourceIcon').value || '🔗',
            created: this.currentEditId ? this.findResource(this.currentEditId).created : Date.now(),
            modified: Date.now()
        };

        try {
            if (this.currentEditId) {
                // Editar recurso existente
                const index = this.resources.findIndex(r => r.id === this.currentEditId);
                this.resources[index] = formData;
                this.showNotification('Recurso actualizado correctamente', 'success');
            } else {
                // Nuevo recurso
                this.resources.push(formData);
                this.showNotification('Recurso creado correctamente', 'success');
            }

            await this.saveResources();
            this.renderResources();
            this.closeResourceModal();
            
        } catch (error) {
            console.error('Error al guardar recurso:', error);
            this.showNotification('Error al guardar recurso', 'error');
        }
    }

    async handleCategorySubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: this.generateId(),
            name: document.getElementById('categoryName').value,
            icon: document.getElementById('categoryIcon').value || '📁',
            created: Date.now()
        };

        try {
            this.categories.push(formData);
            await this.saveCategories();
            
            this.renderCategories();
            this.populateCategoryDropdown();
            this.closeCategoryModal();
            
            this.showNotification('Categoría creada correctamente', 'success');
            
        } catch (error) {
            console.error('Error al crear categoría:', error);
            this.showNotification('Error al crear categoría', 'error');
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    findResource(id) {
        return this.resources.find(r => r.id === id);
    }

    findCategory(id) {
        return this.categories.find(c => c.id === id);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.currentEditId = null;
    }

    closeResourceModal() {
        document.getElementById('resourceModal').classList.remove('active');
        document.getElementById('resourceForm').reset();
        document.getElementById('iconPreview').innerHTML = '';
        this.currentEditId = null;
    }

    closeCategoryModal() {
        document.getElementById('categoryModal').classList.remove('active');
        document.getElementById('categoryForm').reset();
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        const btn = document.getElementById('editModeBtn');
        const container = document.querySelector('.resources-container');
        
        if (this.editMode) {
            btn.innerHTML = '<i class="fas fa-eye"></i> Modo Vista';
            btn.classList.add('btn-warning');
            btn.classList.remove('btn-secondary');
            container.classList.add('edit-mode');
        } else {
            btn.innerHTML = '<i class="fas fa-edit"></i> Modo Edición';
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-warning');
            container.classList.remove('edit-mode');
        }
    }

    async exportResources() {
        const data = {
            categories: this.categories,
            resources: this.resources,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `recursos_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Recursos exportados correctamente', 'success');
    }

    async importResources() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                
                if (data.categories && data.resources) {
                    this.categories = data.categories;
                    this.resources = data.resources;
                    
                    await this.saveCategories();
                    await this.saveResources();
                    
                    this.renderCategories();
                    this.renderResources();
                    this.populateCategoryDropdown();
                    
                    this.showNotification('Recursos importados correctamente', 'success');
                } else {
                    this.showNotification('Formato de archivo inválido', 'error');
                }
            } catch (error) {
                console.error('Error importando recursos:', error);
                this.showNotification('Error al importar recursos', 'error');
            }
        };
        
        input.click();
    }
}

// Funciones globales para los botones
function showAddResourceModal() {
    document.getElementById('resourceModalTitle').textContent = 'Nuevo Recurso';
    document.getElementById('resourceModal').classList.add('active');
    resourceManager.currentEditId = null;
}

function showAddCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
}

function closeResourceModal() {
    resourceManager.closeResourceModal();
}

function closeCategoryModal() {
    resourceManager.closeCategoryModal();
}

function selectIcon(icon) {
    document.getElementById('resourceIcon').value = icon;
    resourceManager.previewIcon(icon);
    
    // Actualizar selección visual
    document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function selectIconFromSearch(iconName, provider) {
    const fullIconName = provider === 'iconify' ? iconName : `${provider}:${iconName}`;
    document.getElementById('resourceIcon').value = fullIconName;
    resourceManager.previewIcon(fullIconName);
    
    // Ocultar resultados
    document.getElementById('iconSearchResults').classList.remove('show');
    document.getElementById('iconSearch').value = '';
    
    // Actualizar selección visual
    document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.remove('selected');
    });
}

function selectCategoryIcon(icon) {
    document.getElementById('categoryIcon').value = icon;
    
    // Actualizar selección visual
    document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function toggleEditMode() {
    resourceManager.toggleEditMode();
}

function editResource(id) {
    const resource = resourceManager.findResource(id);
    if (!resource) return;
    
    document.getElementById('resourceModalTitle').textContent = 'Editar Recurso';
    document.getElementById('resourceName').value = resource.name;
    document.getElementById('resourceUrl').value = resource.url;
    document.getElementById('resourceCategory').value = resource.category;
    document.getElementById('resourceDescription').value = resource.description || '';
    document.getElementById('resourceIcon').value = resource.icon;
    
    resourceManager.previewIcon(resource.icon);
    resourceManager.currentEditId = id;
    document.getElementById('resourceModal').classList.add('active');
}

function deleteResource(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
        resourceManager.resources = resourceManager.resources.filter(r => r.id !== id);
        resourceManager.saveResources();
        resourceManager.renderResources();
        resourceManager.showNotification('Recurso eliminado correctamente', 'success');
    }
}

function editCategory(id) {
    const category = resourceManager.findCategory(id);
    if (!category) return;
    
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryIcon').value = category.icon;
    document.getElementById('categoryModal').classList.add('active');
}

function deleteCategory(id) {
    const hasResources = resourceManager.resources.some(r => r.category === id);
    if (hasResources) {
        resourceManager.showNotification('No se puede eliminar una categoría que tiene recursos', 'error');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        resourceManager.categories = resourceManager.categories.filter(c => c.id !== id);
        resourceManager.saveCategories();
        resourceManager.renderCategories();
        resourceManager.populateCategoryDropdown();
        resourceManager.showNotification('Categoría eliminada correctamente', 'success');
    }
}

function copyResourceUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        resourceManager.showNotification('URL copiada al portapapeles', 'success');
    }).catch(err => {
        console.error('Error copiando URL:', err);
        resourceManager.showNotification('Error al copiar URL', 'error');
    });
}

function exportResources() {
    resourceManager.exportResources();
}

function importResources() {
    resourceManager.importResources();
}

// Inicializar el gestor de recursos cuando se carga la página
let resourceManager;
document.addEventListener('DOMContentLoaded', () => {
    resourceManager = new ResourceManager();
});
