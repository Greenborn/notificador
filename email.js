const sgMail = require('@sendgrid/mail')
require('dotenv').config({ path: '.env' })
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function emailHandler(req, res) {
    try {
        const PARAMETROS = req.body
        // Validar token de API
        if (!PARAMETROS?.token || PARAMETROS.token !== process.env.EMAIL_API_TOKEN) {
            return res.status(401).send({ stat: false, error: 'No autorizado' })
        }
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
                if (error?.response?.body?.errors) {
                    console.log('Error SendGrid:', error.response.body.errors)
                } else {
                    console.log('Error ', error)
                }
                res.status(500).send({ stat: false })
            })
    } catch (error) {
        console.log(error)
        res.status(500).send({ stat: false })
    }    
}

module.exports = emailHandler; 