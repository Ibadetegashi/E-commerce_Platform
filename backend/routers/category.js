const router = require('express').Router()
const {
    createCategory,
    getCategories,
    getCategoryById,
    deleteCategory,
    editCategory,
    getSuggestedProducts
} = require('../controllers/category.js')

const { createCategoryValidation } = require('../validation/productValidation.js')
const { handleValidationErrors } = require('../middlewares/errorHandler.js')
const { isAdmin, isAuth } = require('../middlewares/verifyToken.js')


router.post('/',
    isAdmin,
    createCategoryValidation,
    handleValidationErrors,
    createCategory)

router.get('/',
    isAdmin,
    getCategories)
    
router.get('/:id',
    getCategoryById)

router.delete('/:id',
    isAdmin,
    deleteCategory)

router.put('/:id',
    isAdmin,
    createCategoryValidation,
    handleValidationErrors,
    editCategory)

router.get('/product/:categoryId', isAuth, getSuggestedProducts)


module.exports = router