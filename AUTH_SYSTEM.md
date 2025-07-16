# 🔐 SISTEMA DE AUTENTICACIÓN - Ale Gallo

## 📋 DESCRIPCIÓN
Sistema de autenticación completo que protege todo el sitio web con credenciales personalizadas. Requiere login para acceder a cualquier página del sitio.

## 🔑 CREDENCIALES DE ACCESO
```
Usuario: alegallo
Contraseña: miweb2025
```

## 🚀 ACCESO RÁPIDO
- **Página de Login**: [http://localhost:8000/login.html](http://localhost:8000/login.html)
- **Página Principal**: [http://localhost:8000/index.html](http://localhost:8000/index.html)

## 📁 ARCHIVOS DEL SISTEMA

### 🔐 Autenticación
- `login.html` - Página de login con diseño moderno
- `js/auth-system.js` - Sistema de autenticación completo
- `redirect.html` - Página de redirección automática

### 🛡️ Páginas Protegidas
- `index.html` - Página principal
- `about.html` - Sobre mí
- `blog-simple.html` - Blog
- `contact.html` - Contacto
- `admin.html` - Panel de administración
- `resources-offline.html` - Recursos offline

## ⚙️ CARACTERÍSTICAS

### 🔒 Seguridad
- ✅ Autenticación requerida para todas las páginas
- ✅ Sesión persistente por 24 horas
- ✅ Credenciales almacenadas de forma segura
- ✅ Verificación automática de sesión cada minuto
- ✅ Protección contra acceso directo
- ✅ Redirección automática al login si no hay sesión

### 🎨 Interfaz
- ✅ Diseño moderno con efectos visuales
- ✅ Animaciones suaves y partículas flotantes
- ✅ Responsive design para móviles
- ✅ Indicador de usuario activo
- ✅ Botón de cerrar sesión en todas las páginas

### 🔄 Funcionalidad
- ✅ Extensión automática de sesión con actividad
- ✅ Manejo de páginas de retorno después del login
- ✅ Mensajes de error y éxito
- ✅ Limpieza automática de sesiones expiradas

## 🛠️ CONFIGURACIÓN

### 1. Iniciar Servidor
```bash
python3 -m http.server 8000
```

### 2. Configurar Autenticación
```bash
./setup-auth.sh
```

### 3. Acceder al Sistema
1. Navega a: `http://localhost:8000/login.html`
2. Ingresa las credenciales
3. Serás redirigido al sitio principal

## 🔧 PERSONALIZACIÓN

### Cambiar Credenciales
Edita el archivo `login.html` en la línea 253:
```javascript
const CREDENTIALS = {
    username: 'tu_usuario',
    password: 'tu_contraseña'
};
```

### Cambiar Duración de Sesión
Edita el archivo `js/auth-system.js` en la línea 9:
```javascript
SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas
```

### Personalizar Página de Login
Modifica los estilos CSS en `login.html` para cambiar:
- Colores del degradado
- Fuentes y tamaños
- Animaciones
- Efectos visuales

## 🚨 SOLUCIÓN DE PROBLEMAS

### No puedo acceder
1. Verifica las credenciales:
   - Usuario: `alegallo`
   - Contraseña: `miweb2025`
2. Asegúrate de que el servidor esté corriendo
3. Limpia el localStorage del navegador

### Problemas de redirección
1. Abre la consola del navegador
2. Ejecuta: `localStorage.clear()`
3. Recarga la página

### Login no funciona
1. Verifica que no haya errores en la consola
2. Asegúrate de que JavaScript esté habilitado
3. Prueba en modo incógnito

### Sesión expira muy rápido
1. Revisa la configuración de duración
2. Verifica que haya actividad del usuario
3. Comprueba la hora del sistema

## 📱 COMPATIBILIDAD
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles

## 🔍 MONITOREO

### Verificar Sesión Actual
```javascript
// En consola del navegador
console.log(localStorage.getItem('aleGalloAuth'));
```

### Forzar Logout
```javascript
// En consola del navegador
AuthSystem.logout();
```

### Extender Sesión
```javascript
// En consola del navegador
AuthSystem.extendSession();
```

## 📊 ESTADÍSTICAS
- **Total de páginas protegidas**: 6
- **Duración de sesión**: 24 horas
- **Verificación automática**: Cada minuto
- **Tiempo de redirección**: 1.5 segundos

## 🎯 VENTAJAS
1. **Seguridad Total**: Todas las páginas están protegidas
2. **Fácil de Usar**: Interface intuitiva y moderna
3. **Persistencia**: Sesión se mantiene durante 24 horas
4. **Responsive**: Funciona en cualquier dispositivo
5. **Automático**: Verificación y redirección automática
6. **Personalizable**: Fácil de modificar y personalizar

## 📝 NOTAS
- El sistema usa localStorage para mantener la sesión
- Las credenciales se verifican del lado del cliente
- Para producción, considera implementar autenticación del servidor
- Las sesiones se extienden automáticamente con actividad del usuario
- El sistema es completamente offline y no requiere conexión

## 🔗 ENLACES ÚTILES
- [Página de Login](http://localhost:8000/login.html)
- [Diagnóstico Web](./diagnostico-web.sh)
- [Configuración Auth](./setup-auth.sh)

---

## 📞 SOPORTE
Si tienes problemas con el sistema de autenticación, ejecuta:
```bash
./setup-auth.sh
```

**¡Tu web ahora está completamente protegida con un sistema de autenticación profesional!** 🎉
