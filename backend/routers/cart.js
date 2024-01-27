const router = require('express').Router()
const {
    addToCart,
    removeItemFromCart,
    getCartOfLoggedUser,
    emptyCart
} = require('../controllers/cart.js')

const {isAuth } = require('../middlewares/verifyToken.js')

router.post('/', isAuth, addToCart)
router.delete('/:productId', isAuth, removeItemFromCart)
router.get('/', isAuth, getCartOfLoggedUser)
router.get('/emptyCart', isAuth, emptyCart)

module.exports = router