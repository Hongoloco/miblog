// JavaScript para el blog simple
document.addEventListener('DOMContentLoaded', function() {
    
    // Cargar contenido guardado del localStorage
    loadSavedContent();
    
    // Función para mostrar formulario
    window.showAddForm = function() {
        document.getElementById('add-content-form').style.display = 'block';
        document.getElementById('content-title').focus();
    };
    
    // Función para ocultar formulario
    window.hideAddForm = function() {
        document.getElementById('add-content-form').style.display = 'none';
        document.getElementById('new-content-form').reset();
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
    
    // Función para filtrar contenido
    window.filterContent = function(type) {
        const posts = document.querySelectorAll('.blog-post');
        const buttons = document.querySelectorAll('.filter-btn');
        
        // Actualizar botones activos
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${type}"]`).classList.add('active');
        
        // Filtrar posts
        posts.forEach(post => {
            if (type === 'all' || post.dataset.type === type) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    };
    
    // Función para editar post
    window.editPost = function(button) {
        const post = button.closest('.blog-post');
        const title = post.querySelector('h3').textContent;
        const content = post.querySelector('.post-content p').textContent;
        const url = post.querySelector('.post-url a') ? post.querySelector('.post-url a').href : '';
        const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent).join(', ');
        
        // Llenar formulario con datos existentes
        document.getElementById('content-title').value = title.replace(/^[📝🔗📰💡🛠️]\s/, '');
        document.getElementById('content-description').value = content;
        document.getElementById('content-url').value = url;
        document.getElementById('content-tags').value = tags;
        
        // Eliminar post existente
        post.remove();
        
        // Mostrar formulario
        showAddForm();
    };
    
    // Función para eliminar post
    window.deletePost = function(button) {
        if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
            const post = button.closest('.blog-post');
            post.remove();
            saveContent();
            showNotification('Contenido eliminado correctamente');
        }
    };
    
    // Manejar formulario de nuevo contenido
    document.getElementById('new-content-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('content-title').value;
        const type = document.getElementById('content-type').value;
        const url = document.getElementById('content-url').value;
        const description = document.getElementById('content-description').value;
        const tags = document.getElementById('content-tags').value;
        
        // Crear nuevo post
        createPost(title, type, url, description, tags);
        
        // Limpiar formulario y ocultarlo
        hideAddForm();
        
        // Guardar contenido
        saveContent();
        
        showNotification('Contenido agregado correctamente');
    });
    
    // Función para crear nuevo post
    function createPost(title, type, url, description, tags) {
        const typeIcons = {
            'nota': '📝',
            'enlace': '🔗',
            'articulo': '📰',
            'idea': '💡',
            'recurso': '🛠️'
        };
        
        const typeNames = {
            'nota': 'Nota Personal',
            'enlace': 'Enlace Interesante',
            'articulo': 'Artículo',
            'idea': 'Ideas',
            'recurso': 'Recurso Útil'
        };
        
        const now = new Date();
        const dateString = now.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const postHTML = `
            <article class="blog-post" data-type="${type}">
                <header class="post-header">
                    <h3>${typeIcons[type]} ${title}</h3>
                    <span class="post-date">${dateString}</span>
                    <span class="post-type">${typeIcons[type]} ${typeNames[type]}</span>
                </header>
                <div class="post-content">
                    <p>${description}</p>
                    ${url ? `<div class="post-url"><a href="${url}" target="_blank">🌐 Visitar sitio</a></div>` : ''}
                    ${tags ? `<div class="post-tags">${tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}</div>` : ''}
                </div>
                <div class="post-actions">
                    <button onclick="editPost(this)" class="btn-edit">✏️ Editar</button>
                    <button onclick="deletePost(this)" class="btn-delete">🗑️ Eliminar</button>
                </div>
            </article>
        `;
        
        const blogPosts = document.getElementById('blog-posts');
        blogPosts.insertAdjacentHTML('afterbegin', postHTML);
    }
    
    // Función para guardar contenido en localStorage
    function saveContent() {
        const posts = document.querySelectorAll('.blog-post');
        const content = [];
        
        posts.forEach(post => {
            const title = post.querySelector('h3').textContent;
            const type = post.dataset.type;
            const date = post.querySelector('.post-date').textContent;
            const description = post.querySelector('.post-content p').textContent;
            const url = post.querySelector('.post-url a') ? post.querySelector('.post-url a').href : '';
            const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent);
            
            content.push({
                title,
                type,
                date,
                description,
                url,
                tags
            });
        });
        
        localStorage.setItem('blogContent', JSON.stringify(content));
    }
    
    // Función para cargar contenido guardado
    function loadSavedContent() {
        const savedContent = localStorage.getItem('blogContent');
        if (savedContent) {
            const content = JSON.parse(savedContent);
            const blogPosts = document.getElementById('blog-posts');
            
            // Limpiar contenido existente excepto los ejemplos
            const existingPosts = blogPosts.querySelectorAll('.blog-post');
            existingPosts.forEach(post => {
                if (!post.querySelector('h3').textContent.includes('Bienvenida') && 
                    !post.querySelector('h3').textContent.includes('GitHub')) {
                    post.remove();
                }
            });
            
            // Agregar contenido guardado
            content.forEach(item => {
                if (!item.title.includes('Bienvenida') && !item.title.includes('GitHub')) {
                    createPostFromSaved(item);
                }
            });
        }
    }
    
    // Función para crear post desde contenido guardado
    function createPostFromSaved(item) {
        const typeIcons = {
            'nota': '📝',
            'enlace': '🔗',
            'articulo': '📰',
            'idea': '💡',
            'recurso': '🛠️'
        };
        
        const typeNames = {
            'nota': 'Nota Personal',
            'enlace': 'Enlace Interesante',
            'articulo': 'Artículo',
            'idea': 'Ideas',
            'recurso': 'Recurso Útil'
        };
        
        const postHTML = `
            <article class="blog-post" data-type="${item.type}">
                <header class="post-header">
                    <h3>${item.title}</h3>
                    <span class="post-date">${item.date}</span>
                    <span class="post-type">${typeIcons[item.type]} ${typeNames[item.type]}</span>
                </header>
                <div class="post-content">
                    <p>${item.description}</p>
                    ${item.url ? `<div class="post-url"><a href="${item.url}" target="_blank">🌐 Visitar sitio</a></div>` : ''}
                    ${item.tags.length > 0 ? `<div class="post-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                </div>
                <div class="post-actions">
                    <button onclick="editPost(this)" class="btn-edit">✏️ Editar</button>
                    <button onclick="deletePost(this)" class="btn-delete">🗑️ Eliminar</button>
                </div>
            </article>
        `;
        
        const blogPosts = document.getElementById('blog-posts');
        blogPosts.insertAdjacentHTML('afterbegin', postHTML);
    }
    
    // Agregar estilos CSS
    const additionalStyles = `
        .blog-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .add-content-section {
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .content-form {
            background-color: #1e1e1e;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #333;
            margin-top: 2rem;
        }
        
        .filters-section {
            margin-bottom: 2rem;
        }
        
        .filter-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
        }
        
        .filter-btn {
            background-color: #2a2a2a;
            color: #f0f0f0;
            border: 1px solid #333;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        
        .filter-btn:hover {
            background-color: #3a3a3a;
        }
        
        .filter-btn.active {
            background-color: #4a90e2;
            border-color: #4a90e2;
        }
        
        .blog-posts {
            display: grid;
            gap: 2rem;
        }
        
        .blog-post {
            background-color: #1e1e1e;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 1.5rem;
            border-left: 4px solid #4a90e2;
        }
        
        .post-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .post-header h3 {
            margin: 0;
            color: #f0f0f0;
            font-size: 1.2rem;
        }
        
        .post-date {
            color: #aaa;
            font-size: 0.9rem;
        }
        
        .post-type {
            background-color: #4a90e2;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
        }
        
        .post-content {
            margin-bottom: 1rem;
        }
        
        .post-url {
            margin: 0.5rem 0;
        }
        
        .post-url a {
            color: #64b5f6;
            text-decoration: none;
        }
        
        .post-url a:hover {
            text-decoration: underline;
        }
        
        .post-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .tag {
            background-color: #2a2a2a;
            color: #f0f0f0;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
        }
        
        .post-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .btn-edit, .btn-delete {
            background-color: #2a2a2a;
            color: #f0f0f0;
            border: 1px solid #333;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        
        .btn-edit:hover {
            background-color: #4a90e2;
        }
        
        .btn-delete:hover {
            background-color: #f44336;
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
        
        @media (max-width: 768px) {
            .post-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .filter-buttons {
                justify-content: flex-start;
            }
            
            .form-buttons {
                flex-direction: column;
            }
        }
    `;
    
    // Inyectar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
});
