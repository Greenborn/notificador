const sgMail = require('@sendgrid/mail')
const TelegramBot = require('node-telegram-bot-api')
require("dotenv").config({ path: '.env' })
const express = require('express')
const bodyParser = require("body-parser")
const rateLimit = require('express-rate-limit')
const emailHandler = require('./email')
const telegramHandler = require('./telegram')

const app = express()
app.use(express.json())

app.use(bodyParser.json())
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
}, 100)