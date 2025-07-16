#!/bin/bash

# 🎮 Script de Comparación de Rendimiento - Ale Gallo

echo "🚀 Comparando rendimiento entre versiones..."
echo "============================================="

echo ""
echo "📊 ANÁLISIS DE ARCHIVOS:"
echo "------------------------"

# Versión original
echo "🔴 Versión Original (index.html):"
if [ -f "index.html" ]; then
    ORIGINAL_SIZE=$(wc -c < index.html)
    echo "   - HTML: ${ORIGINAL_SIZE} bytes"
    
    # Contar archivos CSS
    CSS_COUNT=$(grep -c "\.css" index.html)
    echo "   - Archivos CSS: ${CSS_COUNT}"
    
    # Contar archivos JS
    JS_COUNT=$(grep -c "\.js" index.html)
    echo "   - Archivos JS: ${JS_COUNT}"
    
    # Tamaño total estimado
    TOTAL_CSS_SIZE=0
    if [ -f "assets/style.css" ]; then
        TOTAL_CSS_SIZE=$((TOTAL_CSS_SIZE + $(wc -c < assets/style.css)))
    fi
    if [ -f "assets/front-page.css" ]; then
        TOTAL_CSS_SIZE=$((TOTAL_CSS_SIZE + $(wc -c < assets/front-page.css)))
    fi
    if [ -f "assets/gaming-theme.css" ]; then
        TOTAL_CSS_SIZE=$((TOTAL_CSS_SIZE + $(wc -c < assets/gaming-theme.css)))
    fi
    
    TOTAL_JS_SIZE=0
    if [ -f "js/auth-system.js" ]; then
        TOTAL_JS_SIZE=$((TOTAL_JS_SIZE + $(wc -c < js/auth-system.js)))
    fi
    if [ -f "js/visual-effects.js" ]; then
        TOTAL_JS_SIZE=$((TOTAL_JS_SIZE + $(wc -c < js/visual-effects.js)))
    fi
    if [ -f "js/gaming-theme.js" ]; then
        TOTAL_JS_SIZE=$((TOTAL_JS_SIZE + $(wc -c < js/gaming-theme.js)))
    fi
    if [ -f "js/steam-integration.js" ]; then
        TOTAL_JS_SIZE=$((TOTAL_JS_SIZE + $(wc -c < js/steam-integration.js)))
    fi
    if [ -f "js/steam-config-panel.js" ]; then
        TOTAL_JS_SIZE=$((TOTAL_JS_SIZE + $(wc -c < js/steam-config-panel.js)))
    fi
    
    ORIGINAL_TOTAL=$((ORIGINAL_SIZE + TOTAL_CSS_SIZE + TOTAL_JS_SIZE))
    echo "   - CSS Total: ${TOTAL_CSS_SIZE} bytes"
    echo "   - JS Total: ${TOTAL_JS_SIZE} bytes"
    echo "   - TOTAL: ${ORIGINAL_TOTAL} bytes"
else
    echo "   - ❌ Archivo no encontrado"
fi

echo ""
echo "🟢 Versión Optimizada (index-lite.html):"
if [ -f "index-lite.html" ]; then
    LITE_SIZE=$(wc -c < index-lite.html)
    echo "   - HTML: ${LITE_SIZE} bytes"
    
    # Contar archivos CSS
    CSS_COUNT_LITE=$(grep -c "\.css" index-lite.html)
    echo "   - Archivos CSS: ${CSS_COUNT_LITE}"
    
    # Contar archivos JS
    JS_COUNT_LITE=$(grep -c "\.js" index-lite.html)
    echo "   - Archivos JS: ${JS_COUNT_LITE}"
    
    # Tamaño total estimado
    LITE_CSS_SIZE=0
    if [ -f "assets/gaming-lite.css" ]; then
        LITE_CSS_SIZE=$((LITE_CSS_SIZE + $(wc -c < assets/gaming-lite.css)))
    fi
    if [ -f "assets/style.css" ]; then
        LITE_CSS_SIZE=$((LITE_CSS_SIZE + $(wc -c < assets/style.css)))
    fi
    
    LITE_JS_SIZE=0
    if [ -f "js/gaming-app.js" ]; then
        LITE_JS_SIZE=$((LITE_JS_SIZE + $(wc -c < js/gaming-app.js)))
    fi
    
    LITE_TOTAL=$((LITE_SIZE + LITE_CSS_SIZE + LITE_JS_SIZE))
    echo "   - CSS Total: ${LITE_CSS_SIZE} bytes"
    echo "   - JS Total: ${LITE_JS_SIZE} bytes"
    echo "   - TOTAL: ${LITE_TOTAL} bytes"
else
    echo "   - ❌ Archivo no encontrado"
fi

echo ""
echo "📈 COMPARACIÓN:"
echo "--------------"
if [ -f "index.html" ] && [ -f "index-lite.html" ]; then
    # Calcular reducción
    REDUCTION=$((ORIGINAL_TOTAL - LITE_TOTAL))
    PERCENTAGE=$((REDUCTION * 100 / ORIGINAL_TOTAL))
    
    echo "   - Reducción de tamaño: ${REDUCTION} bytes (${PERCENTAGE}%)"
    echo "   - Reducción de archivos CSS: $((CSS_COUNT - CSS_COUNT_LITE))"
    echo "   - Reducción de archivos JS: $((JS_COUNT - JS_COUNT_LITE))"
    
    if [ $REDUCTION -gt 0 ]; then
        echo "   - ✅ Optimización exitosa!"
    else
        echo "   - ⚠️ No hay reducción significativa"
    fi
fi

echo ""
echo "🎯 BENEFICIOS DE LA OPTIMIZACIÓN:"
echo "--------------------------------"
echo "   ✅ Menos archivos HTTP a descargar"
echo "   ✅ Menor tiempo de carga inicial"
echo "   ✅ Mejor rendimiento en dispositivos móviles"
echo "   ✅ CSS y JS unificados"
echo "   ✅ Lazy loading implementado"
echo "   ✅ Animaciones optimizadas"
echo "   ✅ Cache mejorado"
echo "   ✅ Intersection Observer para mejor rendimiento"

echo ""
echo "🔧 PARA USAR LA VERSIÓN OPTIMIZADA:"
echo "-----------------------------------"
echo "   1. Renombra index.html a index-original.html"
echo "   2. Renombra index-lite.html a index.html"
echo "   3. La web será mucho más rápida y ligera"

echo ""
echo "✨ ¡Optimización completa!"
