// Sistema de Edición en Vivo - Live Editor
console.log('🎨 Live Editor System iniciado');

// Configuración del sistema
const LiveEditor = {
    isEditMode: false,
    isAuthenticated: false,
    credentials: {
        username: 'alito',
        password: 'vinilo28'
    },
    originalContent: {},
    
    init: function() {
        this.hideLoginModal();
        this.loadDynamicContent();
        this.setupEventListeners();
        this.checkAuthState();
    },
    
    checkAuthState: function() {
        const auth = sessionStorage.getItem('liveEditorAuth');
        if (auth === 'true') {
            this.isAuthenticated = true;
            this.enableEditMode();
        }
    },
    
    setupEventListeners: function() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Auto-save on content change
        document.addEventListener('input', (e) => {
            if (e.target.hasAttribute('contenteditable') && this.isEditMode) {
                this.autoSave();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's' && this.isEditMode) {
                e.preventDefault();
                this.saveChanges();
            }
        });
    },
    
    handleLogin: function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (username === this.credentials.username && password === this.credentials.password) {
            this.isAuthenticated = true;
            sessionStorage.setItem('liveEditorAuth', 'true');
            this.hideLoginModal();
            this.enableEditMode();
            this.showNotification('✅ Sesión iniciada - Modo edición activado', 'success');
        } else {
            document.getElementById('login-error').textContent = 'Credenciales incorrectas';
            this.showNotification('❌ Credenciales incorrectas', 'error');
        }
    },
    
    enableEditMode: function() {
        this.isEditMode = true;
        document.body.classList.add('edit-mode');
        document.getElementById('edit-toolbar').style.display = 'block';
        
        // Hacer elementos editables
        const editableElements = document.querySelectorAll('[data-editable="true"]');
        editableElements.forEach(element => {
            element.contentEditable = 'true';
            this.originalContent[element.textContent] = element.textContent;
        });
        
        // Mostrar botones de edición
        const editButtons = document.querySelectorAll('.edit-section-btn');
        editButtons.forEach(btn => btn.style.display = 'inline-block');
        
        this.showNotification('✏️ Modo edición activado', 'success');
    },
    
    disableEditMode: function() {
        this.isEditMode = false;
        document.body.classList.remove('edit-mode');
        document.getElementById('edit-toolbar').style.display = 'none';
        
        // Hacer elementos no editables
        const editableElements = document.querySelectorAll('[data-editable="true"]');
        editableElements.forEach(element => {
            element.contentEditable = 'false';
        });
        
        // Ocultar botones de edición
        const editButtons = document.querySelectorAll('.edit-section-btn');
        editButtons.forEach(btn => btn.style.display = 'none');
    },
    
    saveChanges: function() {
        if (!this.isEditMode) return;
        
        const pageData = this.collectPageData();
        
        // Guardar en Firebase
        if (typeof BlogDB !== 'undefined') {
            database.ref('website-content/homepage').set(pageData)
                .then(() => {
                    this.showNotification('💾 Cambios guardados en Firebase', 'success');
                })
                .catch(error => {
                    console.error('Error saving to Firebase:', error);
                    this.showNotification('❌ Error guardando en Firebase', 'error');
                });
        }
        
        // Guardar en localStorage como respaldo
        localStorage.setItem('homepage-content', JSON.stringify(pageData));
        this.showNotification('💾 Cambios guardados', 'success');
    },
    
    collectPageData: function() {
        const data = {};
        const editableElements = document.querySelectorAll('[data-editable="true"]');
        
        editableElements.forEach((element, index) => {
            data[`element_${index}`] = {
                tag: element.tagName.toLowerCase(),
                content: element.textContent,
                html: element.innerHTML,
                selector: this.getSelector(element)
            };
        });
        
        return {
            timestamp: Date.now(),
            data: data
        };
    },
    
    getSelector: function(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    },
    
    autoSave: function() {
        // Auto-save después de 2 segundos de inactividad
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveChanges();
        }, 2000);
    },
    
    resetChanges: function() {
        if (confirm('¿Estás seguro de que quieres resetear todos los cambios?')) {
            Object.keys(this.originalContent).forEach(key => {
                const element = document.querySelector(`[data-editable="true"]`);
                if (element && element.textContent !== this.originalContent[key]) {
                    element.textContent = this.originalContent[key];
                }
            });
            this.showNotification('🔄 Cambios reseteados', 'warning');
        }
    },
    
    logout: function() {
        sessionStorage.removeItem('liveEditorAuth');
        this.isAuthenticated = false;
        this.disableEditMode();
        this.showNotification('🚪 Sesión cerrada', 'info');
    },
    
    showLoginModal: function() {
        document.getElementById('login-modal').style.display = 'flex';
    },
    
    hideLoginModal: function() {
        document.getElementById('login-modal').style.display = 'none';
    },
    
    addDynamicCard: function() {
        const title = prompt('Título de la tarjeta:');
        const content = prompt('Contenido de la tarjeta:');
        
        if (title && content) {
            const card = this.createDynamicCard(title, content);
            document.getElementById('dynamic-cards').appendChild(card);
            this.saveChanges();
        }
    },
    
    createDynamicCard: function(title, content, id = null) {
        const cardId = id || 'card_' + Date.now();
        const card = document.createElement('div');
        card.className = 'dynamic-card';
        card.setAttribute('data-card-id', cardId);
        
        card.innerHTML = `
            <h4 contenteditable="false" data-editable="true">${title}</h4>
            <p contenteditable="false" data-editable="true">${content}</p>
            <div class="card-actions">
                <button onclick="LiveEditor.editCard('${cardId}')">✏️ Editar</button>
                <button onclick="LiveEditor.deleteCard('${cardId}')">🗑️ Eliminar</button>
            </div>
        `;
        
        // Hacer editables si está en modo edición
        if (this.isEditMode) {
            const editableElements = card.querySelectorAll('[data-editable="true"]');
            editableElements.forEach(element => {
                element.contentEditable = 'true';
            });
        }
        
        return card;
    },
    
    editCard: function(cardId) {
        const card = document.querySelector(`[data-card-id="${cardId}"]`);
        if (!card) return;
        
        const title = card.querySelector('h4').textContent;
        const content = card.querySelector('p').textContent;
        
        const newTitle = prompt('Nuevo título:', title);
        const newContent = prompt('Nuevo contenido:', content);
        
        if (newTitle !== null && newContent !== null) {
            card.querySelector('h4').textContent = newTitle;
            card.querySelector('p').textContent = newContent;
            this.saveChanges();
        }
    },
    
    deleteCard: function(cardId) {
        if (confirm('¿Eliminar esta tarjeta?')) {
            const card = document.querySelector(`[data-card-id="${cardId}"]`);
            if (card) {
                card.remove();
                this.saveChanges();
            }
        }
    },
    
    loadDynamicContent: function() {
        // Cargar contenido dinámico desde Firebase
        if (typeof database !== 'undefined') {
            database.ref('website-content/dynamic-cards').once('value')
                .then(snapshot => {
                    const cards = snapshot.val();
                    if (cards) {
                        Object.entries(cards).forEach(([id, cardData]) => {
                            const card = this.createDynamicCard(cardData.title, cardData.content, id);
                            document.getElementById('dynamic-cards').appendChild(card);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error loading dynamic content:', error);
                });
        }
    },
    
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            z-index: 10001;
            font-weight: 600;
            color: white;
            background-color: ${this.getNotificationColor(type)};
            animation: slideIn 0.3s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    getNotificationColor: function(type) {
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        return colors[type] || colors.info;
    }
};

// Funciones globales
window.showLogin = function() {
    LiveEditor.showLoginModal();
};

window.closeLogin = function() {
    LiveEditor.hideLoginModal();
};

window.toggleEditMode = function() {
    LiveEditor.saveChanges();
};

window.resetChanges = function() {
    LiveEditor.resetChanges();
};

window.logout = function() {
    LiveEditor.logout();
};

window.editSection = function(sectionName) {
    LiveEditor.showNotification(`✏️ Editando sección: ${sectionName}`, 'info');
};

window.addDynamicCard = function() {
    LiveEditor.addDynamicCard();
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    LiveEditor.init();
});

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

console.log('🎨 Live Editor System listo');
