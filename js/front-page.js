// JavaScript para el front page
document.addEventListener('DOMContentLoaded', function() {
    
    // Funcionalidad del menú móvil
    window.toggleMobileMenu = function() {
        const menu = document.getElementById('mobile-menu');
        const icon = document.getElementById('menu-icon');
        
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            menu.classList.add('hide');
            icon.textContent = '☰';
            
            setTimeout(() => {
                menu.classList.remove('hide');
            }, 300);
        } else {
            menu.classList.add('show');
            icon.textContent = '✕';
        }
    };
    
    // Cargar últimas notas (simulado)
    function loadLatestPosts() {
        const postsContainer = document.getElementById('latest-posts');
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="post-card">
                    <h3>Introducción a React Hooks</h3>
                    <p>Aprende los conceptos básicos de React Hooks y cómo pueden mejorar tu código.</p>
                    <div class="post-meta">
                        <span>📅 Enero 2025</span>
                        <span>🏷️ Desarrollo</span>
                    </div>
                </div>
                <div class="post-card">
                    <h3>Configuración de VS Code</h3>
                    <p>Optimiza tu entorno de desarrollo con estas extensiones y configuraciones.</p>
                    <div class="post-meta">
                        <span>📅 Enero 2025</span>
                        <span>🏷️ Herramientas</span>
                    </div>
                </div>
                <div class="post-card">
                    <h3>Diseño responsivo con CSS Grid</h3>
                    <p>Crea layouts flexibles y modernos usando CSS Grid y Flexbox.</p>
                    <div class="post-meta">
                        <span>📅 Diciembre 2024</span>
                        <span>🏷️ Frontend</span>
                    </div>
                </div>
            `;
        }
    }
    
    loadLatestPosts();
});