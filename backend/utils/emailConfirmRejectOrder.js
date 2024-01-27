const transporter = require('./transporter.js')

const sendEmailToConfirmRejectOrder = (email, order) => {
    const orderItems = order.items.map((item) => {
        return `${item.Product.name} - Quantity: ${item.quantity} - Price: ${item.Product.price}`;
    });

    const total =  `€${order.total.toFixed(2)}`

    const confirmLink = `${process.env.URL}/order/cancelOrder/${order.id}`
    const cancelLink = `${process.env.URL}/order/confirmOrder/${order.id}`

    const mailOptions = {
        from: 'makerspace.powerup@gmail.com',
        to: email,
        subject: 'Order Confirmation',
        text: `Hello ${order.User.firstname},\n\nThank you for your order! Please confirm or cancel your order if you've changed your mind.\n\n
        Order Details:\n${orderItems.join('\n')}
        \n\nTotal:  ${total}\n\n
        To confirm your order, click on the following link:\n${confirmLink}\n\n
        To cancel your order, click on the following link:\n${cancelLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = sendEmailToConfirmRejectOrder