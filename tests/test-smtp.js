const { sendEmailSMTP } = require('../smtp');
require('dotenv').config();

const destinatario = process.argv[2] || process.env.TEST_EMAIL_TO || 'destinatario@dominio.com';

async function testSMTP() {
  try {
    const result = await sendEmailSMTP({
      to: destinatario,
      subject: 'Prueba SMTP local',
      text: 'Este es un email de prueba enviado usando el conector SMTP local.',
      html: '<b>Este es un email de prueba enviado usando el conector SMTP local.</b>',
    });
    console.log('Email enviado correctamente:', result);
  } catch (err) {
    console.error('Error al enviar el email:', err);
  }
}

testSMTP();
