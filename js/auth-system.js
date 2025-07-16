// 🔐 SISTEMA DE AUTENTICACIÓN - Ale Gallo
// Este script protege todas las páginas del sitio web

(function() {
    'use strict';
    
    // Configuración
    const CONFIG = {
        SESSION_KEY: 'aleGalloAuth',
        LOGIN_PAGE: 'login.html',
        SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas
        CHECK_INTERVAL: 60000 // Verificar cada minuto
    };
    
    // Variables globales
    let sessionCheckInterval;
    let isAuthenticating = false;
    
    // Funciones principales
    function checkAuthentication() {
        if (isAuthenticating) return;
        
        const session = localStorage.getItem(CONFIG.SESSION_KEY);
        
        if (!session) {
            redirectToLogin();
            return false;
        }
        
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            if (now >= sessionData.expires) {
                // Sesión expirada
                localStorage.removeItem(CONFIG.SESSION_KEY);
                showSessionExpiredMessage();
                redirectToLogin();
                return false;
            }
            
            // Sesión válida - actualizar último acceso
            sessionData.lastAccess = now;
            localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));
            
            return true;
            
        } catch (error) {
            console.error('Error verificando sesión:', error);
            localStorage.removeItem(CONFIG.SESSION_KEY);
            redirectToLogin();
            return false;
        }
    }
    
    function redirectToLogin() {
        if (isAuthenticating) return;
        
        isAuthenticating = true;
        
        // Guardar la página actual para redireccionar después del login
        const currentPage = window.location.pathname + window.location.search;
        localStorage.setItem('returnToPage', currentPage);
        
        // Redirigir al login
        window.location.href = CONFIG.LOGIN_PAGE;
    }
    
    function showSessionExpiredMessage() {
        // Crear overlay de sesión expirada
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                backdrop-filter: blur(5px);
            ">
                <div style="
                    background: #1a1a1a;
                    border: 2px solid #f44336;
                    border-radius: 10px;
                    padding: 2rem;
                    text-align: center;
                    color: white;
                    max-width: 400px;
                    margin: 1rem;
                ">
                    <h2 style="color: #f44336; margin-bottom: 1rem;">⏱️ Sesión Expirada</h2>
                    <p style="margin-bottom: 1.5rem;">Tu sesión ha expirado por seguridad. Por favor, inicia sesión nuevamente.</p>
                    <button onclick="window.location.href='${CONFIG.LOGIN_PAGE}'" style="
                        background: #f44336;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Iniciar Sesión</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    function getUserInfo() {
        const session = localStorage.getItem(CONFIG.SESSION_KEY);
        if (!session) return null;
        
        try {
            return JSON.parse(session);
        } catch (error) {
            return null;
        }
    }
    
    function logout() {
        localStorage.removeItem(CONFIG.SESSION_KEY);
        localStorage.removeItem('returnToPage');
        
        // Mostrar mensaje de cierre de sesión
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                backdrop-filter: blur(5px);
            ">
                <div style="
                    background: #1a1a1a;
                    border: 2px solid #4caf50;
                    border-radius: 10px;
                    padding: 2rem;
                    text-align: center;
                    color: white;
                    max-width: 400px;
                    margin: 1rem;
                ">
                    <h2 style="color: #4caf50; margin-bottom: 1rem;">✅ Sesión Cerrada</h2>
                    <p style="margin-bottom: 1.5rem;">Has cerrado sesión correctamente.</p>
                    <p style="font-size: 0.9rem; color: #888;">Redirigiendo al login...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            window.location.href = CONFIG.LOGIN_PAGE;
        }, 2000);
    }
    
    function extendSession() {
        const session = localStorage.getItem(CONFIG.SESSION_KEY);
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            sessionData.expires = new Date().getTime() + CONFIG.SESSION_DURATION;
            localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));
            return true;
        } catch (error) {
            return false;
        }
    }
    
    function addLogoutButton() {
        // Buscar el elemento de navegación
        const nav = document.querySelector('nav ul');
        if (!nav) return;
        
        // Crear botón de logout
        const logoutItem = document.createElement('li');
        logoutItem.innerHTML = `
            <a href="#" onclick="AuthSystem.logout(); return false;" style="
                color: #f44336;
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ">
                🔓 Cerrar Sesión
            </a>
        `;
        
        nav.appendChild(logoutItem);
    }
    
    function addSessionInfo() {
        const userInfo = getUserInfo();
        if (!userInfo) return;
        
        // Crear indicador de sesión
        const sessionIndicator = document.createElement('div');
        sessionIndicator.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(74, 144, 226, 0.9);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                font-size: 0.8rem;
                z-index: 1000;
                backdrop-filter: blur(10px);
            ">
                👤 ${userInfo.user} | 🕒 ${new Date(userInfo.loginTime).toLocaleTimeString()}
            </div>
        `;
        
        document.body.appendChild(sessionIndicator);
    }
    
    function startSessionMonitoring() {
        // Verificar cada minuto
        sessionCheckInterval = setInterval(checkAuthentication, CONFIG.CHECK_INTERVAL);
        
        // Verificar cuando la página regresa al foco
        window.addEventListener('focus', checkAuthentication);
        
        // Extender sesión con actividad del usuario
        document.addEventListener('click', extendSession);
        document.addEventListener('keydown', extendSession);
        document.addEventListener('scroll', extendSession);
    }
    
    function stopSessionMonitoring() {
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
        }
    }
    
    // Inicialización
    function init() {
        // No proteger la página de login
        if (window.location.pathname.includes('login.html')) {
            return;
        }
        
        // Verificar autenticación inicial
        if (!checkAuthentication()) {
            return;
        }
        
        // Configurar monitoreo de sesión
        startSessionMonitoring();
        
        // Agregar elementos de UI cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addLogoutButton();
                addSessionInfo();
            });
        } else {
            addLogoutButton();
            addSessionInfo();
        }
    }
    
    // API pública
    window.AuthSystem = {
        checkAuthentication,
        logout,
        getUserInfo,
        extendSession,
        CONFIG
    };
    
    // Ejecutar inicialización
    init();
    
    // Limpiar al cerrar la página
    window.addEventListener('beforeunload', stopSessionMonitoring);
    
})();
