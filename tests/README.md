# Tests - Notificador de Emails y Telegram

Este directorio contiene scripts de prueba para el sistema de notificaciones.

## Scripts Disponibles

### test-email.js

Script interactivo para probar el envío de emails.

#### Características

- ✅ Validación de formato de email
- ✅ Interfaz interactiva por consola
- ✅ Verificación de configuración
- ✅ Email de prueba con diseño HTML profesional
- ✅ Manejo de errores detallado
- ✅ Confirmación antes del envío

#### Uso

```bash
# Desde el directorio raíz del proyecto
node tests/test-email.js

# O desde el directorio tests
cd tests
node test-email.js
```

#### Flujo de Ejecución

1. **Verificación de Configuración**
   - Comprueba que `SENDGRID_API_KEY` esté configurada
   - Muestra la URL del servidor configurada

2. **Solicitud de Emails**
   - Pide al usuario que ingrese la dirección de email de destino
   - Valida el formato del email de destino
   - Pide al usuario que ingrese la dirección de email del remitente
   - Valida el formato del email del remitente
   - Permite reintentar si algún formato es inválido

3. **Confirmación**
   - Pide confirmación antes de enviar
   - Acepta respuestas: `s`, `si`, `y`, `yes` (case insensitive)

4. **Envío y Resultado**
   - Envía el email de prueba
   - Muestra el resultado del envío
   - Proporciona feedback detallado

#### Configuración

El script lee las siguientes variables de entorno del archivo `.env`:

- `SENDGRID_API_KEY`: Clave API de SendGrid
- `SERVER_URL`: URL del servidor (por defecto: `http://localhost:3000`)

#### Email de Prueba

El script envía un email con:

- **Remitente:** Configurable por el usuario
- **Destinatario:** Configurable por el usuario
- **Asunto:** "Email de Prueba - Notificador"
- **Contenido:** Email HTML profesional con:
  - Diseño responsive
  - Información del servidor
  - Fecha y hora del envío
  - Estilos CSS inline
  - Logo y branding de Greenborn

### test-telegram.js

Script interactivo para probar el envío de mensajes a Telegram.

#### Características

- ✅ Detección automática de alias configurados
- ✅ Interfaz interactiva por consola
- ✅ Verificación de configuración de Telegram
- ✅ Selección de alias disponible
- ✅ Validación de mensaje
- ✅ Manejo de errores detallado
- ✅ Confirmación antes del envío

#### Uso

```bash
# Desde el directorio raíz del proyecto
node tests/test-telegram.js

# O desde el directorio tests
cd tests
node test-telegram.js
```

#### Flujo de Ejecución

1. **Verificación de Configuración**
   - Busca alias de Telegram en variables de entorno
   - Lista todos los alias encontrados
   - Si no hay alias, muestra instrucciones de configuración

2. **Selección de Alias**
   - Permite seleccionar un alias de la lista
   - Valida la selección del usuario
   - Permite reintentar si la selección es inválida

3. **Solicitud de Mensaje**
   - Pide al usuario que ingrese el mensaje
   - Valida que el mensaje no esté vacío
   - Permite reintentar si el mensaje es inválido

4. **Confirmación**
   - Pide confirmación antes de enviar
   - Acepta respuestas: `s`, `si`, `y`, `yes` (case insensitive)

5. **Envío y Resultado**
   - Envía el mensaje de Telegram
   - Muestra el resultado del envío
   - Proporciona feedback detallado

#### Configuración

El script lee las siguientes variables de entorno del archivo `.env`:

- `TELEGRAM_BOT_[ALIAS]_TOKEN`: Token del bot para cada alias
- `TELEGRAM_[ALIAS]_CHAT_ID`: Chat ID para cada alias
- `SERVER_URL`: URL del servidor (por defecto: `http://localhost:3000`)

#### Ejemplo de Configuración

```bash
# En el archivo .env
TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF
TELEGRAM_ALERTAS_CHAT_ID=-123456789
TELEGRAM_BOT_SOPORTE_TOKEN=987654:ZYXWVU
TELEGRAM_SOPORTE_CHAT_ID=-987654321
```

#### Ejemplo de Salida

```
🚀 Script de Prueba - Notificador de Telegram
=============================================

🔧 Verificando configuración de Telegram...
✅ Se encontraron 2 alias(es) de Telegram:
   1. alertas (TELEGRAM_BOT_ALERTAS_TOKEN, TELEGRAM_ALERTAS_CHAT_ID)
   2. soporte (TELEGRAM_BOT_SOPORTE_TOKEN, TELEGRAM_SOPORTE_CHAT_ID)
🌐 URL del servidor: http://localhost:3000

📋 Selecciona un alias (1-2): 1
✅ Alias seleccionado: alertas

💬 Ingresa el mensaje para la prueba: 🚨 <b>Alerta</b>\nPrueba del sistema
✅ Mensaje válido

¿Deseas enviar el mensaje de prueba? (s/n): s

🔄 Procesando envío...

📱 Enviando mensaje de Telegram...
📍 Alias: alertas
🌐 Servidor: http://localhost:3000/telegram
✅ Mensaje enviado exitosamente!
📊 Respuesta del servidor: {"stat":true,"alias":"alertas","message_id":123}

🎉 ¡Prueba completada exitosamente!
📱 Revisa el grupo de Telegram seleccionado.
```

#### Dependencias

El script requiere las siguientes dependencias (ya incluidas en el proyecto):

- `node-fetch`: Para hacer peticiones HTTP
- `dotenv`: Para cargar variables de entorno
- `readline`: Para interfaz interactiva (incluido en Node.js)

#### Troubleshooting

**Error: "No se encontraron alias de Telegram configurados"**
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Asegúrate de que contenga variables con el formato:
  - `TELEGRAM_BOT_[ALIAS]_TOKEN=...`
  - `TELEGRAM_[ALIAS]_CHAT_ID=...`

**Error: "Error de conexión"**
- Verifica que el servidor esté ejecutándose
- Comprueba que la URL del servidor sea correcta
- Revisa que el puerto esté disponible

**Error: "Alias no existe o está mal configurado"**
- Verifica que el alias seleccionado tenga ambas variables configuradas
- Asegúrate de que el bot tenga permisos en el grupo

#### Ejemplo de Salida

```
🚀 Script de Prueba - Notificador de Emails
============================================

🔧 Verificando configuración...
✅ SENDGRID_API_KEY configurada
🌐 URL del servidor: http://localhost:3000

📧 Ingresa la dirección de email de destino: usuario@ejemplo.com
✅ Email de destino válido detectado
📤 Ingresa la dirección de email del remitente: pruebas@greenborn.com.ar
✅ Email de remitente válido detectado

📋 Resumen del email:
   📤 Remitente: pruebas@greenborn.com.ar
   📧 Destino: usuario@ejemplo.com
   📝 Asunto: Email de Prueba - Notificador

¿Deseas enviar el email de prueba? (s/n): s

🔄 Procesando envío...

📧 Enviando email de prueba...
📍 Destino: usuario@ejemplo.com
📤 Remitente: pruebas@greenborn.com.ar
🌐 Servidor: http://localhost:3000/email
✅ Email enviado exitosamente!
📊 Respuesta del servidor: {"stat":true}

🎉 ¡Prueba completada exitosamente!
📧 Revisa la bandeja de entrada del email de destino.
```

#### Integración con CI/CD

El script puede ser usado en pipelines de CI/CD:

```bash
# Ejemplo para GitHub Actions
- name: Test Telegram Service
  run: |
    echo "1" | echo "Prueba automática" | echo "s" | node tests/test-telegram.js
```

#### Notas de Desarrollo

- El script es compatible con Node.js 14+
- Usa ES6 modules y async/await
- Incluye manejo de errores robusto
- Sigue las mejores prácticas de UX para CLI
- Detecta automáticamente todos los alias configurados 