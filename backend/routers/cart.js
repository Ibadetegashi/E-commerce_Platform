const router = require('express').Router()
const {
    addToCart,
    removeItemFromCart,
    getCartOfLoggedUser,
    emptyCart,
    reOrder
} = require('../controllers/cart.js')

const {isAuth } = require('../middlewares/verifyToken.js')

router.post('/', isAuth, addToCart)
router.delete('/:productId', isAuth, removeItemFromCart)
router.get('/', isAuth, getCartOfLoggedUser)
router.get('/emptyCart', isAuth, emptyCart)

router.post('/reorder', isAuth, reOrder)

module.exports = router