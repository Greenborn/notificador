# Tests - Notificador de Emails

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

2. **Solicitud de Email**
   - Pide al usuario que ingrese una dirección de email
   - Valida el formato del email
   - Permite reintentar si el formato es inválido

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

- **Asunto:** "Email de Prueba - Notificador"
- **Contenido:** Email HTML profesional con:
  - Diseño responsive
  - Información del servidor
  - Fecha y hora del envío
  - Estilos CSS inline
  - Logo y branding de Greenborn

#### Ejemplo de Salida

```
🚀 Script de Prueba - Notificador de Emails
============================================

🔧 Verificando configuración...
✅ SENDGRID_API_KEY configurada
🌐 URL del servidor: http://localhost:3000

📧 Ingresa la dirección de email de destino: usuario@ejemplo.com
✅ Email válido detectado

¿Deseas enviar el email de prueba? (s/n): s

🔄 Procesando envío...

📧 Enviando email de prueba...
📍 Destino: usuario@ejemplo.com
🌐 Servidor: http://localhost:3000/email
✅ Email enviado exitosamente!
📊 Respuesta del servidor: {"stat":true}

🎉 ¡Prueba completada exitosamente!
📧 Revisa la bandeja de entrada del email de destino.
```

#### Dependencias

El script requiere las siguientes dependencias (ya incluidas en el proyecto):

- `node-fetch`: Para hacer peticiones HTTP
- `dotenv`: Para cargar variables de entorno
- `readline`: Para interfaz interactiva (incluido en Node.js)

#### Troubleshooting

**Error: "SENDGRID_API_KEY no está configurada"**
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Asegúrate de que contenga la variable `SENDGRID_API_KEY`

**Error: "Error de conexión"**
- Verifica que el servidor esté ejecutándose
- Comprueba que la URL del servidor sea correcta
- Revisa que el puerto esté disponible

**Error: "Email inválido"**
- Asegúrate de usar un formato de email válido
- Ejemplo: `usuario@dominio.com`

#### Integración con CI/CD

El script puede ser usado en pipelines de CI/CD:

```bash
# Ejemplo para GitHub Actions
- name: Test Email Service
  run: |
    echo "test@example.com" | node tests/test-email.js
```

#### Notas de Desarrollo

- El script es compatible con Node.js 14+
- Usa ES6 modules y async/await
- Incluye manejo de errores robusto
- Sigue las mejores prácticas de UX para CLI 