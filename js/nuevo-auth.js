const AUTH_GUARD = {
    init() {
        if (!this.isAuthenticated() && !window.location.pathname.includes('login.html')) {
            this.redirectToLogin();
        }
        this.setupLogoutButton();
    },

    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    redirectToLogin() {
        window.location.href = 'login.html';
    },

    logout() {
        localStorage.removeItem('isAuthenticated');
        this.redirectToLogin();
    },

    setupLogoutButton() {
        if (this.isAuthenticated()) {
            const header = document.querySelector('header');
            if (header) {
                const logoutButton = document.createElement('button');
                logoutButton.className = 'logout-button';
                logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar sesión';
                logoutButton.onclick = () => this.logout();
                header.appendChild(logoutButton);
            }
        }
    }
};

// Inicializar el guard de autenticación
document.addEventListener('DOMContentLoaded', () => AUTH_GUARD.init());
