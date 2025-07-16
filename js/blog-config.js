// Configuración global del sistema de blog
// Este archivo se asegura de que la sesión sea consistente

window.BlogConfig = {
    // Configuración de autenticación
    auth: {
        sessionKey: 'authenticated',
        redirectDelay: 1000,
        
        // Verificar si el usuario está autenticado
        isAuthenticated: function() {
            return sessionStorage.getItem(this.sessionKey) === 'true';
        },
        
        // Establecer autenticación
        setAuthenticated: function(value) {
            if (value) {
                sessionStorage.setItem(this.sessionKey, 'true');
                console.log('✅ Sesión establecida');
            } else {
                sessionStorage.removeItem(this.sessionKey);
                console.log('🚪 Sesión cerrada');
            }
        },
        
        // Limpiar sesión
        clearSession: function() {
            sessionStorage.removeItem(this.sessionKey);
            console.log('🧹 Sesión limpiada');
        }
    },
    
    // Configuración de páginas
    pages: {
        // Páginas que requieren autenticación
        protected: ['blog-viewer.html'],
        
        // Páginas públicas
        public: ['index.html', 'about.html', 'contact.html', 'test.html'],
        
        // Páginas con su propia autenticación
        adminPages: ['admin.html'],
        
        // Verificar si la página actual requiere autenticación
        requiresAuth: function() {
            const currentPage = window.location.pathname;
            return this.protected.some(page => currentPage.includes(page));
        },
        
        // Verificar si es página pública
        isPublic: function() {
            const currentPage = window.location.pathname;
            return this.public.some(page => currentPage.includes(page));
        }
    },
    
    // Configuración de Firebase
    firebase: {
        isAvailable: function() {
            return typeof firebase !== 'undefined';
        },
        
        getDatabase: function() {
            if (this.isAvailable()) {
                return firebase.database();
            }
            throw new Error('Firebase no está disponible');
        }
    },
    
    // Utilidades de navegación
    navigation: {
        // Redirigir con delay
        redirect: function(url, delay = 0) {
            setTimeout(() => {
                window.location.href = url;
            }, delay);
        },
        
        // Redirigir al inicio
        redirectToHome: function() {
            this.redirect('index.html');
        },
        
        // Redirigir al blog
        redirectToBlog: function() {
            this.redirect('blog-viewer.html');
        }
    },
    
    // Manejo de errores
    error: {
        show: function(message, container = 'body') {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 5px;
                z-index: 9999;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            `;
            errorDiv.textContent = message;
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    },
    
    // Inicializar configuración
    init: function() {
        console.log('🚀 Inicializando BlogConfig...');
        
        // Verificar página actual
        const currentPage = window.location.pathname;
        console.log('📄 Página actual:', currentPage);
        
        // Verificar autenticación para páginas protegidas
        if (this.pages.requiresAuth()) {
            console.log('🔐 Página protegida detectada');
            
            if (!this.auth.isAuthenticated()) {
                console.log('❌ No autenticado, redirigiendo...');
                this.navigation.redirectToHome();
                return false;
            }
            
            console.log('✅ Usuario autenticado');
        }
        
        // Verificar Firebase si es necesario
        if (this.pages.requiresAuth() || currentPage.includes('admin')) {
            if (!this.firebase.isAvailable()) {
                console.error('❌ Firebase no disponible');
                this.error.show('Error: Firebase no está disponible');
                return false;
            }
            
            console.log('✅ Firebase disponible');
        }
        
        return true;
    }
};

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', function() {
    window.BlogConfig.init();
});
