const sgMail = require('@sendgrid/mail')
const TelegramBot = require('node-telegram-bot-api')
require("dotenv").config({ path: '.env' })
const express = require('express')
const bodyParser = require("body-parser")
const rateLimit = require('express-rate-limit')
const emailHandler = require('./email')
const telegramHandler = require('./telegram')
const cors = require('cors')

const app = express()
app.use(express.json())

app.use(bodyParser.json())
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Configuración de CORS
const allowedOrigins = (process.env.CORS_ORIGINS || '*').split(',').map(o => o.trim())
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes('*') || !origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}
app.use(cors(corsOptions))

app.post('/email', emailHandler)

// Configuración de rate limit para /telegram
const telegramRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: parseInt(process.env.TELEGRAM_RATE_LIMIT) || 5,
    message: {
        stat: false,
        error: 'Demasiados mensajes enviados desde esta IP. Intenta nuevamente en una hora.'
    },
    standardHeaders: true,
    legacyHeaders: false
})

// Endpoint para enviar mensajes a Telegram usando alias
app.post('/telegram', telegramRateLimit, telegramHandler)

setTimeout(async () => {
    const puerto = process.env.PUERTO || 3000;
    const server = await app.listen(puerto);
    console.log('Servidor escuchando en: ', puerto) 
    // Iniciar el SMTP listener si las propiedades están definidas
    if (
      process.env.SMTP_LISTEN_HOST &&
      process.env.SMTP_LISTEN_PORT &&
      process.env.SMTP_LISTEN_USER &&
      process.env.SMTP_LISTEN_PASS
    ) {
      console.log('Iniciando SMTP listener...');
      const { spawn } = require('child_process');
      const smtpListener = spawn('node', ['smtp-listener.js'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      smtpListener.on('error', (err) => {
        console.error('Error al iniciar el SMTP listener:', err);
      });
    } else {
      console.log('No se iniciará el SMTP listener: configuración incompleta.');
    }
}, 100)