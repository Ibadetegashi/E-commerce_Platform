const nodemailer = require('nodemailer');
const { createSecureContext } = require('tls');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
        secureContext: createSecureContext({ rejectUnauthorized: false }),
    },

 });

 module.exports = transporter