const router = require('express').Router()
const {
    editProductValidation,
    createProductValidation
} = require('../validation/productValidation.js')

const { handleValidationErrors } = require('../middlewares/errorHandler.js')
const {
    createProduct,
    getProducts,
    getProductById,
    setProductCategory,
    editProduct,
    deleteProduct
} = require('../controllers/product.js')

const { isAdmin, isAuth } = require('../middlewares/verifyToken.js')
const uploading = require('../middlewares/upload.js')

// router.post('/', isAdmin, upload.single('image'), createProductValidation, handleValidationErrors, createProduct) //create with image
router.post('/', isAdmin, uploading ,createProductValidation, handleValidationErrors, createProduct);

router.get('/',isAuth, getProducts)
router.get('/:id',isAuth, getProductById)

router.put('/category', isAdmin, setProductCategory)
router.delete('/:id', isAdmin, deleteProduct)
router.put('/:id', isAdmin, uploading, editProductValidation, handleValidationErrors, editProduct) 

module.exports = router