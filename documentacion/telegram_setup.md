# Guía de Configuración de Telegram

## Descripción

El sistema de Telegram del Notificador permite enviar mensajes a grupos y canales usando un sistema de alias configurado mediante variables de entorno. Esto facilita el envío de notificaciones a diferentes grupos sin necesidad de modificar código.

## Configuración Inicial

### 1. Crear un Bot de Telegram

1. Abrir Telegram y buscar [@BotFather](https://t.me/botfather)
2. Enviar el comando `/newbot`
3. Seguir las instrucciones para crear el bot
4. Guardar el token que te proporciona BotFather

### 2. Obtener Chat ID

#### Para Grupos:
1. Agregar el bot al grupo
2. Enviar un mensaje en el grupo
3. Acceder a: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
4. Buscar el `chat.id` en la respuesta JSON

#### Para Canales:
1. Agregar el bot como administrador del canal
2. Enviar un mensaje en el canal
3. Acceder a: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
4. Buscar el `chat.id` en la respuesta JSON

#### Para Chat Privado:
1. Enviar un mensaje al bot
2. Acceder a: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
3. Buscar el `chat.id` en la respuesta JSON

### 3. Configuración de Variables de Entorno

Para cada alias que quieras usar, define en tu `.env`:

```bash
TELEGRAM_BOT_[ALIAS]_TOKEN=token_de_tu_bot
TELEGRAM_[ALIAS]_CHAT_ID=id_del_grupo_o_chat
```

#### Ejemplo de Configuración:

```bash
# Bot para alertas del sistema
TELEGRAM_BOT_ALERTAS_TOKEN=123456:ABCDEF
TELEGRAM_ALERTAS_CHAT_ID=-123456789

# Bot para soporte técnico
TELEGRAM_BOT_SOPORTE_TOKEN=987654:ZYXWVU
TELEGRAM_SOPORTE_CHAT_ID=-987654321

# Bot para administración
TELEGRAM_BOT_ADMIN_TOKEN=555666:GHIJKL
TELEGRAM_ADMIN_CHAT_ID=-555666777

# Bot para desarrollo
TELEGRAM_BOT_DEV_TOKEN=111222:MNOPQR
TELEGRAM_DEV_CHAT_ID=-111222333
```

## Endpoint para Enviar Mensajes

**POST /telegram**

### Parámetros Requeridos:
- `alias`: el alias definido en las variables de entorno
- `message`: el mensaje a enviar

### Parámetros Opcionales:
- `parse_mode`: 'HTML', 'Markdown', 'MarkdownV2' (por defecto 'HTML')
- `disable_web_page_preview`: boolean (por defecto false)
- `disable_notification`: boolean (por defecto false)

### Ejemplo de Request:

```json
{
  "alias": "alertas",
  "message": "<b>Alerta</b>\nSe detectó un error crítico.",
  "parse_mode": "HTML"
}
```

### Respuesta Exitosa:

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

### Respuesta de Error (alias inexistente):

```json
{
  "stat": false,
  "error": "Alias 'alertas' no existe o está mal configurado. Variables requeridas: TELEGRAM_BOT_ALERTAS_TOKEN, TELEGRAM_ALERTAS_CHAT_ID"
}
```

## Ejemplos de Uso

### 1. Node.js con axios

```javascript
const axios = require('axios');

async function enviarNotificacionTelegram(alias, mensaje) {
  try {
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
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// Ejemplos de uso
enviarNotificacionTelegram('alertas', '<b>Alerta</b>\nSe detectó un error crítico.');
enviarNotificacionTelegram('soporte', '🆘 <b>Nuevo Ticket</b>\nUsuario necesita ayuda.');
```

### 2. JavaScript con fetch

```javascript
async function enviarTelegram(alias, mensaje) {
  try {
    const response = await fetch('http://localhost:3000/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        alias,
        message: mensaje,
        parse_mode: 'HTML'
      })
    });

    const resultado = await response.json();
    
    if (resultado.stat) {
      console.log('✅ Mensaje enviado a', alias);
    } else {
      console.error('❌ Error:', resultado.error);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}
```

### 3. Python con requests

```python
import requests
import json

def enviar_telegram(alias, mensaje):
    url = "http://localhost:3000/telegram"
    datos = {
        "alias": alias,
        "message": mensaje,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=datos)
        resultado = response.json()
        
        if resultado.get('stat'):
            print(f"✅ Mensaje enviado a {alias}")
        else:
            print(f"❌ Error: {resultado.get('error')}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

# Ejemplo de uso
enviar_telegram("alertas", "<b>Alerta</b>\nError crítico detectado.")
```

### 4. PHP

```php
<?php
function enviarTelegram($alias, $mensaje) {
    $url = 'http://localhost:3000/telegram';
    $datos = [
        'alias' => $alias,
        'message' => $mensaje,
        'parse_mode' => 'HTML'
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
    $respuesta = json_decode($resultado, true);
    
    if ($respuesta['stat']) {
        echo "✅ Mensaje enviado a $alias\n";
    } else {
        echo "❌ Error: " . $respuesta['error'] . "\n";
    }
}

// Ejemplo de uso
enviarTelegram('alertas', '<b>Alerta</b>\nError crítico detectado.');
?>
```

## Formatos de Mensaje

### HTML (por defecto)

```html
<b>Texto en negrita</b>
<i>Texto en cursiva</i>
<u>Texto subrayado</u>
<s>Texto tachado</s>
<code>Código inline</code>
<pre>Bloque de código</pre>
<a href="https://ejemplo.com">Enlace</a>
```

### Markdown

```markdown
**Texto en negrita**
*Texto en cursiva*
__Texto subrayado__
~~Texto tachado~~
`Código inline`
[Enlace](https://ejemplo.com)
```

## Casos de Uso Comunes

### 1. Alertas del Sistema

```javascript
const alerta = {
    alias: 'alertas',
    message: `🚨 <b>Alerta del Sistema</b>\n\n<b>Error:</b> ${error.message}\n<b>Fecha:</b> ${new Date().toISOString()}\n<b>Servidor:</b> ${process.env.HOSTNAME}`,
    parse_mode: 'HTML'
};
```

### 2. Notificaciones de Soporte

```javascript
const soporte = {
    alias: 'soporte',
    message: `🆘 <b>Nuevo Ticket de Soporte</b>\n\n<b>Usuario:</b> ${usuario.nombre}\n<b>Email:</b> ${usuario.email}\n<b>Asunto:</b> ${ticket.asunto}\n<b>Prioridad:</b> ${ticket.prioridad}`,
    parse_mode: 'HTML'
};
```

### 3. Reportes Automáticos

```javascript
const reporte = {
    alias: 'admin',
    message: `📊 <b>Reporte Diario</b>\n\n👥 Usuarios activos: ${stats.usuariosActivos}\n🆕 Nuevos registros: ${stats.nuevosRegistros}\n💰 Ventas: $${stats.ventas}\n📅 Fecha: ${new Date().toLocaleDateString()}`,
    parse_mode: 'HTML'
};
```

### 4. Notificaciones de Desarrollo

```javascript
const desarrollo = {
    alias: 'dev',
    message: `🔧 <b>Deploy Completado</b>\n\n<b>Ambiente:</b> ${ambiente}\n<b>Versión:</b> ${version}\n<b>Cambios:</b> ${cambios}\n<b>Fecha:</b> ${new Date().toISOString()}`,
    parse_mode: 'HTML'
};
```

## Troubleshooting

### Problemas Comunes

#### 1. "Alias no existe o está mal configurado"
- Verificar que las variables de entorno estén definidas correctamente
- Verificar que el formato sea: `TELEGRAM_BOT_[ALIAS]_TOKEN` y `TELEGRAM_[ALIAS]_CHAT_ID`
- Verificar que el alias en la petición coincida con el configurado

#### 2. "Bot was blocked by the user"
- El bot fue bloqueado por el usuario
- Agregar el bot nuevamente al grupo o chat

#### 3. "Chat not found"
- Verificar que el Chat ID sea correcto
- Verificar que el bot esté agregado al grupo/canal

#### 4. "Forbidden: bot was kicked from the group chat"
- El bot fue expulsado del grupo
- Agregar el bot nuevamente al grupo

### Comandos de Diagnóstico

```bash
# Verificar variables de entorno de Telegram
node -e "require('dotenv').config(); const telegramVars = Object.keys(process.env).filter(key => key.startsWith('TELEGRAM_')); console.log('Variables de Telegram:', telegramVars);"

# Verificar conectividad con Telegram (reemplazar con tu token)
curl "https://api.telegram.org/bot$TELEGRAM_BOT_ALERTAS_TOKEN/getMe"

# Verificar información del chat (reemplazar con tu token y chat ID)
curl "https://api.telegram.org/bot$TELEGRAM_BOT_ALERTAS_TOKEN/getChat?chat_id=$TELEGRAM_ALERTAS_CHAT_ID"
```

## Mejores Prácticas

1. **Usar emojis**: Hacen los mensajes más visibles y organizados
2. **Formato consistente**: Mantener un formato estándar para cada tipo de notificación
3. **Información relevante**: Incluir solo la información necesaria
4. **Timestamps**: Incluir fechas/horas en las notificaciones importantes
5. **Alias descriptivos**: Usar nombres claros para los alias (alertas, soporte, admin, etc.)
6. **Privacidad**: No enviar información sensible por Telegram
7. **Rate limiting**: No enviar demasiados mensajes en poco tiempo

## Seguridad

- Los tokens de bot son sensibles, mantenerlos seguros
- No compartir tokens en código público
- Usar variables de entorno para configuración
- Considerar usar HTTPS en producción
- Revisar permisos del bot regularmente 