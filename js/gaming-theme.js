// 🎮 Gaming Theme JavaScript - Ale Gallo

class GamingTheme {
    constructor() {
        this.init();
    }

    init() {
        this.initGlitchEffect();
        this.initGameCards();
        this.initGameStats();
        this.initControllerAnimation();
        this.initGamingParticles();
        this.initTypingEffect();
        this.initScrollAnimations();
        this.initCategoryHovers();
        this.initContactForm();
    }

    // Efecto de glitch para el título
    initGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            element.setAttribute('data-text', element.textContent);
            
            // Efecto de glitch aleatorio
            setInterval(() => {
                if (Math.random() < 0.1) {
                    element.style.animation = 'none';
                    element.offsetHeight; // Trigger reflow
                    element.style.animation = 'glitch 0.3s ease-out';
                }
            }, 2000);
        });
    }

    // Animaciones para las tarjetas de juegos
    initGameCards() {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            // Efecto de hover con partículas
            card.addEventListener('mouseenter', () => {
                this.createCardParticles(card);
                this.animateRating(card);
            });

            // Efecto de tilt 3D
            card.addEventListener('mousemove', (e) => {
                this.handleCardTilt(card, e);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCardTilt(card);
            });

            // Animación de aparición
            this.animateCardAppearance(card);
        });
    }

    // Crear partículas para las tarjetas
    createCardParticles(card) {
        const rect = card.getBoundingClientRect();
        const particles = [];

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'card-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #4a90e2, #667eea);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleFloat 2s ease-out forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    // Animación de rating
    animateRating(card) {
        const rating = card.querySelector('.game-rating');
        if (rating) {
            rating.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                rating.style.animation = '';
            }, 500);
        }
    }

    // Efecto de tilt 3D para tarjetas
    handleCardTilt(card, e) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (e.clientY - centerY) / 10;
        const rotateY = (centerX - e.clientX) / 10;

        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
    }

    // Resetear tilt de tarjetas
    resetCardTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }

    // Animación de aparición de tarjetas
    animateCardAppearance(card) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
            });
        });

        observer.observe(card);
    }

    // Estadísticas animadas
    initGameStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                    }
                });
            });

            observer.observe(stat);
        });
    }

    // Animación de contador
    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);

            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // Animación del controlador
    initControllerAnimation() {
        const controller = document.querySelector('.gaming-controller');
        if (!controller) return;

        // Animación de botones
        const buttons = controller.querySelectorAll('.button');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.style.animation = `pulse 1s ease-in-out infinite`;
                button.style.animationDelay = `${index * 0.2}s`;
            }, 1000);
        });

        // Interacción con el mouse
        controller.addEventListener('mouseenter', () => {
            controller.style.animation = 'float 1s ease-in-out infinite';
            controller.style.transform = 'scale(1.1)';
        });

        controller.addEventListener('mouseleave', () => {
            controller.style.transform = 'scale(1)';
        });
    }

    // Partículas gaming específicas
    initGamingParticles() {
        const createGamingParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'gaming-particle';
            
            const symbols = ['🎮', '🕹️', '👾', '🎯', '💯', '⚡', '🔥', '💫'];
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            
            particle.innerHTML = symbol;
            particle.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 20 + 10}px;
                left: ${Math.random() * window.innerWidth}px;
                top: ${window.innerHeight}px;
                opacity: 0.7;
                pointer-events: none;
                z-index: 100;
                animation: floatUp 4s linear forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 4000);
        };

        // Crear partículas cada 5 segundos
        setInterval(createGamingParticle, 5000);
    }

    // Efecto de escritura
    initTypingEffect() {
        const typeElements = document.querySelectorAll('.typing-effect');
        
        typeElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeText(entry.target, text);
                    }
                });
            });

            observer.observe(element);
        });
    }

    // Animar texto escribiéndose
    typeText(element, text) {
        let index = 0;
        const speed = 100;

        const timer = setInterval(() => {
            element.textContent += text[index];
            index++;

            if (index >= text.length) {
                clearInterval(timer);
                element.style.borderRight = 'none';
            }
        }, speed);
    }

    // Animaciones de scroll
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Hover effects para categorías
    initCategoryHovers() {
        const categories = document.querySelectorAll('.category-card');
        
        categories.forEach(category => {
            category.addEventListener('mouseenter', () => {
                const icon = category.querySelector('.category-icon');
                if (icon) {
                    icon.style.animation = 'bounce 0.6s ease-in-out';
                }
                
                // Crear efecto de ondas
                this.createRippleEffect(category);
            });

            category.addEventListener('mouseleave', () => {
                const icon = category.querySelector('.category-icon');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
    }

    // Crear efecto de ondas
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(74, 144, 226, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: 50%;
            top: 50%;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Formulario de contacto gaming
    initContactForm() {
        const form = document.querySelector('.gaming-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Efecto de focus
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 25px rgba(74, 144, 226, 0.3)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
                input.style.boxShadow = 'none';
            });

            // Validación en tiempo real
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });

        // Envío del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGamingFormSubmit(form);
        });
    }

    // Validar entrada
    validateInput(input) {
        const isValid = input.checkValidity();
        
        if (isValid) {
            input.style.borderColor = '#4a90e2';
        } else {
            input.style.borderColor = '#ff6b6b';
        }
    }

    // Manejar envío del formulario
    handleGamingFormSubmit(form) {
        const submitBtn = form.querySelector('.btn-gaming');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.style.opacity = '0.7';
        
        // Simular envío
        setTimeout(() => {
            submitBtn.textContent = '¡Enviado! 🎮';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        }, 2000);
    }

    // Métodos utilitarios
    static addGamingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                0% {
                    transform: translateY(30px);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes particleFloat {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(0);
                    opacity: 0;
                }
            }

            @keyframes floatUp {
                0% {
                    transform: translateY(0);
                    opacity: 0.7;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh);
                    opacity: 0;
                }
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }

            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .gaming-particle {
                animation: floatUp 4s linear forwards;
            }

            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease-out;
            }

            .animate-on-scroll.animated {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Sistema de logros gaming
class GamingAchievements {
    constructor() {
        this.achievements = [
            { id: 'first_visit', name: 'Primer Contacto', description: 'Visitaste el sitio por primera vez', icon: '🎮' },
            { id: 'explorer', name: 'Explorador', description: 'Visitaste todas las secciones', icon: '🗺️' },
            { id: 'reader', name: 'Lector Ávido', description: 'Leíste 3 artículos del blog', icon: '📚' },
            { id: 'social', name: 'Conectado', description: 'Usaste el formulario de contacto', icon: '💬' },
            { id: 'speedrun', name: 'Speedrunner', description: 'Navegaste por todo el sitio en menos de 2 minutos', icon: '⚡' }
        ];
        
        this.unlockedAchievements = JSON.parse(localStorage.getItem('gamingAchievements') || '[]');
        this.initTracking();
    }

    initTracking() {
        this.trackFirstVisit();
        this.trackExplorer();
        this.trackReader();
        this.trackSocial();
        this.trackSpeedrun();
    }

    trackFirstVisit() {
        if (!this.isUnlocked('first_visit')) {
            this.unlockAchievement('first_visit');
        }
    }

    trackExplorer() {
        const sections = ['home', 'blog', 'about', 'contact'];
        const visitedSections = JSON.parse(localStorage.getItem('visitedSections') || '[]');
        
        // Agregar sección actual
        const currentSection = this.getCurrentSection();
        if (currentSection && !visitedSections.includes(currentSection)) {
            visitedSections.push(currentSection);
            localStorage.setItem('visitedSections', JSON.stringify(visitedSections));
        }

        if (visitedSections.length >= sections.length && !this.isUnlocked('explorer')) {
            this.unlockAchievement('explorer');
        }
    }

    trackReader() {
        const readArticles = JSON.parse(localStorage.getItem('readArticles') || '[]');
        
        if (readArticles.length >= 3 && !this.isUnlocked('reader')) {
            this.unlockAchievement('reader');
        }
    }

    trackSocial() {
        const form = document.querySelector('.gaming-form');
        if (form) {
            form.addEventListener('submit', () => {
                if (!this.isUnlocked('social')) {
                    this.unlockAchievement('social');
                }
            });
        }
    }

    trackSpeedrun() {
        const startTime = Date.now();
        const sections = ['home', 'blog', 'about', 'contact'];
        let visitedCount = 0;

        const checkSpeedrun = () => {
            const visitedSections = JSON.parse(localStorage.getItem('visitedSections') || '[]');
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;

            if (visitedSections.length >= sections.length && elapsed < 120000 && !this.isUnlocked('speedrun')) {
                this.unlockAchievement('speedrun');
            }
        };

        setInterval(checkSpeedrun, 1000);
    }

    getCurrentSection() {
        const path = window.location.pathname;
        if (path.includes('blog')) return 'blog';
        if (path.includes('about')) return 'about';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }

    isUnlocked(achievementId) {
        return this.unlockedAchievements.includes(achievementId);
    }

    unlockAchievement(achievementId) {
        if (this.isUnlocked(achievementId)) return;

        this.unlockedAchievements.push(achievementId);
        localStorage.setItem('gamingAchievements', JSON.stringify(this.unlockedAchievements));

        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement) {
            this.showAchievementNotification(achievement);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h4>¡Logro Desbloqueado!</h4>
                <p><strong>${achievement.name}</strong></p>
                <p>${achievement.description}</p>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4a90e2, #667eea);
            color: white;
            padding: 1rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Agregar estilos necesarios
    GamingTheme.addGamingStyles();
    
    // Inicializar tema gaming
    const gamingTheme = new GamingTheme();
    
    // Inicializar sistema de logros
    const achievements = new GamingAchievements();
    
    // Console easter egg
    console.log(`
    🎮 Gaming Theme Activated! 🎮
    
    Developed by: Ale Gallo
    Theme: Dark Gaming Glassmorphism
    
    Features:
    ✅ Glitch effects
    ✅ 3D card animations
    ✅ Gaming particles
    ✅ Achievement system
    ✅ Interactive controller
    
    Type 'achievements()' to see your progress!
    `);
    
    // Función global para mostrar logros
    window.achievements = () => {
        const unlocked = JSON.parse(localStorage.getItem('gamingAchievements') || '[]');
        console.log('🏆 Logros Desbloqueados:', unlocked.length);
        unlocked.forEach(id => {
            const achievement = achievements.achievements.find(a => a.id === id);
            if (achievement) {
                console.log(`${achievement.icon} ${achievement.name}: ${achievement.description}`);
            }
        });
    };
});
