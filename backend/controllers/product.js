const { PrismaClient } = require('@prisma/client');
const { connect } = require('tls');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    try {
        const { name, description, stock } = req.body;
        const price = Number(req.body.price)
        const categoryId = parseInt(req.body.categoryId)
        // Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required.' });
        }

        const url = `${process.env.URL}/public/images/`

        const image = req.file.filename;
        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                image: `${url}${image}`,
                categoryId,
                stock: Number(stock)
            },
            include: {
                Category: true
            }
        });

        if (!product) {
            return res.status(401).send('Failed creating product.');
        }

        return res.status(201).send({ message: 'Created Successfully.', data: product });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                Category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No Products Found.' });
        }
        return res.status(200).json({ message: "Products retrieved successfully.", data: products });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}

const getProductById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const product = await prisma.product.findFirst({
            where: {
                id,
            },
            include: {
                Category: true
            }
        })
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${id} not found.` })
        }
        return res.status(200).json({ message: `Product with ID ${id} retrieved successfully.`, data: product })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}
const editProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { name, description, stock } = req.body;
        const categoryId = Number(req.body.categoryId);
        const price = Number(req.body.price);

        // Check if a new file is provided in the request
        let image = req.file ? req.file.filename : null;

        const url = `${process.env.URL}/public/images/`;

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                price,
                description,
                // Use the new file if provided, otherwise keep the existing file
                image: image ? `${url}${image}` : undefined,
                categoryId,
                stock: Number(stock)
            },
            include: {
                Category: true
            }
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: `Product with ID ${productId} not found.`, data: null });
        }

        return res.status(200).json({ message: `Product with ID ${productId} updated successfully.`, data: updatedProduct });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
};

const setProductCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.body.categoryId);
        const productId = parseInt(req.body.productId);

        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })
        if (!category || !product) {
            return res.status(404).json({ message: `Category or product was not found.` })
        }
        if (product.categoryId === categoryId) {
            res.status(404).json({ message: 'This product has this category already.' })
        }
        const setCategory = await prisma.product.update({
            where: {
                id: product.id
            },
            data: {
                categoryId: categoryId
            }, include: {
                Category: true
            }
        })
        if (!setCategory) {
            res.status(400).json({ message: 'Failed to update the product\'s category.' })
        }
        return res.status(200).json({
            message: `Category for the product with ID ${productId} set successfully.`,
            data: setCategory
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const productToDelete = await prisma.product.findUnique({
            where: { id }
        })
        if (!productToDelete) {
            return res.status(404).json({ message: "The product does not exist." })
        }
        const deletedProduct = await prisma.product.delete({
            where: { id }
        })
        if (!deletedProduct) {
            return res.status(400).json({ message: "The product could not be deleted." })
        }

        return res.status(200).json({ message: "The product was deleted successfully." })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}

const getProductsPagination = async (req, res) => {
    try {
        const { query: { page = 1, limit = 10, categoryId = null, name = '' } } = req;
        const match = {};
        if (categoryId && categoryId !== 'null' && categoryId != undefined) {
            match.categoryId = +categoryId;
        }
        if (name) {
            match.name = { contains: name }
        }
        console.log('match', match);
        const products = await prisma.product.findMany({
            skip: (page - 1) * limit,
            take: +limit,
            where: match,
            include: {
                Category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        const totalPages = Math.ceil((await prisma.product.count({ where: match })) / limit);
        const totalRecords = Math.ceil(await prisma.product.count());
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No Products Found.' });
        }
        return res.status(200).json({ message: "Products retrieved successfully.", data: products, totalPages, totalRecords });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}

const addReview = async (req, res) => {
    try {
        const { productId, comment, rating } = req.body
        const userId = +req.user.userId

        const userAlreadyReview = await prisma.review.findFirst({
            where: {
                userId,
                productId
            }
        })

        if (userAlreadyReview) {
            return res.status(403).json({ message: 'You already left a review for this product' })
        }

        const review = await prisma.review.create({
            data: {
                comment,
                rating: +rating,
                Product: {
                    connect: {
                        id: +productId
                    }
                },
                User: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        res.status(201).json(review)


    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error')
    }
}

const getReviewsByProductId = async (req, res)=>{
    try {
        const reviews = await prisma.review.findMany({ 
            where:{
            productId: +req.params.id
          }    
        });
        res.json(reviews)
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error')
    }
}
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    setProductCategory,
    editProduct,
    deleteProduct,
    getProductsPagination,
    addReview,
    getReviewsByProductId
}