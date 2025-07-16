// 🎮 Gaming App Optimizado - Ale Gallo
// Archivo JavaScript unificado para mejor rendimiento

class OptimizedGamingApp {
    constructor() {
        this.config = {
            steamId: null,
            steamApiKey: null,
            cacheTime: 10 * 60 * 1000, // 10 minutos
            animationSpeed: 300,
            updateInterval: 5 * 60 * 1000 // 5 minutos
        };
        
        this.cache = new Map();
        this.observers = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.initLazyLoading();
        this.initSteamIntegration();
        this.initAchievements();
        this.startPerformanceMonitoring();
        
        this.isInitialized = true;
        console.log('🎮 Gaming App optimizado iniciado');
    }

    // Event listeners unificados
    setupEventListeners() {
        // Scroll optimizado con throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
                scrollTimeout = null;
            }, 16); // 60fps
        }, { passive: true });

        // Resize optimizado
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Intersection Observer para animaciones
        this.setupIntersectionObserver();
        
        // Click handlers optimizados
        this.setupClickHandlers();
    }

    // Lazy loading optimizado
    initLazyLoading() {
        const lazyElements = document.querySelectorAll('.lazy-load');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyElements.forEach(el => lazyObserver.observe(el));
    }

    // Intersection Observer para animaciones
    setupIntersectionObserver() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Observar elementos que necesitan animación
        document.querySelectorAll('.stat-item, .card, .setup-item').forEach(el => {
            animationObserver.observe(el);
        });
    }

    // Click handlers optimizados
    setupClickHandlers() {
        // Delegación de eventos para mejor rendimiento
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            this.handleAction(action, target, e);
        });

        // Botones específicos
        document.getElementById('steamConfigBtn')?.addEventListener('click', () => {
            this.showSteamConfig();
        });
    }

    // Integración Steam optimizada
    initSteamIntegration() {
        // Cargar configuración guardada
        const savedConfig = this.getFromCache('steamConfig');
        if (savedConfig) {
            this.config.steamId = savedConfig.steamId;
            this.config.steamApiKey = savedConfig.apiKey;
            this.loadSteamData();
        } else {
            // Usar datos demo por defecto
            this.loadDemoData();
        }
    }

    // Cargar datos de Steam
    async loadSteamData() {
        if (!this.config.steamId || !this.config.steamApiKey) {
            this.loadDemoData();
            return;
        }

        try {
            const cachedData = this.getFromCache('steamData');
            if (cachedData) {
                this.updateUI(cachedData);
                return;
            }

            this.showLoadingState();
            
            const steamData = await this.fetchSteamData();
            this.saveToCache('steamData', steamData);
            this.updateUI(steamData);
            
        } catch (error) {
            console.error('Error cargando datos Steam:', error);
            this.loadDemoData();
        }
    }

    // Fetch optimizado de Steam
    async fetchSteamData() {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const urls = {
            profile: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.config.steamApiKey}&steamids=${this.config.steamId}`,
            games: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.config.steamApiKey}&steamid=${this.config.steamId}&format=json&include_appinfo=true`
        };

        const [profileRes, gamesRes] = await Promise.all([
            fetch(proxyUrl + encodeURIComponent(urls.profile)),
            fetch(proxyUrl + encodeURIComponent(urls.games))
        ]);

        const profileData = JSON.parse((await profileRes.json()).contents);
        const gamesData = JSON.parse((await gamesRes.json()).contents);

        return {
            profile: profileData.response.players[0],
            games: gamesData.response,
            timestamp: Date.now()
        };
    }

    // Datos demo optimizados
    loadDemoData() {
        const demoData = {
            profile: {
                personaname: 'AleGallo_Gaming',
                timecreated: 1388534400
            },
            games: {
                game_count: 187,
                games: [
                    { name: 'Cyberpunk 2077', playtime_forever: 7200, appid: 1091500 },
                    { name: 'Hades', playtime_forever: 5100, appid: 1145360 },
                    { name: 'The Witcher 3', playtime_forever: 12000, appid: 292030 },
                    { name: 'ELDEN RING', playtime_forever: 9000, appid: 1245620 }
                ]
            },
            stats: {
                total_playtime: 45600,
                achievement_rate: 75.5
            }
        };

        this.updateUI(demoData);
    }

    // Actualizar UI optimizada
    updateUI(data) {
        // Actualizar estadísticas
        this.updateStats(data);
        
        // Actualizar juegos destacados
        this.updateFeaturedGames(data);
        
        // Actualizar perfil
        this.updateProfile(data);
        
        this.hideLoadingState();
    }

    // Actualizar estadísticas con animaciones
    updateStats(data) {
        const stats = [
            { 
                selector: '.stat-item:nth-child(1) .stat-number', 
                value: data.games?.game_count || 187,
                label: 'Juegos en Biblioteca'
            },
            { 
                selector: '.stat-item:nth-child(2) .stat-number', 
                value: this.formatPlaytime(data.stats?.total_playtime || 45600),
                label: 'Horas Jugadas'
            },
            { 
                selector: '.stat-item:nth-child(3) .stat-number', 
                value: `${data.stats?.achievement_rate || 75.5}%`,
                label: 'Tasa de Logros'
            }
        ];

        stats.forEach(stat => {
            const element = document.querySelector(stat.selector);
            if (element) {
                this.animateNumber(element, stat.value);
            }
        });
    }

    // Actualizar juegos destacados
    updateFeaturedGames(data) {
        if (!data.games?.games) return;

        const gameCards = document.querySelectorAll('.card');
        const topGames = data.games.games
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .slice(0, 4);

        topGames.forEach((game, index) => {
            if (gameCards[index]) {
                this.updateGameCard(gameCards[index], game);
            }
        });
    }

    // Actualizar tarjeta de juego
    updateGameCard(card, game) {
        const nameEl = card.querySelector('h3');
        const playtimeEl = card.querySelector('.badge');
        const ratingEl = card.querySelector('.card-rating');

        if (nameEl) nameEl.textContent = game.name;
        if (playtimeEl) playtimeEl.textContent = this.formatPlaytime(game.playtime_forever);
        if (ratingEl) ratingEl.textContent = this.calculateRating(game.playtime_forever);
    }

    // Actualizar perfil
    updateProfile(data) {
        if (!data.profile) return;

        const headerName = document.querySelector('header h1');
        if (headerName && data.profile.personaname) {
            headerName.textContent = `${data.profile.personaname} - Gaming Universe`;
        }
    }

    // Animaciones optimizadas
    animateElement(element) {
        element.style.animation = 'fadeIn 0.6s ease-out forwards';
    }

    animateNumber(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const targetValue = parseInt(newValue) || 0;
        
        if (currentValue === targetValue) return;

        const duration = 1000;
        const steps = 30;
        const stepValue = (targetValue - currentValue) / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const value = Math.round(currentValue + (stepValue * currentStep));
            element.textContent = typeof newValue === 'string' && newValue.includes('%') 
                ? value + '%' 
                : value;

            if (currentStep >= steps) {
                element.textContent = newValue;
                clearInterval(timer);
            }
        }, duration / steps);
    }

    // Sistema de logros simplificado
    initAchievements() {
        const achievements = ['first_visit', 'explorer', 'reader'];
        
        if (!localStorage.getItem('achievements')) {
            localStorage.setItem('achievements', JSON.stringify([]));
        }

        // Marcar primera visita
        this.unlockAchievement('first_visit');
    }

    unlockAchievement(id) {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (achievements.includes(id)) return;

        achievements.push(id);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        this.showAchievementNotification(id);
    }

    showAchievementNotification(id) {
        const messages = {
            first_visit: '¡Bienvenido gamer!',
            explorer: '¡Explorador!',
            reader: '¡Lector ávido!'
        };

        this.showNotification(messages[id] || 'Logro desbloqueado', 'success');
    }

    // Configuración Steam
    showSteamConfig() {
        const modal = this.createSteamConfigModal();
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    createSteamConfigModal() {
        const modal = document.createElement('div');
        modal.className = 'steam-config-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🎮 Configuración Steam</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <input type="text" id="steamIdInput" placeholder="Tu Steam ID" class="form-control">
                        </div>
                        <div class="form-group">
                            <input type="password" id="steamApiInput" placeholder="Tu API Key" class="form-control">
                        </div>
                        <div class="modal-actions">
                            <button class="btn-gaming primary" onclick="window.gamingApp.saveSteamConfig()">💾 Guardar</button>
                            <button class="btn-gaming secondary" onclick="window.gamingApp.useDemoData()">📝 Usar Demo</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Eventos del modal
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });

        return modal;
    }

    saveSteamConfig() {
        const steamId = document.getElementById('steamIdInput').value.trim();
        const apiKey = document.getElementById('steamApiInput').value.trim();

        if (steamId && apiKey) {
            this.config.steamId = steamId;
            this.config.steamApiKey = apiKey;
            
            this.saveToCache('steamConfig', { steamId, apiKey });
            this.loadSteamData();
            
            this.showNotification('Configuración guardada', 'success');
            document.querySelector('.steam-config-modal').remove();
        } else {
            this.showNotification('Por favor completa todos los campos', 'error');
        }
    }

    useDemoData() {
        this.loadDemoData();
        this.showNotification('Datos demo cargados', 'success');
        document.querySelector('.steam-config-modal').remove();
    }

    // Utilidades optimizadas
    formatPlaytime(minutes) {
        const hours = Math.floor(minutes / 60);
        return hours > 1000 ? `${(hours / 1000).toFixed(1)}K` : `${hours}h`;
    }

    calculateRating(playtime) {
        if (playtime > 6000) return '9.5';
        if (playtime > 3000) return '9.0';
        if (playtime > 1500) return '8.5';
        return '8.0';
    }

    // Cache optimizado
    saveToCache(key, data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now(),
                expires: Date.now() + this.config.cacheTime
            };
            localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Error guardando cache:', error);
        }
    }

    getFromCache(key) {
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;
            
            const cacheData = JSON.parse(cached);
            if (Date.now() > cacheData.expires) {
                localStorage.removeItem(key);
                return null;
            }
            
            return cacheData.data;
        } catch (error) {
            console.warn('Error leyendo cache:', error);
            return null;
        }
    }

    // Estados de carga
    showLoadingState() {
        document.querySelectorAll('.stat-number').forEach(el => {
            el.textContent = '...';
        });
    }

    hideLoadingState() {
        // Se oculta automáticamente al actualizar los datos
    }

    // Notificaciones optimizadas
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 10px;
            color: white;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Colores según tipo
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Manejo de acciones
    handleAction(action, element, event) {
        switch (action) {
            case 'steam-config':
                this.showSteamConfig();
                break;
            case 'demo-data':
                this.useDemoData();
                break;
            default:
                console.warn('Acción no reconocida:', action);
        }
    }

    // Manejo de scroll
    handleScroll() {
        // Lógica optimizada para scroll
    }

    // Manejo de resize
    handleResize() {
        // Lógica optimizada para resize
    }

    // Monitoreo de rendimiento
    startPerformanceMonitoring() {
        if (typeof performance === 'undefined') return;
        
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 100) {
                    console.warn('Operación lenta detectada:', entry.name, entry.duration);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gamingApp = new OptimizedGamingApp();
});

// Funciones globales mínimas
window.showSteamConfig = () => {
    window.gamingApp?.showSteamConfig();
};
