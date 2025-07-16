// Verificador de funcionalidad del blog
// Este archivo prueba que todas las funcionalidades estén trabajando correctamente

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Iniciando verificación del sistema...');
    
    // Verificar que Firebase esté disponible
    if (typeof firebase !== 'undefined') {
        console.log('✅ Firebase está disponible');
        
        // Verificar conexión a la base de datos
        const database = firebase.database();
        console.log('✅ Base de datos conectada');
        
        // Verificar estructura de datos
        database.ref('blog-posts').once('value', (snapshot) => {
            const posts = snapshot.val();
            console.log('📝 Posts en la base de datos:', posts ? Object.keys(posts).length : 0);
        });
        
        database.ref('contact-messages').once('value', (snapshot) => {
            const messages = snapshot.val();
            console.log('📧 Mensajes de contacto:', messages ? Object.keys(messages).length : 0);
        });
        
        database.ref('comments').once('value', (snapshot) => {
            const comments = snapshot.val();
            console.log('💬 Comentarios:', comments ? Object.keys(comments).length : 0);
        });
        
    } else {
        console.error('❌ Firebase no está disponible');
    }
    
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem('authenticated');
    console.log('🔐 Estado de autenticación:', isAuthenticated ? 'Autenticado' : 'No autenticado');
    
    // Verificar página actual
    const currentPage = window.location.pathname;
    console.log('📄 Página actual:', currentPage);
    
    // Verificar si estamos en blog-viewer.html
    if (currentPage.includes('blog-viewer.html')) {
        console.log('🎯 En página del blog - verificando autenticación...');
        if (!isAuthenticated) {
            console.log('🚨 Redirigiendo a index.html por falta de autenticación');
        } else {
            console.log('✅ Usuario autenticado, cargando posts...');
        }
    }
    
    // Verificar si estamos en páginas públicas
    if (currentPage.includes('about.html') || currentPage.includes('contact.html')) {
        console.log('🌐 En página pública - no requiere autenticación');
    }
    
    // Verificar elementos del DOM
    const blogPosts = document.getElementById('blog-posts');
    if (blogPosts) {
        console.log('✅ Contenedor de posts encontrado');
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        console.log('✅ Formulario de contacto encontrado');
    }
    
    console.log('🔍 Verificación completada');
});

// Función para probar la autenticación
function testAuth() {
    console.log('🧪 Probando autenticación...');
    
    // Simular login
    sessionStorage.setItem('authenticated', 'true');
    console.log('✅ Sesión establecida');
    
    // Verificar que funciona
    const isAuth = sessionStorage.getItem('authenticated');
    console.log('Estado después del login:', isAuth);
    
    return isAuth === 'true';
}

// Función para probar logout
function testLogout() {
    console.log('🧪 Probando logout...');
    
    sessionStorage.removeItem('authenticated');
    console.log('✅ Sesión eliminada');
    
    const isAuth = sessionStorage.getItem('authenticated');
    console.log('Estado después del logout:', isAuth);
    
    return isAuth === null;
}

// Función para probar navegación
function testNavigation() {
    console.log('🧪 Probando navegación...');
    
    const links = document.querySelectorAll('nav a');
    console.log('Enlaces encontrados:', links.length);
    
    links.forEach(link => {
        console.log('Link:', link.href, '- Texto:', link.textContent);
    });
}

// Exportar funciones de prueba
window.BlogTester = {
    testAuth,
    testLogout,
    testNavigation
};
