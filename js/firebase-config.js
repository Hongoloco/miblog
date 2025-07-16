// Configuración de Firebase
// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDh3yYNj9Cg29T-wzIhBRnOTvrWCabdBM",
  authDomain: "mi-b-99ca8.firebaseapp.com",
  databaseURL: "https://mi-b-99ca8-default-rtdb.firebaseio.com",
  projectId: "mi-b-99ca8",
  storageBucket: "mi-b-99ca8.firebasestorage.app",
  messagingSenderId: "164430405479",
  appId: "1:164430405479:web:bedd6d831f9df3b2eb19c2",
  measurementId: "G-2G92YVLZTR"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Realtime Database
const database = firebase.database();

// Funciones para manejar la base de datos
const BlogDB = {
  // Guardar mensaje de contacto
  saveContactMessage: function(name, email, message) {
    const contactRef = database.ref('contact-messages');
    const newMessageRef = contactRef.push();
    
    return newMessageRef.set({
      name: name,
      email: email,
      message: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      read: false
    });
  },

  // Agregar nueva entrada de blog
  addBlogPost: function(title, content, summary) {
    const postsRef = database.ref('blog-posts');
    const newPostRef = postsRef.push();
    
    return newPostRef.set({
      title: title,
      content: content,
      summary: summary,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      author: 'Ale Gallo'
    });
  },

  // Obtener todas las entradas del blog
  getBlogPosts: function() {
    return database.ref('blog-posts').orderByChild('timestamp').once('value');
  },

  // Agregar comentario a un post
  addComment: function(postId, name, comment) {
    const commentsRef = database.ref(`comments/${postId}`);
    const newCommentRef = commentsRef.push();
    
    return newCommentRef.set({
      name: name,
      comment: comment,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  },

  // Obtener comentarios de un post
  getComments: function(postId) {
    return database.ref(`comments/${postId}`).orderByChild('timestamp').once('value');
  },

  // Guardar recurso
  saveResource: function(name, url, category, description) {
    const resourcesRef = database.ref('resources');
    const newResourceRef = resourcesRef.push();
    
    return newResourceRef.set({
      name: name,
      url: url,
      category: category,
      description: description,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      author: 'Ale Gallo'
    });
  },

  // Obtener recursos
  getResources: function() {
    return database.ref('resources').orderByChild('timestamp').once('value');
  },

  // Guardar contenido del blog simple
  saveBlogContent: function(title, type, url, description, tags) {
    const contentRef = database.ref('blog-content');
    const newContentRef = contentRef.push();
    
    return newContentRef.set({
      title: title,
      type: type,
      url: url || '',
      description: description,
      tags: tags || '',
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      author: 'Ale Gallo'
    });
  },

  // Obtener contenido del blog simple
  getBlogContent: function() {
    return database.ref('blog-content').orderByChild('timestamp').once('value');
  },

  // Eliminar contenido del blog simple
  deleteBlogContent: function(contentId) {
    return database.ref(`blog-content/${contentId}`).remove();
  },

  // Obtener mensajes de contacto
  getContactMessages: function() {
    return database.ref('contact-messages').orderByChild('timestamp').once('value');
  },

  // Marcar mensaje como leído
  markMessageAsRead: function(messageId) {
    return database.ref(`contact-messages/${messageId}`).update({ read: true });
  }
};

// Hacer BlogDB disponible globalmente
window.BlogDB = BlogDB;

// Verificar conexión a Firebase
database.ref('.info/connected').on('value', function(snapshot) {
  if (snapshot.val() === true) {
    console.log('✅ Conectado a Firebase');
  } else {
    console.log('❌ Desconectado de Firebase');
  }
});

console.log('🔥 Firebase configurado correctamente');
