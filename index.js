const sgMail = require('@sendgrid/mail')
const TelegramBot = require('node-telegram-bot-api')
require("dotenv").config({ path: '.env' })
const express = require('express')
const bodyParser = require("body-parser")

const app = express()
app.use(express.json())

app.use(bodyParser.json())
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.post('/email', function requestHandler(req, res) {
    try {
        const PARAMETROS = req.body
        console.log(PARAMETROS)
        if (!PARAMETROS?.to || !PARAMETROS?.subject || !PARAMETROS?.text || !PARAMETROS?.html) {
            console.log("revisar parametros")
            res.status(500).send({ stat: false })
            return
        }

        const msg = {
            to: PARAMETROS.to, 
            from: PARAMETROS?.from, 
            subject: PARAMETROS.subject,
            text: PARAMETROS.text,
            html: PARAMETROS.html,
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                res.status(200).send({ stat: true })
            })
            .catch((error) => {
                console.log('Error ', error)
                res.status(500).send({ stat: false })
            })
    } catch (error) {
        console.log(error)
        res.status(500).send({ stat: false })
    }    
    
});

// Endpoint para enviar mensajes a Telegram usando alias
app.post('/telegram', function telegramHandler(req, res) {
    try {
        const { alias, message, parse_mode, disable_web_page_preview, disable_notification } = req.body
        console.log('Parámetros Telegram:', req.body)

        if (!alias || !message) {
            res.status(400).send({
                stat: false,
                error: "Parámetros requeridos: alias y message"
            })
            return
        }

        // Construir nombres de variables de entorno
        const botTokenVar = `TELEGRAM_BOT_${alias.toUpperCase()}_TOKEN`
        const chatIdVar = `TELEGRAM_${alias.toUpperCase()}_CHAT_ID`
        const botToken = process.env[botTokenVar]
        const chatId = process.env[chatIdVar]

        if (!botToken || !chatId) {
            res.status(400).send({
                stat: false,
                error: `Alias '${alias}' no existe o está mal configurado. Variables requeridas: ${botTokenVar}, ${chatIdVar}`
            })
            return
        }

        const telegramBot = new TelegramBot(botToken, { polling: false })
        const options = {
            parse_mode: parse_mode || 'HTML',
            disable_web_page_preview: disable_web_page_preview || false,
            disable_notification: disable_notification || false
        }

        telegramBot.sendMessage(chatId, message, options)
            .then((response) => {
                console.log(`Mensaje de Telegram enviado al alias '${alias}':`, response)
                res.status(200).send({
                    stat: true,
                    alias,
                    message_id: response.message_id,
                    chat: response.chat
                })
            })
            .catch((error) => {
                console.log(`Error enviando mensaje de Telegram al alias '${alias}':`, error)
                res.status(500).send({
                    stat: false,
                    error: error.message || 'Error al enviar mensaje de Telegram',
                    alias
                })
            })
    } catch (error) {
        console.log('Error en endpoint de Telegram:', error)
        res.status(500).send({
            stat: false,
            error: 'Error interno del servidor'
        })
    }
});

setTimeout(async () => {
    const puerto = process.env.PUERTO || 3000;
    const server = await app.listen(puerto);
    console.log('Servidor escuchando en: ', puerto) 
}, 100)