# Modo de Uso - Proyecto Notificador

## Descripción

El **Notificador** es un microservicio que permite enviar emails utilizando SendGrid. Este documento explica cómo configurar, desplegar y utilizar el módulo.

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
```

#### Obtención de API Key de SendGrid

1. Crear cuenta en [SendGrid](https://sendgrid.com/)
2. Ir a Settings > API Keys
3. Crear una nueva API Key con permisos de "Mail Send"
4. Copiar la clave y agregarla al archivo `.env`

### 3. Verificación de Configuración

```bash
# Verificar que las variables están cargadas
node -e "require('dotenv').config(); console.log('Puerto:', process.env.PUERTO); console.log('API Key:', process.env.SENDGRID_API_KEY ? 'Configurada' : 'Faltante');"
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

### Endpoint Principal

**URL:** `POST /`

**Headers requeridos:**
```
Content-Type: application/json
```

### Parámetros de Entrada

| Parámetro | Tipo   | Requerido | Descripción                    |
|-----------|--------|-----------|--------------------------------|
| `to`      | string | Sí        | Email del destinatario         |
| `subject` | string | Sí        | Asunto del email               |
| `text`    | string | Sí        | Contenido en texto plano       |
| `html`    | string | Sí        | Contenido en formato HTML      |

### Ejemplos de Uso

#### 1. Uso con cURL

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "to": "usuario@ejemplo.com",
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
        const response = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: 'usuario@ejemplo.com',
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
    url = "http://localhost:3000"
    datos = {
        "to": "usuario@ejemplo.com",
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
    $url = 'http://localhost:3000';
    $datos = [
        'to' => 'usuario@ejemplo.com',
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

## Casos de Uso Comunes

### 1. Notificación de Registro de Usuario

```javascript
const datosRegistro = {
    to: nuevoUsuario.email,
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

### 2. Notificación de Error del Sistema

```javascript
const datosError = {
    to: "admin@greenborn.com.ar",
    subject: "Error en el sistema",
    text: `Se ha detectado un error: ${error.message}`,
    html: `
        <h1>Error del Sistema</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Fecha:</strong> ${new Date().toISOString()}</p>
        <p><strong>Stack:</strong> ${error.stack}</p>
    `
};
```

### 3. Reporte Automático

```javascript
const datosReporte = {
    to: "gerencia@greenborn.com.ar",
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
```

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
- **Error de SendGrid**: "Error [detalles]"
- **Parámetros recibidos**: Log de los datos de entrada

## Troubleshooting

### Problemas Comunes

#### 1. Error de API Key
```
Error: Forbidden
```
**Solución:** Verificar que la API Key de SendGrid sea válida y tenga permisos de "Mail Send".

#### 2. Error de Parámetros
```
revisar parametros
```
**Solución:** Asegurar que todos los parámetros requeridos (`to`, `subject`, `text`, `html`) estén presentes.

#### 3. Error de Conexión
```
Error: connect ECONNREFUSED
```
**Solución:** Verificar que el servidor esté ejecutándose y el puerto sea correcto.

#### 4. Error de Puerto en Uso
```
Error: listen EADDRINUSE
```
**Solución:** Cambiar el puerto en el archivo `.env` o detener el proceso que usa el puerto.

### Comandos de Diagnóstico

```bash
# Verificar variables de entorno
node -e "require('dotenv').config(); console.log(process.env);"

# Verificar conectividad con SendGrid
curl -H "Authorization: Bearer $SENDGRID_API_KEY" https://api.sendgrid.com/v3/user/profile

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
            subject: "Bienvenido",
            text: "Gracias por registrarte",
            html: "<h1>Bienvenido</h1><p>Gracias por registrarte</p>"
        };

        const response = await fetch('http://notificador:3000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        const resultado = await response.json();
        console.log('Email enviado:', resultado);

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
        'subject' => 'Bienvenido a Greenborn',
        'text' => 'Gracias por registrarte en nuestro sistema.',
        'html' => '<h1>Bienvenido</h1><p>Gracias por registrarte en nuestro sistema.</p>'
    ];

    $response = Http::post('http://notificador:3000', $emailData);
    
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