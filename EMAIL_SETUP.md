# 📧 Configuración de Email para Formulario de Contacto

## Estado Actual
✅ **Formulario de contacto es PÚBLICO** - No requiere autenticación  
✅ **Mensajes se guardan en Firebase** - Disponibles en el panel de administración  
⚠️ **Envío de email directo** - Requiere configuración adicional

## Opciones de Configuración

### 🔥 **Opción 1: Solo Firebase (Funcional Ahora)**
**Estado:** ✅ **FUNCIONANDO**

- Los mensajes se guardan en Firebase
- Puedes verlos en el panel de administración (`/admin.html`)
- Recibes notificaciones cuando hay mensajes nuevos
- **No requiere configuración adicional**

### 📧 **Opción 2: EmailJS (Recomendado)**
**Estado:** ⚙️ **Requiere configuración**

1. **Registrarse en EmailJS:**
   - Ve a https://www.emailjs.com/
   - Crea una cuenta gratuita
   - Configura un servicio de email (Gmail, Outlook, etc.)

2. **Obtener credenciales:**
   - Public Key
   - Service ID
   - Template ID

3. **Actualizar el archivo:**
   - Abre `/js/contact-handler.js`
   - Reemplaza `TU_PUBLIC_KEY`, `TU_SERVICE_ID`, `TU_TEMPLATE_ID`

4. **Configurar template:**
   ```
   Asunto: Nuevo mensaje de {{from_name}}
   Contenido:
   Has recibido un nuevo mensaje:
   
   Nombre: {{from_name}}
   Email: {{from_email}}
   Mensaje: {{message}}
   ```

### 📨 **Opción 3: Formspree (Fácil)**
**Estado:** ⚙️ **Requiere configuración**

1. **Registrarse en Formspree:**
   - Ve a https://formspree.io/
   - Crea una cuenta gratuita
   - Crea un formulario con tu email `ale21rock@gmail.com`

2. **Obtener Form ID:**
   - Copia el Form ID generado

3. **Actualizar el código:**
   - En `/js/contact-handler.js`
   - Reemplaza `TU_FORM_ID` con tu Form ID

### 🐘 **Opción 4: PHP (Servidor propio)**
**Estado:** ⚙️ **Requiere servidor PHP**

- Archivo `send-email.php` ya creado
- Funciona en cualquier servidor con PHP
- Configuración automática a `ale21rock@gmail.com`

## 🚀 **Configuración Rápida con EmailJS**

### Paso 1: Registro
```
1. Ve a https://www.emailjs.com/
2. Crea cuenta con tu email
3. Verifica tu email
```

### Paso 2: Configurar Gmail
```
1. En EmailJS, ve a "Email Services"
2. Selecciona "Gmail"
3. Conecta tu cuenta ale21rock@gmail.com
4. Copia el Service ID
```

### Paso 3: Crear Template
```
1. Ve a "Email Templates"
2. Crea nuevo template
3. Usa este contenido:

Subject: Nuevo mensaje de {{from_name}} - Blog
Content:
Hola Ale,

Has recibido un nuevo mensaje desde tu blog:

Nombre: {{from_name}}
Email: {{from_email}}

Mensaje:
{{message}}

---
Enviado automáticamente desde tu blog
```

### Paso 4: Actualizar Código
Edita `/js/contact-handler.js` y reemplaza:
```javascript
// Línea 54: Reemplaza 'TU_PUBLIC_KEY' con tu Public Key
emailjs.init('tu_public_key_aquí');

// Línea 70: Reemplaza los IDs
return emailjs.send('tu_service_id', 'tu_template_id', templateParams);
```

### Paso 5: Habilitar EmailJS
En `/js/contact-handler.js`, cambia la línea 85:
```javascript
// Cambiar de:
BlogDB.saveContactMessage(name, email, message)

// A:
sendEmailWithEmailJS(name, email, message)
```

## 🧪 **Probar el Sistema**

### Actualmente Funciona:
1. Ve a `http://localhost:8000/contact.html`
2. Completa el formulario (sin necesidad de login)
3. Envía el mensaje
4. Revisa el panel de administración (`/admin.html`)
5. El mensaje aparecerá en la sección "Mensajes"

### Después de Configurar EmailJS:
1. Los mensajes te llegarán a `ale21rock@gmail.com`
2. También se guardarán en Firebase
3. Recibirás notificación inmediata por email

## 📋 **Resumen de Cambios Realizados**

### ✅ **Completado:**
- Formulario de contacto público (sin autenticación)
- Guardado en Firebase
- Validación de campos
- Interfaz de usuario mejorada
- Panel de administración funcional

### ⚙️ **Requiere tu configuración:**
- Servicio de email (EmailJS, Formspree, o PHP)
- Credenciales de email
- Template de email

## 🔧 **Recomendación**

**Para empezar inmediatamente:**
1. Usa el sistema actual (solo Firebase)
2. Revisa mensajes en el panel de administración
3. Responde manualmente por email

**Para automatizar completamente:**
1. Configura EmailJS (15 minutos)
2. Recibe emails automáticamente
3. Mantén copia en Firebase

¿Quieres que te ayude a configurar EmailJS paso a paso?
