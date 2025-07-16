// 🛡️ Sistema de Autenticación con Protección Total - Ale Gallo Gaming Universe
// Sistema que bloquea completamente el acceso hasta que el usuario se autentique

class AuthGuard {
    constructor() {
        this.isLoggedIn = false;
        this.sessionKey = 'gaming-auth-session';
        this.sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
        this.correctUsername = 'alito';
        this.correctPassword = 'vinilo28';
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthGuard();
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
                    return true;
                } else {
                    // Sesión expirada
                    this.logout();
                    return false;
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                this.logout();
                return false;
            }
        } else {
            this.isLoggedIn = false;
            return false;
        }
    }

    setupAuthGuard() {
        if (!this.isLoggedIn) {
            this.showLoginScreen();
        } else {
            this.showMainContent();
            this.setupLogoutButton();
        }
    }

    showLoginScreen() {
        // Ocultar todo el contenido principal
        const body = document.body;
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        // Ocultar elementos principales
        if (mainContent) mainContent.style.display = 'none';
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
        
        // Crear pantalla de login
        const loginScreen = document.createElement('div');
        loginScreen.id = 'auth-login-screen';
        loginScreen.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h1>🎮 Ale Gallo Gaming Universe</h1>
                    <p>Acceso Restringido</p>
                </div>
                
                <div class="auth-form">
                    <div class="auth-icon">🔐</div>
                    <h2>Iniciar Sesión</h2>
                    <p>Introduce tus credenciales para acceder al contenido</p>
                    
                    <form id="auth-login-form">
                        <div class="input-group">
                            <input type="text" id="auth-username" placeholder="Usuario..." required>
                            <input type="password" id="auth-password" placeholder="Contraseña..." required>
                            <button type="submit" class="btn-login">
                                <span>🚀 Entrar</span>
                            </button>
                        </div>
                    </form>
                    
                    <div class="auth-footer">
                        <p>💡 Usuario: alito</p>
                    </div>
                </div>
                
                <div class="auth-background">
                    <div class="floating-shape shape-1"></div>
                    <div class="floating-shape shape-2"></div>
                    <div class="floating-shape shape-3"></div>
                </div>
            </div>
        `;
        
        body.appendChild(loginScreen);
        this.addLoginStyles();
        this.setupLoginForm();
    }

    showMainContent() {
        // Mostrar contenido principal
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        if (mainContent) mainContent.style.display = 'block';
        if (header) header.style.display = 'block';
        if (footer) footer.style.display = 'block';
        
        // Remover pantalla de login si existe
        const loginScreen = document.getElementById('auth-login-screen');
        if (loginScreen) {
            loginScreen.remove();
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('auth-login-form');
        const usernameInput = document.getElementById('auth-username');
        const passwordInput = document.getElementById('auth-password');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = usernameInput.value;
                const password = passwordInput.value;
                this.attemptLogin(username, password);
            });
        }
        
        // Auto-focus en el input de usuario
        if (usernameInput) {
            usernameInput.focus();
        }
    }

    attemptLogin(username, password) {
        const usernameInput = document.getElementById('auth-username');
        const passwordInput = document.getElementById('auth-password');
        
        if (!username || !password) {
            this.showLoginError('Por favor ingresa usuario y contraseña');
            return false;
        }
        
        if (username === this.correctUsername && password === this.correctPassword) {
            // Crear sesión
            const sessionData = {
                timestamp: Date.now(),
                user: username,
                expires: Date.now() + this.sessionDuration
            };
            
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            this.isLoggedIn = true;
            
            // Mostrar mensaje de éxito
            this.showLoginSuccess();
            
            // Después de 1 segundo, mostrar el contenido principal
            setTimeout(() => {
                this.showMainContent();
                this.setupLogoutButton();
            }, 1000);
            
            return true;
        } else {
            if (username !== this.correctUsername) {
                this.showLoginError('Usuario incorrecto');
                usernameInput.value = '';
                usernameInput.focus();
            } else {
                this.showLoginError('Contraseña incorrecta');
                passwordInput.value = '';
                passwordInput.focus();
            }
            return false;
        }
    }

    showLoginError(message) {
        const existingError = document.querySelector('.auth-error');
        if (existingError) existingError.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        
        const form = document.getElementById('auth-login-form');
        if (form) {
            form.appendChild(errorDiv);
        }
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    showLoginSuccess() {
        const existingError = document.querySelector('.auth-error');
        if (existingError) existingError.remove();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success';
        successDiv.textContent = '✅ Acceso concedido';
        
        const form = document.getElementById('auth-login-form');
        if (form) {
            form.appendChild(successDiv);
        }
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        this.isLoggedIn = false;
        
        // Redirigir automáticamente al login
        window.location.href = 'login-standalone.html';
    }

    setupLogoutButton() {
        // Buscar botón de logout en el header
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    this.logout();
                }
            });
        }
    }

    addLoginStyles() {
        const styles = `
            #auth-login-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: 'Montserrat', sans-serif;
            }
            
            .auth-container {
                position: relative;
                max-width: 400px;
                width: 90%;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                text-align: center;
                color: white;
            }
            
            .auth-header h1 {
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(45deg, #4a90e2, #7b68ee);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .auth-header p {
                color: #aaa;
                margin-bottom: 2rem;
            }
            
            .auth-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .auth-form h2 {
                color: white;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
            }
            
            .auth-form > p {
                color: #ccc;
                margin-bottom: 2rem;
                font-size: 0.9rem;
            }
            
            .input-group {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            #auth-username, #auth-password {
                padding: 1rem;
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 1rem;
                font-family: inherit;
                transition: all 0.3s ease;
            }
            
            #auth-username:focus, #auth-password:focus {
                outline: none;
                border-color: #4a90e2;
                box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
            }
            
            #auth-username::placeholder, #auth-password::placeholder {
                color: #aaa;
            }
            
            .btn-login {
                padding: 1rem 2rem;
                background: linear-gradient(45deg, #4a90e2, #357abd);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            
            .btn-login:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(74, 144, 226, 0.4);
            }
            
            .btn-login:active {
                transform: translateY(0);
            }
            
            .auth-footer {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .auth-footer p {
                color: #888;
                font-size: 0.8rem;
            }
            
            .auth-error {
                color: #e74c3c;
                background: rgba(231, 76, 60, 0.1);
                border: 1px solid rgba(231, 76, 60, 0.3);
                padding: 0.8rem;
                border-radius: 8px;
                margin-top: 1rem;
                font-size: 0.9rem;
            }
            
            .auth-success {
                color: #27ae60;
                background: rgba(39, 174, 96, 0.1);
                border: 1px solid rgba(39, 174, 96, 0.3);
                padding: 0.8rem;
                border-radius: 8px;
                margin-top: 1rem;
                font-size: 0.9rem;
            }
            
            .auth-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            
            .floating-shape {
                position: absolute;
                border-radius: 50%;
                background: linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(123, 104, 238, 0.1));
                animation: float 6s ease-in-out infinite;
            }
            
            .shape-1 {
                width: 80px;
                height: 80px;
                top: 20%;
                left: 10%;
                animation-delay: 0s;
            }
            
            .shape-2 {
                width: 60px;
                height: 60px;
                top: 60%;
                right: 15%;
                animation-delay: 2s;
            }
            
            .shape-3 {
                width: 40px;
                height: 40px;
                bottom: 20%;
                left: 20%;
                animation-delay: 4s;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            
            /* Responsive */
            @media (max-width: 480px) {
                .auth-container {
                    padding: 1.5rem;
                }
                
                .auth-header h1 {
                    font-size: 1.5rem;
                }
                
                .auth-form h2 {
                    font-size: 1.3rem;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Método para verificar si está logueado (para otras funciones)
    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Instanciar el sistema de autenticación
let authGuard;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    authGuard = new AuthGuard();
});

// Función global para logout
function logout() {
    if (authGuard) {
        authGuard.logout();
    }
}

// Función para verificar si está autenticado
function isAuthenticated() {
    return authGuard ? authGuard.isAuthenticated() : false;
}
