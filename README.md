# Notificador - Microservicio de Notificaciones

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![SendGrid](https://img.shields.io/badge/SendGrid-API-orange.svg)](https://sendgrid.com/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-blue.svg)](https://telegram.org/)

## Descripción

El **Notificador** es un microservicio especializado en el envío de notificaciones por email utilizando SendGrid y mensajes a grupos de Telegram. Diseñado como una API REST simple y eficiente, proporciona una interfaz unificada para el envío de notificaciones desde otros servicios del ecosistema Greenborn.

## Características Principales

- ✅ **API REST simple** con múltiples endpoints
- ✅ **Integración con SendGrid** para envío confiable de emails
- ✅ **Integración con Telegram** para mensajes a grupos
- ✅ **Validación de parámetros** automática
- ✅ **Manejo de errores** robusto
- ✅ **Configuración flexible** mediante variables de entorno
- ✅ **Logs detallados** para monitoreo


## Inicio Rápido

### Prerrequisitos

- Node.js 16 o superior
- Cuenta de SendGrid con API Key
- Bot de Telegram con token (opcional)
- Puerto disponible para el servicio

### Instalación

```bash
# Clonar el proyecto
git clone <repository-url>
cd notificador

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con la siguiente configuración:
# SENDGRID_API_KEY=tu_api_key_de_sendgrid
# TELEGRAM_BOT_[ALIAS]_TOKEN=tu_token_del_bot (opcional)
# TELEGRAM_[ALIAS]_CHAT_ID=tu_chat_id (opcional)
# PUERTO=3000

# Iniciar el servicio
node index.js
```

### Uso Básico

```bash
# Enviar un email de prueba
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "to": "usuario@ejemplo.com",
    "subject": "Prueba del sistema",
    "text": "Este es un email de prueba.",
    "html": "<h1>Prueba</h1><p>Este es un email de prueba.</p>"
  }'
```

## Documentación

### 📚 [Arquitectura](./documentacion/arquitectura.md)
Documentación técnica detallada sobre la arquitectura del sistema, componentes, flujo de datos y diseño.

### 🚀 [Modo de Uso](./documentacion/modo_uso.md)
Guía completa de configuración, despliegue, uso de la API y casos de uso prácticos.

### 📱 [Configuración de Telegram](./documentacion/telegram_setup.md)
Guía completa para configurar y usar la funcionalidad de Telegram.

## Estructura del Proyecto

```
notificador/
├── index.js                    # Punto de entrada principal
├── package.json               # Dependencias y configuración
├── .env                       # Variables de entorno (no versionado)
├── .gitignore                # Archivos ignorados por Git

├── README.md                 # Este archivo
├── tests/                    # Scripts de prueba
│   ├── test-email.js        # Test de emails
│   ├── test-telegram.js     # Test de Telegram
│   └── README.md            # Documentación de tests
└── documentacion/            # Documentación del proyecto
    ├── arquitectura.md       # Documentación técnica
    ├── modo_uso.md          # Guía de uso
    └── telegram_setup.md    # Configuración de Telegram
```

## API Endpoints

### POST /email
Envía un email utilizando SendGrid.

**Parámetros requeridos:**
- `to`: Email del destinatario
- `subject`: Asunto del email
- `text`: Contenido en texto plano
- `html`: Contenido en formato HTML

**Respuesta:**
```json
{
    "stat": true  // true = éxito, false = error
}
```

## Envío de mensajes a grupos de Telegram por alias

### Configuración de variables de entorno

Para cada alias que quieras usar, define en tu `.env`:

```
TELEGRAM_BOT_[ALIAS]_TOKEN=token_de_tu_bot
TELEGRAM_[ALIAS]_CHAT_ID=id_del_grupo_o_chat
```

Ejemplo:
```
TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF
TELEGRAM_ALERTAS_CHAT_ID=-123456789
TELEGRAM_BOT_SOPORTE_TOKEN=987654:ZYXWVU
TELEGRAM_SOPORTE_CHAT_ID=-987654321
```

### Endpoint para enviar mensajes a Telegram

**POST /telegram**

Parámetros requeridos:
- `alias`: el alias definido en las variables de entorno
- `message`: el mensaje a enviar

Parámetros opcionales:
- `parse_mode`: 'HTML', 'Markdown', etc. (por defecto 'HTML')
- `disable_web_page_preview`: boolean
- `disable_notification`: boolean

Ejemplo de request:
```json
{
  "alias": "alertas",
  "message": "<b>Alerta</b>\nSe detectó un error crítico.",
  "parse_mode": "HTML"
}
```

Respuesta exitosa:
```json
{
  "stat": true,
  "alias": "alertas",
  "message_id": 123,
  "chat": {
    "id": -123456789,
    "title": "Grupo de Alertas",
    "type": "group"
  }
}
```

Respuesta de error (alias inexistente):
```json
{
  "stat": false,
  "error": "Alias 'alertas' no existe o está mal configurado. Variables requeridas: TELEGRAM_BOT_ALERTAS_TOKEN, TELEGRAM_ALERTAS_CHAT_ID"
}
```

### Ejemplo de uso en Node.js

```js
const axios = require('axios');

async function enviarNotificacionTelegram(alias, mensaje) {
  const response = await axios.post('http://localhost:3000/telegram', {
    alias,
    message: mensaje,
    parse_mode: 'HTML'
  });
  if (response.data.stat) {
    console.log('✅ Mensaje enviado:', response.data);
  } else {
    console.error('❌ Error:', response.data.error);
  }
}

enviarNotificacionTelegram('alertas', '<b>Alerta</b>\nSe detectó un error crítico.');
```

---

El resto de la funcionalidad del microservicio (envío de emails) no se ve afectada.

## Configuración

### Variables de Entorno

| Variable | Descripción | Requerido | Ejemplo |
|----------|-------------|-----------|---------|
| `SENDGRID_API_KEY` | API Key de SendGrid | Sí | `SG.xxxxxxxxxxxxx` |
| `TELEGRAM_BOT_[ALIAS]_TOKEN` | Token del bot para cada alias | No | `123456789:ABCdefGHIjklMNOpqrsTUVwxyz` |
| `TELEGRAM_[ALIAS]_CHAT_ID` | Chat ID para cada alias | No | `-123456789` |
| `PUERTO` | Puerto del servidor | No | `3000` |

### Archivo .env
```bash
SENDGRID_API_KEY=tu_api_key_de_sendgrid
TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF
TELEGRAM_ALERTAS_CHAT_ID=-123456789
TELEGRAM_BOT_SOPORTE_TOKEN=987654:ZYXWVU
TELEGRAM_SOPORTE_CHAT_ID=-987654321
PUERTO=3000
```

## Despliegue

### Opción 1: Despliegue Local
```bash
node index.js
```

### Opción 2: Producción (PM2)
```bash
npm install -g pm2
pm2 start index.js --name "notificador"
pm2 save
pm2 startup
```

## Casos de Uso

### Notificación de Registro
```javascript
const emailData = {
    to: "nuevo@usuario.com",
    subject: "Bienvenido a Greenborn",
    text: "Tu cuenta ha sido creada exitosamente.",
    html: "<h1>Bienvenido</h1><p>Tu cuenta ha sido creada exitosamente.</p>"
};
```

### Alertas del Sistema
```javascript
const alertData = {
    to: "admin@greenborn.com.ar",
    subject: "Alerta del Sistema",
    text: "Se ha detectado un error crítico.",
    html: "<h1>Alerta</h1><p>Se ha detectado un error crítico.</p>"
};
```

### Notificación de Telegram
```javascript
const telegramData = {
    alias: "alertas",
    message: "🚨 <b>Alerta del Sistema</b>\n\nSe ha detectado un error crítico en el servidor.\n\n<i>Timestamp:</i> " + new Date().toISOString(),
    parse_mode: "HTML"
};
```

## Monitoreo

### Logs Importantes
- **Inicio**: "Servidor escuchando en: PUERTO"
- **Envío exitoso**: "Email sent"
- **Errores**: "Error [detalles]"

### Verificación de Estado
```bash
# Verificar si el servicio está funcionando
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"to":"test@test.com","subject":"test","text":"test","html":"<p>test</p>"}'
```

## Troubleshooting

### Problemas Comunes

1. **Error de API Key**: Verificar que la API Key de SendGrid sea válida
2. **Puerto en uso**: Cambiar el puerto en el archivo `.env`
3. **Parámetros faltantes**: Asegurar que todos los campos requeridos estén presentes

### Comandos de Diagnóstico
```bash
# Verificar variables de entorno
node -e "require('dotenv').config(); console.log('Puerto:', process.env.PUERTO);"

# Verificar conectividad con SendGrid
curl -H "Authorization: Bearer $SENDGRID_API_KEY" https://api.sendgrid.com/v3/user/profile
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas sobre el proyecto:

- 📧 Email: soporte@greenborn.com.ar
- 📋 Issues: [GitHub Issues](https://github.com/greenborn/notificador/issues)
- 📖 Documentación: [Ver documentación](./documentacion/)

## Changelog

### v1.2.0
- ✅ Sistema de alias para Telegram
- ✅ Endpoint POST /telegram
- ✅ Configuración flexible mediante variables de entorno
- ✅ Tests interactivos para email y Telegram
- ✅ Documentación completa actualizada

### v1.0.0
- ✅ Implementación inicial del microservicio
- ✅ Integración con SendGrid
- ✅ API REST básica
- ✅ Validación de parámetros
- ✅ Manejo de errores
- ✅ Documentación completa

---

**Desarrollado por el equipo de Greenborn** 🚀 