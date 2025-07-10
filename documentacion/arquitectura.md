# Arquitectura del Proyecto Notificador

## Descripción General

El **Notificador** es un microservicio especializado en el envío de notificaciones por email utilizando SendGrid y mensajes a grupos de Telegram. Diseñado como una API REST simple y eficiente, proporciona una interfaz unificada para el envío de notificaciones desde otros servicios del ecosistema Greenborn.

## Arquitectura del Sistema

```
┌─────────────────┐    HTTP POST    ┌──────────────────┐    API Call    ┌─────────────────┐
│   Cliente       │ ──────────────► │   Notificador    │ ─────────────► │   SendGrid       │
│   (Frontend/    │                 │   (Node.js)      │                │   (Servicio     │
│   Backend)      │                 │                  │                │   Externo)      │
└─────────────────┘                 └──────────────────┘                └─────────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │   Variables de   │
                                     │   Entorno        │
                                     │   (.env)         │
                                     └──────────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐    API Call    ┌─────────────────┐
                                     │   Telegram Bot   │ ─────────────► │   Telegram      │
                                     │   API            │                │   (Servicio     │
                                     │                  │                │   Externo)      │
                                     └──────────────────┘                └─────────────────┘
```

## Componentes Principales

### 1. Servidor Express.js
- **Propósito**: Servidor web que maneja las peticiones HTTP
- **Puerto**: Configurable mediante variable de entorno `PUERTO`
- **Middleware**: 
  - `express.json()` para parsing de JSON
  - `body-parser` para procesamiento de requests

### 2. Endpoint de Emails
- **Ruta**: `POST /email`
- **Función**: Procesa y envía emails
- **Validación**: Verifica parámetros requeridos
- **Respuesta**: JSON con estado de éxito/error

### 3. Endpoint de Telegram
- **Ruta**: `POST /telegram`
- **Función**: Envía mensajes a grupos de Telegram usando alias
- **Validación**: Verifica alias y parámetros requeridos
- **Respuesta**: JSON con estado de éxito/error

### 4. Integración SendGrid
- **Librería**: `@sendgrid/mail`
- **Configuración**: API Key mediante variable de entorno
- **Remitente**: `registro.gfc@greenborn.com.ar` (fijo)

### 5. Integración Telegram
- **Librería**: `node-telegram-bot-api`
- **Configuración**: Tokens y chat IDs mediante variables de entorno
- **Sistema de Alias**: Configuración dinámica basada en variables de entorno

## Flujo de Datos

### Email
### 1. Recepción de Petición
```javascript
app.post('/email', function requestHandler(req, res) {
    const PARAMETROS = req.body
    // Validación de parámetros
})
```

### 2. Validación de Parámetros
- `to`: Destinatario (requerido)
- `subject`: Asunto (requerido)
- `text`: Contenido texto plano (requerido)
- `html`: Contenido HTML (requerido)

### 3. Construcción del Mensaje
```javascript
const msg = {
    to: PARAMETROS.to,
    from: 'registro.gfc@greenborn.com.ar',
    subject: PARAMETROS.subject,
    text: PARAMETROS.text,
    html: PARAMETROS.html,
}
```

### 4. Envío y Respuesta
- Envío asíncrono mediante SendGrid
- Respuesta de éxito: `{ stat: true }`
- Respuesta de error: `{ stat: false }`

### Telegram
### 1. Recepción de Petición
```javascript
app.post('/telegram', function telegramHandler(req, res) {
    const { alias, message, parse_mode } = req.body
    // Validación de parámetros
})
```

### 2. Validación de Parámetros
- `alias`: Nombre del alias (requerido)
- `message`: Contenido del mensaje (requerido)
- `parse_mode`: Modo de formato (opcional, por defecto 'HTML')

### 3. Búsqueda de Configuración
```javascript
const botTokenVar = `TELEGRAM_BOT_${alias.toUpperCase()}_TOKEN`
const chatIdVar = `TELEGRAM_${alias.toUpperCase()}_CHAT_ID`
const botToken = process.env[botTokenVar]
const chatId = process.env[chatIdVar]
```

### 4. Envío y Respuesta
- Envío asíncrono mediante Telegram Bot API
- Respuesta de éxito: `{ stat: true, alias, message_id, chat }`
- Respuesta de error: `{ stat: false, error }`

## Configuración del Entorno

### Variables de Entorno (.env)
```bash
# Configuración del servidor
PUERTO=3000

# Configuración de SendGrid
SENDGRID_API_KEY=tu_api_key_de_sendgrid

# Configuración de Telegram (sistema de alias)
TELEGRAM_BOT_[ALIAS]_TOKEN=token_del_bot
TELEGRAM_[ALIAS]_CHAT_ID=id_del_grupo_o_chat

# Ejemplos:
TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF
TELEGRAM_ALERTAS_CHAT_ID=-123456789
TELEGRAM_BOT_SOPORTE_TOKEN=987654:ZYXWVU
TELEGRAM_SOPORTE_CHAT_ID=-987654321
```

### Dependencias (package.json)
```json
{
  "dependencies": {
    "@sendgrid/mail": "^8.1.0",
    "node-telegram-bot-api": "^0.66.0",
    "body-parser": "^1.20.2",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  }
}
```

## Estructura de Archivos

```
notificador/
├── index.js              # Punto de entrada principal
├── package.json          # Dependencias y configuración
├── package-lock.json     # Versiones exactas de dependencias
├── .env                  # Variables de entorno (no versionado)
├── .gitignore           # Archivos ignorados por Git

├── README.md            # Documentación principal
├── tests/               # Scripts de prueba
│   ├── test-email.js    # Test de emails
│   ├── test-telegram.js # Test de Telegram
│   └── README.md        # Documentación de tests
└── documentacion/       # Documentación detallada
    ├── arquitectura.md  # Documentación técnica
    ├── modo_uso.md     # Guía de uso
    └── telegram_setup.md # Configuración de Telegram
```

## Sistema de Alias de Telegram

### Concepto
El sistema de alias permite configurar múltiples bots y chats de Telegram de forma dinámica mediante variables de entorno.

### Formato de Variables
- **Token del Bot**: `TELEGRAM_BOT_[ALIAS]_TOKEN`
- **Chat ID**: `TELEGRAM_[ALIAS]_CHAT_ID`

### Ejemplo de Configuración
```bash
# Alias "alertas"
TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF
TELEGRAM_ALERTAS_CHAT_ID=-123456789

# Alias "soporte"
TELEGRAM_BOT_SOPORTE_TOKEN=987654:ZYXWVU
TELEGRAM_SOPORTE_CHAT_ID=-987654321
```

### Uso
```javascript
// Enviar mensaje usando alias
const response = await fetch('/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        alias: 'alertas',
        message: '<b>Alerta</b>\nError crítico detectado',
        parse_mode: 'HTML'
    })
});
```

## Manejo de Errores

### Errores de Validación
- Parámetros faltantes o inválidos
- Respuesta: `400` con `{ stat: false, error }`

### Errores de SendGrid
- Problemas de conexión o autenticación
- Respuesta: `500` con `{ stat: false }`

### Errores de Telegram
- Alias no encontrado o mal configurado
- Respuesta: `400` con `{ stat: false, error }`
- Problemas de API de Telegram
- Respuesta: `500` con `{ stat: false, error }`

### Errores Internos
- Excepciones no manejadas
- Respuesta: `500` con `{ stat: false, error }`

## Seguridad

### Consideraciones
- API Keys protegidas en variables de entorno
- Tokens de bots de Telegram protegidos
- Validación de parámetros de entrada
- Manejo de errores sin exponer información sensible

### Limitaciones
- No implementa rate limiting
- No tiene autenticación de clientes
- Remitente de email fijo (no configurable)

## Escalabilidad

### Características Actuales
- Servidor single-threaded
- Sin persistencia de datos
- Sin cola de mensajes
- Sistema de alias dinámico para Telegram

### Posibles Mejoras
- Implementar cola de mensajes (Redis/RabbitMQ)
- Añadir rate limiting
- Logging estructurado
- Métricas y monitoreo
- Autenticación de clientes
- Cache de configuración de alias

## Integración con Otros Servicios

### Casos de Uso Típicos
- Notificaciones de registro de usuarios (email)
- Alertas del sistema (Telegram)
- Reportes automáticos (email + Telegram)
- Confirmaciones de acciones (email)
- Notificaciones de soporte (Telegram)

## Monitoreo y Logs

### Logs Actuales
- Parámetros recibidos
- Estado de envío de emails
- Estado de envío de mensajes de Telegram
- Errores de SendGrid y Telegram
- Inicio del servidor

### Métricas Sugeridas
- Número de emails enviados
- Número de mensajes de Telegram enviados
- Tasa de éxito/error por servicio
- Tiempo de respuesta
- Uso de recursos

## Despliegue

### Requisitos
- Node.js (versión recomendada: 16+)
- Variables de entorno configuradas
- Acceso a internet para SendGrid y Telegram

*Para información detallada sobre configuración y despliegue, consultar el archivo `modo_uso.md`*

 