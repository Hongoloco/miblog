// Funciones principales del blog
document.addEventListener('DOMContentLoaded', function() {
  
  // Inicializar autenticación
  if (typeof Auth !== 'undefined') {
    Auth.init();
  }
  
  // Función para mostrar notificaciones
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Manejar formulario de contacto (ahora público)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // El formulario de contacto ya se maneja en contact-handler.js
    // No necesita autenticación
  }

  // Manejar formulario de nuevo post
  const newPostForm = document.getElementById('new-post-form');
  if (newPostForm) {
    newPostForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Verificar autenticación
      Auth.requireAuth(() => {
        const title = document.getElementById('post-title').value;
        const summary = document.getElementById('post-summary').value;
        const content = document.getElementById('post-content').value;
        
        if (!title || !summary || !content) {
          showNotification('Por favor, completa todos los campos', 'error');
          return;
        }
        
        BlogDB.addBlogPost(title, content, summary)
          .then(() => {
            showNotification('¡Post publicado correctamente!');
            newPostForm.reset();
            loadBlogPosts(); // Recargar posts
          })
          .catch((error) => {
            console.error('Error:', error);
            showNotification('Error al publicar el post. Intenta nuevamente.', 'error');
          });
      });
    });
  }

  // Cargar posts del blog
  function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    if (!blogContainer) return;
    
    // Verificar si estamos en la página principal para limitar posts
    const isHomePage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/' ||
                       window.location.pathname.endsWith('/');
    
    // En la página principal, solo mostrar si está autenticado
    if (isHomePage && !Auth.isAuthenticated()) {
      return; // No cargar posts si no está autenticado
    }
    
    BlogDB.getBlogPosts()
      .then((snapshot) => {
        const authRequiredMsg = blogContainer.querySelector('.auth-required-message');
        if (authRequiredMsg) {
          authRequiredMsg.style.display = 'none';
        }
        
        blogContainer.innerHTML = '';
        const posts = snapshot.val();
        
        if (!posts) {
          blogContainer.innerHTML = '<p>No hay posts disponibles.</p>';
          return;
        }
        
        // Convertir a array y ordenar por fecha más reciente
        const postsArray = Object.entries(posts).map(([id, post]) => ({
          id,
          ...post
        }));
        
        postsArray.sort((a, b) => b.timestamp - a.timestamp);
        
        // En la página principal, mostrar solo los 3 más recientes
        const postsToShow = isHomePage ? postsArray.slice(0, 3) : postsArray;
        
        postsToShow.forEach(post => {
          const article = document.createElement('article');
          article.className = 'blog-post';
          
          const date = new Date(post.timestamp).toLocaleDateString('es-AR');
          
          article.innerHTML = `
            <h3>${post.title}</h3>
            <p class="post-date">Publicado el ${date}</p>
            <p>${post.summary}</p>
            <a href="post.html?id=${post.id}" class="read-more">Leer más</a>
          `;
          
          blogContainer.appendChild(article);
        });
        
        // Agregar enlace para ver todos los posts si estamos en la página principal
        if (isHomePage && postsArray.length > 3) {
          const moreLink = document.createElement('div');
          moreLink.style.textAlign = 'center';
          moreLink.style.marginTop = '2rem';
          moreLink.innerHTML = '<a href="blog.html" class="read-more">Ver todas las entradas del blog →</a>';
          blogContainer.appendChild(moreLink);
        }
      })
      .catch((error) => {
        console.error('Error al cargar posts:', error);
        blogContainer.innerHTML = '<p>Error al cargar los posts.</p>';
      });
  }

  // Cargar post individual
  function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) return;
    
    database.ref(`blog-posts/${postId}`).once('value')
      .then((snapshot) => {
        const post = snapshot.val();
        if (!post) {
          document.getElementById('post-content').innerHTML = '<p>Post no encontrado.</p>';
          return;
        }
        
        const date = new Date(post.timestamp).toLocaleDateString('es-AR');
        
        document.getElementById('post-content').innerHTML = `
          <h2>${post.title}</h2>
          <p class="post-date">Publicado el ${date} por ${post.author}</p>
          <div class="post-text">${post.content}</div>
        `;
        
        loadComments(postId);
        setupCommentForm(postId);
      })
      .catch((error) => {
        console.error('Error al cargar el post:', error);
        document.getElementById('post-content').innerHTML = '<p>Error al cargar el post.</p>';
      });
  }

  // Cargar comentarios
  function loadComments(postId) {
    const commentsContainer = document.getElementById('comments');
    if (!commentsContainer) return;
    
    BlogDB.getComments(postId)
      .then((snapshot) => {
        const comments = snapshot.val();
        
        if (!comments) {
          commentsContainer.innerHTML = '<p>No hay comentarios aún.</p>';
          return;
        }
        
        const commentsArray = Object.entries(comments).map(([id, comment]) => ({
          id,
          ...comment
        }));
        
        commentsArray.sort((a, b) => a.timestamp - b.timestamp);
        
        commentsContainer.innerHTML = '';
        commentsArray.forEach(comment => {
          const commentDiv = document.createElement('div');
          commentDiv.className = 'comment';
          
          const date = new Date(comment.timestamp).toLocaleDateString('es-AR');
          
          commentDiv.innerHTML = `
            <h4>${comment.name}</h4>
            <p class="comment-date">${date}</p>
            <p>${comment.comment}</p>
          `;
          
          commentsContainer.appendChild(commentDiv);
        });
      })
      .catch((error) => {
        console.error('Error al cargar comentarios:', error);
      });
  }

  // Configurar formulario de comentarios
  function setupCommentForm(postId) {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Verificar autenticación antes de comentar
      Auth.requireAuth(() => {
        const name = document.getElementById('comment-name').value;
        const comment = document.getElementById('comment-text').value;
        
        if (!name || !comment) {
          showNotification('Por favor, completa todos los campos', 'error');
          return;
        }
        
        BlogDB.addComment(postId, name, comment)
          .then(() => {
            showNotification('¡Comentario agregado!');
            commentForm.reset();
            loadComments(postId);
          })
          .catch((error) => {
            console.error('Error:', error);
            showNotification('Error al agregar el comentario', 'error');
          });
      });
    });
  }

  // Inicializar funciones según la página
  if (document.getElementById('blog-posts')) {
    loadBlogPosts();
    
    // Recargar posts cuando se autentique
    const originalUpdateAuthUI = Auth.updateAuthUI;
    Auth.updateAuthUI = function() {
      originalUpdateAuthUI.call(this);
      loadBlogPosts(); // Recargar posts después de actualizar UI
    };
  }
  
  if (document.getElementById('post-content')) {
    loadSinglePost();
  }
});
