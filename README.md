# Notificador - Microservicio de Emails

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![SendGrid](https://img.shields.io/badge/SendGrid-API-orange.svg)](https://sendgrid.com/)

## Descripción

El **Notificador** es un microservicio especializado en el envío de notificaciones por email utilizando la plataforma SendGrid. Diseñado como una API REST simple y eficiente, proporciona una interfaz unificada para el envío de correos electrónicos desde otros servicios del ecosistema Greenborn.

## Características Principales

- ✅ **API REST simple** con endpoint único
- ✅ **Integración con SendGrid** para envío confiable de emails
- ✅ **Validación de parámetros** automática
- ✅ **Manejo de errores** robusto
- ✅ **Configuración flexible** mediante variables de entorno
- ✅ **Logs detallados** para monitoreo


## Inicio Rápido

### Prerrequisitos

- Node.js 16 o superior
- Cuenta de SendGrid con API Key
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

## Estructura del Proyecto

```
notificador/
├── index.js                    # Punto de entrada principal
├── package.json               # Dependencias y configuración
├── .env                       # Variables de entorno (no versionado)
├── .gitignore                # Archivos ignorados por Git

├── README.md                 # Este archivo
└── documentacion/            # Documentación del proyecto
    ├── arquitectura.md       # Documentación técnica
    └── modo_uso.md          # Guía de uso
```

## API Endpoints

### POST /
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

## Configuración

### Variables de Entorno

| Variable | Descripción | Requerido | Ejemplo |
|----------|-------------|-----------|---------|
| `SENDGRID_API_KEY` | API Key de SendGrid | Sí | `SG.xxxxxxxxxxxxx` |
| `PUERTO` | Puerto del servidor | No | `3000` |

### Archivo .env
```bash
SENDGRID_API_KEY=tu_api_key_de_sendgrid
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

### v1.0.0
- ✅ Implementación inicial del microservicio
- ✅ Integración con SendGrid
- ✅ API REST básica
- ✅ Validación de parámetros
- ✅ Manejo de errores
- ✅ Documentación completa

---

**Desarrollado por el equipo de Greenborn** 🚀 