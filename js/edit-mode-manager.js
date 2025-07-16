// Sistema de Edición Unificado - Edit Mode Manager
import { FirebaseService } from './firebase-service.js';
import { SyncStatusIndicator } from './sync-status-indicator.js';

class EditModeManager {
    constructor() {
        this.firebaseService = new FirebaseService();
        this.syncIndicator = new SyncStatusIndicator();
        this.isEditMode = false;
        this.currentEditingElement = null;
        this.init();
    }

    init() {
        this.createEditModeToggle();
        this.setupGlobalKeyboardShortcuts();
        this.addEditModeStyles();
    }

    createEditModeToggle() {
        const toggle = document.createElement('div');
        toggle.id = 'edit-mode-toggle';
        toggle.innerHTML = `
            <button id="edit-mode-btn" class="edit-mode-button" onclick="editManager.toggleEditMode()">
                <span class="edit-icon">✏️</span>
                <span class="edit-text">Modo Edición</span>
            </button>
        `;
        document.body.appendChild(toggle);
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const btn = document.getElementById('edit-mode-btn');
        const body = document.body;
        
        if (this.isEditMode) {
            btn.classList.add('active');
            btn.innerHTML = `
                <span class="edit-icon">💾</span>
                <span class="edit-text">Salir Edición</span>
            `;
            body.classList.add('edit-mode');
            this.enableEditMode();
        } else {
            btn.classList.remove('active');
            btn.innerHTML = `
                <span class="edit-icon">✏️</span>
                <span class="edit-text">Modo Edición</span>
            `;
            body.classList.remove('edit-mode');
            this.disableEditMode();
        }
    }

    enableEditMode() {
        // Hacer elementos editables
        this.makeElementsEditable();
        this.showEditControls();
        this.syncIndicator.show('Modo edición activado', 'info');
    }

    disableEditMode() {
        // Remover controles de edición
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
        element.classList.add('editable');
        
        element.addEventListener('focus', () => {
            this.currentEditingElement = element;
            element.classList.add('editing');
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('editing');
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

    makeElementsNonEditable() {
        const editableElements = document.querySelectorAll('.editable');
        editableElements.forEach(element => {
            element.contentEditable = false;
            element.classList.remove('editable', 'editing');
        });
    }

    showEditControls() {
        // Agregar botones de agregar contenido
        this.addContentButtons();
        
        // Agregar botones de eliminación
        this.addDeleteButtons();
    }

    addContentButtons() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const addButton = document.createElement('div');
            addButton.className = 'add-content-button';
            addButton.innerHTML = `
                <button onclick="editManager.addNewContent(this)" class="btn-add-content">
                    ➕ Agregar Contenido
                </button>
            `;
            section.appendChild(addButton);
        });
    }

    addDeleteButtons() {
        const deletableElements = document.querySelectorAll('.card, .content-item, .project-item, .experience-item');
        deletableElements.forEach(element => {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-element-btn';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.onclick = () => this.deleteElement(element);
            element.appendChild(deleteBtn);
        });
    }

    removeEditControls() {
        // Remover botones de agregar
        const addButtons = document.querySelectorAll('.add-content-button');
        addButtons.forEach(btn => btn.remove());
        
        // Remover botones de eliminar
        const deleteButtons = document.querySelectorAll('.delete-element-btn');
        deleteButtons.forEach(btn => btn.remove());
    }

    addNewContent(button) {
        const section = button.closest('section');
        const newElement = document.createElement('div');
        newElement.className = 'card';
        newElement.innerHTML = `
            <h4 contenteditable="true" class="editable">Nuevo Título</h4>
            <p contenteditable="true" class="editable">Nueva descripción...</p>
            <button class="btn-primary">Acción</button>
        `;
        
        section.insertBefore(newElement, button.parentElement);
        
        // Hacer el nuevo elemento editable
        const editableElements = newElement.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(el => this.makeElementEditable(el));
        
        // Agregar botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-element-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => this.deleteElement(newElement);
        newElement.appendChild(deleteBtn);
        
        // Enfocar el primer elemento editable
        editableElements[0].focus();
    }

    deleteElement(element) {
        if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
            element.remove();
            this.syncIndicator.show('Elemento eliminado', 'success');
        }
    }

    saveElementContent(element) {
        // Guardar contenido editado
        const content = {
            id: element.id || this.generateElementId(),
            tag: element.tagName.toLowerCase(),
            content: element.innerHTML,
            timestamp: new Date().toISOString()
        };
        
        this.saveToFirebase(content);
    }

    saveCurrentEdit() {
        if (this.currentEditingElement) {
            this.saveElementContent(this.currentEditingElement);
            this.currentEditingElement = null;
        }
    }

    async saveToFirebase(content) {
        try {
            await this.firebaseService.addDocument('page-edits', content);
            this.syncIndicator.show('Cambios guardados', 'success');
        } catch (error) {
            console.error('Error guardando cambios:', error);
            this.syncIndicator.show('Error al guardar', 'error');
        }
    }

    generateElementId() {
        return 'edit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + E para toggle edit mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.toggleEditMode();
            }
            
            // Ctrl/Cmd + S para guardar en modo edición
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.isEditMode) {
                e.preventDefault();
                this.saveCurrentEdit();
            }
        });
    }

    addEditModeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #edit-mode-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .edit-mode-button {
                background: #3498db;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .edit-mode-button:hover {
                background: #2980b9;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
            }
            
            .edit-mode-button.active {
                background: #e74c3c;
            }
            
            .edit-mode-button.active:hover {
                background: #c0392b;
            }
            
            .editable {
                border: 2px dashed transparent;
                transition: all 0.3s ease;
                border-radius: 4px;
                padding: 4px;
                margin: 2px;
            }
            
            .editable:hover {
                border-color: #3498db;
                background: rgba(52, 152, 219, 0.1);
            }
            
            .editable.editing {
                border-color: #e74c3c;
                background: rgba(231, 76, 60, 0.1);
                outline: none;
            }
            
            .add-content-button {
                text-align: center;
                margin: 20px 0;
                padding: 20px;
                border: 2px dashed #bdc3c7;
                border-radius: 8px;
                background: rgba(52, 152, 219, 0.05);
            }
            
            .btn-add-content {
                background: #27ae60;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .btn-add-content:hover {
                background: #219a52;
                transform: translateY(-1px);
            }
            
            .delete-element-btn {
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
            
            .delete-element-btn:hover {
                background: #c0392b;
                transform: scale(1.1);
            }
            
            .card, .content-item, .project-item, .experience-item {
                position: relative;
            }
            
            .edit-mode .card:hover,
            .edit-mode .content-item:hover,
            .edit-mode .project-item:hover,
            .edit-mode .experience-item:hover {
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar el manager cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.editManager = new EditModeManager();
});

export { EditModeManager };
