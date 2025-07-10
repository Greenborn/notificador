# Changelog

## [1.2.0] - 2024-12-19

### ✨ Agregado
- **Sistema de alias para Telegram**: Configuración centralizada de bots y chats
- **Endpoint POST /telegram**: Envío de mensajes usando alias
- **Configuración flexible**: Múltiples bots y chats configurables
- **Validación automática**: Verificación de alias y configuración
- **Documentación completa**: Guías de configuración y uso

### 🔧 Configuración
- Nuevas variables de entorno para bots de Telegram
- Nuevas variables de entorno para chat IDs
- Archivo de configuración `config/telegram.js`
- Archivo de ejemplo `env.example`

### 📚 Documentación
- Guía completa de configuración de Telegram
- Ejemplos de uso prácticos
- Casos de uso comunes
- Troubleshooting y mejores prácticas

### 🗂️ Estructura del Proyecto
- Nuevo directorio `config/` para configuraciones
- Nuevo directorio `ejemplos/` con archivos de prueba
- Documentación actualizada en `documentacion/`

### 🔒 Seguridad
- Tokens de bot almacenados en variables de entorno
- Validación de parámetros de entrada
- Manejo seguro de errores sin exponer información sensible

### 📋 Alias Predefinidos
- `alertas-admin`: Alertas críticas para administradores
- `notificaciones-desarrollo`: Notificaciones para el equipo de desarrollo
- `soporte-general`: Notificaciones de soporte
- `sistema-general`: Notificaciones generales del sistema

### 🚀 Uso Básico
```javascript
// Enviar mensaje usando alias
const mensaje = {
    alias: "alertas-admin",
    message: "🚨 <b>Alerta</b>\nError crítico detectado",
    parse_mode: "HTML"
};
```

---

## [1.1.0] - Versión Anterior

### Funcionalidades
- Envío de emails usando SendGrid
- API REST simple
- Validación de parámetros
- Manejo de errores robusto 