# Configuración Firebase para tu Blog

## Pasos para configurar Firebase

### 1. Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Add project" (Agregar proyecto)
3. Nombra tu proyecto (ej: "miblog")
4. Sigue los pasos de configuración

### 2. Configurar Firestore Database
1. En la consola de Firebase, ve a "Firestore Database"
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Elige la ubicación más cercana a tu audiencia

### 3. Configurar Firebase Hosting
1. En la consola de Firebase, ve a "Hosting"
2. Haz clic en "Get started"
3. Sigue las instrucciones

### 4. Configurar la aplicación web
1. En la consola de Firebase, ve a "Project settings" (⚙️)
2. En la sección "Your apps", haz clic en el icono web "</>"
3. Registra tu app con un nombre
4. Copia la configuración que aparece

### 5. Actualizar firebase-config.js
Reemplaza el contenido del archivo `firebase-config.js` con tu configuración:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-project.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 6. Configurar reglas de Firestore
Ve a "Firestore Database" > "Rules" y usa estas reglas para desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura para todos (solo para desarrollo)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Importante**: Para producción, debes configurar reglas de seguridad más estrictas.

### 7. Desplegar a Firebase Hosting

```bash
# Inicializar Firebase en tu proyecto
firebase login
firebase init hosting

# Desplegar
firebase deploy
```

### 8. Comandos útiles

```bash
# Servir localmente
firebase serve

# Ver logs
firebase functions:log

# Configurar dominio personalizado
firebase hosting:channel:deploy preview-channel
```

## Estructura de datos en Firestore

### Colección: resources
```javascript
{
  title: "Nombre del recurso",
  url: "https://ejemplo.com",
  description: "Descripción del recurso",
  category: "frontend|backend|frameworks|databases|cloud|ai|mobile|devops|editors|design|testing|productivity",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección: notes
```javascript
{
  title: "Título de la nota",
  content: "Contenido de la nota",
  category: "general|dev|tech|personal",
  tags: ["tag1", "tag2"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Funcionalidades implementadas

✅ **Recursos**:
- Agregar recursos con formulario
- Visualizar recursos por categorías
- Eliminar recursos
- Actualizaciones en tiempo real

✅ **Hosting**:
- Configuración para Firebase Hosting
- Archivos estáticos optimizados

🔄 **Próximas funcionalidades**:
- Sistema de notas con Firebase
- Autenticación de usuarios
- Sistema de comentarios
- Análiticas y métricas

## Troubleshooting

### Error: "Firebase not initialized"
- Asegúrate de que `firebase-config.js` tenga la configuración correcta
- Verifica que el proyecto esté creado en Firebase Console

### Error: "Permission denied"
- Revisa las reglas de Firestore
- Para desarrollo, usa las reglas permisivas mostradas arriba

### Error en el despliegue
- Verifica que `firebase.json` esté configurado correctamente
- Asegúrate de estar logueado con `firebase login`

## Próximos pasos

1. Configurar tu proyecto en Firebase Console
2. Actualizar `firebase-config.js` con tu configuración
3. Probar localmente con `firebase serve`
4. Desplegar con `firebase deploy`

¡Tu blog estará funcionando en la nube con Firebase! 🚀
