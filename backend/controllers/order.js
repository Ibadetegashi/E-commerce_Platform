const { PrismaClient } = require('@prisma/client');
const { Decimal } = require('@prisma/client/runtime/library');
const prisma = new PrismaClient()
const sendEmailToConfirmRejectOrder = require('../utils/emailConfirmRejectOrder.js')
const sendEmailForStatusUpdated = require('../utils/emailStatusUpdate.js')




const createOrder = async (req, res) => {
    try {
        const itemsIds = await Promise.all(req.body.items.map(async (item) => {
            const response = await prisma.orderItems.create({
                data: {
                    productId: parseInt(item.productId),
                    quantity: parseInt(item.quantity)
                }
            });
            console.log(response);
            return { id: response.id };
        }));

        const totalPrices = await Promise.all(itemsIds.map(async (itemsId) => {
            const item = await prisma.orderItems.findUnique(
                {
                    where:
                    {
                        id: itemsId.id
                    },

                    include: {
                        Product: {
                            select: {
                                price: true,
                            },

                        }

                    }

                }
            );
            console.log(item);
            return item?.Product.price * item.quantity;
            //kthen price*quan te secilit product, totalPrices eshte array me cmime price*quan 
        }
        ))
        console.log(totalPrices);
        const total = totalPrices.reduce((prev, curr) => {
            return prev + curr
        }, 0)
        const { userId, shippingAddress, city, country, zip, phoneNumber, status } = req.body;
        const order = await prisma.order.create({
            data: {
                status,
                total: Number(total),
                zip,
                city,
                country,
                phoneNumber: phoneNumber,
                shippingAddress,
                items: { connect: itemsIds },
                User: {
                    connect: {
                        id: userId
                    }
                }
            },
            include: {
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        email: true,
                    }
                },
                items: {
                    include: {
                        Product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(400).send({ message: 'Could not create Order' });
        }
        //console.log('order items', order.items);
        const orderItems = await Promise.all(order.items.map(async (item) => {
            const updateStock = await prisma.product.update({
                where: { id: item.Product.id },
                data: { stock: item.Product.stock - item.quantity }
            })
            console.log('stock in making order', updateStock);
        }))


        sendEmailToConfirmRejectOrder(order.User.email, order)
        return res.json({ data: order, message: 'Created Successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error.');
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No Orders Found.' });
        }
        return res.json({ data: orders, message: "Orders retrieved successfully." })
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error.');
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                items: true,
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        email: true
                    }
                }
            },
        })
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        return res.json({ data: order, message: 'Order retrieved successfully.' })
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error.');
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { status } = req.body
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        Product: true
                    }
                }
            }
        })
        if (!order) {
            return res.status(404).json({ message: 'Order Not Found' })
        }
        const orderStatusUpdated = await prisma.order.update({
            where: { id },
            data: { status }
        })
        if (!orderStatusUpdated) {
            return res.status(400).json({ message: "Failed to Update Order" })
        }
        console.log(order);
        sendEmailForStatusUpdated(order.User.email, status, order)
        res.status(200).json({ message: 'Status updated successfully.', data: order })

    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error.');
    }
}

const confirmOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId)
        const order = await prisma.order.update({
            where: { id: orderId },
            include: {
                User: true,
                items: { include: { Product: true } },
            },
            data: {
                status: "Confirmed"
            }
        })

        delete order.User.password
        console.log(order);
        res.status(201).send(`The order is confirmed.`)

    } catch (error) {

    }
}
const cancelOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId)
        const order = await prisma.order.update({
            where: { id: orderId },
            include: {
                User: true,
                items: { include: { Product: true } },
            },
            data: {
                status: "Canceled"
            }
        })

        const orderItems = await Promise.all(order.items.map(async (item) => {
            const updateStock = await prisma.product.update({
                where: { id: item.Product.id },
                data: { stock: item.Product.stock + item.quantity }
            })
            console.log('stock in cancel', updateStock);
        }))



        delete order.User.password
        console.log(order);
        res.status(201).send("The order is canceled.")

    } catch (error) {

    }
}

const deleteOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const findOrder = await prisma.order
            .findUnique({ where: { id } })

        if (!findOrder) {
            return res.status(404)
                .json({ message: 'Order Not Found' })
        }
        const orderDeleted = await prisma.order.delete({
            where: { id }
        })


        if (!orderDeleted) {
            return res.status(400)
                .json({ message: "Failed to Delete Order" })
        }

        res.status(200)
            .json({ message: "Order Deleted Successfully." })

    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error.');
    }
}

const orderTotalSum = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                total: true,
            }
        });
        console.log(orders);

        const sum = orders.reduce((acc, order) => {
            return acc + Number(order.total);
        }, 0);

        res.status(200).json({ totalAmount: sum, totalOrders: orders.length });
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error.');
    }
};

const getOrderItems = async (req, res) => {
    try {
        const orderId = req.params.id;
        const items = await prisma.orderItems.findMany({
            where: {
                orderId: parseInt(orderId)
            },
            include: {
                Product: {
                    select: {
                        name: true,
                        price: true,
                        image: true,
                        Category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        if (!items) {
            throw new Error("No Items Found!");
        }
        res.status(200).json({ data: items, message: "Order items retrieved successfully." });
    } catch (error) {

    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    orderTotalSum,
    getOrderItems,
    confirmOrder,
    cancelOrder
}