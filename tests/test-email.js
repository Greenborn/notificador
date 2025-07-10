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
    console.log('   SENDGRID_API_KEY=tu_api_key_de_sendgrid');
    console.log('   PUERTO=3000');
    process.exit(1);
}

require('dotenv').config({ path: envPath });

// Configuración de URL del servidor
const puerto = process.env.PUERTO || '3000';
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${puerto}`;
const TEST_EMAIL_TEMPLATE = {
    subject: 'Email de Prueba - Notificador',
    text: 'Este es un email de prueba enviado desde el script de testing del notificador.',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c3e50; text-align: center;">Email de Prueba</h1>
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #34495e;">Notificador - Sistema de Emails</h2>
                <p>Este es un email de prueba enviado desde el script de testing del notificador.</p>
                <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-ES')}</p>
                <p><strong>Servidor:</strong> ${SERVER_URL}</p>
            </div>
            <div style="background-color: #3498db; color: white; padding: 15px; border-radius: 5px; text-align: center;">
                <p style="margin: 0;">✅ Email enviado exitosamente</p>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #bdc3c7;">
            <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
                Este es un email automático del sistema de notificaciones de Greenborn.
            </p>
        </div>
    `
};

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

// Función para validar email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para enviar email
async function enviarEmailPrueba(emailDestino, emailRemitente) {
    try {
        console.log('\n📧 Enviando email de prueba...');
        console.log(`📍 Destino: ${emailDestino}`);
        console.log(`📤 Remitente: ${emailRemitente}`);
        console.log(`🌐 Servidor: ${SERVER_URL}/email`);
        
        const datosEmail = {
            to: emailDestino,
            from: emailRemitente,
            subject: TEST_EMAIL_TEMPLATE.subject,
            text: TEST_EMAIL_TEMPLATE.text,
            html: TEST_EMAIL_TEMPLATE.html
        };

        const response = await fetch(`${SERVER_URL}/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEmail)
        });

        const resultado = await response.json();

        if (resultado.stat) {
            console.log('✅ Email enviado exitosamente!');
            console.log(`📊 Respuesta del servidor: ${JSON.stringify(resultado)}`);
            return true;
        } else {
            console.log('❌ Error al enviar el email');
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
    console.log('🚀 Script de Prueba - Notificador de Emails');
    console.log('============================================\n');

    // Verificar configuración
    console.log('🔧 Verificando configuración...');
    if (!process.env.SENDGRID_API_KEY) {
        console.log('⚠️  ADVERTENCIA: SENDGRID_API_KEY no está configurada en el .env');
        console.log('💡 Asegúrate de que el archivo .env esté en la raíz del proyecto');
    } else {
        console.log('✅ SENDGRID_API_KEY configurada');
    }

    console.log(`🌐 URL del servidor: ${SERVER_URL}`);
    console.log('');

    try {
        // Solicitar email de destino
        let emailDestino = await pregunta('📧 Ingresa la dirección de email de destino: ');
        
        // Validar email de destino
        while (!validarEmail(emailDestino)) {
            console.log('❌ Email de destino inválido. Por favor, ingresa un email válido.');
            emailDestino = await pregunta('📧 Ingresa la dirección de email de destino: ');
        }

        console.log('✅ Email de destino válido detectado');
        
        // Solicitar email de remitente
        let emailRemitente = await pregunta('📤 Ingresa la dirección de email del remitente: ');
        
        // Validar email de remitente
        while (!validarEmail(emailRemitente)) {
            console.log('❌ Email de remitente inválido. Por favor, ingresa un email válido.');
            emailRemitente = await pregunta('📤 Ingresa la dirección de email del remitente: ');
        }

        console.log('✅ Email de remitente válido detectado');
        
        // Mostrar resumen
        console.log('\n📋 Resumen del email:');
        console.log(`   📤 Remitente: ${emailRemitente}`);
        console.log(`   📧 Destino: ${emailDestino}`);
        console.log(`   📝 Asunto: ${TEST_EMAIL_TEMPLATE.subject}`);
        
        // Confirmar envío
        const confirmacion = await pregunta('\n¿Deseas enviar el email de prueba? (s/n): ');
        
        if (confirmacion.toLowerCase() === 's' || confirmacion.toLowerCase() === 'si' || confirmacion.toLowerCase() === 'y' || confirmacion.toLowerCase() === 'yes') {
            console.log('\n🔄 Procesando envío...');
            
            const resultado = await enviarEmailPrueba(emailDestino, emailRemitente);
            
            if (resultado) {
                console.log('\n🎉 ¡Prueba completada exitosamente!');
                console.log('📧 Revisa la bandeja de entrada del email de destino.');
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

module.exports = { enviarEmailPrueba, validarEmail }; 