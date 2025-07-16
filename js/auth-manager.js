// Sistema de Autenticación
class AuthManager {
    constructor() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.loginTime = localStorage.getItem('loginTime');
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.addLogoutButton();
        this.setupSessionTimeout();
    }

    checkAuthStatus() {
        // Verificar si la sesión ha expirado
        if (this.isLoggedIn && this.loginTime) {
            const loginDate = new Date(this.loginTime);
            const currentDate = new Date();
            const timeDiff = currentDate.getTime() - loginDate.getTime();
            
            if (timeDiff > this.sessionTimeout) {
                this.logout();
                return;
            }
        }

        // Si no está logueado, redirigir al login
        if (!this.isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
    }

    addLogoutButton() {
        if (!this.isLoggedIn) return;

        // Crear botón de logout
        const logoutButton = document.createElement('div');
        logoutButton.id = 'logout-button';
        logoutButton.innerHTML = `
            <button onclick="authManager.logout()" class="logout-btn">
                <span class="logout-icon">🚪</span>
                <span class="logout-text">Cerrar Sesión</span>
            </button>
        `;
        
        // Agregar estilos
        this.addLogoutStyles();
        
        // Agregar al DOM
        document.body.appendChild(logoutButton);
    }

    addLogoutStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #logout-button {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
            }
            
            .logout-btn {
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                font-family: 'Inter', sans-serif;
            }
            
            .logout-btn:hover {
                background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
            }
            
            .logout-btn:active {
                transform: translateY(0);
            }
            
            .logout-icon {
                font-size: 12px;
            }
            
            .logout-text {
                font-size: 12px;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                #logout-button {
                    top: 10px;
                    right: 10px;
                }
                
                .logout-btn {
                    padding: 8px 12px;
                    font-size: 11px;
                }
                
                .logout-icon {
                    font-size: 11px;
                }
                
                .logout-text {
                    font-size: 11px;
                }
            }
            
            /* Ajustar para que no interfiera con el edit-mode-toggle */
            #edit-mode-toggle {
                bottom: 20px;
                right: 20px;
            }
            
            @media (max-width: 768px) {
                #edit-mode-toggle {
                    bottom: 10px;
                    right: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    logout() {
        // Confirmar logout
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            // Limpiar localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTime');
            
            // Redirigir al login
            window.location.href = 'login.html';
        }
    }

    setupSessionTimeout() {
        // Verificar sesión cada 5 minutos
        setInterval(() => {
            this.checkAuthStatus();
        }, 5 * 60 * 1000);
    }

    // Método para renovar la sesión
    renewSession() {
        if (this.isLoggedIn) {
            localStorage.setItem('loginTime', new Date().toISOString());
        }
    }
}

// Inicializar el sistema de autenticación
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Renovar sesión en actividad del usuario
document.addEventListener('click', () => {
    if (window.authManager) {
        window.authManager.renewSession();
    }
});

document.addEventListener('keydown', () => {
    if (window.authManager) {
        window.authManager.renewSession();
    }
});

export { AuthManager };
