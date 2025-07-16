#!/bin/bash

# Script para seleccionar versión de recursos
echo "🔗 Selector de Sistema de Recursos"
echo "=================================="
echo ""
echo "Opciones disponibles:"
echo "1. 🚀 Versión Avanzada (resources.html) - Con iconos externos y funcionalidades completas"
echo "2. ⚡ Versión Simplificada (resources-simple.html) - Funcional y estable"
echo "3. 🔧 Página de Debug (debug-recursos.html) - Para diagnosticar problemas"
echo "4. 📱 Página de Demo (demo-recursos.html) - Para ver funcionalidades"
echo "5. 📋 Ver estado actual"
echo ""

read -p "Selecciona una opción (1-5): " choice

case $choice in
    1)
        echo "🚀 Configurando versión avanzada..."
        if [ -f "resources.html" ]; then
            echo "✅ resources.html está disponible"
            echo "📝 Características:"
            echo "   • Iconos desde múltiples servidores"
            echo "   • Búsqueda avanzada de iconos"
            echo "   • Caché inteligente"
            echo "   • Funcionalidades completas"
            echo ""
            echo "🌐 Abrir con: file://$(pwd)/resources.html"
        else
            echo "❌ resources.html no encontrado"
        fi
        ;;
        
    2)
        echo "⚡ Configurando versión simplificada..."
        if [ -f "resources-simple.html" ]; then
            echo "✅ resources-simple.html está disponible"
            echo "📝 Características:"
            echo "   • Funcionalidad básica estable"
            echo "   • Solo emojis como iconos"
            echo "   • Interfaz limpia y rápida"
            echo "   • Compatible con todos los navegadores"
            echo ""
            echo "🌐 Abrir con: file://$(pwd)/resources-simple.html"
        else
            echo "❌ resources-simple.html no encontrado"
        fi
        ;;
        
    3)
        echo "🔧 Abriendo página de debug..."
        if [ -f "debug-recursos.html" ]; then
            echo "✅ debug-recursos.html está disponible"
            echo "📝 Úsalo para:"
            echo "   • Diagnosticar problemas"
            echo "   • Verificar dependencias"
            echo "   • Probar funcionalidades"
            echo "   • Ver logs en tiempo real"
            echo ""
            echo "🌐 Abrir con: file://$(pwd)/debug-recursos.html"
        else
            echo "❌ debug-recursos.html no encontrado"
        fi
        ;;
        
    4)
        echo "📱 Abriendo página de demo..."
        if [ -f "demo-recursos.html" ]; then
            echo "✅ demo-recursos.html está disponible"
            echo "📝 Contiene:"
            echo "   • Documentación completa"
            echo "   • Ejemplos de uso"
            echo "   • Estadísticas del sistema"
            echo "   • Enlaces a todas las funcionalidades"
            echo ""
            echo "🌐 Abrir con: file://$(pwd)/demo-recursos.html"
        else
            echo "❌ demo-recursos.html no encontrado"
        fi
        ;;
        
    5)
        echo "📋 Estado actual del sistema:"
        echo "=============================="
        echo ""
        
        echo "📁 Archivos HTML disponibles:"
        for file in resources.html resources-simple.html debug-recursos.html demo-recursos.html; do
            if [ -f "$file" ]; then
                size=$(du -h "$file" | cut -f1)
                echo "   ✅ $file ($size)"
            else
                echo "   ❌ $file (no encontrado)"
            fi
        done
        
        echo ""
        echo "📁 Archivos JavaScript:"
        for file in js/resources-manager.js js/icon-manager.js js/firebase-config.js js/firebase-manager.js; do
            if [ -f "$file" ]; then
                size=$(du -h "$file" | cut -f1)
                echo "   ✅ $file ($size)"
            else
                echo "   ❌ $file (no encontrado)"
            fi
        done
        
        echo ""
        echo "🔥 Estado de Firebase:"
        if grep -q "databaseURL" js/firebase-config.js 2>/dev/null; then
            echo "   ✅ Configuración Firebase encontrada"
        else
            echo "   ❌ Configuración Firebase no encontrada"
        fi
        
        echo ""
        echo "📊 Recomendaciones:"
        echo "   • Para uso estable: resources-simple.html"
        echo "   • Para funcionalidades avanzadas: resources.html"
        echo "   • Para diagnosticar problemas: debug-recursos.html"
        echo "   • Para ver documentación: demo-recursos.html"
        ;;
        
    *)
        echo "❌ Opción no válida"
        echo "Por favor selecciona una opción del 1 al 5"
        ;;
esac

echo ""
echo "💡 Consejos:"
echo "• Si tienes problemas con la versión avanzada, usa la simplificada"
echo "• Revisa la consola del navegador para ver errores"
echo "• La versión simplificada es más estable y rápida"
echo "• Usa la página de debug para diagnosticar problemas"
echo ""
echo "🎯 Para más ayuda, consulta GUIA_RECURSOS.md"
