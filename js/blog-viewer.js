// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    
    if (!isAuthenticated) {
        // Si no está autenticado, redirigir al inicio
        window.location.href = 'index.html';
        return;
    }
    
    // Cargar los posts del blog
    loadBlogPosts();
});

// Función para cargar posts del blog
function loadBlogPosts() {
    const postsContainer = document.getElementById('blog-posts');
    
    // Referencia a la base de datos
    const database = firebase.database();
    const postsRef = database.ref('posts');
    
    postsRef.on('value', (snapshot) => {
        const posts = snapshot.val();
        postsContainer.innerHTML = '';
        
        if (!posts) {
            postsContainer.innerHTML = '<p>No hay entradas en el blog aún.</p>';
            return;
        }
        
        // Convertir objeto a array y ordenar por fecha
        const postsArray = Object.keys(posts).map(key => ({
            id: key,
            ...posts[key]
        }));
        
        postsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Crear HTML para cada post
        postsArray.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
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
                <span>📅 ${formatDate(post.date)}</span>
                <span>🏷️ ${post.category || 'General'}</span>
            </div>
            <div class="post-content">
                ${post.content.replace(/\n/g, '<br>')}
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
function formatDate(dateString) {
    const date = new Date(dateString);
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
        
        commentsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Crear HTML para cada comentario
        commentsArray.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <strong>${comment.name}</strong>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-content">
                    ${comment.content.replace(/\n/g, '<br>')}
                </div>
            `;
            commentsContainer.appendChild(commentElement);
        });
    });
}

// Función para cerrar sesión
function logout() {
    sessionStorage.removeItem('authenticated');
    window.location.href = 'index.html';
}
