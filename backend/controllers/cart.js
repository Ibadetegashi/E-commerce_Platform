const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const addToCart = async (req, res) => {
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity);
    const userId = parseInt(req.user.userId);
    const fixedQuantity = JSON.parse(req.body.fixedQuantity);

    try {
        let cart = await prisma.cart.findFirst({
            where: {
                userId: userId,
            },
            include: {
                items: true
            },
        });

        if (!cart) {
            // Create a new cart if none exists for the user
            cart = await prisma.cart.create({
                data: {
                    userId: userId,
                }
            });
            console.log('Create a new cart');
        }
        console.log('else');
        const existingCartItem = cart.items?.find(item => item.productId === productId);
        if (existingCartItem) {
            // Update quantity if the item exists
            if (fixedQuantity) {
                existingCartItem.quantity = quantity;
            } else {
                existingCartItem.quantity += quantity;
            }
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity }
            });
        } else {
            // Create a new cart item if it doesn't exist
            await prisma.cartItem.create({
                data: {
                    Cart: {
                        connect: {
                            id: cart.id,
                        },
                    },
                    Product: {
                        connect: {
                            id: productId,
                        },
                    },
                     quantity,
                },
            });
        }

        // Fetch the updated cart
        cart = await prisma.cart.findUnique({
            where: {
                id: cart.id,
            },
            include: {
                items: {
                    include: {
                        Product: true,
                    },
                },
            },
        });

        return res.status(201).send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
};


const removeItemFromCart = async (req, res) => {
    try {
        const userId = parseInt(req.user.userId)
        const productId = parseInt(req.params.productId)
        let cart = await prisma.cart.findFirst({
            where: { userId: userId },
            include: { items: true },
        });
        if (cart && cart.items.length > 0) {
            //gjeje qat item
            const existingCartItem = cart.items.find(item => item.productId === productId);
            console.log(existingCartItem);

            if (existingCartItem) {
                // Remove nese eshte gjetur
                const deleteItem = await prisma.cartItem.delete({
                    where: { id: existingCartItem.id },
                });
                if (!deleteItem) {
                    return res.status(400).json({ message: 'Failed to delete item' });
                }
                // kthe carten pa item e sapo fshire
                cart = await prisma.cart.findUnique({
                    where: {
                        id: cart.id,
                    },
                    include: {
                        items: {
                            include: {
                                Product: true,
                            },
                        },
                    },
                });
                return res.status(200).json({ message: 'Item was deleted.', deleteItem, newCart: cart })
            } else {
                return res.status(404).json({ message: "No such item in the cart." })
            }

        } else {
            // ska cart ose length === 0
            return res.status(404).json({ message: 'No cart or cart is empty' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
}

const getCartOfLoggedUser = async (req, res) => {
    try {
        const userId = parseInt(req.user.userId);
        console.log(userId);

        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        Product: true
                    }
                }
            }
        });

        if (!cart) {
            return res.status(404).json({ message: "No Cart Found." });
        }

        return res.status(200).json({ message: 'Cart retrieved successfully.', data: cart });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
};


const emptyCart = async (req, res) => {
    try {
        const userId = parseInt(req.user.userId);
        const existingCart = await prisma.cart.findFirst({
            where: { userId }
        });

        if (existingCart) {
            const deletedCart = await prisma.cart.delete({
                where: { userId },
                include: {
                    items: true
                }
            });

            return res.status(200).json({ message: 'Cart emptied successfully', deletedCart, newCart: [] });
        }

        return res.status(404).json({ message: 'No cart found for the user' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
};

const reOrder = async (req, res) => {
    try {
        const userId = parseInt(req.user.userId);
        const { items } = req.body;

        // Check if a cart already exists for the user
        let cart = await prisma.cart.findFirst({
            where: {
                userId: userId,
            }
        });

        if (cart) {
            await prisma.cart.delete({
                where: {
                    id: cart.id
                }
            });
        }
        cart = await prisma.cart.create({
            data: {
                userId: userId,
                items: {
                    create: items.map((item) => {
                        return {
                            productId: item.productId,
                            quantity: item.quantity
                        };
                    })
                }
            },
            include: {
                items: true
            }
        });

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
};





module.exports = { addToCart, removeItemFromCart, getCartOfLoggedUser, emptyCart, reOrder }