# Modo de Uso - Proyecto Notificador

## Descripción

El **Notificador** es un microservicio que permite enviar emails utilizando SendGrid y mensajes a grupos de Telegram. Este documento explica cómo configurar, desplegar y utilizar el módulo.

## Configuración Inicial

### 1. Instalación de Dependencias

```bash
# Clonar o descargar el proyecto
cd notificador

# Instalar dependencias
npm install
```

### 2. Configuración de Variables de Entorno

Crear el archivo `.env` en la raíz del proyecto:

```bash
# Archivo .env
SENDGRID_API_KEY=tu_api_key_de_sendgrid
PUERTO=3000

# Configuración de Telegram (sistema de alias)
# Para cada alias que quieras usar, define:
TELEGRAM_BOT_[ALIAS]_TOKEN=token_de_tu_bot
TELEGRAM_[ALIAS]_CHAT_ID=id_del_grupo_o_chat

# Límite de mensajes por IP para /telegram (por hora)
TELEGRAM_RATE_LIMIT=5

# Ejemplos:
TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF
TELEGRAM_ALERTAS_CHAT_ID=-123456789
TELEGRAM_BOT_SOPORTE_TOKEN=987654:ZYXWVU
TELEGRAM_SOPORTE_CHAT_ID=-987654321
```

#### Obtención de API Key de SendGrid

1. Crear cuenta en [SendGrid](https://sendgrid.com/)
2. Ir a Settings > API Keys
3. Crear una nueva API Key con permisos de "Mail Send"
4. Copiar la clave y agregarla al archivo `.env`

#### Configuración de Telegram

1. Crear un bot en Telegram usando [@BotFather](https://t.me/botfather)
2. Obtener el token del bot
3. Agregar el bot a un grupo o canal
4. Obtener el Chat ID del grupo/canal
5. Configurar las variables de entorno con el formato:
   - `TELEGRAM_BOT_[ALIAS]_TOKEN=token_del_bot`
   - `TELEGRAM_[ALIAS]_CHAT_ID=id_del_grupo`

### 3. Verificación de Configuración

```bash
# Verificar que las variables están cargadas
node -e "require('dotenv').config(); console.log('Puerto:', process.env.PUERTO); console.log('API Key:', process.env.SENDGRID_API_KEY ? 'Configurada' : 'Faltante');"

# Verificar configuración de Telegram
node -e "require('dotenv').config(); const telegramVars = Object.keys(process.env).filter(key => key.startsWith('TELEGRAM_')); console.log('Variables de Telegram:', telegramVars);"
```

## Despliegue

### Opción 1: Despliegue Local

```bash
# Iniciar el servidor
node index.js
```

El servidor estará disponible en `http://localhost:PUERTO`

### Opción 2: Despliegue en Producción

```bash
# Usar PM2 para gestión de procesos
npm install -g pm2
pm2 start index.js --name "notificador"
pm2 save
pm2 startup
```

## Uso de la API

### Endpoint de Email

**URL:** `POST /email`

**Headers requeridos:**
```
Content-Type: application/json
```

### Parámetros de Entrada

| Parámetro | Tipo   | Requerido | Descripción                    |
|-----------|--------|-----------|--------------------------------|
| `to`      | string | Sí        | Email del destinatario         |
| `from`    | string | Sí        | Email del remitente            |
| `subject` | string | Sí        | Asunto del email               |
| `text`    | string | Sí        | Contenido en texto plano       |
| `html`    | string | Sí        | Contenido en formato HTML      |

### Ejemplos de Uso

#### 1. Uso con cURL

```bash
curl -X POST http://localhost:3000/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "usuario@ejemplo.com",
    "from": "registro@greenborn.com.ar",
    "subject": "Bienvenido al sistema",
    "text": "Gracias por registrarte en nuestro sistema.",
    "html": "<h1>Bienvenido</h1><p>Gracias por registrarte en nuestro sistema.</p>"
  }'
```

#### 2. Uso con JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

async function enviarEmail() {
    try {
        const response = await fetch('http://localhost:3000/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: 'usuario@ejemplo.com',
                from: 'registro@greenborn.com.ar',
                subject: 'Confirmación de registro',
                text: 'Tu cuenta ha sido creada exitosamente.',
                html: '<h1>Cuenta Creada</h1><p>Tu cuenta ha sido creada exitosamente.</p>'
            })
        });

        const resultado = await response.json();
        console.log('Resultado:', resultado);
    } catch (error) {
        console.error('Error:', error);
    }
}

enviarEmail();
```

#### 3. Uso con Python

```python
import requests
import json

def enviar_email():
    url = "http://localhost:3000/email"
    datos = {
        "to": "usuario@ejemplo.com",
        "from": "notificaciones@greenborn.com.ar",
        "subject": "Notificación importante",
        "text": "Este es un mensaje importante.",
        "html": "<h1>Notificación</h1><p>Este es un mensaje importante.</p>"
    }
    
    try:
        response = requests.post(url, json=datos)
        resultado = response.json()
        print(f"Estado: {resultado}")
    except Exception as e:
        print(f"Error: {e}")

enviar_email()
```

#### 4. Uso con PHP

```php
<?php
function enviarEmail() {
    $url = 'http://localhost:3000/email';
    $datos = [
        'to' => 'usuario@ejemplo.com',
        'from' => 'sistema@greenborn.com.ar',
        'subject' => 'Mensaje del sistema',
        'text' => 'Este es un mensaje del sistema.',
        'html' => '<h1>Sistema</h1><p>Este es un mensaje del sistema.</p>'
    ];

    $opciones = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($datos)
        ]
    ];

    $contexto = stream_context_create($opciones);
    $resultado = file_get_contents($url, false, $contexto);
    
    echo "Resultado: " . $resultado;
}

enviarEmail();
?>
```

### Respuestas de la API

#### Respuesta Exitosa (200)
```json
{
    "stat": true
}
```

#### Respuesta de Error (500)
```json
{
    "stat": false
}
```

### Endpoint de Telegram

**URL:** `POST /telegram`

**Rate limit:** Por defecto, cada IP puede enviar hasta 5 mensajes por hora a este endpoint. Este límite se puede configurar con la variable `TELEGRAM_RATE_LIMIT` en el archivo `.env`. Si se supera el límite, la API responderá:

```json
{
    "stat": false,
    "error": "Demasiados mensajes enviados desde esta IP. Intenta nuevamente en una hora."
}
```

**Headers requeridos:**
```
Content-Type: application/json
```

### Parámetros de Entrada

| Parámetro | Tipo   | Requerido | Descripción                    |
|-----------|--------|-----------|--------------------------------|
| `alias`   | string | Sí        | Alias configurado en variables de entorno |
| `message` | string | Sí        | Contenido del mensaje          |
| `parse_mode` | string | No     | Modo de formato ('HTML', 'Markdown') |
| `disable_web_page_preview` | boolean | No | Deshabilitar vista previa de enlaces |
| `disable_notification` | boolean | No | Enviar sin notificación |

### Ejemplos de Uso

#### 1. Uso con cURL

```bash
curl -X POST http://localhost:3000/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "alias": "alertas",
    "message": "<b>Alerta</b>\nSe detectó un error crítico.",
    "parse_mode": "HTML"
  }'
```

#### 2. Uso con JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

async function enviarMensajeTelegram() {
    try {
        const response = await fetch('http://localhost:3000/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                alias: 'alertas',
                message: '🚨 <b>Alerta del Sistema</b>\n\nSe ha detectado un error crítico en el servidor.\n\n<i>Timestamp:</i> ' + new Date().toISOString(),
                parse_mode: 'HTML'
            })
        });

        const resultado = await response.json();
        console.log('Resultado:', resultado);
    } catch (error) {
        console.error('Error:', error);
    }
}

enviarMensajeTelegram();
```

#### 3. Uso con Python

```python
import requests
import json
from datetime import datetime

def enviar_telegram():
    url = "http://localhost:3000/telegram"
    datos = {
        "alias": "alertas",
        "message": f"🚨 <b>Alerta del Sistema</b>\n\nSe ha detectado un error crítico.\n\n<i>Timestamp:</i> {datetime.now().isoformat()}",
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=datos)
        resultado = response.json()
        print(f"Estado: {resultado}")
    except Exception as e:
        print(f"Error: {e}")

enviar_telegram()
```

### Respuestas de la API

#### Respuesta Exitosa (200)
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

#### Respuesta de Error (400/500)
```json
{
    "stat": false,
    "error": "Alias 'alertas' no existe o está mal configurado. Variables requeridas: TELEGRAM_BOT_ALERTAS_TOKEN, TELEGRAM_ALERTAS_CHAT_ID"
}
```

## Casos de Uso Comunes

### 1. Notificación de Registro de Usuario (Email)

```javascript
const datosRegistro = {
    to: nuevoUsuario.email,
    from: "registro@greenborn.com.ar",
    subject: "Bienvenido a Greenborn",
    text: `Hola ${nuevoUsuario.nombre}, tu cuenta ha sido creada exitosamente.`,
    html: `
        <h1>Bienvenido a Greenborn</h1>
        <p>Hola ${nuevoUsuario.nombre},</p>
        <p>Tu cuenta ha sido creada exitosamente.</p>
        <p>Saludos,<br>Equipo Greenborn</p>
    `
};
```

### 2. Notificación de Error del Sistema (Email + Telegram)

```javascript
// Email para administradores
const datosErrorEmail = {
    to: "admin@greenborn.com.ar",
    from: "sistema@greenborn.com.ar",
    subject: "Error en el sistema",
    text: `Se ha detectado un error: ${error.message}`,
    html: `
        <h1>Error del Sistema</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Fecha:</strong> ${new Date().toISOString()}</p>
        <p><strong>Stack:</strong> ${error.stack}</p>
    `
};

// Telegram para alertas inmediatas
const datosErrorTelegram = {
    alias: "alertas",
    message: `🚨 <b>Error Crítico del Sistema</b>\n\n<b>Error:</b> ${error.message}\n<b>Fecha:</b> ${new Date().toISOString()}\n\n<i>Se ha enviado un email detallado a administración.</i>`,
    parse_mode: "HTML"
};
```

### 3. Reporte Automático (Email + Telegram)

```javascript
// Email detallado
const datosReporteEmail = {
    to: "gerencia@greenborn.com.ar",
    from: "reportes@greenborn.com.ar",
    subject: "Reporte Diario - " + new Date().toLocaleDateString(),
    text: `Reporte diario generado. Total de usuarios: ${totalUsuarios}`,
    html: `
        <h1>Reporte Diario</h1>
        <table>
            <tr><td>Total de usuarios:</td><td>${totalUsuarios}</td></tr>
            <tr><td>Nuevos registros:</td><td>${nuevosRegistros}</td></tr>
            <tr><td>Fecha:</td><td>${new Date().toLocaleDateString()}</td></tr>
        </table>
    `
};

// Resumen en Telegram
const datosReporteTelegram = {
    alias: "admin",
    message: `📊 <b>Reporte Diario</b>\n\n👥 Total usuarios: ${totalUsuarios}\n🆕 Nuevos registros: ${nuevosRegistros}\n📅 Fecha: ${new Date().toLocaleDateString()}\n\n<i>Reporte completo enviado por email.</i>`,
    parse_mode: "HTML"
};
```

### 4. Notificación de Soporte (Telegram)

```javascript
const datosSoporte = {
    alias: "soporte",
    message: `🆘 <b>Nuevo Ticket de Soporte</b>\n\n<b>Usuario:</b> ${usuario.nombre}\n<b>Asunto:</b> ${ticket.asunto}\n<b>Prioridad:</b> ${ticket.prioridad}\n<b>Fecha:</b> ${new Date().toISOString()}\n\n<i>Revisar sistema de tickets para más detalles.</i>`,
    parse_mode: "HTML"
};
```

## Scripts de Prueba

### test-email.js

Script interactivo para probar el envío de emails.

```bash
# Ejecutar script de prueba
node tests/test-email.js
```

#### Características
- ✅ Validación automática de formato de email
- ✅ Interfaz interactiva por consola
- ✅ Verificación de configuración del servidor
- ✅ Email de prueba con diseño HTML profesional
- ✅ Confirmación antes del envío

#### Uso
1. Ejecutar el script: `node tests/test-email.js`
2. Ingresar dirección de email de destino
3. Confirmar el envío (s/n)
4. Revisar resultado en consola

### test-telegram.js

Script interactivo para probar el envío de mensajes a Telegram.

```bash
# Ejecutar script de prueba
node tests/test-telegram.js
```

#### Características
- ✅ Listado automático de alias configurados
- ✅ Interfaz interactiva por consola
- ✅ Verificación de configuración del servidor
- ✅ Mensaje de prueba con formato HTML
- ✅ Confirmación antes del envío

#### Uso
1. Ejecutar el script: `node tests/test-telegram.js`
2. Seleccionar alias de la lista
3. Ingresar mensaje personalizado (opcional)
4. Confirmar el envío (s/n)
5. Revisar resultado en consola

Para más detalles, consultar `tests/README.md`

## Monitoreo y Logs

### Verificación de Estado

```bash
# Verificar si el servidor está funcionando
curl -X GET http://localhost:3000/health

# Ver logs en tiempo real
tail -f logs/notificador.log
```

### Logs Importantes

- **Inicio del servidor**: "Servidor escuchando en: PUERTO"
- **Email enviado**: "Email sent"
- **Mensaje de Telegram enviado**: "Telegram message sent"
- **Error de SendGrid**: "Error [detalles]"
- **Error de Telegram**: "Telegram error [detalles]"
- **Parámetros recibidos**: Log de los datos de entrada

## Troubleshooting

### Problemas Comunes

#### 1. Error de API Key (SendGrid)
```
Error: Forbidden
```
**Solución:** Verificar que la API Key de SendGrid sea válida y tenga permisos de "Mail Send".

#### 2. Error de Token de Bot (Telegram)
```
Alias 'alertas' no existe o está mal configurado
```
**Solución:** Verificar que las variables `TELEGRAM_BOT_[ALIAS]_TOKEN` y `TELEGRAM_[ALIAS]_CHAT_ID` estén configuradas correctamente.

#### 3. Error de Parámetros (Email)
```
revisar parametros
```
**Solución:** Asegurar que todos los parámetros requeridos (`to`, `subject`, `text`, `html`) estén presentes.

#### 4. Error de Parámetros (Telegram)
```
Alias requerido
```
**Solución:** Asegurar que el parámetro `alias` esté presente y corresponda a una configuración válida.

#### 5. Error de Conexión
```
Error: connect ECONNREFUSED
```
**Solución:** Verificar que el servidor esté ejecutándose y el puerto sea correcto.

#### 6. Error de Puerto en Uso
```
Error: listen EADDRINUSE
```
**Solución:** Cambiar el puerto en el archivo `.env` o detener el proceso que usa el puerto.

### Comandos de Diagnóstico

```bash
# Verificar variables de entorno
node -e "require('dotenv').config(); console.log(process.env);"

# Verificar configuración de Telegram
node -e "require('dotenv').config(); const telegramVars = Object.keys(process.env).filter(key => key.startsWith('TELEGRAM_')); console.log('Variables de Telegram:', telegramVars);"

# Verificar conectividad con SendGrid
curl -H "Authorization: Bearer $SENDGRID_API_KEY" https://api.sendgrid.com/v3/user/profile

# Verificar conectividad con Telegram (reemplazar con tu token)
curl "https://api.telegram.org/bot$TELEGRAM_BOT_ALERTAS_TOKEN/getMe"

# Verificar logs del sistema
journalctl -u notificador -f
```

## Integración con Otros Servicios

### Ejemplo de Integración con Express.js

```javascript
// En tu aplicación principal
app.post('/registrar-usuario', async (req, res) => {
    try {
        // Lógica de registro...
        
        // Enviar email de bienvenida
        const emailData = {
            to: req.body.email,
            from: "registro@greenborn.com.ar",
            subject: "Bienvenido",
            text: "Gracias por registrarte",
            html: "<h1>Bienvenido</h1><p>Gracias por registrarte</p>"
        };

        const emailResponse = await fetch('http://notificador:3000/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        const emailResultado = await emailResponse.json();
        console.log('Email enviado:', emailResultado);

        // Notificar a administración por Telegram
        const telegramData = {
            alias: "admin",
            message: `👋 <b>Nuevo Usuario Registrado</b>\n\n<b>Email:</b> ${req.body.email}\n<b>Fecha:</b> ${new Date().toISOString()}`,
            parse_mode: "HTML"
        };

        const telegramResponse = await fetch('http://notificador:3000/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telegramData)
        });

        const telegramResultado = await telegramResponse.json();
        console.log('Notificación Telegram enviada:', telegramResultado);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Ejemplo de Integración con Laravel

```php
// En tu controlador Laravel
public function registrarUsuario(Request $request)
{
    // Lógica de registro...
    
    // Enviar email de bienvenida
    $emailData = [
        'to' => $request->email,
        'from' => 'registro@greenborn.com.ar',
        'subject' => 'Bienvenido a Greenborn',
        'text' => 'Gracias por registrarte en nuestro sistema.',
        'html' => '<h1>Bienvenido</h1><p>Gracias por registrarte en nuestro sistema.</p>'
    ];

    $response = Http::post('http://notificador:3000/email', $emailData);
    
    if ($response->json('stat')) {
        Log::info('Email de bienvenida enviado');
    } else {
        Log::error('Error al enviar email de bienvenida');
    }

    return response()->json(['success' => true]);
}
```

## Consideraciones de Seguridad

### Buenas Prácticas

1. **Validar emails**: Verificar formato de email antes de enviar
2. **Rate limiting**: Implementar límites de envío por IP/usuario
3. **Autenticación**: Considerar agregar autenticación a la API
4. **Logs seguros**: No registrar información sensible en logs
5. **HTTPS**: Usar HTTPS en producción

### Configuración de Firewall

```bash
# Permitir solo conexiones locales (desarrollo)
iptables -A INPUT -p tcp --dport 3000 -s 127.0.0.1 -j ACCEPT

# Permitir conexiones desde red interna (producción)
iptables -A INPUT -p tcp --dport 3000 -s 192.168.1.0/24 -j ACCEPT
``` 