// Panel de Administración Avanzado - Admin Panel Manager
import { FirebaseService } from './firebase-service.js';
import { SyncStatusIndicator } from './sync-status-indicator.js';

class AdminPanelManager {
    constructor() {
        this.firebaseService = new FirebaseService();
        this.syncIndicator = new SyncStatusIndicator();
        this.isAdminMode = false;
        this.isEditMode = false;
        this.currentEditingElement = null;
        this.init();
    }

    init() {
        this.createAdminPanel();
        this.setupGlobalKeyboardShortcuts();
        this.addAdminStyles();
    }

    createAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-toggle">
                <button id="admin-toggle-btn" class="admin-toggle-button" onclick="adminPanel.toggleAdminMode()">
                    <span class="admin-icon">⚙️</span>
                    <span class="admin-text">Admin</span>
                </button>
            </div>
            
            <div id="admin-sidebar" class="admin-sidebar">
                <div class="admin-header">
                    <h3>🛠️ Panel Admin</h3>
                    <button class="admin-close-btn" onclick="adminPanel.toggleAdminMode()">✕</button>
                </div>
                
                <div class="admin-content">
                    <div class="admin-section">
                        <h4>🎨 Modo Edición</h4>
                        <button id="edit-mode-btn" class="admin-btn" onclick="adminPanel.toggleEditMode()">
                            <span id="edit-mode-icon">✏️</span>
                            <span id="edit-mode-text">Activar Edición</span>
                        </button>
                    </div>
                    
                    <div class="admin-section">
                        <h4>➕ Agregar Contenido</h4>
                        <button class="admin-btn" onclick="adminPanel.addNewSection()">
                            <span>📄</span> Nueva Sección
                        </button>
                        <button class="admin-btn" onclick="adminPanel.addNewCard()">
                            <span>🃏</span> Nueva Tarjeta
                        </button>
                        <button class="admin-btn" onclick="adminPanel.addNewText()">
                            <span>📝</span> Nuevo Texto
                        </button>
                    </div>
                    
                    <div class="admin-section">
                        <h4>🎨 Personalizar</h4>
                        <button class="admin-btn" onclick="adminPanel.changeTheme()">
                            <span>🎨</span> Cambiar Tema
                        </button>
                        <button class="admin-btn" onclick="adminPanel.customizeColors()">
                            <span>🌈</span> Personalizar Colores
                        </button>
                    </div>
                    
                    <div class="admin-section">
                        <h4>💾 Gestión</h4>
                        <button class="admin-btn success" onclick="adminPanel.saveAllChanges()">
                            <span>💾</span> Guardar Todo
                        </button>
                        <button class="admin-btn warning" onclick="adminPanel.exportContent()">
                            <span>📤</span> Exportar
                        </button>
                        <button class="admin-btn danger" onclick="adminPanel.resetPage()">
                            <span>🔄</span> Restaurar
                        </button>
                    </div>
                    
                    <div class="admin-section">
                        <h4>📊 Estadísticas</h4>
                        <div class="admin-stats">
                            <div class="stat-item">
                                <span class="stat-label">Elementos:</span>
                                <span id="elements-count">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Editados:</span>
                                <span id="edited-count">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Guardados:</span>
                                <span id="saved-count">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="admin-overlay" class="admin-overlay" onclick="adminPanel.toggleAdminMode()"></div>
        `;
        document.body.appendChild(adminPanel);
    }

    toggleAdminMode() {
        this.isAdminMode = !this.isAdminMode;
        const sidebar = document.getElementById('admin-sidebar');
        const overlay = document.getElementById('admin-overlay');
        const toggleBtn = document.getElementById('admin-toggle-btn');
        
        if (this.isAdminMode) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            toggleBtn.classList.add('active');
            this.updateStats();
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            toggleBtn.classList.remove('active');
        }
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const editBtn = document.getElementById('edit-mode-btn');
        const editIcon = document.getElementById('edit-mode-icon');
        const editText = document.getElementById('edit-mode-text');
        const body = document.body;
        
        if (this.isEditMode) {
            editBtn.classList.add('active');
            editIcon.textContent = '💾';
            editText.textContent = 'Salir Edición';
            body.classList.add('admin-edit-mode');
            this.enableEditMode();
        } else {
            editBtn.classList.remove('active');
            editIcon.textContent = '✏️';
            editText.textContent = 'Activar Edición';
            body.classList.remove('admin-edit-mode');
            this.disableEditMode();
        }
    }

    enableEditMode() {
        this.makeElementsEditable();
        this.showEditControls();
        this.syncIndicator.show('Modo edición activado - Haz clic para editar', 'info');
    }

    disableEditMode() {
        this.removeEditControls();
        this.makeElementsNonEditable();
        if (this.currentEditingElement) {
            this.saveCurrentEdit();
        }
        this.syncIndicator.show('Modo edición desactivado', 'success');
    }

    makeElementsEditable() {
        // Hacer títulos editables
        const titles = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        titles.forEach(title => {
            if (!title.classList.contains('no-edit')) {
                this.makeElementEditable(title);
            }
        });

        // Hacer párrafos editables
        const paragraphs = document.querySelectorAll('p:not(.no-edit)');
        paragraphs.forEach(p => {
            if (!p.classList.contains('no-edit')) {
                this.makeElementEditable(p);
            }
        });

        // Hacer contenido de tarjetas editable
        const cardContent = document.querySelectorAll('.card h4, .card p');
        cardContent.forEach(element => {
            this.makeElementEditable(element);
        });
    }

    makeElementEditable(element) {
        element.contentEditable = true;
        element.classList.add('admin-editable');
        
        element.addEventListener('focus', () => {
            this.currentEditingElement = element;
            element.classList.add('admin-editing');
            this.showEditingToolbar(element);
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('admin-editing');
            this.hideEditingToolbar();
            this.saveElementContent(element);
        });
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                element.blur();
            }
            if (e.key === 'Escape') {
                element.blur();
            }
        });
    }

    showEditingToolbar(element) {
        // Crear toolbar flotante para edición
        const toolbar = document.createElement('div');
        toolbar.id = 'editing-toolbar';
        toolbar.className = 'editing-toolbar';
        toolbar.innerHTML = `
            <button onclick="adminPanel.formatText('bold')" title="Negrita">B</button>
            <button onclick="adminPanel.formatText('italic')" title="Cursiva">I</button>
            <button onclick="adminPanel.formatText('underline')" title="Subrayado">U</button>
            <button onclick="adminPanel.changeTextColor()" title="Color">🎨</button>
            <button onclick="adminPanel.deleteElement()" title="Eliminar">🗑️</button>
            <button onclick="adminPanel.saveCurrentEdit()" title="Guardar">💾</button>
        `;
        
        // Posicionar toolbar
        const rect = element.getBoundingClientRect();
        toolbar.style.top = (rect.top - 50) + 'px';
        toolbar.style.left = rect.left + 'px';
        
        document.body.appendChild(toolbar);
    }

    hideEditingToolbar() {
        const toolbar = document.getElementById('editing-toolbar');
        if (toolbar) {
            toolbar.remove();
        }
    }

    formatText(command) {
        document.execCommand(command, false, null);
    }

    changeTextColor() {
        const color = prompt('Ingresa el color (ej: #ff0000 o red):');
        if (color) {
            document.execCommand('foreColor', false, color);
        }
    }

    makeElementsNonEditable() {
        const editableElements = document.querySelectorAll('.admin-editable');
        editableElements.forEach(element => {
            element.contentEditable = false;
            element.classList.remove('admin-editable', 'admin-editing');
        });
    }

    showEditControls() {
        this.addDeleteButtons();
        this.addMoveButtons();
    }

    addDeleteButtons() {
        const deletableElements = document.querySelectorAll('.card, .content-item, .project-item, .experience-item, section');
        deletableElements.forEach(element => {
            if (!element.querySelector('.admin-delete-btn')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'admin-delete-btn';
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.onclick = () => this.deleteElement(element);
                element.appendChild(deleteBtn);
            }
        });
    }

    addMoveButtons() {
        const movableElements = document.querySelectorAll('.card, .content-item, .project-item, .experience-item');
        movableElements.forEach(element => {
            if (!element.querySelector('.admin-move-btn')) {
                const moveBtn = document.createElement('button');
                moveBtn.className = 'admin-move-btn';
                moveBtn.innerHTML = '⬍';
                moveBtn.onclick = () => this.moveElement(element);
                element.appendChild(moveBtn);
            }
        });
    }

    removeEditControls() {
        const adminButtons = document.querySelectorAll('.admin-delete-btn, .admin-move-btn');
        adminButtons.forEach(btn => btn.remove());
    }

    addNewSection() {
        const main = document.querySelector('main');
        const newSection = document.createElement('section');
        newSection.className = 'content-section';
        newSection.innerHTML = `
            <div class="container">
                <h3 contenteditable="true" class="admin-editable">Nueva Sección</h3>
                <div class="grid-container">
                    <div class="card">
                        <h4 contenteditable="true" class="admin-editable">Título de la tarjeta</h4>
                        <p contenteditable="true" class="admin-editable">Descripción de la tarjeta...</p>
                        <button class="btn-primary">Acción</button>
                    </div>
                </div>
            </div>
        `;
        main.appendChild(newSection);
        
        // Hacer editables los nuevos elementos
        const editableElements = newSection.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(el => this.makeElementEditable(el));
        
        this.syncIndicator.show('Nueva sección agregada', 'success');
        this.updateStats();
    }

    addNewCard() {
        const gridContainer = document.querySelector('.grid-container');
        if (gridContainer) {
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.innerHTML = `
                <h4 contenteditable="true" class="admin-editable">Nueva Tarjeta</h4>
                <p contenteditable="true" class="admin-editable">Descripción de la nueva tarjeta...</p>
                <button class="btn-primary">Acción</button>
            `;
            gridContainer.appendChild(newCard);
            
            // Hacer editables los nuevos elementos
            const editableElements = newCard.querySelectorAll('[contenteditable="true"]');
            editableElements.forEach(el => this.makeElementEditable(el));
            
            this.syncIndicator.show('Nueva tarjeta agregada', 'success');
            this.updateStats();
        } else {
            alert('No se encontró un contenedor de tarjetas. Agrega una sección primero.');
        }
    }

    addNewText() {
        const container = document.querySelector('.container');
        if (container) {
            const newText = document.createElement('p');
            newText.contentEditable = true;
            newText.className = 'admin-editable';
            newText.textContent = 'Nuevo texto - Haz clic para editar';
            container.appendChild(newText);
            
            this.makeElementEditable(newText);
            this.syncIndicator.show('Nuevo texto agregado', 'success');
            this.updateStats();
        }
    }

    deleteElement(element) {
        if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
            element.remove();
            this.syncIndicator.show('Elemento eliminado', 'success');
            this.updateStats();
        }
    }

    moveElement(element) {
        // Implementar movimiento de elementos
        alert('Función de movimiento en desarrollo. Próximamente...');
    }

    changeTheme() {
        const themes = ['default', 'dark', 'blue', 'green', 'purple'];
        const currentTheme = localStorage.getItem('theme') || 'default';
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        
        document.body.className = document.body.className.replace(/theme-\w+/g, '') + ` theme-${newTheme}`;
        localStorage.setItem('theme', newTheme);
        
        this.syncIndicator.show(`Tema cambiado a: ${newTheme}`, 'success');
    }

    customizeColors() {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.onchange = (e) => {
            document.documentElement.style.setProperty('--primary', e.target.value);
            this.syncIndicator.show('Color personalizado aplicado', 'success');
        };
        colorPicker.click();
    }

    saveElementContent(element) {
        const content = {
            id: element.id || this.generateElementId(),
            tag: element.tagName.toLowerCase(),
            content: element.innerHTML,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        this.saveToFirebase(content);
        this.updateStats();
    }

    saveCurrentEdit() {
        if (this.currentEditingElement) {
            this.saveElementContent(this.currentEditingElement);
            this.currentEditingElement = null;
        }
    }

    async saveToFirebase(content) {
        try {
            await this.firebaseService.addDocument('admin-edits', content);
            this.syncIndicator.show('Cambios guardados automáticamente', 'success');
        } catch (error) {
            console.error('Error guardando cambios:', error);
            this.syncIndicator.show('Error al guardar cambios', 'error');
        }
    }

    saveAllChanges() {
        const allEditableElements = document.querySelectorAll('.admin-editable');
        allEditableElements.forEach(element => {
            this.saveElementContent(element);
        });
        this.syncIndicator.show('Todos los cambios guardados', 'success');
    }

    exportContent() {
        const content = {
            html: document.documentElement.outerHTML,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.syncIndicator.show('Contenido exportado', 'success');
    }

    resetPage() {
        if (confirm('¿Estás seguro de que quieres restaurar la página? Se perderán todos los cambios no guardados.')) {
            location.reload();
        }
    }

    updateStats() {
        const elementsCount = document.querySelectorAll('.admin-editable').length;
        const editedCount = document.querySelectorAll('.admin-editable[data-edited="true"]').length;
        const savedCount = parseInt(localStorage.getItem('savedCount') || '0');
        
        document.getElementById('elements-count').textContent = elementsCount;
        document.getElementById('edited-count').textContent = editedCount;
        document.getElementById('saved-count').textContent = savedCount;
    }

    generateElementId() {
        return 'admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + A para toggle admin mode
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.toggleAdminMode();
            }
            
            // Ctrl/Cmd + E para toggle edit mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'e' && this.isAdminMode) {
                e.preventDefault();
                this.toggleEditMode();
            }
            
            // Ctrl/Cmd + S para guardar
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.isEditMode) {
                e.preventDefault();
                this.saveCurrentEdit();
            }
        });
    }

    addAdminStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Admin Panel Styles */
            .admin-toggle {
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 1000;
            }
            
            .admin-toggle-button {
                background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .admin-toggle-button:hover {
                background: linear-gradient(135deg, #8e44ad 0%, #732d91 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(155, 89, 182, 0.4);
            }
            
            .admin-toggle-button.active {
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            }
            
            .admin-sidebar {
                position: fixed;
                top: 0;
                right: -350px;
                width: 350px;
                height: 100vh;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                transition: right 0.3s ease;
                overflow-y: auto;
            }
            
            .admin-sidebar.active {
                right: 0;
            }
            
            .admin-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .admin-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .admin-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #e0e0e0;
                background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
                color: white;
            }
            
            .admin-header h3 {
                margin: 0;
                font-size: 1.2rem;
            }
            
            .admin-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .admin-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .admin-content {
                padding: 1rem;
            }
            
            .admin-section {
                margin-bottom: 2rem;
            }
            
            .admin-section h4 {
                margin-bottom: 1rem;
                color: #2c3e50;
                font-size: 1rem;
                border-bottom: 2px solid #9b59b6;
                padding-bottom: 0.5rem;
            }
            
            .admin-btn {
                width: 100%;
                padding: 0.75rem;
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .admin-btn:hover {
                background: #e9ecef;
                transform: translateY(-1px);
            }
            
            .admin-btn.active {
                background: #9b59b6;
                color: white;
            }
            
            .admin-btn.success {
                background: #27ae60;
                color: white;
            }
            
            .admin-btn.warning {
                background: #f39c12;
                color: white;
            }
            
            .admin-btn.danger {
                background: #e74c3c;
                color: white;
            }
            
            .admin-stats {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            }
            
            .stat-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                font-weight: 500;
                color: #6c757d;
            }
            
            /* Edit Mode Styles */
            .admin-edit-mode .admin-editable {
                border: 2px dashed #9b59b6;
                padding: 4px;
                margin: 2px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .admin-edit-mode .admin-editable:hover {
                border-color: #8e44ad;
                background: rgba(155, 89, 182, 0.1);
            }
            
            .admin-edit-mode .admin-editable.admin-editing {
                border-color: #e74c3c;
                background: rgba(231, 76, 60, 0.1);
                outline: none;
            }
            
            .admin-delete-btn,
            .admin-move-btn {
                position: absolute;
                top: -10px;
                right: -10px;
                background: #e74c3c;
                color: white;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
                z-index: 10;
                transition: all 0.3s ease;
            }
            
            .admin-move-btn {
                right: 25px;
                background: #3498db;
            }
            
            .admin-delete-btn:hover {
                background: #c0392b;
                transform: scale(1.1);
            }
            
            .admin-move-btn:hover {
                background: #2980b9;
                transform: scale(1.1);
            }
            
            .editing-toolbar {
                position: fixed;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 0.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 1002;
                display: flex;
                gap: 0.5rem;
            }
            
            .editing-toolbar button {
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                padding: 0.5rem;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.3s ease;
            }
            
            .editing-toolbar button:hover {
                background: #e9ecef;
            }
            
            .card, .content-item, .project-item, .experience-item, section {
                position: relative;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .admin-sidebar {
                    width: 300px;
                    right: -300px;
                }
                
                .admin-toggle {
                    bottom: 60px;
                    right: 10px;
                }
                
                .admin-toggle-button {
                    padding: 10px 16px;
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar el panel de administración
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanelManager();
});

export { AdminPanelManager };
