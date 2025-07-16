// Sistema de Gestión de Contenido - Content Management System
import { FirebaseService } from './firebase-service.js';
import { SyncStatusIndicator } from './sync-status-indicator.js';

class ContentManager {
    constructor() {
        this.firebaseService = new FirebaseService();
        this.syncIndicator = new SyncStatusIndicator();
        this.contentTypes = {
            'gaming': {
                icon: '🎮',
                fields: ['title', 'description', 'category', 'image', 'link']
            },
            'professional': {
                icon: '💼',
                fields: ['title', 'description', 'skills', 'date', 'link']
            },
            'resources': {
                icon: '📚',
                fields: ['title', 'description', 'type', 'url', 'tags']
            },
            'blog': {
                icon: '📝',
                fields: ['title', 'content', 'date', 'tags', 'category']
            }
        };
        this.init();
    }

    init() {
        this.setupContentCreator();
        this.setupContentLibrary();
        this.setupTemplates();
    }

    setupContentCreator() {
        const contentCreatorHTML = `
            <div id="content-creator-modal" class="content-modal">
                <div class="content-modal-content">
                    <div class="content-modal-header">
                        <h3>✨ Crear Nuevo Contenido</h3>
                        <button class="close-btn" onclick="contentManager.closeContentCreator()">✕</button>
                    </div>
                    
                    <div class="content-modal-body">
                        <div class="content-type-selector">
                            <h4>Selecciona el tipo de contenido:</h4>
                            <div class="content-type-grid">
                                ${Object.entries(this.contentTypes).map(([type, config]) => `
                                    <div class="content-type-card" onclick="contentManager.selectContentType('${type}')">
                                        <span class="content-type-icon">${config.icon}</span>
                                        <span class="content-type-name">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div id="content-form-container" class="content-form-container" style="display: none;">
                            <div id="content-form"></div>
                            <div class="content-form-actions">
                                <button class="btn-secondary" onclick="contentManager.previewContent()">👁️ Vista Previa</button>
                                <button class="btn-primary" onclick="contentManager.saveContent()">💾 Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="content-library-modal" class="content-modal">
                <div class="content-modal-content large">
                    <div class="content-modal-header">
                        <h3>📚 Biblioteca de Contenido</h3>
                        <button class="close-btn" onclick="contentManager.closeContentLibrary()">✕</button>
                    </div>
                    
                    <div class="content-modal-body">
                        <div class="content-library-toolbar">
                            <div class="search-container">
                                <input type="text" id="content-search" placeholder="Buscar contenido..." onkeyup="contentManager.searchContent()">
                                <button onclick="contentManager.searchContent()">🔍</button>
                            </div>
                            <div class="filter-container">
                                <select id="content-filter" onchange="contentManager.filterContent()">
                                    <option value="">Todos los tipos</option>
                                    ${Object.keys(this.contentTypes).map(type => `
                                        <option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div id="content-library-grid" class="content-library-grid">
                            <!-- Contenido se carga dinámicamente -->
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="content-preview-modal" class="content-modal">
                <div class="content-modal-content">
                    <div class="content-modal-header">
                        <h3>👁️ Vista Previa</h3>
                        <button class="close-btn" onclick="contentManager.closePreview()">✕</button>
                    </div>
                    
                    <div class="content-modal-body">
                        <div id="content-preview-container"></div>
                    </div>
                </div>
            </div>
        `;
        
        const contentCreatorDiv = document.createElement('div');
        contentCreatorDiv.innerHTML = contentCreatorHTML;
        document.body.appendChild(contentCreatorDiv);
    }

    openContentCreator() {
        document.getElementById('content-creator-modal').style.display = 'flex';
    }

    closeContentCreator() {
        document.getElementById('content-creator-modal').style.display = 'none';
        document.getElementById('content-form-container').style.display = 'none';
        this.resetForm();
    }

    selectContentType(type) {
        this.currentContentType = type;
        this.generateForm(type);
        document.getElementById('content-form-container').style.display = 'block';
    }

    generateForm(type) {
        const config = this.contentTypes[type];
        const formContainer = document.getElementById('content-form');
        
        let formHTML = `<h4>${config.icon} Crear ${type.charAt(0).toUpperCase() + type.slice(1)}</h4>`;
        
        config.fields.forEach(field => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
            
            if (field === 'content') {
                formHTML += `
                    <div class="form-group">
                        <label for="${field}">${fieldName}:</label>
                        <div class="editor-toolbar">
                            <button type="button" onclick="contentManager.formatContent('bold')" title="Negrita">B</button>
                            <button type="button" onclick="contentManager.formatContent('italic')" title="Cursiva">I</button>
                            <button type="button" onclick="contentManager.formatContent('underline')" title="Subrayado">U</button>
                            <button type="button" onclick="contentManager.insertLink()" title="Enlace">🔗</button>
                            <button type="button" onclick="contentManager.insertImage()" title="Imagen">🖼️</button>
                        </div>
                        <div id="${field}" class="content-editor" contenteditable="true" placeholder="Escribe tu contenido aquí..."></div>
                    </div>
                `;
            } else if (field === 'description') {
                formHTML += `
                    <div class="form-group">
                        <label for="${field}">${fieldName}:</label>
                        <textarea id="${field}" placeholder="Ingresa la ${field}..." rows="4"></textarea>
                    </div>
                `;
            } else if (field === 'tags' || field === 'skills') {
                formHTML += `
                    <div class="form-group">
                        <label for="${field}">${fieldName} (separados por comas):</label>
                        <input type="text" id="${field}" placeholder="Ej: JavaScript, React, Node.js">
                        <div class="tags-preview" id="${field}-preview"></div>
                    </div>
                `;
            } else if (field === 'date') {
                formHTML += `
                    <div class="form-group">
                        <label for="${field}">${fieldName}:</label>
                        <input type="date" id="${field}" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                `;
            } else if (field === 'category' || field === 'type') {
                const options = this.getCategoryOptions(type, field);
                formHTML += `
                    <div class="form-group">
                        <label for="${field}">${fieldName}:</label>
                        <select id="${field}">
                            ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (field === 'image') {
                formHTML += `
                    <div class="form-group">
                        <label for="${field}">${fieldName}:</label>
                        <div class="image-upload-container">
                            <input type="file" id="${field}" accept="image/*" onchange="contentManager.handleImageUpload(this)">
                            <div class="image-preview" id="${field}-preview"></div>
                        </div>
                    </div>
                `;
            } else {
                formHTML += `
                    <div class="form-group">
                        <label for="${field}">${fieldName}:</label>
                        <input type="text" id="${field}" placeholder="Ingresa ${fieldName.toLowerCase()}...">
                    </div>
                `;
            }
        });
        
        formContainer.innerHTML = formHTML;
        
        // Agregar event listeners para tags
        const tagsFields = formContainer.querySelectorAll('input[id*="tags"], input[id*="skills"]');
        tagsFields.forEach(field => {
            field.addEventListener('input', (e) => {
                this.updateTagsPreview(e.target.id);
            });
        });
    }

    getCategoryOptions(type, field) {
        const options = {
            gaming: {
                category: ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Puzzle', 'Indie', 'Multijugador']
            },
            professional: {
                category: ['Desarrollo Web', 'Diseño', 'Marketing', 'Gestión', 'Análisis', 'Consultoría']
            },
            resources: {
                type: ['Tutorial', 'Herramienta', 'Librería', 'Framework', 'Documentación', 'Curso', 'Artículo']
            }
        };
        
        return options[type] ? (options[type][field] || ['General']) : ['General'];
    }

    updateTagsPreview(fieldId) {
        const input = document.getElementById(fieldId);
        const preview = document.getElementById(`${fieldId}-preview`);
        const tags = input.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        preview.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    }

    formatContent(command) {
        document.execCommand(command, false, null);
    }

    insertLink() {
        const url = prompt('Ingresa la URL del enlace:');
        if (url) {
            const text = prompt('Texto del enlace:') || url;
            document.execCommand('createLink', false, url);
        }
    }

    insertImage() {
        const url = prompt('Ingresa la URL de la imagen:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }

    handleImageUpload(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById(`${input.id}-preview`);
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px;">`;
            };
            reader.readAsDataURL(file);
        }
    }

    async saveContent() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            this.syncIndicator.show('Por favor, completa todos los campos requeridos', 'error');
            return;
        }
        
        try {
            const contentData = {
                type: this.currentContentType,
                ...formData,
                id: this.generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'published'
            };
            
            await this.firebaseService.addDocument('content', contentData);
            this.syncIndicator.show('Contenido guardado exitosamente', 'success');
            this.closeContentCreator();
            this.addContentToPage(contentData);
            
        } catch (error) {
            console.error('Error guardando contenido:', error);
            this.syncIndicator.show('Error al guardar el contenido', 'error');
        }
    }

    getFormData() {
        const formData = {};
        const config = this.contentTypes[this.currentContentType];
        
        config.fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                if (field === 'content') {
                    formData[field] = element.innerHTML;
                } else if (field === 'tags' || field === 'skills') {
                    formData[field] = element.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                } else if (field === 'image' && element.files && element.files[0]) {
                    // Por ahora guardamos la imagen como base64, en el futuro se puede subir a Firebase Storage
                    const reader = new FileReader();
                    reader.onload = (e) => formData[field] = e.target.result;
                    reader.readAsDataURL(element.files[0]);
                } else {
                    formData[field] = element.value;
                }
            }
        });
        
        return formData;
    }

    validateForm(formData) {
        const requiredFields = ['title'];
        return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
    }

    addContentToPage(contentData) {
        const container = this.getContentContainer(contentData.type);
        if (container) {
            const contentElement = this.createContentElement(contentData);
            container.appendChild(contentElement);
        }
    }

    getContentContainer(type) {
        // Buscar el contenedor apropiado basado en el tipo
        const selectors = {
            gaming: '.gaming-content .grid-container, .content-grid',
            professional: '.professional-content .grid-container, .content-grid',
            resources: '.resources-content .grid-container, .content-grid',
            blog: '.blog-content .grid-container, .content-grid'
        };
        
        return document.querySelector(selectors[type] || '.grid-container');
    }

    createContentElement(contentData) {
        const element = document.createElement('div');
        element.className = 'card content-item';
        element.setAttribute('data-content-id', contentData.id);
        
        let elementHTML = `
            <div class="card-header">
                <h4>${contentData.title}</h4>
                <div class="card-actions">
                    <button class="edit-btn" onclick="contentManager.editContent('${contentData.id}')">✏️</button>
                    <button class="delete-btn" onclick="contentManager.deleteContent('${contentData.id}')">🗑️</button>
                </div>
            </div>
        `;
        
        if (contentData.description) {
            elementHTML += `<p class="content-description">${contentData.description}</p>`;
        }
        
        if (contentData.tags && contentData.tags.length > 0) {
            elementHTML += `<div class="content-tags">
                ${contentData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>`;
        }
        
        if (contentData.link) {
            elementHTML += `<a href="${contentData.link}" class="btn-primary" target="_blank">Ver más</a>`;
        }
        
        element.innerHTML = elementHTML;
        return element;
    }

    async openContentLibrary() {
        document.getElementById('content-library-modal').style.display = 'flex';
        await this.loadContentLibrary();
    }

    closeContentLibrary() {
        document.getElementById('content-library-modal').style.display = 'none';
    }

    async loadContentLibrary() {
        try {
            const content = await this.firebaseService.getDocuments('content');
            this.displayContentLibrary(content);
        } catch (error) {
            console.error('Error cargando biblioteca:', error);
            this.syncIndicator.show('Error al cargar la biblioteca', 'error');
        }
    }

    displayContentLibrary(content) {
        const grid = document.getElementById('content-library-grid');
        
        if (content.length === 0) {
            grid.innerHTML = '<p class="no-content">No hay contenido disponible. ¡Crea el primer elemento!</p>';
            return;
        }
        
        grid.innerHTML = content.map(item => `
            <div class="content-library-item" data-content-id="${item.id}">
                <div class="content-item-header">
                    <span class="content-type-badge">${this.contentTypes[item.type].icon} ${item.type}</span>
                    <div class="content-item-actions">
                        <button onclick="contentManager.editContent('${item.id}')" title="Editar">✏️</button>
                        <button onclick="contentManager.duplicateContent('${item.id}')" title="Duplicar">📋</button>
                        <button onclick="contentManager.deleteContent('${item.id}')" title="Eliminar">🗑️</button>
                    </div>
                </div>
                <h4>${item.title}</h4>
                <p class="content-item-description">${item.description || 'Sin descripción'}</p>
                <div class="content-item-meta">
                    <span class="content-date">📅 ${new Date(item.createdAt).toLocaleDateString()}</span>
                    <span class="content-status status-${item.status}">●</span>
                </div>
            </div>
        `).join('');
    }

    searchContent() {
        const searchTerm = document.getElementById('content-search').value.toLowerCase();
        const filter = document.getElementById('content-filter').value;
        const items = document.querySelectorAll('.content-library-item');
        
        items.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('.content-item-description').textContent.toLowerCase();
            const type = item.getAttribute('data-content-type');
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesFilter = !filter || type === filter;
            
            item.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
        });
    }

    filterContent() {
        this.searchContent();
    }

    async editContent(contentId) {
        try {
            const content = await this.firebaseService.getDocument('content', contentId);
            this.openContentCreator();
            this.populateForm(content);
            this.currentEditingId = contentId;
        } catch (error) {
            console.error('Error cargando contenido:', error);
            this.syncIndicator.show('Error al cargar el contenido', 'error');
        }
    }

    populateForm(content) {
        this.selectContentType(content.type);
        
        // Esperar a que se genere el formulario
        setTimeout(() => {
            const config = this.contentTypes[content.type];
            config.fields.forEach(field => {
                const element = document.getElementById(field);
                if (element && content[field]) {
                    if (field === 'content') {
                        element.innerHTML = content[field];
                    } else if (field === 'tags' || field === 'skills') {
                        element.value = content[field].join(', ');
                        this.updateTagsPreview(field);
                    } else {
                        element.value = content[field];
                    }
                }
            });
        }, 100);
    }

    async duplicateContent(contentId) {
        try {
            const content = await this.firebaseService.getDocument('content', contentId);
            const duplicatedContent = {
                ...content,
                id: this.generateId(),
                title: `${content.title} (Copia)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            await this.firebaseService.addDocument('content', duplicatedContent);
            this.syncIndicator.show('Contenido duplicado exitosamente', 'success');
            this.loadContentLibrary();
            
        } catch (error) {
            console.error('Error duplicando contenido:', error);
            this.syncIndicator.show('Error al duplicar el contenido', 'error');
        }
    }

    async deleteContent(contentId) {
        if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
            try {
                await this.firebaseService.deleteDocument('content', contentId);
                
                // Eliminar del DOM
                const element = document.querySelector(`[data-content-id="${contentId}"]`);
                if (element) {
                    element.remove();
                }
                
                this.syncIndicator.show('Contenido eliminado exitosamente', 'success');
                this.loadContentLibrary();
                
            } catch (error) {
                console.error('Error eliminando contenido:', error);
                this.syncIndicator.show('Error al eliminar el contenido', 'error');
            }
        }
    }

    previewContent() {
        const formData = this.getFormData();
        const previewContainer = document.getElementById('content-preview-container');
        
        const previewHTML = `
            <div class="content-preview">
                <div class="preview-header">
                    <h3>${formData.title || 'Sin título'}</h3>
                    <span class="preview-type">${this.contentTypes[this.currentContentType].icon} ${this.currentContentType}</span>
                </div>
                
                ${formData.description ? `<p class="preview-description">${formData.description}</p>` : ''}
                
                ${formData.content ? `<div class="preview-content">${formData.content}</div>` : ''}
                
                ${formData.tags && formData.tags.length > 0 ? `
                    <div class="preview-tags">
                        ${formData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                ${formData.link ? `<a href="${formData.link}" class="btn-primary" target="_blank">Ver enlace</a>` : ''}
            </div>
        `;
        
        previewContainer.innerHTML = previewHTML;
        document.getElementById('content-preview-modal').style.display = 'flex';
    }

    closePreview() {
        document.getElementById('content-preview-modal').style.display = 'none';
    }

    resetForm() {
        this.currentContentType = null;
        this.currentEditingId = null;
        document.getElementById('content-form').innerHTML = '';
    }

    generateId() {
        return 'content-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    setupTemplates() {
        // Agregar estilos CSS para el content manager
        const style = document.createElement('style');
        style.textContent = `
            /* Content Manager Styles */
            .content-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 2000;
                align-items: center;
                justify-content: center;
            }
            
            .content-modal-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .content-modal-content.large {
                max-width: 1000px;
            }
            
            .content-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e0e0e0;
                background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
                color: white;
                border-radius: 12px 12px 0 0;
            }
            
            .content-modal-header h3 {
                margin: 0;
                font-size: 1.3rem;
            }
            
            .content-modal-body {
                padding: 2rem;
            }
            
            .content-type-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .content-type-card {
                background: #f8f9fa;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                padding: 1.5rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .content-type-card:hover {
                border-color: #9b59b6;
                background: rgba(155, 89, 182, 0.1);
                transform: translateY(-2px);
            }
            
            .content-type-icon {
                font-size: 2rem;
                display: block;
                margin-bottom: 0.5rem;
            }
            
            .content-type-name {
                font-weight: 600;
                color: #2c3e50;
                text-transform: capitalize;
            }
            
            .content-form-container {
                margin-top: 2rem;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #2c3e50;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #9b59b6;
            }
            
            .content-editor {
                min-height: 150px;
                max-height: 300px;
                overflow-y: auto;
                padding: 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                background: white;
            }
            
            .content-editor:focus {
                outline: none;
                border-color: #9b59b6;
            }
            
            .editor-toolbar {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                padding: 0.5rem;
                background: #f8f9fa;
                border-radius: 6px;
            }
            
            .editor-toolbar button {
                padding: 0.5rem;
                border: 1px solid #e0e0e0;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .editor-toolbar button:hover {
                background: #e9ecef;
            }
            
            .tags-preview {
                margin-top: 0.5rem;
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .tag {
                background: #9b59b6;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
                display: inline-block;
            }
            
            .image-upload-container {
                border: 2px dashed #e0e0e0;
                border-radius: 8px;
                padding: 2rem;
                text-align: center;
                transition: border-color 0.3s ease;
            }
            
            .image-upload-container:hover {
                border-color: #9b59b6;
            }
            
            .image-preview {
                margin-top: 1rem;
            }
            
            .image-preview img {
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .content-form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #e0e0e0;
            }
            
            .content-library-toolbar {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                align-items: center;
            }
            
            .search-container {
                display: flex;
                flex: 1;
                gap: 0.5rem;
            }
            
            .search-container input {
                flex: 1;
                padding: 0.75rem;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
            }
            
            .search-container button {
                padding: 0.75rem 1rem;
                background: #9b59b6;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            }
            
            .filter-container select {
                padding: 0.75rem;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
            }
            
            .content-library-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }
            
            .content-library-item {
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 1.5rem;
                transition: transform 0.3s ease;
            }
            
            .content-library-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .content-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .content-type-badge {
                background: #9b59b6;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
                text-transform: capitalize;
            }
            
            .content-item-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            .content-item-actions button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.5rem;
                border-radius: 4px;
                transition: background 0.3s ease;
            }
            
            .content-item-actions button:hover {
                background: rgba(155, 89, 182, 0.1);
            }
            
            .content-item-description {
                color: #6c757d;
                margin-bottom: 1rem;
                line-height: 1.5;
            }
            
            .content-item-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9rem;
                color: #6c757d;
            }
            
            .content-status {
                font-size: 1.2rem;
            }
            
            .content-status.status-published {
                color: #27ae60;
            }
            
            .content-status.status-draft {
                color: #f39c12;
            }
            
            .no-content {
                text-align: center;
                color: #6c757d;
                font-style: italic;
                padding: 2rem;
            }
            
            .content-preview {
                max-width: 600px;
                margin: 0 auto;
            }
            
            .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #e0e0e0;
            }
            
            .preview-type {
                background: #9b59b6;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 15px;
                font-size: 0.9rem;
            }
            
            .preview-description {
                color: #6c757d;
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .preview-content {
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .preview-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }
            
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .card-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            .card-actions button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.5rem;
                border-radius: 4px;
                transition: background 0.3s ease;
            }
            
            .card-actions button:hover {
                background: rgba(155, 89, 182, 0.1);
            }
            
            .content-description {
                color: #6c757d;
                margin-bottom: 1rem;
                line-height: 1.5;
            }
            
            .content-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .content-modal-content {
                    width: 95%;
                    max-height: 95vh;
                }
                
                .content-modal-body {
                    padding: 1rem;
                }
                
                .content-type-grid {
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                }
                
                .content-library-toolbar {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .search-container {
                    width: 100%;
                }
                
                .content-library-grid {
                    grid-template-columns: 1fr;
                }
                
                .content-form-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar el content manager
document.addEventListener('DOMContentLoaded', () => {
    window.contentManager = new ContentManager();
});

export { ContentManager };
