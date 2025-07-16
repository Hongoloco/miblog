// JavaScript para la página de notas
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
    
    // Funcionalidad de filtros
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noteCards = document.querySelectorAll('.note-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar notas
            noteCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Agregar notas de ejemplo
    loadSampleNotes();
    
    function loadSampleNotes() {
        const notesContainer = document.querySelector('.posts-grid');
        if (notesContainer) {
            notesContainer.innerHTML = `
                <div class="post-card note-card" data-category="dev">
                    <h3>Introducción a React Hooks</h3>
                    <p>Los hooks son una nueva característica de React que te permite usar estado y otras características de React sin escribir una clase.</p>
                    <div class="post-meta">
                        <span>📅 15 Enero 2025</span>
                        <span>🏷️ Desarrollo</span>
                    </div>
                </div>
                <div class="post-card note-card" data-category="tech">
                    <h3>Configuración de Docker</h3>
                    <p>Aprende a configurar Docker para desarrollar aplicaciones en contenedores de manera eficiente.</p>
                    <div class="post-meta">
                        <span>📅 12 Enero 2025</span>
                        <span>🏷️ Tecnología</span>
                    </div>
                </div>
                <div class="post-card note-card" data-category="tools">
                    <h3>Extensiones útiles para VS Code</h3>
                    <p>Una lista de extensiones que pueden mejorar tu productividad al desarrollar.</p>
                    <div class="post-meta">
                        <span>📅 10 Enero 2025</span>
                        <span>🏷️ Herramientas</span>
                    </div>
                </div>
                <div class="post-card note-card" data-category="dev">
                    <h3>CSS Grid vs Flexbox</h3>
                    <p>Comparación entre CSS Grid y Flexbox para crear layouts responsivos.</p>
                    <div class="post-meta">
                        <span>📅 8 Enero 2025</span>
                        <span>🏷️ Desarrollo</span>
                    </div>
                </div>
            `;
        }
    }
});
