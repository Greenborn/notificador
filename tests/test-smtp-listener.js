const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Configuración SMTP para el listener:');
console.log('Host:', process.env.SMTP_LISTEN_HOST);
console.log('Port:', process.env.SMTP_LISTEN_PORT);
console.log('User:', process.env.SMTP_LISTEN_USER);

const destinatario = process.argv[2] || process.env.TEST_EMAIL_TO || 'destinatario@dominio.com';
console.log('Destinatario:', destinatario);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_LISTEN_HOST,
  port: process.env.SMTP_LISTEN_PORT,
  secure: false, // El listener no usa TLS por defecto
  auth: {
    user: process.env.SMTP_LISTEN_USER,
    pass: process.env.SMTP_LISTEN_PASS,
  },
});

const mailOptions = {
  from: process.env.SMTP_LISTEN_USER,
  to: destinatario,
  subject: 'Prueba de conexión al listener SMTP',
  text: 'Este es un email de prueba enviado al listener SMTP simulado.',
  html: '<b>Este es un email de prueba enviado al listener SMTP simulado.</b>',
};

console.log('Enviando email al listener SMTP...');
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar el email al listener SMTP:', error);
  } else {
    console.log('Email enviado al listener SMTP correctamente.');
    console.log('Respuesta del servidor:', info);
  }
});
