// 🎮 Steam Configuration Panel - Ale Gallo

class SteamConfigPanel {
    constructor() {
        this.isVisible = false;
        this.createPanel();
        this.setupEvents();
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'steamConfigPanel';
        panel.innerHTML = `
            <div class="steam-config-overlay">
                <div class="steam-config-modal">
                    <div class="steam-config-header">
                        <h3>🎮 Configuración de Steam</h3>
                        <button class="close-steam-config">&times;</button>
                    </div>
                    
                    <div class="steam-config-content">
                        <div class="config-section">
                            <h4>📋 Instrucciones</h4>
                            <ol>
                                <li>Ve a <a href="https://steamcommunity.com/dev/apikey" target="_blank">Steam API Key</a></li>
                                <li>Registra tu sitio web y obtén tu API key</li>
                                <li>Encuentra tu Steam ID en tu perfil URL</li>
                                <li>Ingresa los datos aquí</li>
                            </ol>
                        </div>
                        
                        <div class="config-form">
                            <div class="form-group">
                                <label>🔑 Steam API Key</label>
                                <input type="password" id="steamApiKey" placeholder="Tu API key de Steam">
                                <small>Obtenla en: https://steamcommunity.com/dev/apikey</small>
                            </div>
                            
                            <div class="form-group">
                                <label>👤 Steam ID</label>
                                <input type="text" id="steamId" placeholder="76561198000000000">
                                <small>Encuéntralo en tu URL de perfil</small>
                            </div>
                            
                            <div class="form-group">
                                <label>🔗 URL de Perfil de Steam (opcional)</label>
                                <input type="url" id="steamProfileUrl" placeholder="https://steamcommunity.com/profiles/76561198000000000">
                                <button type="button" id="extractSteamId">Extraer Steam ID</button>
                            </div>
                            
                            <div class="config-actions">
                                <button type="button" id="testSteamConnection">🧪 Probar Conexión</button>
                                <button type="button" id="saveSteamConfig">💾 Guardar Configuración</button>
                                <button type="button" id="useDemoData">📝 Usar Datos Demo</button>
                            </div>
                        </div>
                        
                        <div class="config-status">
                            <div id="steamStatus" class="status-indicator">
                                <span class="status-dot"></span>
                                <span class="status-text">Sin configurar</span>
                            </div>
                        </div>
                        
                        <div class="demo-info">
                            <h4>🎯 Datos Demo Disponibles</h4>
                            <p>Si no tienes API key, puedes usar datos de ejemplo para ver cómo funciona:</p>
                            <ul>
                                <li>187 juegos en biblioteca</li>
                                <li>760+ horas de juego</li>
                                <li>Juegos populares como Cyberpunk 2077, Hades, etc.</li>
                                <li>Estadísticas de logros y progreso</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            backdrop-filter: blur(5px);
        `;
        
        document.body.appendChild(panel);
        this.panel = panel;
    }

    setupEvents() {
        // Cerrar panel
        this.panel.querySelector('.close-steam-config').addEventListener('click', () => {
            this.hide();
        });

        // Extraer Steam ID desde URL
        this.panel.querySelector('#extractSteamId').addEventListener('click', () => {
            this.extractSteamIdFromUrl();
        });

        // Probar conexión
        this.panel.querySelector('#testSteamConnection').addEventListener('click', () => {
            this.testConnection();
        });

        // Guardar configuración
        this.panel.querySelector('#saveSteamConfig').addEventListener('click', () => {
            this.saveConfiguration();
        });

        // Usar datos demo
        this.panel.querySelector('#useDemoData').addEventListener('click', () => {
            this.useDemoData();
        });

        // Cerrar al hacer clic fuera
        this.panel.querySelector('.steam-config-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hide();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    show() {
        this.panel.style.display = 'flex';
        this.isVisible = true;
        
        // Cargar configuración guardada
        this.loadSavedConfig();
        
        // Animar entrada
        setTimeout(() => {
            this.panel.querySelector('.steam-config-modal').style.animation = 'steamModalIn 0.3s ease-out';
        }, 10);
    }

    hide() {
        this.panel.querySelector('.steam-config-modal').style.animation = 'steamModalOut 0.3s ease-in';
        
        setTimeout(() => {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }, 300);
    }

    loadSavedConfig() {
        const saved = localStorage.getItem('steamConfig');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                
                if (config.apiKey) {
                    this.panel.querySelector('#steamApiKey').value = config.apiKey;
                }
                if (config.steamId) {
                    this.panel.querySelector('#steamId').value = config.steamId;
                }
                if (config.profileUrl) {
                    this.panel.querySelector('#steamProfileUrl').value = config.profileUrl;
                }
                
                this.updateStatus('configured', 'Configurado correctamente');
            } catch (error) {
                console.error('Error cargando configuración:', error);
            }
        }
    }

    extractSteamIdFromUrl() {
        const urlInput = this.panel.querySelector('#steamProfileUrl');
        const steamIdInput = this.panel.querySelector('#steamId');
        const url = urlInput.value.trim();
        
        if (!url) {
            this.showMessage('Por favor ingresa la URL de tu perfil de Steam', 'error');
            return;
        }
        
        const steamId = SteamIntegration.extractSteamId(url);
        if (steamId) {
            steamIdInput.value = steamId;
            this.showMessage('Steam ID extraído correctamente', 'success');
        } else {
            this.showMessage('No se pudo extraer el Steam ID de la URL', 'error');
        }
    }

    async testConnection() {
        const apiKey = this.panel.querySelector('#steamApiKey').value.trim();
        const steamId = this.panel.querySelector('#steamId').value.trim();
        
        if (!apiKey || !steamId) {
            this.showMessage('Por favor ingresa API key y Steam ID', 'error');
            return;
        }
        
        this.updateStatus('testing', 'Probando conexión...');
        
        try {
            // Crear instancia temporal para probar
            const tempIntegration = new SteamIntegration();
            const isValid = await tempIntegration.validateApiKey(apiKey);
            
            if (isValid) {
                this.updateStatus('success', 'Conexión exitosa');
                this.showMessage('¡Conexión con Steam exitosa!', 'success');
            } else {
                this.updateStatus('error', 'Error de conexión');
                this.showMessage('Error: API key inválida o problema de conexión', 'error');
            }
        } catch (error) {
            this.updateStatus('error', 'Error de conexión');
            this.showMessage('Error conectando con Steam: ' + error.message, 'error');
        }
    }

    saveConfiguration() {
        const apiKey = this.panel.querySelector('#steamApiKey').value.trim();
        const steamId = this.panel.querySelector('#steamId').value.trim();
        const profileUrl = this.panel.querySelector('#steamProfileUrl').value.trim();
        
        if (!apiKey || !steamId) {
            this.showMessage('Por favor completa API key y Steam ID', 'error');
            return;
        }
        
        const config = {
            apiKey: apiKey,
            steamId: steamId,
            profileUrl: profileUrl,
            timestamp: Date.now()
        };
        
        // Guardar configuración
        localStorage.setItem('steamConfig', JSON.stringify(config));
        
        // Configurar integración de Steam
        if (window.steamIntegration) {
            window.steamIntegration.configure(steamId, apiKey);
        }
        
        this.updateStatus('configured', 'Configuración guardada');
        this.showMessage('¡Configuración guardada exitosamente!', 'success');
        
        // Cerrar panel después de 2 segundos
        setTimeout(() => {
            this.hide();
        }, 2000);
    }

    useDemoData() {
        // Configurar datos demo
        if (window.steamIntegration) {
            window.steamIntegration.setManualData({
                username: 'AleGallo_Gaming',
                gameCount: 187,
                totalPlaytime: 45600,
                accountCreated: 1388534400,
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
                        name: 'The Witcher 3: Wild Hunt',
                        playtime_forever: 12000,
                        img_icon_url: 'witcher3_icon'
                    },
                    {
                        appid: 1245620,
                        name: 'ELDEN RING',
                        playtime_forever: 9000,
                        img_icon_url: 'elden_ring_icon'
                    }
                ]
            });
        }
        
        this.updateStatus('demo', 'Usando datos demo');
        this.showMessage('¡Datos demo cargados exitosamente!', 'success');
        
        // Cerrar panel
        setTimeout(() => {
            this.hide();
        }, 2000);
    }

    updateStatus(type, message) {
        const statusEl = this.panel.querySelector('#steamStatus');
        const dotEl = statusEl.querySelector('.status-dot');
        const textEl = statusEl.querySelector('.status-text');
        
        // Resetear clases
        statusEl.className = 'status-indicator';
        
        // Aplicar nueva clase
        statusEl.classList.add(`status-${type}`);
        textEl.textContent = message;
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `steam-message steam-message-${type}`;
        messageEl.textContent = message;
        
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10002;
            animation: slideInRight 0.3s ease-out;
        `;
        
        if (type === 'success') {
            messageEl.style.background = '#4CAF50';
        } else if (type === 'error') {
            messageEl.style.background = '#f44336';
        } else {
            messageEl.style.background = '#2196F3';
        }
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// Estilos para el panel
const configStyles = document.createElement('style');
configStyles.textContent = `
    .steam-config-modal {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 2px solid #4a90e2;
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        backdrop-filter: blur(15px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .steam-config-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(74, 144, 226, 0.3);
    }

    .steam-config-header h3 {
        color: #4a90e2;
        margin: 0;
        font-size: 1.5rem;
    }

    .close-steam-config {
        background: none;
        border: none;
        color: #888;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 5px;
        transition: all 0.3s;
    }

    .close-steam-config:hover {
        color: #f0f0f0;
        background: rgba(255, 255, 255, 0.1);
    }

    .config-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .config-section h4 {
        color: #4a90e2;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .config-section ol {
        color: rgba(255, 255, 255, 0.9);
        padding-left: 1.5rem;
    }

    .config-section li {
        margin-bottom: 0.5rem;
    }

    .config-section a {
        color: #4a90e2;
        text-decoration: none;
        font-weight: 600;
    }

    .config-section a:hover {
        text-decoration: underline;
    }

    .config-form {
        margin-bottom: 2rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        color: #f0f0f0;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    .form-group input {
        width: 100%;
        padding: 0.8rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #f0f0f0;
        font-size: 1rem;
        transition: all 0.3s;
    }

    .form-group input:focus {
        outline: none;
        border-color: #4a90e2;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 20px rgba(74, 144, 226, 0.2);
    }

    .form-group small {
        display: block;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 0.5rem;
        font-size: 0.9rem;
    }

    .form-group button {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s;
    }

    .form-group button:hover {
        background: #357abd;
        transform: translateY(-1px);
    }

    .config-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
    }

    .config-actions button {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 0.9rem;
    }

    .config-actions button:nth-child(1) {
        background: #ff9800;
        color: white;
    }

    .config-actions button:nth-child(2) {
        background: #4caf50;
        color: white;
    }

    .config-actions button:nth-child(3) {
        background: #2196f3;
        color: white;
    }

    .config-actions button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .config-status {
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 1.5rem;
    }

    .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #888;
        animation: pulse 2s infinite;
    }

    .status-configured .status-dot {
        background: #4caf50;
    }

    .status-testing .status-dot {
        background: #ff9800;
    }

    .status-success .status-dot {
        background: #4caf50;
    }

    .status-error .status-dot {
        background: #f44336;
    }

    .status-demo .status-dot {
        background: #2196f3;
    }

    .status-text {
        color: #f0f0f0;
        font-weight: 600;
    }

    .demo-info {
        background: rgba(33, 150, 243, 0.1);
        border: 1px solid #2196f3;
        border-radius: 10px;
        padding: 1.5rem;
    }

    .demo-info h4 {
        color: #2196f3;
        margin-bottom: 1rem;
    }

    .demo-info p {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 1rem;
    }

    .demo-info ul {
        color: rgba(255, 255, 255, 0.8);
        padding-left: 1.5rem;
    }

    .demo-info li {
        margin-bottom: 0.5rem;
    }

    @keyframes steamModalIn {
        0% {
            transform: scale(0.9);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes steamModalOut {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0.9);
            opacity: 0;
        }
    }

    @keyframes slideInRight {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    @media (max-width: 768px) {
        .steam-config-modal {
            width: 95%;
            padding: 1rem;
        }
        
        .config-actions {
            flex-direction: column;
        }
        
        .config-actions button {
            width: 100%;
        }
    }
`;

document.head.appendChild(configStyles);

// Exportar clase
window.SteamConfigPanel = SteamConfigPanel;
