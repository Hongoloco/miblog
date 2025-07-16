// 🔐 Sistema de Autenticación Simple - Ale Gallo Gaming Universe
// Sistema unificado para manejar login/logout en toda la web

class AuthSystem {
    constructor() {
        this.isLoggedIn = false;
        this.sessionKey = 'gaming-auth-session';
        this.sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupLogoutButton();
        this.setupLoginButton();
    }

    checkAuthStatus() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = Date.now();
                
                // Verificar si la sesión no ha expirado
                if (now - sessionData.timestamp < this.sessionDuration) {
                    this.isLoggedIn = true;
                    this.showLogoutButton();
                } else {
                    // Sesión expirada
                    this.logout();
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                this.logout();
            }
        } else {
            this.isLoggedIn = false;
            this.hideLogoutButton();
        }
    }

    login(password = null) {
        // Si no se proporciona password, mostrar prompt
        if (!password) {
            password = prompt('🔐 Ingresa la contraseña para acceder:');
        }
        
        if (!password) {
            return false;
        }
        
        // Contraseña simple para demo (puedes cambiarla)
        const correctPassword = 'gaming2025';
        
        if (password === correctPassword) {
            // Crear sesión
            const sessionData = {
                timestamp: Date.now(),
                user: 'Ale Gallo',
                expires: Date.now() + this.sessionDuration
            };
            
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            this.isLoggedIn = true;
            this.showLogoutButton();
            this.showNotification('✅ Sesión iniciada correctamente');
            return true;
        } else {
            this.showNotification('❌ Contraseña incorrecta');
            return false;
        }
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        this.isLoggedIn = false;
        this.hideLogoutButton();
        this.showNotification('🚪 Sesión cerrada');
        
        // Opcional: redirigir a login
        setTimeout(() => {
            if (confirm('¿Quieres ir a la página de login?')) {
                window.location.href = 'login.html';
            }
        }, 1000);
    }

    showLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
        
        // Mostrar botón de login si existe
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
    }

    hideLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
        
        // Mostrar botón de login si existe
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
    }

    setupLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    this.logout();
                }
            });
        }
    }

    setupLoginButton() {
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.login();
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${message.includes('❌') ? '#e74c3c' : '#4a90e2'};
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
            setTimeout(() => {
                try {
                    document.body.removeChild(notification);
                } catch (e) {
                    // Elemento ya removido
                }
            }, 300);
        }, 3000);
    }

    // Método para verificar si está logueado (para otras funciones)
    isAuthenticated() {
        return this.isLoggedIn;
    }

    // Método para obtener información de la sesión
    getSessionInfo() {
        if (!this.isLoggedIn) return null;
        
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            try {
                return JSON.parse(session);
            } catch (error) {
                return null;
            }
        }
        return null;
    }
}

// Instanciar el sistema de autenticación
let authSystem;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthSystem();
});

// Funciones globales para usar en HTML
function logout() {
    if (authSystem) {
        authSystem.logout();
    }
}

function login(password = null) {
    if (authSystem) {
        return authSystem.login(password);
    }
    return false;
}

function isAuthenticated() {
    return authSystem ? authSystem.isAuthenticated() : false;
}

// Agregar botón de login flotante si no está logueado
function addLoginButton() {
    if (authSystem && !authSystem.isAuthenticated()) {
        const loginFloatingBtn = document.createElement('button');
        loginFloatingBtn.id = 'login-floating-btn';
        loginFloatingBtn.innerHTML = '🔐';
        loginFloatingBtn.title = 'Iniciar Sesión';
        loginFloatingBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4a90e2, #357abd);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        loginFloatingBtn.addEventListener('click', () => {
            authSystem.login();
        });
        
        loginFloatingBtn.addEventListener('mouseenter', () => {
            loginFloatingBtn.style.transform = 'scale(1.1)';
        });
        
        loginFloatingBtn.addEventListener('mouseleave', () => {
            loginFloatingBtn.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(loginFloatingBtn);
    }
}

// Agregar botón de login flotante después de un delay
setTimeout(() => {
    addLoginButton();
}, 1000);

// Estilos adicionales para el botón de logout
const authStyles = `
    #logout-btn {
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    #logout-btn:hover {
        background: rgba(231, 76, 60, 0.2) !important;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
    }
    
    #login-floating-btn:hover {
        background: linear-gradient(135deg, #357abd, #2c5aa0) !important;
    }
`;

// Agregar estilos
const authStyleSheet = document.createElement('style');
authStyleSheet.textContent = authStyles;
document.head.appendChild(authStyleSheet);
