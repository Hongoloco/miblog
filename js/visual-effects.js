// 🎨 SISTEMA DE EFECTOS VISUALES - Ale Gallo
// Efectos de partículas, animaciones y glassmorphism

(function() {
    'use strict';
    
    // Configuración de efectos
    const CONFIG = {
        particles: {
            count: 12,
            maxSize: 25,
            minSize: 8,
            colors: ['rgba(74, 144, 226, 0.1)', 'rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)'],
            animationDuration: [4, 8],
            zIndex: -1
        },
        scrollReveal: {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        }
    };
    
    // Crear partículas flotantes
    function createParticles() {
        const particleCount = CONFIG.particles.count;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posición aleatoria
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            
            // Tamaño aleatorio
            const size = Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Color aleatorio
            const color = CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)];
            particle.style.background = color;
            
            // Duración de animación aleatoria
            const duration = Math.random() * (CONFIG.particles.animationDuration[1] - CONFIG.particles.animationDuration[0]) + CONFIG.particles.animationDuration[0];
            particle.style.animationDuration = duration + 's';
            
            // Retraso aleatorio
            particle.style.animationDelay = Math.random() * 6 + 's';
            
            // Z-index
            particle.style.zIndex = CONFIG.particles.zIndex;
            
            document.body.appendChild(particle);
        }
    }
    
    // Efecto de scroll reveal
    function initScrollReveal() {
        const elements = document.querySelectorAll('.scroll-reveal');
        
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            CONFIG.scrollReveal
        );
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Agregar clases de scroll reveal automáticamente
    function addScrollRevealClasses() {
        const selectors = [
            'main article',
            '.blog-preview article',
            '.card',
            '.contact-form',
            '.new-post-form',
            '.intro'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('scroll-reveal');
            });
        });
    }
    
    // Efectos de hover mejorados
    function initHoverEffects() {
        const cards = document.querySelectorAll('.card, .blog-preview article');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Efecto de typing para títulos
    function initTypingEffect() {
        const titles = document.querySelectorAll('.typing-effect');
        
        titles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            title.style.borderRight = '2px solid #4a90e2';
            
            let index = 0;
            const typeInterval = setInterval(() => {
                title.textContent += text[index];
                index++;
                
                if (index >= text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        title.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }
    
    // Inicializar efectos de cursor
    function initCursorEffects() {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
        
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });
    }
    
    // Efecto de loading suave
    function initLoadingEffect() {
        const main = document.querySelector('main');
        if (main) {
            main.style.opacity = '0';
            main.style.transform = 'translateY(30px)';
            
            window.addEventListener('load', () => {
                setTimeout(() => {
                    main.style.transition = 'all 0.8s ease';
                    main.style.opacity = '1';
                    main.style.transform = 'translateY(0)';
                }, 200);
            });
        }
    }
    
    // Inicializar todos los efectos
    function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Crear partículas
        createParticles();
        
        // Agregar clases de scroll reveal
        addScrollRevealClasses();
        
        // Inicializar efectos
        initScrollReveal();
        initHoverEffects();
        initTypingEffect();
        initCursorEffects();
        initLoadingEffect();
        
        // Recrear partículas cada 30 segundos
        setInterval(() => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => particle.remove());
            createParticles();
        }, 30000);
    }
    
    // API pública
    window.VisualEffects = {
        createParticles,
        initScrollReveal,
        addScrollRevealClasses,
        CONFIG
    };
    
    // Ejecutar inicialización
    init();
    
})();
