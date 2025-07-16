// JavaScript para páginas públicas (about.html, contact.html)
// Estas páginas no requieren autenticación

document.addEventListener('DOMContentLoaded', function() {
    
    // Función de logout para páginas públicas
    window.logout = function() {
        sessionStorage.removeItem('authenticated');
        
        // Mostrar notificación
        showNotification('Sesión cerrada correctamente');
        
        // Redirigir a index después de un pequeño delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    };
    
    // Verificar estado de autenticación y mostrar/ocultar botón de logout
    function checkAuthStatus() {
        const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
        const logoutBtn = document.getElementById('logout-btn');
        
        if (logoutBtn) {
            logoutBtn.style.display = isAuthenticated ? 'inline-block' : 'none';
        }
    }
    
    // Llamar a checkAuthStatus al cargar la página
    checkAuthStatus();
    
    // Función para mostrar notificaciones
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            z-index: 1000;
            font-weight: 600;
            color: white;
            background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
            animation: slideIn 0.3s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Agregar botón para acceder al blog si no está autenticado
    const isAuthenticated = sessionStorage.getItem('authenticated');
    
    if (!isAuthenticated) {
        // Crear botón para acceder al blog
        const accessButton = document.createElement('div');
        accessButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4a90e2, #64b5f6);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        accessButton.textContent = '📝 Acceder al Blog';
        accessButton.onclick = function() {
            window.location.href = 'index.html';
        };
        
        // Efecto hover
        accessButton.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)';
        };
        
        accessButton.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.3)';
        };
        
        document.body.appendChild(accessButton);
    }
    
    // Si hay un formulario de contacto, manejarlo
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validación simple
            if (!name || !email || !message) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Mostrar indicador de carga
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Guardar mensaje en Firebase
            BlogDB.saveContactMessage(name, email, message)
                .then(() => {
                    showNotification('¡Mensaje enviado correctamente! Te responderé pronto.');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Error al enviar mensaje:', error);
                    showNotification('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
    
    // Agregar estilos para las animaciones
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
    `;
    document.head.appendChild(style);
});
