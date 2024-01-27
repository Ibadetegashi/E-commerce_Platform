const transporter = require('./transporter.js')

const sendEmailForStatusUpdated = (email, status, order) => {
    const orderItems = order.items.map((item) => {
        return `${item.Product.name} - Quantity: ${item.quantity} - Price: ${item.Product.price}`;
    });
    console.log(orderItems);

    const total = order.total;

    const mailOptions = {
        from: 'makerspace.powerup@gmail.com',
        to: email,
        subject: 'Order Status Update',
        text: `Your order status has been updated to ${status}.\n\nOrder Details:\n${orderItems.join('\n')}\n\nTotal: ${total}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = sendEmailForStatusUpdated