// Cargar posts del blog al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Inicializando blog-viewer...');
    
    // Cargar los posts del blog directamente
    loadBlogPosts();
});

// Función para cargar posts del blog
function loadBlogPosts() {
    const postsContainer = document.getElementById('blog-posts');
    
    if (!postsContainer) {
        console.error('Contenedor de posts no encontrado');
        return;
    }
    
    // Mostrar mensaje de carga
    postsContainer.innerHTML = '<p>Cargando entradas del blog...</p>';
    
    console.log('Cargando posts desde Firebase...');
    
    // Usar BlogDB para obtener los posts
    BlogDB.getBlogPosts().then(snapshot => {
        const posts = snapshot.val();
        console.log('Posts recibidos:', posts);
        
        postsContainer.innerHTML = '';
        
        if (!posts) {
            postsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #aaa;">
                    <h3>📝 No hay entradas en el blog aún</h3>
                    <p>Usa el panel de administración para crear tu primera entrada.</p>
                    <a href="admin.html" style="color: #4a90e2;">Ir al Panel Admin</a>
                </div>
            `;
            return;
        }
        
        // Convertir objeto a array y ordenar por fecha
        const postsArray = Object.keys(posts).map(key => ({
            id: key,
            ...posts[key]
        }));
        
        postsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        console.log('Posts procesados:', postsArray.length);
        
        // Crear HTML para cada post
        postsArray.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }, (error) => {
        console.error('Error al cargar posts:', error);
        postsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #f44336;">
                <h3>❌ Error al cargar las entradas</h3>
                <p>Verifica la configuración de Firebase.</p>
                <button onclick="location.reload()" style="background: #4a90e2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                    Reintentar
                </button>
            </div>
        `;
    });
}

// Función para crear elemento HTML de un post
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'blog-post';
    postDiv.innerHTML = `
        <article>
            <h3>${post.title}</h3>
            <div class="post-meta">
                <span>📅 ${formatDate(post.timestamp)}</span>
                <span>👤 ${post.author}</span>
            </div>
            <div class="post-content">
                ${post.summary ? post.summary.replace(/\n/g, '<br>') : post.content.substring(0, 200) + '...'}
            </div>
            <div class="post-actions">
                <button onclick="showComments('${post.id}')" class="btn-comments">
                    💬 Ver comentarios
                </button>
            </div>
            <div id="comments-${post.id}" class="comments-section" style="display: none;">
                <div class="comments-container">
                    <h4>Comentarios</h4>
                    <div id="comments-list-${post.id}" class="comments-list">
                        <!-- Comentarios se cargarán aquí -->
                    </div>
                </div>
            </div>
        </article>
    `;
    
    return postDiv;
}

// Función para formatear fecha
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para mostrar/ocultar comentarios
function showComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    const isVisible = commentsSection.style.display !== 'none';
    
    if (isVisible) {
        commentsSection.style.display = 'none';
    } else {
        commentsSection.style.display = 'block';
        loadComments(postId);
    }
}

// Función para cargar comentarios
function loadComments(postId) {
    const commentsContainer = document.getElementById(`comments-list-${postId}`);
    const database = firebase.database();
    const commentsRef = database.ref(`comments/${postId}`);
    
    commentsRef.on('value', (snapshot) => {
        const comments = snapshot.val();
        commentsContainer.innerHTML = '';
        
        if (!comments) {
            commentsContainer.innerHTML = '<p>No hay comentarios aún.</p>';
            return;
        }
        
        // Convertir objeto a array y ordenar por fecha
        const commentsArray = Object.keys(comments).map(key => ({
            id: key,
            ...comments[key]
        }));
        
        commentsArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Crear HTML para cada comentario
        commentsArray.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <strong>${comment.name}</strong>
                    <span class="comment-date">${formatDate(comment.timestamp)}</span>
                </div>
                <div class="comment-content">
                    ${comment.comment.replace(/\n/g, '<br>')}
                </div>
            `;
            commentsContainer.appendChild(commentElement);
        });
    });
}
