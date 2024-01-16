const sgMail = require('@sendgrid/mail')
require("dotenv").config({ path: '.env' })
const express = require('express')
const bodyParser = require("body-parser")

const app = express()
app.use(express.json())

app.use(bodyParser.json())
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.post('/', function requestHandler(req, res) {
    try {
        const PARAMETROS = req.body
        console.log(PARAMETROS)

        const msg = {
            to: PARAMETROS.to, 
            from: 'registro.gfc@greenborn.com.ar', 
            subject: PARAMETROS.subject,
            text: PARAMETROS.text,
            html: PARAMETROS.html,
        }
        sgMail
            .send(msg)
            .then(() => {
                res.status(200).send({ stat: true })
            })
            .catch((error) => {
                res.status(200).send({ stat: false })
            })
    } catch (error) {
        console.log(error)
        res.status(200).send({ stat: false })
    }    
    
});

setTimeout(async () => {
    const server = await app.listen(process.env.PUERTO);
    console.log('Servidor escuchando en: ',process.env.PUERTO) 
}, 100)