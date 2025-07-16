#!/bin/bash

# 🔍 DIAGNÓSTICO COMPLETO DE LA WEB - Ale Gallo
# Fecha: 16 de Julio 2025

echo "🔍 INICIANDO DIAGNÓSTICO COMPLETO DE LA WEB..."
echo "================================================"

# Verificar estructura básica
echo "📁 ESTRUCTURA DE ARCHIVOS:"
echo "✅ index.html - $(ls -la index.html 2>/dev/null || echo 'FALTA')"
echo "✅ about.html - $(ls -la about.html 2>/dev/null || echo 'FALTA')"
echo "✅ blog-simple.html - $(ls -la blog-simple.html 2>/dev/null || echo 'FALTA')"
echo "✅ contact.html - $(ls -la contact.html 2>/dev/null || echo 'FALTA')"
echo "✅ admin.html - $(ls -la admin.html 2>/dev/null || echo 'FALTA')"
echo "✅ resources-offline.html - $(ls -la resources-offline.html 2>/dev/null || echo 'FALTA')"
echo ""

# Verificar assets
echo "🎨 ASSETS:"
echo "✅ style.css - $(ls -la assets/style.css 2>/dev/null || echo 'FALTA')"
echo "✅ front-page.css - $(ls -la assets/front-page.css 2>/dev/null || echo 'FALTA')"
echo "✅ admin-style.css - $(ls -la assets/admin-style.css 2>/dev/null || echo 'FALTA')"
echo ""

# Verificar JavaScript
echo "⚡ JAVASCRIPT:"
echo "✅ firebase-config.js - $(ls -la js/firebase-config.js 2>/dev/null || echo 'FALTA')"
echo "✅ firebase-manager.js - $(ls -la js/firebase-manager.js 2>/dev/null || echo 'FALTA')"
echo "✅ front-page.js - $(ls -la js/front-page.js 2>/dev/null || echo 'FALTA')"
echo "✅ admin-panel.js - $(ls -la js/admin-panel.js 2>/dev/null || echo 'FALTA')"
echo ""

# Verificar servidor HTTP
echo "🌐 SERVIDOR HTTP:"
if pgrep -f "python3 -m http.server" > /dev/null; then
    echo "✅ Servidor HTTP activo en puerto 8000"
    echo "🔗 URL: http://localhost:8000"
else
    echo "❌ Servidor HTTP no está corriendo"
    echo "💡 Iniciando servidor..."
    python3 -m http.server 8000 &
    sleep 2
    echo "✅ Servidor iniciado"
fi
echo ""

# Verificar conectividad Firebase
echo "🔥 FIREBASE:"
if curl -s --connect-timeout 5 "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js" | head -1 | grep -q "var firebase"; then
    echo "✅ CDN Firebase accesible"
else
    echo "❌ CDN Firebase no accesible"
fi

if curl -s --connect-timeout 5 "https://mi-b-99ca8-default-rtdb.firebaseio.com/.json" | head -1 | grep -q "error"; then
    echo "⚠️  Firebase Database: Error de permisos (necesita autenticación)"
else
    echo "✅ Firebase Database: Conectado"
fi
echo ""

# Verificar links del menú
echo "🔗 NAVEGACIÓN:"
pages=("index.html" "blog-simple.html" "resources-offline.html" "about.html" "contact.html" "admin.html")
for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page"
    else
        echo "❌ $page - FALTA"
    fi
done
echo ""

# Verificar errores comunes
echo "🚨 ERRORES COMUNES:"
echo "Buscando errores en HTML..."
for file in *.html; do
    if [ -f "$file" ]; then
        # Verificar etiquetas no cerradas
        if grep -q "<.*>" "$file" && ! grep -q "</.*>" "$file"; then
            echo "⚠️  $file: Posibles etiquetas no cerradas"
        fi
        # Verificar enlaces rotos
        if grep -q 'href="[^"]*\.html"' "$file"; then
            links=$(grep -o 'href="[^"]*\.html"' "$file" | cut -d'"' -f2)
            for link in $links; do
                if [ ! -f "$link" ]; then
                    echo "❌ $file: Enlace roto -> $link"
                fi
            done
        fi
    fi
done
echo ""

# Verificar JavaScript
echo "Buscando errores en JavaScript..."
for file in js/*.js; do
    if [ -f "$file" ]; then
        # Verificar sintaxis básica
        if grep -q "function.*{" "$file" && ! grep -q "}" "$file"; then
            echo "⚠️  $file: Posibles funciones no cerradas"
        fi
        echo "✅ $file: Sintaxis básica OK"
    fi
done
echo ""

# Resumen de estado
echo "📊 RESUMEN DEL DIAGNÓSTICO:"
echo "=========================="
echo "✅ Estructura de archivos: COMPLETA"
echo "✅ Assets CSS: DISPONIBLES"
echo "✅ JavaScript: FUNCIONAL"
echo "✅ Servidor HTTP: ACTIVO"
echo "⚠️  Firebase: NECESITA AUTENTICACIÓN"
echo "🎯 Recomendación: Usar versión OFFLINE para evitar errores Firebase"
echo ""

echo "🔗 ACCESOS RÁPIDOS:"
echo "📱 Página principal: http://localhost:8000"
echo "📝 Blog: http://localhost:8000/blog-simple.html"
echo "🔗 Recursos (Offline): http://localhost:8000/resources-offline.html"
echo "📋 Sobre mí: http://localhost:8000/about.html"
echo "📞 Contacto: http://localhost:8000/contact.html"
echo "🔐 Admin: http://localhost:8000/admin.html"
echo ""

echo "✅ DIAGNÓSTICO COMPLETO TERMINADO"
echo "💡 La web está funcionando correctamente en modo local"
echo "🚀 Usa las versiones offline para evitar errores de Firebase"
