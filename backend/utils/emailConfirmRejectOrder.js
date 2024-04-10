const transporter = require('./transporter.js')

const message = (order, orderItems, cancelLink) => {
    return `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; display: flex; justify-content: center; height: 100vh;  margin: 0;">
        <div
            style="background-color: #fff;margin:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; width: 65%;">
            <h3>Hello, <strong>${order.User.firstname}</strong>,</h3>
            <p>Thank you for your order! Below you can cancel your order if you've changed your mind.</p>
        
            <h2>Order Details:</h2>
            <ul style="list-style: none; padding: 0;">
                ${orderItems.map(item => {
        return `
                <li style="background-color: #6f6e6d5c; border-radius: 4px; padding: 10px; margin-bottom: 5px;">
                    <div><strong>${item.Product.name}</strong></div>
                    <div>Quantity: ${item.quantity}</div>
                    <div><span style="color: green;">Price: ${item.Product.price}</span></div>
                </li>`;
    }).join('\n')}
            </ul>
        
            <p><strong>Total:</strong> €${order.total.toFixed(2)}</p>
            <p>To cancel your order, click on the following link:</p>
            <a style="background-color: red; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-size: 16px; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; transition: background-color 0.3s;"
                href="${cancelLink}">Cancel Order</a>
        </div>
    </div>


`
}

const sendEmailToConfirmRejectOrder = (email, order) => {
    const orderItems = order.items.map((item) => {
        return item
    });

    const total = `€${order.total.toFixed(2)}`

    const confirmLink = `${process.env.URL}/order/confirmOrder/${order.id}`
    const cancelLink = `${process.env.URL}/order/cancelOrder/${order.id}`
    const messageTemplate = message(order, orderItems, cancelLink)

    const mailOptions = {
        from: 'makerspace.powerup@gmail.com',
        to: email,
        subject: 'Order Confirmation',
        html: messageTemplate
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