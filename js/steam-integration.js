// 🎮 Steam Integration - Ale Gallo
// Sistema para obtener información real de Steam

class SteamIntegration {
    constructor() {
        // Tu Steam ID (necesitarás obtenerlo de tu perfil)
        this.steamId = '76561198000000000'; // Placeholder - necesitas tu Steam ID real
        this.apiKey = 'TU_API_KEY_AQUI'; // Necesitas registrar una API key en Steam
        this.proxyUrl = 'https://api.allorigins.win/get?url='; // Proxy para CORS
        this.cache = new Map();
        this.cacheExpiry = 10 * 60 * 1000; // 10 minutos
        
        this.init();
    }

    init() {
        console.log('🎮 Iniciando integración con Steam...');
        
        // Verificar si hay datos en cache
        this.loadCachedData();
        
        // Intentar obtener datos de Steam
        this.fetchSteamData();
        
        // Configurar actualización automática cada 5 minutos
        setInterval(() => {
            this.fetchSteamData();
        }, 5 * 60 * 1000);
    }

    // Método para configurar manualmente los datos si no tienes API key
    setManualData(data) {
        this.manualData = {
            profile: {
                personaname: data.username || 'Ale Gallo',
                profileurl: data.profileUrl || 'https://steamcommunity.com/profiles/76561198000000000',
                avatar: data.avatar || 'https://via.placeholder.com/64x64/4a90e2/ffffff?text=AG',
                timecreated: data.accountCreated || 1388534400, // 1 Enero 2014
                realname: data.realName || 'Alejandro Gallo'
            },
            games: {
                game_count: data.gameCount || 150,
                games: data.recentGames || [
                    {
                        appid: 1091500,
                        name: 'Cyberpunk 2077',
                        playtime_forever: 7200, // 120 horas
                        img_icon_url: 'cyberpunk_icon',
                        img_logo_url: 'cyberpunk_logo'
                    },
                    {
                        appid: 1145360,
                        name: 'Hades',
                        playtime_forever: 5100, // 85 horas
                        img_icon_url: 'hades_icon',
                        img_logo_url: 'hades_logo'
                    },
                    {
                        appid: 292030,
                        name: 'The Witcher 3: Wild Hunt',
                        playtime_forever: 12000, // 200 horas
                        img_icon_url: 'witcher3_icon',
                        img_logo_url: 'witcher3_logo'
                    },
                    {
                        appid: 1245620,
                        name: 'ELDEN RING',
                        playtime_forever: 9000, // 150 horas
                        img_icon_url: 'elden_ring_icon',
                        img_logo_url: 'elden_ring_logo'
                    }
                ]
            },
            achievements: {
                total_achievements: 1250,
                completed_achievements: 890,
                completion_rate: 71.2
            },
            stats: {
                total_playtime: 33600, // 560 horas total
                games_played_2_weeks: 12,
                perfect_games: 25,
                avg_completion_rate: 75.5
            }
        };
        
        this.updateUIWithData(this.manualData);
    }

    async fetchSteamData() {
        try {
            // Si no hay API key, usar datos manuales
            if (!this.apiKey || this.apiKey === 'TU_API_KEY_AQUI') {
                console.log('⚠️ No hay API key de Steam configurada, usando datos de ejemplo');
                this.setManualData({
                    username: 'AleGallo_Gaming',
                    gameCount: 187,
                    totalPlaytime: 45600, // 760 horas
                    recentGames: [
                        {
                            appid: 1091500,
                            name: 'Cyberpunk 2077',
                            playtime_forever: 7200,
                            img_icon_url: 'cyberpunk_icon'
                        },
                        {
                            appid: 1145360,
                            name: 'Hades',
                            playtime_forever: 5100,
                            img_icon_url: 'hades_icon'
                        },
                        {
                            appid: 292030,
                            name: 'The Witcher 3',
                            playtime_forever: 12000,
                            img_icon_url: 'witcher3_icon'
                        }
                    ]
                });
                return;
            }

            // Obtener información del perfil
            const profileData = await this.fetchProfileData();
            
            // Obtener juegos del usuario
            const gamesData = await this.fetchGamesData();
            
            // Obtener estadísticas globales
            const statsData = await this.fetchStatsData();

            const steamData = {
                profile: profileData,
                games: gamesData,
                stats: statsData,
                timestamp: Date.now()
            };

            // Guardar en cache
            this.saveToCache(steamData);
            
            // Actualizar UI
            this.updateUIWithData(steamData);
            
            console.log('✅ Datos de Steam obtenidos exitosamente');
            
        } catch (error) {
            console.error('❌ Error obteniendo datos de Steam:', error);
            this.handleSteamError(error);
        }
    }

    async fetchProfileData() {
        const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${this.steamId}`;
        const response = await fetch(this.proxyUrl + encodeURIComponent(url));
        const data = await response.json();
        return JSON.parse(data.contents).response.players[0];
    }

    async fetchGamesData() {
        const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.apiKey}&steamid=${this.steamId}&format=json&include_appinfo=true&include_played_free_games=true`;
        const response = await fetch(this.proxyUrl + encodeURIComponent(url));
        const data = await response.json();
        return JSON.parse(data.contents).response;
    }

    async fetchStatsData() {
        // Calcular estadísticas basadas en los datos de juegos
        const gamesData = await this.fetchGamesData();
        
        const totalPlaytime = gamesData.games.reduce((total, game) => total + game.playtime_forever, 0);
        const recentGames = gamesData.games.filter(game => game.playtime_2weeks > 0);
        
        return {
            total_playtime: totalPlaytime,
            games_played_2_weeks: recentGames.length,
            total_games: gamesData.game_count,
            avg_playtime: totalPlaytime / gamesData.game_count
        };
    }

    updateUIWithData(data) {
        // Actualizar estadísticas del hero
        this.updateHeroStats(data);
        
        // Actualizar juegos destacados
        this.updateFeaturedGames(data);
        
        // Actualizar información del perfil
        this.updateProfileInfo(data);
        
        // Actualizar categorías
        this.updateCategories(data);
        
        // Mostrar notificación de actualización
        this.showUpdateNotification();
    }

    updateHeroStats(data) {
        const stats = [
            {
                selector: '.stat-item:nth-child(1) .stat-number',
                value: data.games ? data.games.game_count || 150 : 187,
                label: 'Juegos en Biblioteca'
            },
            {
                selector: '.stat-item:nth-child(2) .stat-number',
                value: this.formatPlaytime(data.stats ? data.stats.total_playtime : 45600),
                label: 'Horas Jugadas'
            },
            {
                selector: '.stat-item:nth-child(3) .stat-number',
                value: data.achievements ? `${data.achievements.completion_rate.toFixed(1)}%` : '75.5%',
                label: 'Tasa de Logros'
            }
        ];

        stats.forEach(stat => {
            const element = document.querySelector(stat.selector);
            if (element) {
                this.animateNumber(element, stat.value);
            }
            
            const labelElement = document.querySelector(stat.selector.replace('.stat-number', '.stat-label'));
            if (labelElement) {
                labelElement.textContent = stat.label;
            }
        });
    }

    updateFeaturedGames(data) {
        if (!data.games || !data.games.games) return;

        const gameCards = document.querySelectorAll('.game-card');
        const topGames = data.games.games
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .slice(0, 4);

        topGames.forEach((game, index) => {
            if (gameCards[index]) {
                const card = gameCards[index];
                
                // Actualizar nombre del juego
                const nameElement = card.querySelector('h3');
                if (nameElement) {
                    nameElement.textContent = game.name;
                }
                
                // Actualizar tiempo jugado
                const playtimeElement = card.querySelector('.playtime');
                if (playtimeElement) {
                    playtimeElement.textContent = this.formatPlaytime(game.playtime_forever);
                }
                
                // Actualizar imagen si está disponible
                const imageElement = card.querySelector('.game-image');
                if (imageElement && game.img_icon_url) {
                    const imgUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                    imageElement.style.backgroundImage = `url(${imgUrl})`;
                    imageElement.style.backgroundSize = 'cover';
                    imageElement.style.backgroundPosition = 'center';
                }
                
                // Generar rating basado en tiempo jugado
                const rating = this.calculateRating(game.playtime_forever);
                const ratingElement = card.querySelector('.game-rating');
                if (ratingElement) {
                    ratingElement.textContent = rating;
                }
            }
        });
    }

    updateProfileInfo(data) {
        if (!data.profile) return;

        // Actualizar nombre en el header si existe
        const headerName = document.querySelector('header h1');
        if (headerName && data.profile.personaname) {
            headerName.innerHTML = `${data.profile.personaname} - Gaming Universe`;
        }

        // Actualizar descripción del hero
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.innerHTML = `
                Gamer desde ${this.formatCreationDate(data.profile.timecreated)}. 
                Explora mi mundo digital: reviews, guías, análisis y todo sobre videojuegos.
            `;
        }
    }

    updateCategories(data) {
        if (!data.games || !data.games.games) return;

        // Categorizar juegos por géneros (estimado)
        const categories = this.categorizeGames(data.games.games);
        
        const categoryCards = document.querySelectorAll('.category-card');
        const categoryData = [
            { name: 'Acción', count: categories.action },
            { name: 'RPG', count: categories.rpg },
            { name: 'Puzzle', count: categories.puzzle },
            { name: 'Indie', count: categories.indie }
        ];

        categoryData.forEach((category, index) => {
            if (categoryCards[index]) {
                const countElement = categoryCards[index].querySelector('.game-count');
                if (countElement) {
                    countElement.textContent = `${category.count} juegos`;
                }
            }
        });
    }

    categorizeGames(games) {
        // Categorización básica basada en nombres de juegos
        const categories = { action: 0, rpg: 0, puzzle: 0, indie: 0 };
        
        games.forEach(game => {
            const name = game.name.toLowerCase();
            
            if (name.includes('action') || name.includes('shooter') || name.includes('combat')) {
                categories.action++;
            } else if (name.includes('rpg') || name.includes('witcher') || name.includes('elder') || name.includes('fantasy')) {
                categories.rpg++;
            } else if (name.includes('puzzle') || name.includes('tetris') || name.includes('brain')) {
                categories.puzzle++;
            } else {
                categories.indie++;
            }
        });

        return categories;
    }

    calculateRating(playtime) {
        // Calcular rating basado en tiempo jugado
        if (playtime > 6000) return '9.5'; // 100+ horas
        if (playtime > 3000) return '9.0'; // 50+ horas
        if (playtime > 1500) return '8.5'; // 25+ horas
        if (playtime > 600) return '8.0'; // 10+ horas
        return '7.5';
    }

    formatPlaytime(minutes) {
        const hours = Math.floor(minutes / 60);
        if (hours > 1000) {
            return `${(hours / 1000).toFixed(1)}K`;
        }
        return `${hours}h`;
    }

    formatCreationDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.getFullYear();
    }

    animateNumber(element, newValue) {
        const currentValue = element.textContent;
        
        // Si es un número, animar la transición
        if (!isNaN(parseInt(currentValue))) {
            const start = parseInt(currentValue);
            const end = parseInt(newValue);
            const duration = 1000;
            const step = (end - start) / (duration / 16);
            
            let current = start;
            const timer = setInterval(() => {
                current += step;
                element.textContent = Math.floor(current);
                
                if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
                    element.textContent = newValue;
                    clearInterval(timer);
                }
            }, 16);
        } else {
            // Si no es un número, cambiar directamente
            element.textContent = newValue;
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'steam-update-notification';
        notification.innerHTML = `
            <div class="steam-notification-content">
                <span class="steam-icon">🎮</span>
                <span>Datos de Steam actualizados</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #1b2838, #2a475e);
            color: #c7d5e0;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border: 1px solid #4a90e2;
            animation: slideInLeft 0.5s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutLeft 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    loadCachedData() {
        const cached = localStorage.getItem('steamData');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < this.cacheExpiry) {
                    this.updateUIWithData(data);
                    console.log('🎮 Datos de Steam cargados desde cache');
                }
            } catch (error) {
                console.error('Error cargando cache:', error);
            }
        }
    }

    saveToCache(data) {
        try {
            localStorage.setItem('steamData', JSON.stringify(data));
        } catch (error) {
            console.error('Error guardando cache:', error);
        }
    }

    handleSteamError(error) {
        console.error('❌ Error de Steam:', error);
        
        // Usar datos de respaldo
        this.setManualData({
            username: 'AleGallo_Gaming',
            gameCount: 187,
            totalPlaytime: 45600
        });
        
        // Mostrar notificación de error
        const notification = document.createElement('div');
        notification.className = 'steam-error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <span>⚠️</span>
                <span>Steam API no disponible - usando datos locales</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #f44336;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInLeft 0.5s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutLeft 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // Método para configurar manualmente tu Steam ID y API key
    configure(steamId, apiKey) {
        this.steamId = steamId;
        this.apiKey = apiKey;
        
        console.log('🔧 Configuración de Steam actualizada');
        this.fetchSteamData();
    }

    // Método para obtener tu Steam ID desde URL
    static extractSteamId(profileUrl) {
        const match = profileUrl.match(/\/profiles\/(\d+)/);
        return match ? match[1] : null;
    }

    // Método para validar API key
    async validateApiKey(apiKey) {
        try {
            const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=76561197960435530`;
            const response = await fetch(this.proxyUrl + encodeURIComponent(url));
            const data = await response.json();
            return data.status === 200;
        } catch (error) {
            return false;
        }
    }
}

// Estilos para las notificaciones
const steamStyles = document.createElement('style');
steamStyles.textContent = `
    @keyframes slideInLeft {
        0% {
            transform: translateX(-100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutLeft {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-100%);
            opacity: 0;
        }
    }

    .steam-notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .steam-icon {
        font-size: 1.2rem;
    }
`;

document.head.appendChild(steamStyles);

// Función global para configurar Steam
window.configureSteam = function(steamId, apiKey) {
    if (window.steamIntegration) {
        window.steamIntegration.configure(steamId, apiKey);
    }
};

// Exportar clase
window.SteamIntegration = SteamIntegration;
