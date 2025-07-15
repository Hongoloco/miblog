// Sistema de contacto público - sin autenticación requerida
document.addEventListener('DOMContentLoaded', function() {
    
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
    
    // Función para enviar email usando Formspree
    function sendEmailWithFormspree(name, email, message) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);
        formData.append('_replyto', email);
        formData.append('_subject', `Nuevo mensaje de ${name} desde el blog`);
        
        // Reemplaza 'TU_FORM_ID' con tu ID de Formspree
        // Regístrate en https://formspree.io/ y crea un formulario
        return fetch('https://formspree.io/f/TU_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
    }
    
    // Función alternativa usando EmailJS (más confiable)
    function sendEmailWithEmailJS(name, email, message) {
        // Configuración de EmailJS - necesitas registrarte en https://www.emailjs.com/
        emailjs.init('TU_PUBLIC_KEY');
        
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'ale21rock@gmail.com',
            reply_to: email
        };
        
        return emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams);
    }
    
    // Función para enviar email usando un servicio PHP simple
    function sendEmailWithPHP(name, email, message) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);
        formData.append('to', 'ale21rock@gmail.com');
        
        return fetch('send-email.php', {
            method: 'POST',
            body: formData
        });
    }
    
    // Manejar formulario de contacto
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
            
            // Siempre guardar en Firebase para el panel de administración
            BlogDB.saveContactMessage(name, email, message)
                .then(() => {
                    showNotification('¡Mensaje enviado correctamente! Te responderé pronto por email.');
                    contactForm.reset();
                    
                    // Crear mensaje para que copies y envíes manualmente
                    const emailContent = `
                        Nuevo mensaje de contacto:
                        
                        Nombre: ${name}
                        Email: ${email}
                        Mensaje: ${message}
                        Fecha: ${new Date().toLocaleString('es-AR')}
                        
                        Responder a: ${email}
                    `;
                    
                    console.log('Contenido del email:', emailContent);
                    
                    // Mostrar información adicional
                    setTimeout(() => {
                        showNotification('El mensaje se guardó correctamente. Revisa el panel de administración.', 'success');
                    }, 2000);
                    
                })
                .catch((error) => {
                    console.error('Error al guardar mensaje:', error);
                    showNotification('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
                })
                .finally(() => {
                    // Restaurar botón
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
});
