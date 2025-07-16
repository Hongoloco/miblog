// JavaScript para la página de recursos
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de recursos cargado');
    
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
    
    // Funcionalidad del modal
    window.openModal = function() {
        const modal = document.getElementById('resourceModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    };
    
    window.closeModal = function() {
        const modal = document.getElementById('resourceModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    // Configurar botón de agregar recurso
    const addBtn = document.getElementById('addResourceBtn');
    if (addBtn) {
        addBtn.addEventListener('click', openModal);
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('resourceModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Funcionalidad de las pestañas de categorías
    const tabBtns = document.querySelectorAll('.tab-btn');
    console.log('Botones de pestaña encontrados:', tabBtns.length);
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            console.log('Pestaña clickeada:', category);
            
            // Actualizar botones activos
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar/ocultar secciones según la categoría
            const devSection = document.getElementById('dev-section');
            const techSection = document.getElementById('tech-section');
            const toolsSection = document.getElementById('tools-section');
            
            if (category === 'all') {
                devSection.style.display = 'block';
                techSection.style.display = 'block';
                toolsSection.style.display = 'block';
            } else if (category === 'dev') {
                devSection.style.display = 'block';
                techSection.style.display = 'none';
                toolsSection.style.display = 'none';
            } else if (category === 'tech') {
                devSection.style.display = 'none';
                techSection.style.display = 'block';
                toolsSection.style.display = 'none';
            } else if (category === 'tools') {
                devSection.style.display = 'none';
                techSection.style.display = 'none';
                toolsSection.style.display = 'block';
            }
        });
    });
    
    console.log('Script de recursos inicializado correctamente');
});
