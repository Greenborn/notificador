
require('dotenv').config({ path: '.env' })

let sendEmail;
const proveedor = process.env.PROVEEDOR_EMAIL?.toLowerCase();

if (proveedor === 'sendgrid') {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendEmail = async (msg) => {
        await sgMail.send(msg);
    };
} else if (proveedor === 'nodemailer') {
    const nodemailer = require('nodemailer');
    // Configuración básica, puede ser extendida según necesidades
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    sendEmail = async (msg) => {
        await transporter.sendMail({
            from: msg.from,
            to: msg.to,
            subject: msg.subject,
            text: msg.text,
            html: msg.html,
        });
    };
} else {
    throw new Error('Proveedor de email no soportado o no definido. Use "sendgrid" o "nodemailer" en PROVEEDOR_EMAIL');
}

async function emailHandler(req, res) {
    try {
        const PARAMETROS = req.body;
        // Validar token de API
        if (!PARAMETROS?.token || PARAMETROS.token !== process.env.EMAIL_API_TOKEN) {
            return res.status(401).send({ stat: false, error: 'No autorizado' });
        }
        console.log(PARAMETROS);
        if (!PARAMETROS?.to || !PARAMETROS?.subject || !PARAMETROS?.text || !PARAMETROS?.html) {
            console.log("revisar parametros");
            res.status(500).send({ stat: false });
            return;
        }

        const msg = {
            to: PARAMETROS.to,
            from: PARAMETROS?.from,
            subject: PARAMETROS.subject,
            text: PARAMETROS.text,
            html: PARAMETROS.html,
        };
        try {
            await sendEmail(msg);
            console.log('Email sent');
            res.status(200).send({ stat: true });
        } catch (error) {
            if (proveedor === 'sendgrid' && error?.response?.body?.errors) {
                console.log('Error SendGrid:', error.response.body.errors);
            } else {
                console.log('Error ', error);
            }
            res.status(500).send({ stat: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ stat: false });
    }
}

module.exports = emailHandler; 