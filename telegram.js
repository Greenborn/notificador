const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config({ path: '.env' })

const COLA_TELEGRAM = [];
const INTERVALO_ENVIO = parseInt(process.env.TELEGRAM_SEND_INTERVAL_MS) || 10000;
let procesandoCola = false;

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

        // Agregar mensaje a la cola
        COLA_TELEGRAM.push({ alias, message, parse_mode, disable_web_page_preview, disable_notification })
        res.status(200).send({ stat: true, enCola: COLA_TELEGRAM.length })
    } catch (error) {
        console.log('Error en endpoint de Telegram:', error)
        res.status(500).send({
            stat: false,
            error: 'Error interno del servidor'
        })
    }
}

async function procesarColaTelegram() {
    if (procesandoCola) return;
    procesandoCola = true;
    while (COLA_TELEGRAM.length > 0) {
        const item = COLA_TELEGRAM.shift();
        try {
            // Buscar configuración de alias
            const botTokenVar = `TELEGRAM_BOT_${item.alias.toUpperCase()}_TOKEN`
            const chatIdVar = `TELEGRAM_${item.alias.toUpperCase()}_CHAT_ID`
            const botToken = process.env[botTokenVar]
            const chatId = process.env[chatIdVar]
            if (!botToken || !chatId) {
                console.log(`[COLA_TELEGRAM] Alias '${item.alias}' mal configurado.`)
                continue;
            }
            const telegramBot = new TelegramBot(botToken, { polling: false })
            const options = {
                parse_mode: item.parse_mode || 'HTML',
                disable_web_page_preview: item.disable_web_page_preview || false,
                disable_notification: item.disable_notification || false
            }
            await telegramBot.sendMessage(chatId, item.message, options)
            console.log(`[COLA_TELEGRAM] Mensaje enviado a '${item.alias}'`)
        } catch (err) {
            console.log(`[COLA_TELEGRAM] Error enviando mensaje a '${item.alias}':`, err.message)
        }
        await new Promise(r => setTimeout(r, INTERVALO_ENVIO))
    }
    procesandoCola = false;
}

setInterval(procesarColaTelegram, INTERVALO_ENVIO)

module.exports = telegramHandler; 