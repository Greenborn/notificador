const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config({ path: '.env' })

function telegramHandler(req, res) {
    try {
        const { alias, message, parse_mode, disable_web_page_preview, disable_notification, token } = req.body
        // Validar token de API para telegram
        if (!token || token !== process.env.TELEGRAM_API_TOKEN) {
            return res.status(401).send({ stat: false, error: 'No autorizado' })
        }
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
                error: `Revise configuración`
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
}

module.exports = telegramHandler; 