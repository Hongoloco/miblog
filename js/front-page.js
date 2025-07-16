// JavaScript para el front page - Funcionalidad Unificada
document.addEventListener('DOMContentLoaded', function() {
    
    // Funcionalidad del menú móvil unificado
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenu.style.display = 'none';
            menuIcon.textContent = '☰';
        } else {
            mobileMenu.classList.add('active');
            mobileMenu.style.display = 'flex';
            menuIcon.textContent = '✕';
        }
    };
    
    // Cerrar menú móvil al hacer clic en un enlace
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu();
        });
    });
    
    // Cerrar menú móvil al redimensionar la ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuIcon = document.getElementById('menu-icon');
            if (mobileMenu && menuIcon) {
                mobileMenu.classList.remove('active');
                mobileMenu.style.display = 'none';
                menuIcon.textContent = '☰';
            }
        }
    });
    
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