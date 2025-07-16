// Gestor de iconos externos y caché local
class IconManager {
    constructor() {
        this.cache = new Map();
        this.providers = {
            iconify: 'https://api.iconify.design',
            fontawesome: 'https://kit.fontawesome.com/icons',
            simpleicons: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons',
            devicons: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'
        };
        this.init();
    }

    async init() {
        // Cargar caché desde localStorage
        this.loadCache();
        
        // Precargar iconos populares
        this.preloadPopularIcons();
    }

    loadCache() {
        try {
            const cached = localStorage.getItem('iconCache');
            if (cached) {
                const data = JSON.parse(cached);
                this.cache = new Map(data);
            }
        } catch (error) {
            console.error('Error cargando caché de iconos:', error);
        }
    }

    saveCache() {
        try {
            const data = Array.from(this.cache.entries());
            localStorage.setItem('iconCache', JSON.stringify(data));
        } catch (error) {
            console.error('Error guardando caché de iconos:', error);
        }
    }

    async getIcon(iconName, provider = 'iconify') {
        const cacheKey = `${provider}:${iconName}`;
        
        // Verificar caché
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const iconData = await this.fetchIcon(iconName, provider);
            
            // Guardar en caché
            this.cache.set(cacheKey, iconData);
            this.saveCache();
            
            return iconData;
        } catch (error) {
            console.error(`Error obteniendo icono ${iconName}:`, error);
            return this.getFallbackIcon();
        }
    }

    async fetchIcon(iconName, provider) {
        switch (provider) {
            case 'iconify':
                return await this.fetchIconifyIcon(iconName);
            case 'fontawesome':
                return await this.fetchFontAwesomeIcon(iconName);
            case 'simpleicons':
                return await this.fetchSimpleIcon(iconName);
            case 'devicons':
                return await this.fetchDevIcon(iconName);
            default:
                throw new Error(`Proveedor no soportado: ${provider}`);
        }
    }

    async fetchIconifyIcon(iconName) {
        const response = await fetch(`${this.providers.iconify}/${iconName}.svg`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const svg = await response.text();
        return {
            type: 'svg',
            data: svg,
            url: `${this.providers.iconify}/${iconName}.svg`
        };
    }

    async fetchFontAwesomeIcon(iconName) {
        // Para FontAwesome, generamos la URL directamente
        const url = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svgs/solid/${iconName}.svg`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const svg = await response.text();
            return {
                type: 'svg',
                data: svg,
                url: url
            };
        } catch (error) {
            // Intentar con brands
            const brandsUrl = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svgs/brands/${iconName}.svg`;
            const response = await fetch(brandsUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const svg = await response.text();
            return {
                type: 'svg',
                data: svg,
                url: brandsUrl
            };
        }
    }

    async fetchSimpleIcon(iconName) {
        const url = `${this.providers.simpleicons}/${iconName}.svg`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const svg = await response.text();
        return {
            type: 'svg',
            data: svg,
            url: url
        };
    }

    async fetchDevIcon(iconName) {
        const url = `${this.providers.devicons}/${iconName}/${iconName}-original.svg`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const svg = await response.text();
        return {
            type: 'svg',
            data: svg,
            url: url
        };
    }

    getFallbackIcon() {
        return {
            type: 'emoji',
            data: '🔗',
            url: null
        };
    }

    async preloadPopularIcons() {
        const popularIcons = [
            { name: 'mdi:github', provider: 'iconify' },
            { name: 'mdi:google', provider: 'iconify' },
            { name: 'mdi:microsoft', provider: 'iconify' },
            { name: 'mdi:apple', provider: 'iconify' },
            { name: 'mdi:facebook', provider: 'iconify' },
            { name: 'mdi:twitter', provider: 'iconify' },
            { name: 'mdi:instagram', provider: 'iconify' },
            { name: 'mdi:linkedin', provider: 'iconify' },
            { name: 'mdi:youtube', provider: 'iconify' },
            { name: 'mdi:discord', provider: 'iconify' },
            { name: 'chrome', provider: 'simpleicons' },
            { name: 'firefox', provider: 'simpleicons' },
            { name: 'edge', provider: 'simpleicons' },
            { name: 'vscode', provider: 'simpleicons' },
            { name: 'npm', provider: 'simpleicons' },
            { name: 'nodejs', provider: 'simpleicons' },
            { name: 'python', provider: 'simpleicons' },
            { name: 'javascript', provider: 'simpleicons' },
            { name: 'typescript', provider: 'simpleicons' },
            { name: 'react', provider: 'simpleicons' }
        ];

        // Precargar de manera asíncrona
        popularIcons.forEach(icon => {
            this.getIcon(icon.name, icon.provider).catch(() => {
                // Ignorar errores en precarga
            });
        });
    }

    // Buscar iconos por nombre o categoría
    async searchIcons(query, limit = 20) {
        const results = [];
        
        // Buscar en caché primero
        for (const [key, value] of this.cache.entries()) {
            if (key.includes(query.toLowerCase()) && results.length < limit) {
                results.push({
                    name: key.split(':')[1],
                    provider: key.split(':')[0],
                    ...value
                });
            }
        }

        // Si no hay suficientes resultados, buscar en línea
        if (results.length < limit) {
            try {
                const iconifyResults = await this.searchIconify(query, limit - results.length);
                results.push(...iconifyResults);
            } catch (error) {
                console.error('Error buscando iconos:', error);
            }
        }

        return results;
    }

    async searchIconify(query, limit = 10) {
        try {
            // Iconify no tiene un endpoint de búsqueda directo, usar iconos populares
            const popularMatches = this.getPopularIconsMatching(query, limit);
            if (popularMatches.length > 0) {
                return popularMatches;
            }
            
            // Si no hay matches, devolver lista vacía
            return [];
        } catch (error) {
            console.error('Error buscando en Iconify:', error);
            return [];
        }
    }

    getPopularIconsMatching(query, limit = 10) {
        const popularIcons = [
            { name: 'github', provider: 'mdi', full: 'mdi:github' },
            { name: 'google', provider: 'mdi', full: 'mdi:google' },
            { name: 'microsoft', provider: 'mdi', full: 'mdi:microsoft' },
            { name: 'apple', provider: 'mdi', full: 'mdi:apple' },
            { name: 'facebook', provider: 'mdi', full: 'mdi:facebook' },
            { name: 'twitter', provider: 'mdi', full: 'mdi:twitter' },
            { name: 'instagram', provider: 'mdi', full: 'mdi:instagram' },
            { name: 'linkedin', provider: 'mdi', full: 'mdi:linkedin' },
            { name: 'youtube', provider: 'simple-icons', full: 'simple-icons:youtube' },
            { name: 'discord', provider: 'mdi', full: 'mdi:discord' },
            { name: 'chrome', provider: 'simple-icons', full: 'simple-icons:chrome' },
            { name: 'firefox', provider: 'simple-icons', full: 'simple-icons:firefox' },
            { name: 'vscode', provider: 'simple-icons', full: 'simple-icons:visualstudiocode' },
            { name: 'npm', provider: 'simple-icons', full: 'simple-icons:npm' },
            { name: 'nodejs', provider: 'simple-icons', full: 'simple-icons:nodedotjs' },
            { name: 'python', provider: 'simple-icons', full: 'simple-icons:python' },
            { name: 'javascript', provider: 'simple-icons', full: 'simple-icons:javascript' },
            { name: 'typescript', provider: 'simple-icons', full: 'simple-icons:typescript' },
            { name: 'react', provider: 'simple-icons', full: 'simple-icons:react' },
            { name: 'vue', provider: 'simple-icons', full: 'simple-icons:vuedotjs' },
            { name: 'angular', provider: 'simple-icons', full: 'simple-icons:angular' },
            { name: 'html', provider: 'simple-icons', full: 'simple-icons:html5' },
            { name: 'css', provider: 'simple-icons', full: 'simple-icons:css3' },
            { name: 'sass', provider: 'simple-icons', full: 'simple-icons:sass' },
            { name: 'bootstrap', provider: 'simple-icons', full: 'simple-icons:bootstrap' },
            { name: 'tailwind', provider: 'simple-icons', full: 'simple-icons:tailwindcss' },
            { name: 'git', provider: 'simple-icons', full: 'simple-icons:git' },
            { name: 'webpack', provider: 'simple-icons', full: 'simple-icons:webpack' },
            { name: 'docker', provider: 'simple-icons', full: 'simple-icons:docker' },
            { name: 'aws', provider: 'simple-icons', full: 'simple-icons:amazonaws' }
        ];
        
        const lowerQuery = query.toLowerCase();
        return popularIcons
            .filter(icon => icon.name.includes(lowerQuery))
            .slice(0, limit)
            .map(icon => ({
                name: icon.full,
                provider: 'iconify',
                type: 'svg',
                url: `${this.providers.iconify}/${icon.full}.svg`
            }));
    }

    // Generar HTML para mostrar un icono
    generateIconHTML(iconData, size = '24px') {
        if (!iconData) return '';
        
        if (iconData.type === 'emoji') {
            return `<span style="font-size: ${size};">${iconData.data}</span>`;
        }
        
        if (iconData.type === 'svg') {
            return `<div style="width: ${size}; height: ${size}; display: inline-block;">${iconData.data}</div>`;
        }
        
        if (iconData.url) {
            return `<img src="${iconData.url}" alt="Icon" style="width: ${size}; height: ${size};" />`;
        }
        
        return '';
    }

    // Limpiar caché antiguo
    clearOldCache(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 días
        const now = Date.now();
        const toDelete = [];
        
        for (const [key, value] of this.cache.entries()) {
            if (value.cached && (now - value.cached) > maxAge) {
                toDelete.push(key);
            }
        }
        
        toDelete.forEach(key => this.cache.delete(key));
        this.saveCache();
        
        console.log(`Limpiados ${toDelete.length} iconos del caché`);
    }

    // Obtener estadísticas del caché
    getCacheStats() {
        return {
            totalIcons: this.cache.size,
            providers: [...new Set(Array.from(this.cache.keys()).map(key => key.split(':')[0]))],
            cacheSize: JSON.stringify(Array.from(this.cache.entries())).length
        };
    }

    // Exportar/importar configuración
    exportSettings() {
        return {
            cache: Array.from(this.cache.entries()),
            providers: this.providers,
            exportDate: new Date().toISOString()
        };
    }

    importSettings(data) {
        try {
            if (data.cache) {
                this.cache = new Map(data.cache);
                this.saveCache();
            }
            
            if (data.providers) {
                this.providers = { ...this.providers, ...data.providers };
            }
            
            return true;
        } catch (error) {
            console.error('Error importando configuración:', error);
            return false;
        }
    }
}

// Crear instancia global
const iconManager = new IconManager();

// Exportar para uso en otros módulos
window.iconManager = iconManager;
