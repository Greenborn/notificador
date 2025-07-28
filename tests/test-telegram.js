#!/usr/bin/env node

const readline = require('readline');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Verificar existencia de .env
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ No se encontró el archivo .env en la raíz del proyecto.');
    console.log('ℹ️  Antes de realizar cualquier prueba, debes configurar el archivo .env e iniciar el servicio.');
    console.log('   Ejemplo de .env:');
    console.log('   TELEGRAM_BOT_ALERTAS_TOKEN=tu_token_del_bot');
    console.log('   TELEGRAM_ALERTAS_CHAT_ID=tu_chat_id');
    console.log('   PUERTO=3000');
    process.exit(1);
}

require('dotenv').config({ path: envPath });

// Configuración de URL del servidor
const puerto = process.env.PUERTO || '3000';
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${puerto}`;

// Función para leer input del usuario
function pregunta(pregunta) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            rl.close();
            resolve(respuesta.trim());
        });
    });
}

// Función para encontrar alias de Telegram en variables de entorno
function encontrarAliasTelegram() {
    const alias = [];
    const envVars = Object.keys(process.env);
    
    // Buscar variables que empiecen con TELEGRAM_BOT_ y terminen con _TOKEN
    const botTokens = envVars.filter(varName => 
        varName.startsWith('TELEGRAM_BOT_') && varName.endsWith('_TOKEN')
    );
    
    botTokens.forEach(tokenVar => {
        // Extraer el nombre del alias (entre TELEGRAM_BOT_ y _TOKEN)
        const aliasName = tokenVar.replace('TELEGRAM_BOT_', '').replace('_TOKEN', '');
        const chatIdVar = `TELEGRAM_${aliasName}_CHAT_ID`;
        
        // Verificar que también existe la variable del chat_id
        if (process.env[chatIdVar]) {
            alias.push({
                name: aliasName.toLowerCase(),
                tokenVar: tokenVar,
                chatIdVar: chatIdVar,
                token: process.env[tokenVar],
                chatId: process.env[chatIdVar]
            });
        }
    });
    
    return alias;
}

// Función para enviar mensaje de Telegram
async function enviarMensajeTelegram(alias, mensaje) {
    try {
        console.log('\n📱 Enviando mensaje de Telegram...');
        console.log(`📍 Alias: ${alias.name}`);
        console.log(`🌐 Servidor: ${SERVER_URL}/telegram`);
        
        const datosMensaje = {
            alias: alias.name,
            message: mensaje,
            parse_mode: 'HTML',
            token: process.env.TELEGRAM_API_TOKEN
        };

        const response = await fetch(`${SERVER_URL}/telegram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosMensaje)
        });

        const resultado = await response.json();

        if (resultado.stat) {
            console.log('✅ Mensaje enviado exitosamente!');
            console.log(`📊 Respuesta del servidor: ${JSON.stringify(resultado)}`);
            return true;
        } else {
            console.log('❌ Error al enviar el mensaje');
            console.log(`📊 Respuesta del servidor: ${JSON.stringify(resultado)}`);
            return false;
        }

    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
        console.log('💡 Verifica que el servidor esté ejecutándose en:', SERVER_URL);
        return false;
    }
}

// Función principal
async function main() {
    console.log('🚀 Script de Prueba - Notificador de Telegram');
    console.log('=============================================\n');

    // Verificar configuración
    console.log('🔧 Verificando configuración de Telegram...');
    
    const aliasEncontrados = encontrarAliasTelegram();
    
    if (aliasEncontrados.length === 0) {
        console.log('❌ No se encontraron alias de Telegram configurados en el .env');
        console.log('💡 Para configurar Telegram, agrega al archivo .env:');
        console.log('   TELEGRAM_BOT_[ALIAS]_TOKEN=tu_token_del_bot');
        console.log('   TELEGRAM_[ALIAS]_CHAT_ID=tu_chat_id');
        console.log('');
        console.log('   Ejemplo:');
        console.log('   TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF');
        console.log('   TELEGRAM_ALERTAS_CHAT_ID=-123456789');
        process.exit(1);
    }

    console.log(`✅ Se encontraron ${aliasEncontrados.length} alias(es) de Telegram:`);
    aliasEncontrados.forEach((alias, index) => {
        console.log(`   ${index + 1}. ${alias.name} (${alias.tokenVar}, ${alias.chatIdVar})`);
    });

    console.log(`🌐 URL del servidor: ${SERVER_URL}`);
    console.log('');

    try {
        // Seleccionar alias
        let seleccion = await pregunta(`📋 Selecciona un alias (1-${aliasEncontrados.length}): `);
        let aliasIndex = parseInt(seleccion) - 1;
        
        while (isNaN(aliasIndex) || aliasIndex < 0 || aliasIndex >= aliasEncontrados.length) {
            console.log(`❌ Selección inválida. Debe ser un número entre 1 y ${aliasEncontrados.length}`);
            seleccion = await pregunta(`📋 Selecciona un alias (1-${aliasEncontrados.length}): `);
            aliasIndex = parseInt(seleccion) - 1;
        }

        const aliasSeleccionado = aliasEncontrados[aliasIndex];
        console.log(`✅ Alias seleccionado: ${aliasSeleccionado.name}`);

        // Solicitar mensaje
        let mensaje = await pregunta('\n💬 Ingresa el mensaje para la prueba: ');
        
        while (!mensaje.trim()) {
            console.log('❌ El mensaje no puede estar vacío.');
            mensaje = await pregunta('💬 Ingresa el mensaje para la prueba: ');
        }

        console.log('✅ Mensaje válido');
        
        // Confirmar envío
        const confirmacion = await pregunta('\n¿Deseas enviar el mensaje de prueba? (s/n): ');
        
        if (confirmacion.toLowerCase() === 's' || confirmacion.toLowerCase() === 'si' || confirmacion.toLowerCase() === 'y' || confirmacion.toLowerCase() === 'yes') {
            console.log('\n🔄 Procesando envío...');
            
            const resultado = await enviarMensajeTelegram(aliasSeleccionado, mensaje);
            
            if (resultado) {
                console.log('\n🎉 ¡Prueba completada exitosamente!');
                console.log('📱 Revisa el grupo de Telegram seleccionado.');
            } else {
                console.log('\n💥 La prueba falló. Revisa los logs anteriores.');
                process.exit(1);
            }
        } else {
            console.log('\n❌ Envío cancelado por el usuario.');
        }

    } catch (error) {
        console.log('\n💥 Error inesperado:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { enviarMensajeTelegram, encontrarAliasTelegram }; 