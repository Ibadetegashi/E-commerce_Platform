const { PrismaClient } = require('@prisma/client');
const { connect } = require('tls');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    try {
        console.log(req.body);
        console.log('req.files', req.files['mainImage']);
        console.log('req.files', req.files['additionalImages']);

        const { name, description, stock } = req.body;
        const price = Number(req.body.price)
        const categoryId = parseInt(req.body.categoryId)
        // Check if an image file was uploaded
        if (!req.files['mainImage']) {
            return res.status(400).json({ message: 'Main Image is required.' });
        }

        const url = `${process.env.URL}/public/images/`

        const mainImage = req.files['mainImage'][0].filename;
        const additionalImages = req.files['additionalImages'] ? req.files['additionalImages'].map(image => ({
            url: `${url}${image.filename}`,
            productId: null
        })) : null
        console.log('mainImages', mainImage);
        console.log('additionalImages', additionalImages);

        //create product
        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                image: `${url}${mainImage}`,
                categoryId,
                stock: Number(stock)
            },
            include: {
                Category: true,
            }
        });

        if (!product) {
            return res.status(401).send('Failed creating product.');
        }

        //create image record for each additional image 
        if (additionalImages) { 
            await prisma.image.createMany({
                data: additionalImages.map((img, i) => ({
                    url: img.url,
                    productId: product.id
                }))
            })
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
                Category: true,
                Images: {
                    select: {
                        url: true
                    }
                }
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

//if i provide with additional images, the old one will be removed (from images array & Image tabel) and replaced by new ones
const editProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { name, description, stock } = req.body;
        const categoryId = Number(req.body.categoryId);
        const price = Number(req.body.price);
        const previewsImagesUrl = JSON.parse(req.body.previewsImagesUrl);

        let mainImage = req.files['mainImage'] ? req.files['mainImage'][0].filename : null;

        const url = `${process.env.URL}/public/images/`;

        const additionalImages = req.files['additionalImages'] ?
            req.files['additionalImages'].map(image => ({
                url: `${url}${image.filename}`,
                productId: null
            })) : null;

        console.log('previewsImagesUrl');
        console.log(previewsImagesUrl);
        console.log('addimg', additionalImages);

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                price,
                description,
                image: mainImage ? `${url}${mainImage}` : undefined,
                categoryId,
                stock: Number(stock),
            },
            include: {
                Category: true,
                Images: true,
            }
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: `Product with ID ${productId} not found.`, data: null });
        }
        
        const existingImageUrls = updatedProduct.Images.map(image => image.url);
        console.log('Images BEFORE',updatedProduct.Images);
        
        const existingImagesToKeep = updatedProduct.Images.filter(image => {
            return previewsImagesUrl.some(url => image.url.includes(url.url));
        });

        const deleteExistingImages = updatedProduct.Images.filter(image => {
            return !previewsImagesUrl.some(url => image.url.includes(url.url));
        });

        console.log('existingImagesToKeep', existingImagesToKeep);
        console.log('deleteExistingImages', deleteExistingImages);


        if (additionalImages && additionalImages.length > 0) {
            const createNewImageRecords = [];
            for (const image of additionalImages) {
                const newImageRecord = await prisma.image.create({
                    data: { url: image.url, productId }
                });
                createNewImageRecords.push(newImageRecord);
            }
            updatedProduct.Images = [...createNewImageRecords, ...existingImagesToKeep];
            console.log('updatedProduct');
            console.log(updatedProduct.Images);
            console.log('Images AFTER', updatedProduct.Images);

        }
        
        for (const image of deleteExistingImages) {
            await prisma.image.delete({
                where: {
                    id: image.id 
                }
            });
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
        const { query: { page = 1, limit = 10, categoryId , search = '', price = '' } } = req;
        const match = {};
        if (categoryId && categoryId != -1 && categoryId != undefined) {
            match.categoryId = +categoryId;
        }
        if (search) {
            match.OR = [
                { name: { contains: search } },
                { Category: { name: { contains: search } } }
            ];
        }
        if (price) {
            const [from, to] = price.split('-').map(p => Number(p.trim())); // Parse "from-to" string
            match.price = {
                gte: from,
                lte: to
            };
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
        const totalRecords = Math.ceil(await prisma.product.count({where: match}));
        
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
                productId: +productId
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

const getReviewsByProductId = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                productId: +req.params.id
            },
            include: {
                User: {
                    select: {
                        firstname: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(reviews)
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error')
    }
}

const deleteReview = async (req, res) => {
    try {
        const findReview = await prisma.review.findUnique({
            where: {
                id: +req.params.id
            }
        })

        if (!findReview) {
            return res.status(404).json('Review Not Found')
        }

        await prisma.review.delete({
            where: {
                id: +req.params.id
            }
        })

        res.json({ deletedReview: findReview, message: 'The review was deleted successfully.' })
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
    getReviewsByProductId,
    deleteReview
}