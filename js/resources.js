// JavaScript para la página de recursos
document.addEventListener('DOMContentLoaded', function() {
    
    // Función para mostrar formulario de agregar recurso
    window.showAddResourceForm = function() {
        document.getElementById('add-resource-form').style.display = 'block';
        document.getElementById('resource-name').focus();
    };
    
    // Función para ocultar formulario de agregar recurso
    window.hideAddResourceForm = function() {
        document.getElementById('add-resource-form').style.display = 'none';
        document.getElementById('new-resource-form').reset();
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
    
    // Manejar formulario de nuevo recurso
    document.getElementById('new-resource-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('resource-name').value;
        const url = document.getElementById('resource-url').value;
        const category = document.getElementById('resource-category').value;
        const description = document.getElementById('resource-description').value;
        
        // Aquí podrías guardar en Firebase si quieres persistencia
        // Por ahora, simplemente agregamos al DOM
        addResourceToPage(name, url, category, description);
        
        // Mostrar notificación
        showNotification('Recurso agregado correctamente');
        
        // Limpiar formulario y ocultarlo
        hideAddResourceForm();
    });
    
    // Función para agregar recurso a la página
    function addResourceToPage(name, url, category, description) {
        const categoryMap = {
            'trabajo': '💼 Herramientas de Trabajo',
            'desarrollo': '🚀 Desarrollo',
            'educacion': '📚 Educación',
            'utilidades': '🔧 Utilidades'
        };
        
        // Buscar la categoría correcta
        const categories = document.querySelectorAll('.resource-category');
        let targetCategory = null;
        
        categories.forEach(cat => {
            const title = cat.querySelector('h3').textContent;
            if (title === categoryMap[category]) {
                targetCategory = cat;
            }
        });
        
        if (targetCategory) {
            const resourceList = targetCategory.querySelector('.resource-list');
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${url}" target="_blank">${name}</a> - ${description}`;
            resourceList.appendChild(listItem);
        }
    }
    
    // Agregar estilos CSS adicionales
    const additionalStyles = `
        .resources-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .resource-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .resource-category {
            background-color: #1e1e1e;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #333;
        }
        
        .resource-category h3 {
            margin-top: 0;
            color: #4a90e2;
            border-bottom: 2px solid #4a90e2;
            padding-bottom: 0.5rem;
        }
        
        .resource-list {
            list-style: none;
            padding: 0;
        }
        
        .resource-list li {
            margin-bottom: 0.8rem;
            padding: 0.5rem;
            background-color: #2a2a2a;
            border-radius: 4px;
            border-left: 3px solid #4a90e2;
        }
        
        .resource-list a {
            color: #64b5f6;
            text-decoration: none;
            font-weight: 600;
        }
        
        .resource-list a:hover {
            color: #90caf9;
        }
        
        .add-resource-section {
            text-align: center;
            margin: 2rem 0;
        }
        
        .resource-form {
            background-color: #1e1e1e;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #333;
            margin-top: 2rem;
        }
        
        .form-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .btn-secondary {
            background-color: #666;
            color: white;
            padding: 0.8rem 2rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
        }
        
        .btn-secondary:hover {
            background-color: #777;
        }
        
        select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #333;
            background-color: #2a2a2a;
            color: #f0f0f0;
            border-radius: 4px;
            font-family: 'Montserrat', sans-serif;
        }
        
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
    
    // Inyectar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
});
