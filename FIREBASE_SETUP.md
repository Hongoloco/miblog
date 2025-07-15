# Configuración de Firebase para tu Blog

## Paso 1: Crear proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (por ejemplo: "ale-gallo-blog")
4. Acepta los términos y continúa
5. Puedes deshabilitar Google Analytics si no lo necesitas

## Paso 2: Configurar Realtime Database

1. En la consola de Firebase, ve a "Realtime Database"
2. Haz clic en "Crear base de datos"
3. Selecciona una ubicación (recomendado: us-central1)
4. Comienza en "modo de prueba" (puedes cambiarlo después)

## Paso 3: Configurar autenticación (opcional)

1. Ve a "Authentication" en la consola
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", puedes habilitar métodos como:
   - Email/Password
   - Google
   - Anónimo

## Paso 4: Obtener configuración del proyecto

1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. Selecciona "Configuración general"
3. Baja hasta "Tus aplicaciones"
4. Haz clic en "Agregar app" → "Web"
5. Registra tu app con un nombre
6. Copia la configuración que aparece

## Paso 5: Actualizar archivo firebase-config.js

Reemplaza las variables en `/js/firebase-config.js` con los valores de tu proyecto:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-aquí",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

## Paso 6: Configurar reglas de seguridad

En Realtime Database → Reglas, puedes usar estas reglas básicas:

```json
{
  "rules": {
    "contact-messages": {
      ".write": true,
      ".read": false
    },
    "blog-posts": {
      ".read": true,
      ".write": false
    },
    "comments": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Paso 7: Estructura de la base de datos

Tu base de datos tendrá esta estructura:

```
tu-proyecto/
├── contact-messages/
│   ├── -UniqueKey1/
│   │   ├── name: "Juan Pérez"
│   │   ├── email: "juan@example.com"
│   │   ├── message: "Hola, me gusta tu blog"
│   │   ├── timestamp: 1642678800000
│   │   └── read: false
│   └── ...
├── blog-posts/
│   ├── -UniqueKey2/
│   │   ├── title: "Mi primera entrada"
│   │   ├── content: "Contenido completo del post..."
│   │   ├── summary: "Resumen del post"
│   │   ├── timestamp: 1642678800000
│   │   └── author: "Ale Gallo"
│   └── ...
└── comments/
    ├── -UniqueKey2/  (ID del post)
    │   ├── -CommentKey1/
    │   │   ├── name: "Ana"
    │   │   ├── comment: "Excelente post!"
    │   │   └── timestamp: 1642678800000
    │   └── ...
    └── ...
```

## Funcionalidades implementadas:

### 1. Formulario de contacto
- Los mensajes se guardan en `/contact-messages/`
- Incluye validación de campos
- Notificaciones de éxito/error

### 2. Sistema de blog
- Posts se almacenan en `/blog-posts/`
- Se muestran ordenados por fecha
- Formulario para agregar nuevos posts (oculto por defecto)

### 3. Sistema de comentarios
- Comentarios se almacenan en `/comments/{postId}/`
- Cada post tiene su propia sección de comentarios
- Formulario para agregar comentarios

## Cómo mostrar el formulario de admin:

Para mostrar el formulario de administrador y agregar posts:

1. Abre `/blog.html`
2. Cambia esta línea:
   ```html
   <div id="admin-section" class="admin-section" style="display: none;">
   ```
   Por:
   ```html
   <div id="admin-section" class="admin-section">
   ```

## Mejoras futuras que puedes implementar:

1. **Autenticación**: Agregar login para administrador
2. **Editor rico**: Usar un editor WYSIWYG para los posts
3. **Imágenes**: Subir imágenes a Firebase Storage
4. **Búsqueda**: Implementar búsqueda de posts
5. **Categorías**: Agregar categorías a los posts
6. **Moderación**: Sistema de moderación de comentarios

## Soporte

Si tienes problemas:
1. Verifica que la configuración de Firebase esté correcta
2. Abre las herramientas de desarrollador del navegador (F12)
3. Revisa la consola por errores
4. Asegúrate de que las reglas de Firebase permitan las operaciones

¡Tu blog ya está listo para usar con base de datos!
