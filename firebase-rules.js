// REGLAS DE SEGURIDAD PARA FIREBASE REALTIME DATABASE
// Copia estas reglas en tu Firebase Console

// ==========================================
// REGLAS PARA DESARROLLO (PERMISIVAS)
// ==========================================

const developmentRules = {
  "rules": {
    // Permitir lectura y escritura para datos de prueba
    "test-data": {
      ".read": true,
      ".write": true
    },
    
    // Permitir lectura y escritura para diagnósticos
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
    
    // Ediciones de página - Solo lectura pública, escritura autenticada
    "page-edits": {
      ".read": true,
      ".write": true // En producción, cambiar a auth != null
    },
    
    // Mensajes de contacto - Solo escritura pública, lectura autenticada
    "contact-messages": {
      ".read": true, // En producción, cambiar a auth != null
      ".write": true
    },
    
    // Otros datos del blog
    "blog-posts": {
      ".read": true,
      ".write": true // En producción, cambiar a auth != null
    },
    
    // Información del sistema
    "system-info": {
      ".read": true,
      ".write": true
    }
  }
};

// ==========================================
// REGLAS PARA PRODUCCIÓN (SEGURAS)
// ==========================================

const productionRules = {
  "rules": {
    // Datos públicos de lectura
    "blog-posts": {
      ".read": true,
      ".write": "auth != null"
    },
    
    // Mensajes de contacto
    "contact-messages": {
      ".read": "auth != null",
      ".write": true,
      "$messageId": {
        ".validate": "newData.hasChildren(['name', 'email', 'message', 'timestamp'])"
      }
    },
    
    // Ediciones de página
    "page-edits": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$editId": {
        ".validate": "newData.hasChildren(['page', 'changes', 'timestamp', 'user'])"
      }
    },
    
    // Bloquear todo lo demás
    ".read": false,
    ".write": false
  }
};

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

// Función para obtener las reglas como JSON string
function getDevelopmentRulesJSON() {
    return JSON.stringify(developmentRules, null, 2);
}

function getProductionRulesJSON() {
    return JSON.stringify(productionRules, null, 2);
}

// Función para copiar reglas al portapapeles
function copyRulesToClipboard(type = 'development') {
    const rules = type === 'development' ? developmentRules : productionRules;
    const rulesJSON = JSON.stringify(rules, null, 2);
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(rulesJSON).then(() => {
            console.log('✅ Reglas copiadas al portapapeles');
        }).catch(err => {
            console.error('❌ Error al copiar:', err);
        });
    } else {
        console.log('📋 Reglas para copiar:');
        console.log(rulesJSON);
    }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        developmentRules,
        productionRules,
        getDevelopmentRulesJSON,
        getProductionRulesJSON,
        copyRulesToClipboard
    };
}

// ==========================================
// CÓMO APLICAR ESTAS REGLAS
// ==========================================

/*
1. Ve a Firebase Console: https://console.firebase.google.com
2. Selecciona tu proyecto: mi-b-99ca8
3. Ve a "Realtime Database" en el menú lateral
4. Haz clic en la pestaña "Reglas"
5. Copia y pega las reglas de DESARROLLO ejecutando:
   console.log(getDevelopmentRulesJSON());
6. Haz clic en "Publicar"
7. Verifica que no haya errores

Para verificar:
- Ve a firebase-diagnostic.html
- Ejecuta los tests
- Debería mostrar ✅ en todos los estados

Para copiar reglas automáticamente:
- Abre las herramientas de desarrollador (F12)
- Ejecuta: copyRulesToClipboard('development')
- Pega en Firebase Console
*/
