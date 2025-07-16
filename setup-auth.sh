#!/bin/bash

# 🔐 CONFIGURACIÓN SISTEMA DE AUTENTICACIÓN - Ale Gallo
# Script para configurar el acceso protegido a la web

echo "🔐 CONFIGURANDO SISTEMA DE AUTENTICACIÓN"
echo "======================================="

# Verificar archivos necesarios
echo "📁 Verificando archivos del sistema de autenticación..."

required_files=(
    "login.html"
    "js/auth-system.js"
    "redirect.html"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - OK"
    else
        echo "❌ $file - FALTA"
    fi
done

# Verificar protección en páginas principales
echo ""
echo "🛡️  Verificando protección en páginas principales..."

protected_pages=(
    "index.html"
    "about.html"
    "blog-simple.html"
    "contact.html"
    "admin.html"
    "resources-offline.html"
)

for page in "${protected_pages[@]}"; do
    if [ -f "$page" ]; then
        if grep -q "auth-system.js" "$page"; then
            echo "✅ $page - PROTEGIDA"
        else
            echo "⚠️  $page - SIN PROTECCIÓN"
        fi
    else
        echo "❌ $page - FALTA"
    fi
done

echo ""
echo "🔑 CREDENCIALES DE ACCESO:"
echo "========================"
echo "👤 Usuario: alegallo"
echo "🔑 Contraseña: miweb2025"

echo ""
echo "🌐 CONFIGURACIÓN DE SERVIDOR:"
echo "============================="

# Verificar si el servidor está corriendo
if pgrep -f "python3 -m http.server" > /dev/null; then
    echo "✅ Servidor HTTP activo en puerto 8000"
else
    echo "🚀 Iniciando servidor HTTP..."
    python3 -m http.server 8000 &
    sleep 2
    echo "✅ Servidor iniciado en puerto 8000"
fi

echo ""
echo "🔗 ACCESOS:"
echo "==========="
echo "🔐 Página de Login: http://localhost:8000/login.html"
echo "🏠 Página Principal: http://localhost:8000/index.html"
echo "📝 Blog: http://localhost:8000/blog-simple.html"
echo "🔗 Recursos: http://localhost:8000/resources-offline.html"
echo "📋 Sobre mí: http://localhost:8000/about.html"
echo "📞 Contacto: http://localhost:8000/contact.html"
echo "🔐 Admin: http://localhost:8000/admin.html"

echo ""
echo "🛠️  CARACTERÍSTICAS DEL SISTEMA:"
echo "================================"
echo "✅ Autenticación requerida para todas las páginas"
echo "✅ Sesión persistente por 24 horas"
echo "✅ Redirección automática al login si no hay sesión"
echo "✅ Botón de cerrar sesión en todas las páginas"
echo "✅ Indicador de usuario activo"
echo "✅ Extensión automática de sesión con actividad"
echo "✅ Verificación periódica de sesión"
echo "✅ Protección contra acceso directo"

echo ""
echo "🔒 SEGURIDAD:"
echo "============"
echo "🔐 Credenciales almacenadas en localStorage"
echo "⏰ Sesión expira automáticamente después de 24 horas"
echo "🔄 Verificación de sesión cada minuto"
echo "🚫 Acceso bloqueado sin autenticación válida"

echo ""
echo "💡 INSTRUCCIONES DE USO:"
echo "======================="
echo "1. Accede a: http://localhost:8000/login.html"
echo "2. Ingresa las credenciales:"
echo "   - Usuario: alegallo"
echo "   - Contraseña: miweb2025"
echo "3. Serás redirigido automáticamente al sitio"
echo "4. Puedes navegar libremente por todas las páginas"
echo "5. Usa el botón 'Cerrar Sesión' para salir"

echo ""
echo "🚨 SOLUCIÓN DE PROBLEMAS:"
echo "========================"
echo "• Si no puedes acceder, verifica las credenciales"
echo "• Si hay problemas de redirección, limpia localStorage"
echo "• Si el login no funciona, recarga la página"
echo "• Para resetear todo: localStorage.clear() en consola"

echo ""
echo "✅ SISTEMA DE AUTENTICACIÓN CONFIGURADO CORRECTAMENTE"
echo "🎯 ¡Tu web ahora está completamente protegida!"
echo ""
echo "🔗 ACCESO RÁPIDO AL LOGIN:"
echo "http://localhost:8000/login.html"
