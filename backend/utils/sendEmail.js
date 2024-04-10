const transporter = require('./transporter.js');
const { confirmEmail } = require('./emailConfirmTemplate.js')


function sendConfirmationEmail(email, confirmationToken) {
    const link = `${process.env.URL}/user/confirm/${confirmationToken}`
    const message = confirmEmail(link)
    console.log('link', link);


    const mailOptions = {
        from: 'makerspace.powerup@gmail.com',
        to: email,
        subject: 'Confirm Your Email',
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
            return res.status(500).json({ error: 'Email sending failed' });
        } else {
            console.log('Email sent:', info.response);
            return res.json({ message: 'Email sent successfully.' });
        }
    });
}

function sendUpdateConfirmationEmail(email, token, name) {
    const mailOptions = {
        from: 'makerspace.powerup@gmail.com',
        to: email,
        subject: 'Confirm Your Email Update',
        text: `Dear ${name},\n\n`
            + `We received a request to update the email associated with your account. Please click the link below to confirm the email update. The confirmation link is valid for 15 minutes:\n\n`
            + `${process.env.URL}/user/confirm-update/${token}\n\n`
            + `If you didn't initiate this request, please ignore this email. Your account security is important to us.\n\n`
            + `Thank you,\nThe Makerspace Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendConfirmationEmail, sendUpdateConfirmationEmail }