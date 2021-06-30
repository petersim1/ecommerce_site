const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PSWD
        }
    });

    const message = {
        from:`${process.env.SMT_FROM_NAME} <${process.env.SMT_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    
    await transport.sendMail(message)
}

module.exports = sendEmail;