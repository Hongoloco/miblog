#!/bin/bash

# Script de configuración inicial para Firebase
echo "🔥 Configurando Firebase para tu blog..."

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instalándolo..."
    npm install -g firebase-tools
fi

# Verificar si el usuario está logueado
if ! firebase projects:list &> /dev/null; then
    echo "📝 Necesitas iniciar sesión en Firebase..."
    firebase login --no-localhost
fi

echo "✅ Firebase CLI configurado correctamente"

# Mostrar proyectos disponibles
echo "📋 Proyectos disponibles:"
firebase projects:list

echo ""
echo "🚀 Pasos siguientes:"
echo "1. Crea un nuevo proyecto en Firebase Console (https://console.firebase.google.com/)"
echo "2. Configura Firestore Database"
echo "3. Configura Firebase Hosting"
echo "4. Actualiza firebase-config.js con tu configuración"
echo "5. Ejecuta: firebase init"
echo "6. Ejecuta: firebase deploy"
echo ""
echo "📖 Lee FIREBASE_SETUP.md para instrucciones detalladas"
