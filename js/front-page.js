// JavaScript para el front page
document.addEventListener('DOMContentLoaded', function() {
    
    // Configuración de autenticación
    const AUTH_CREDENTIALS = {
        username: 'alito',
        password: 'vinilo28'
    };
    
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
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            color: white;
            background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Función para scroll suave al contacto
    window.scrollToContact = function() {
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });
    };
    
    // Función para mostrar modal de login
    window.showLoginModal = function() {
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('username').focus();
    };
    
    // Función para cerrar modal de login
    window.closeLoginModal = function() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-error').style.display = 'none';
        document.getElementById('login-form').reset();
    };
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
        }
    });
    
    // Cerrar modal haciendo click fuera
    document.getElementById('login-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLoginModal();
        }
    });
    
    // Manejar login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password) {
            // Guardar sesión
            sessionStorage.setItem('authenticated', 'true');
            
            // Redirigir al blog
            showNotification('¡Acceso concedido! Redirigiendo al blog...');
            
            setTimeout(() => {
                window.location.href = 'blog-viewer.html';
            }, 1500);
        } else {
            document.getElementById('login-error').style.display = 'block';
            document.getElementById('login-error').textContent = 'Usuario o contraseña incorrectos';
        }
    });
    
    // Manejar formulario de contacto
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Validación
        if (!name || !email || !message) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, ingresa un email válido', 'error');
            return;
        }
        
        // Mostrar indicador de carga
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Guardar mensaje en Firebase
        BlogDB.saveContactMessage(name, email, message)
            .then(() => {
                showNotification('¡Mensaje enviado correctamente! Te responderé pronto.');
                document.getElementById('contact-form').reset();
                
                // Crear mensaje formateado para el log
                const emailContent = `
                    Nuevo mensaje de contacto:
                    
                    Nombre: ${name}
                    Email: ${email}
                    Mensaje: ${message}
                    Fecha: ${new Date().toLocaleString('es-AR')}
                    
                    Responder a: ${email}
                `;
                
                console.log('Mensaje guardado:', emailContent);
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
    
    // Animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.about-section, .contact-section').forEach(el => {
        observer.observe(el);
    });
    
    // Verificar si ya está autenticado
    if (sessionStorage.getItem('blog_authenticated') === 'true') {
        // Mostrar opción para acceder directamente al blog
        const heroActions = document.querySelector('.hero-actions');
        const blogButton = heroActions.querySelector('button');
        blogButton.textContent = 'Ir al Blog';
        blogButton.onclick = function() {
            window.location.href = 'blog.html';
        };
    }
});

// Estilos adicionales para animaciones
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
