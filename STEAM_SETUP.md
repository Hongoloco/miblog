# 🎮 Guía de Configuración Steam - Ale Gallo

## 📋 Instrucciones Paso a Paso

### 1. Obtener tu Steam ID

Tu Steam ID es un número único que identifica tu cuenta. Hay varias formas de obtenerlo:

#### Opción A: Desde tu URL de perfil
1. Ve a tu perfil de Steam
2. Copia la URL (ejemplo: `https://steamcommunity.com/profiles/76561198123456789`)
3. El número después de `/profiles/` es tu Steam ID

#### Opción B: Usar herramientas online
1. Ve a [SteamID.io](https://steamid.io/)
2. Ingresa tu nombre de usuario o URL de perfil
3. Obtendrás tu Steam ID64

### 2. Obtener tu Steam API Key

1. Ve a [Steam API Key Registration](https://steamcommunity.com/dev/apikey)
2. Inicia sesión con tu cuenta Steam
3. Ingresa tu dominio (ejemplo: `localhost` para desarrollo local)
4. Acepta los términos de servicio
5. Copia tu API Key (formato: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### 3. Configurar en tu sitio web

1. Haz clic en el botón flotante 🎮 en la esquina inferior derecha
2. Ingresa tu Steam ID y API Key
3. Opcionalmente, pega tu URL de perfil para extraer automáticamente el Steam ID
4. Haz clic en "Probar Conexión" para verificar
5. Si funciona, haz clic en "Guardar Configuración"

### 4. Datos que se mostrarán

Una vez configurado, tu sitio mostrará:

- **Estadísticas reales**: Total de juegos, horas jugadas, tasa de logros
- **Juegos destacados**: Tus juegos con más horas jugadas
- **Información de perfil**: Nombre de usuario, fecha de creación de cuenta
- **Categorías**: Distribución de juegos por género (estimado)
- **Actualizaciones automáticas**: Los datos se actualizan cada 5 minutos

### 5. Modo Demo

Si no quieres configurar Steam o tienes problemas:

1. Haz clic en "Usar Datos Demo"
2. Se cargarán datos de ejemplo realistas
3. Perfectos para probar el diseño

### 6. Solución de Problemas

#### Error: "API key inválida"
- Verifica que copiaste correctamente la API key
- Asegúrate de que no hay espacios al inicio o final
- Comprueba que la API key no haya expirado

#### Error: "CORS"
- Esto es normal, usamos un proxy para evitar problemas de CORS
- Los datos se obtienen correctamente a través del proxy

#### Error: "Steam ID no encontrado"
- Verifica que tu Steam ID sea correcto
- Asegúrate de que tu perfil sea público
- Usa el Steam ID64 (número largo)

### 7. Configuración Avanzada

#### Personalizar datos mostrados
Puedes modificar el archivo `steam-integration.js` para:
- Cambiar qué estadísticas mostrar
- Modificar cómo se categorizan los juegos
- Ajustar el formato de las horas jugadas

#### Cachés y rendimiento
- Los datos se guardan en localStorage por 10 minutos
- Esto reduce las llamadas a la API de Steam
- Mejora la velocidad de carga

### 8. Seguridad

- Tu API key se guarda localmente en tu navegador
- No se envía a ningún servidor externo
- Solo se usa para obtener datos de Steam
- Puedes revocar la API key en cualquier momento desde Steam

### 9. Limitaciones

- Steam API tiene límites de velocidad
- Algunos datos pueden no estar disponibles si tu perfil es privado
- Las categorías de juegos son estimadas, no exactas

### 10. Ejemplos de Configuración

#### Configuración completa
```javascript
// En la consola del navegador
window.steamIntegration.configure('76561198123456789', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
```

#### Solo datos demo
```javascript
// En la consola del navegador
window.steamIntegration.setManualData({
    username: 'AleGallo_Gaming',
    gameCount: 187,
    totalPlaytime: 45600
});
```

## 🎯 Resultado Final

Una vez configurado, tu sitio web mostrará:

- ✅ **Estadísticas reales** de tu cuenta Steam
- ✅ **Juegos más jugados** con horas exactas
- ✅ **Progreso de logros** calculado
- ✅ **Información de perfil** actualizada
- ✅ **Diseño gaming** personalizado con tus datos

¡Disfruta de tu sitio web gaming completamente personalizado! 🎮
