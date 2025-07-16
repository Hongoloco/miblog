# REGLAS DE SEGURIDAD PARA FIREBASE REALTIME DATABASE
# Copia estas reglas en tu Firebase Console

## REGLAS PARA DESARROLLO (PERMISIVAS)
## Usa estas reglas mientras desarrollas y pruebas

```json
{
  "rules": {
    "test-data": {
      ".read": true,
      ".write": true
    },
    "test-connection": {
      ".read": true,
      ".write": true
    },
    "test-permissions": {
      ".read": true,
      ".write": true
    },
    "realtime-test": {
      ".read": true,
      ".write": true
    },
    "read-write-test": {
      ".read": true,
      ".write": true
    },
    "page-edits": {
      ".read": true,
      ".write": true
    },
    "contact-messages": {
      ".read": true,
      ".write": true
    },
    "blog-posts": {
      ".read": true,
      ".write": true
    },
    "system-info": {
      ".read": true,
      ".write": true
    }
  }
}
```

## CÓMO APLICAR ESTAS REGLAS

1. Ve a Firebase Console: https://console.firebase.google.com
2. Selecciona tu proyecto: **mi-b-99ca8**
3. Ve a "Realtime Database" en el menú lateral
4. Haz clic en la pestaña "Reglas"
5. Copia y pega las reglas JSON de arriba
6. Haz clic en "Publicar"
7. Verifica que no haya errores

## VERIFICACIÓN

- Ve a firebase-diagnostic.html
- Ejecuta los tests
- Debería mostrar ✅ en todos los estados

## POSIBLES PROBLEMAS

1. **Reglas muy restrictivas**: Las reglas por defecto bloquean todo
2. **Proyecto no configurado**: Verifica que el proyecto esté activo
3. **Billing**: Asegúrate de que el proyecto tenga billing habilitado
4. **Región**: Verifica que la database esté en la región correcta

## REGLAS PARA PRODUCCIÓN (SEGURAS)
## Usa estas cuando el sitio esté en producción

```json
{
  "rules": {
    "blog-posts": {
      ".read": true,
      ".write": "auth != null"
    },
    "contact-messages": {
      ".read": "auth != null",
      ".write": true,
      "$messageId": {
        ".validate": "newData.hasChildren(['name', 'email', 'message', 'timestamp'])"
      }
    },
    "page-edits": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$editId": {
        ".validate": "newData.hasChildren(['page', 'changes', 'timestamp', 'user'])"
      }
    },
    ".read": false,
    ".write": false
  }
}
```
