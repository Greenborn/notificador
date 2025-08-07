const { SMTPServer } = require('smtp-server');
const simpleParser = require('mailparser').simpleParser;
const dotenv = require('dotenv');
dotenv.config();

const { sendEmailSMTP } = require('./smtp');
const sendgrid = require('@sendgrid/mail');

// Configuración del proveedor de reenvío
const proveedor = process.env.PROVEEDOR_EMAIL || 'sendgrid';
if (proveedor === 'sendgrid') {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

const server = new SMTPServer({
  authOptional: true,
  onAuth(auth, session, callback) {
    if (
      auth.username === process.env.SMTP_LISTEN_USER &&
      auth.password === process.env.SMTP_LISTEN_PASS
    ) {
      return callback(null, { user: auth.username });
    }
    return callback(new Error('Autenticación SMTP fallida'));
  },
  onData(stream, session, callback) {
    simpleParser(stream)
      .then(async parsed => {
        const to = parsed.to.text;
        const subject = parsed.subject || '';
        const text = parsed.text || '';
        const html = parsed.html || '';

        try {
          if (proveedor === 'sendgrid') {
            await sendgrid.send({
              to,
              from: process.env.SMTP_LISTEN_USER,
              subject,
              text,
              html,
            });
          } else {
            await sendEmailSMTP({ to, subject, text, html });
          }
          callback();
        } catch (err) {
          callback(err);
        }
      })
      .catch(callback);
  },
});


// Solo iniciar el listener si todas las variables están definidas
if (
  process.env.SMTP_LISTEN_HOST &&
  process.env.SMTP_LISTEN_PORT &&
  process.env.SMTP_LISTEN_USER &&
  process.env.SMTP_LISTEN_PASS
) {
  server.listen(Number(process.env.SMTP_LISTEN_PORT), process.env.SMTP_LISTEN_HOST, () => {
    console.log(`Servidor SMTP simulado escuchando en ${process.env.SMTP_LISTEN_HOST}:${process.env.SMTP_LISTEN_PORT}`);
  });
} else {
  console.log('Configuración incompleta para el servidor SMTP simulado. No se iniciará el listener.');
}

/**
 * Instrucciones de uso:
 *
 * 1. Configura las variables en tu archivo .env:
 *    SMTP_LISTEN_HOST, SMTP_LISTEN_PORT, SMTP_LISTEN_USER, SMTP_LISTEN_PASS
 *    PROVEEDOR_EMAIL=sendgrid o nodemailer
 *    (y las variables necesarias para el proveedor de reenvío)
 *
 * 2. Inicia el servidor SMTP simulado:
 *    node smtp-listener.js
 *
 * 3. Desde otro servicio, envía un email a este servidor SMTP usando las credenciales configuradas.
 *    Ejemplo con swaks:
 *    swaks --to destinatario@dominio.com --server 127.0.0.1 --port 2525 --auth LOGIN --auth-user usuario_local --auth-password contraseña_local --data "Subject: Prueba\n\nEste es un mensaje de prueba"
 *
 * 4. El microservicio reenviará el email usando el proveedor configurado en PROVEEDOR_EMAIL.
 *
 * 5. Revisa la consola para ver logs y posibles errores.
 */
