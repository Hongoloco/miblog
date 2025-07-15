// Sistema de administración completo
const Admin = {
    // Credenciales (las mismas que el sistema anterior)
    credentials: {
        username: 'alito',
        password: 'vinilo28'
    },

    // Verificar si está autenticado
    isAuthenticated: function() {
        return sessionStorage.getItem('authenticated') === 'true';
    },

    // Función de login
    login: function(username, password) {
        if (username === this.credentials.username && password === this.credentials.password) {
            sessionStorage.setItem('authenticated', 'true');
            return true;
        }
        return false;
    },

    // Función de logout
    logout: function() {
        sessionStorage.removeItem('authenticated');
        this.showLoginScreen();
    },

    // Mostrar pantalla de login
    showLoginScreen: function() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-panel').style.display = 'none';
    },

    // Mostrar panel de administración
    showAdminPanel: function() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        this.loadDashboard();
    },

    // Inicializar sistema
    init: function() {
        // Configurar formulario de login
        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            if (this.login(username, password)) {
                this.showAdminPanel();
            } else {
                document.getElementById('admin-login-error').style.display = 'block';
                document.getElementById('admin-login-error').textContent = 'Usuario o contraseña incorrectos';
            }
        });

        // Configurar formulario de nuevo post
        document.getElementById('new-post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });

        // Configurar formulario de credenciales
        document.getElementById('change-credentials-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changeCredentials();
        });

        // Verificar autenticación
        if (this.isAuthenticated()) {
            this.showAdminPanel();
        } else {
            this.showLoginScreen();
        }
    },

    // Cargar dashboard
    loadDashboard: function() {
        this.loadStats();
        this.loadPosts();
        this.loadComments();
        this.loadMessages();
    },

    // Cargar estadísticas
    loadStats: function() {
        // Contar posts
        BlogDB.getBlogPosts().then(snapshot => {
            const posts = snapshot.val();
            const count = posts ? Object.keys(posts).length : 0;
            document.getElementById('posts-count').textContent = count;
        });

        // Contar comentarios
        database.ref('comments').once('value').then(snapshot => {
            const comments = snapshot.val();
            let totalComments = 0;
            if (comments) {
                Object.values(comments).forEach(postComments => {
                    totalComments += Object.keys(postComments).length;
                });
            }
            document.getElementById('comments-count').textContent = totalComments;
        });

        // Contar mensajes
        database.ref('contact-messages').once('value').then(snapshot => {
            const messages = snapshot.val();
            const totalMessages = messages ? Object.keys(messages).length : 0;
            const unreadMessages = messages ? Object.values(messages).filter(msg => !msg.read).length : 0;
            
            document.getElementById('messages-count').textContent = totalMessages;
            document.getElementById('unread-messages-count').textContent = unreadMessages;
        });
    },

    // Cargar posts
    loadPosts: function() {
        BlogDB.getBlogPosts().then(snapshot => {
            const posts = snapshot.val();
            const postsList = document.getElementById('posts-list');
            
            if (!posts) {
                postsList.innerHTML = '<p>No hay posts disponibles.</p>';
                return;
            }

            const postsArray = Object.entries(posts).map(([id, post]) => ({
                id,
                ...post
            }));

            postsArray.sort((a, b) => b.timestamp - a.timestamp);

            postsList.innerHTML = postsArray.map(post => `
                <div class="data-item">
                    <div class="data-item-content">
                        <div class="data-item-title">${post.title}</div>
                        <div class="data-item-meta">
                            Publicado el ${new Date(post.timestamp).toLocaleDateString('es-AR')} por ${post.author}
                        </div>
                        <div class="data-item-text">${post.summary}</div>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn-small btn-edit" onclick="Admin.editPost('${post.id}')">Editar</button>
                        <button class="btn-small btn-delete" onclick="Admin.deletePost('${post.id}')">Eliminar</button>
                        <button class="btn-small btn-secondary" onclick="window.open('post.html?id=${post.id}', '_blank')">Ver</button>
                    </div>
                </div>
            `).join('');
        });
    },

    // Cargar comentarios
    loadComments: function() {
        database.ref('comments').once('value').then(snapshot => {
            const comments = snapshot.val();
            const commentsList = document.getElementById('comments-list');
            
            if (!comments) {
                commentsList.innerHTML = '<p>No hay comentarios disponibles.</p>';
                return;
            }

            const commentsArray = [];
            Object.entries(comments).forEach(([postId, postComments]) => {
                Object.entries(postComments).forEach(([commentId, comment]) => {
                    commentsArray.push({
                        id: commentId,
                        postId,
                        ...comment
                    });
                });
            });

            commentsArray.sort((a, b) => b.timestamp - a.timestamp);

            commentsList.innerHTML = commentsArray.map(comment => `
                <div class="data-item">
                    <div class="data-item-content">
                        <div class="data-item-title">${comment.name}</div>
                        <div class="data-item-meta">
                            ${new Date(comment.timestamp).toLocaleDateString('es-AR')} - Post ID: ${comment.postId}
                        </div>
                        <div class="data-item-text">${comment.comment}</div>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn-small btn-delete" onclick="Admin.deleteComment('${comment.postId}', '${comment.id}')">Eliminar</button>
                    </div>
                </div>
            `).join('');
        });
    },

    // Cargar mensajes
    loadMessages: function() {
        database.ref('contact-messages').once('value').then(snapshot => {
            const messages = snapshot.val();
            const messagesList = document.getElementById('messages-list');
            
            if (!messages) {
                messagesList.innerHTML = '<p>No hay mensajes disponibles.</p>';
                return;
            }

            const messagesArray = Object.entries(messages).map(([id, message]) => ({
                id,
                ...message
            }));

            messagesArray.sort((a, b) => b.timestamp - a.timestamp);

            messagesList.innerHTML = messagesArray.map(message => `
                <div class="data-item ${message.read ? 'status-read' : 'status-unread'}">
                    <div class="data-item-content">
                        <div class="data-item-title">${message.name} (${message.email})</div>
                        <div class="data-item-meta">
                            ${new Date(message.timestamp).toLocaleDateString('es-AR')} - ${message.read ? 'Leído' : 'Sin leer'}
                        </div>
                        <div class="data-item-text">${message.message}</div>
                    </div>
                    <div class="data-item-actions">
                        ${!message.read ? `<button class="btn-small btn-mark-read" onclick="Admin.markAsRead('${message.id}')">Marcar como leído</button>` : ''}
                        <button class="btn-small btn-delete" onclick="Admin.deleteMessage('${message.id}')">Eliminar</button>
                    </div>
                </div>
            `).join('');
        });
    },

    // Crear post
    createPost: function() {
        const title = document.getElementById('post-title').value;
        const summary = document.getElementById('post-summary').value;
        const content = document.getElementById('post-content').value;

        if (!title || !summary || !content) {
            alert('Por favor, completa todos los campos');
            return;
        }

        BlogDB.addBlogPost(title, content, summary).then(() => {
            alert('Post creado exitosamente');
            document.getElementById('new-post-form').reset();
            this.hideCreatePost();
            this.loadPosts();
            this.loadStats();
        }).catch(error => {
            console.error('Error:', error);
            alert('Error al crear el post');
        });
    },

    // Eliminar post
    deletePost: function(postId) {
        if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
            database.ref(`blog-posts/${postId}`).remove().then(() => {
                alert('Post eliminado exitosamente');
                this.loadPosts();
                this.loadStats();
            }).catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el post');
            });
        }
    },

    // Eliminar comentario
    deleteComment: function(postId, commentId) {
        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            database.ref(`comments/${postId}/${commentId}`).remove().then(() => {
                alert('Comentario eliminado exitosamente');
                this.loadComments();
                this.loadStats();
            }).catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el comentario');
            });
        }
    },

    // Marcar mensaje como leído
    markAsRead: function(messageId) {
        database.ref(`contact-messages/${messageId}`).update({read: true}).then(() => {
            this.loadMessages();
            this.loadStats();
        }).catch(error => {
            console.error('Error:', error);
            alert('Error al marcar como leído');
        });
    },

    // Eliminar mensaje
    deleteMessage: function(messageId) {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            database.ref(`contact-messages/${messageId}`).remove().then(() => {
                alert('Mensaje eliminado exitosamente');
                this.loadMessages();
                this.loadStats();
            }).catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el mensaje');
            });
        }
    },

    // Cambiar credenciales
    changeCredentials: function() {
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;

        if (!newUsername || !newPassword) {
            alert('Por favor, completa ambos campos');
            return;
        }

        this.credentials.username = newUsername;
        this.credentials.password = newPassword;
        
        alert('Credenciales actualizadas exitosamente');
        document.getElementById('change-credentials-form').reset();
    },

    // Limpiar toda la base de datos
    clearAllData: function() {
        if (confirm('⚠️ PELIGRO: ¿Estás seguro de que quieres eliminar TODA la información? Esta acción no se puede deshacer.')) {
            if (confirm('Confirma nuevamente: Se eliminarán todos los posts, comentarios y mensajes.')) {
                Promise.all([
                    database.ref('blog-posts').remove(),
                    database.ref('comments').remove(),
                    database.ref('contact-messages').remove()
                ]).then(() => {
                    alert('Toda la información ha sido eliminada');
                    this.loadDashboard();
                }).catch(error => {
                    console.error('Error:', error);
                    alert('Error al limpiar la base de datos');
                });
            }
        }
    }
};

// Funciones auxiliares para la interfaz
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    document.getElementById(sectionName + '-section').classList.add('active');
    document.getElementById(sectionName + '-btn').classList.add('active');
    
    // Cargar datos específicos de la sección
    switch(sectionName) {
        case 'posts':
            Admin.loadPosts();
            break;
        case 'comments':
            Admin.loadComments();
            break;
        case 'messages':
            Admin.loadMessages();
            break;
        case 'dashboard':
            Admin.loadStats();
            break;
    }
}

function showCreatePost() {
    document.getElementById('create-post-form').style.display = 'block';
}

function hideCreatePost() {
    document.getElementById('create-post-form').style.display = 'none';
}

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
        z-index: 10000;
        font-weight: 600;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    Admin.init();
});
