const sgMail = require('@sendgrid/mail')
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
            from: 'registro.gfc@greenborn.com.ar', 
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

setTimeout(async () => {
    const puerto = process.env.PUERTO || 3000;
    const server = await app.listen(puerto);
    console.log('Servidor escuchando en: ', puerto) 
}, 100)