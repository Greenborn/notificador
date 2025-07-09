# Arquitectura del Proyecto Notificador

## Descripción General

El **Notificador** es un microservicio especializado en el envío de notificaciones por email utilizando la plataforma SendGrid. Diseñado como una API REST simple y eficiente, proporciona una interfaz unificada para el envío de correos electrónicos desde otros servicios del ecosistema Greenborn.

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
```

## Componentes Principales

### 1. Servidor Express.js
- **Propósito**: Servidor web que maneja las peticiones HTTP
- **Puerto**: Configurable mediante variable de entorno `PUERTO`
- **Middleware**: 
  - `express.json()` para parsing de JSON
  - `body-parser` para procesamiento de requests

### 2. Endpoint de Notificaciones
- **Ruta**: `POST /`
- **Función**: Procesa y envía emails
- **Validación**: Verifica parámetros requeridos
- **Respuesta**: JSON con estado de éxito/error

### 3. Integración SendGrid
- **Librería**: `@sendgrid/mail`
- **Configuración**: API Key mediante variable de entorno
- **Remitente**: `registro.gfc@greenborn.com.ar` (fijo)

## Flujo de Datos

### 1. Recepción de Petición
```javascript
app.post('/', function requestHandler(req, res) {
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

## Configuración del Entorno

### Variables de Entorno (.env)
```bash
SENDGRID_API_KEY=tu_api_key_de_sendgrid
PUERTO=3000
```

### Dependencias (package.json)
```json
{
  "dependencies": {
    "@sendgrid/mail": "^8.1.0",
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
└── documentacion/       # Documentación detallada
    ├── arquitectura.md  # Documentación técnica
    └── modo_uso.md     # Guía de uso
```

## Manejo de Errores

### Errores de Validación
- Parámetros faltantes o inválidos
- Respuesta: `500` con `{ stat: false }`

### Errores de SendGrid
- Problemas de conexión o autenticación
- Respuesta: `500` con `{ stat: false }`

### Errores Internos
- Excepciones no manejadas
- Respuesta: `500` con `{ stat: false }`

## Seguridad

### Consideraciones
- API Key de SendGrid protegida en variables de entorno
- Validación de parámetros de entrada
- Manejo de errores sin exponer información sensible

### Limitaciones
- No implementa rate limiting
- No tiene autenticación de clientes
- Remitente fijo (no configurable)

## Escalabilidad

### Características Actuales
- Servidor single-threaded
- Sin persistencia de datos
- Sin cola de mensajes

### Posibles Mejoras
- Implementar cola de mensajes (Redis/RabbitMQ)
- Añadir rate limiting
- Logging estructurado
- Métricas y monitoreo
- Autenticación de clientes

## Integración con Otros Servicios

### Casos de Uso Típicos
- Notificaciones de registro de usuarios
- Alertas del sistema
- Reportes automáticos
- Confirmaciones de acciones



## Monitoreo y Logs

### Logs Actuales
- Parámetros recibidos
- Estado de envío de emails
- Errores de SendGrid
- Inicio del servidor

### Métricas Sugeridas
- Número de emails enviados
- Tasa de éxito/error
- Tiempo de respuesta
- Uso de recursos

## Despliegue

### Requisitos
- Node.js (versión recomendada: 14+)
- Variables de entorno configuradas
- Acceso a internet para SendGrid

*Para información detallada sobre configuración y despliegue, consultar el archivo `modo_uso.md`*

 