const router = require('express').Router()
const { createOrderValidation } = require('../validation/orderValidation.js')
const { handleValidationErrors } = require('../middlewares/errorHandler.js')
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    orderTotalSum,
    getOrderItems,
    confirmOrder,
    cancelOrder
} = require('../controllers/order.js')
const { isAdmin, isAuth } = require('../middlewares/verifyToken.js')

router.post('/', isAuth, createOrderValidation, handleValidationErrors, createOrder)
router.get('/', isAdmin, getOrders)
router.get('/:id',isAuth, getOrderById)
router.put('/:id',isAdmin, updateOrderStatus)
router.delete('/:id', isAdmin, deleteOrder) // delete an order => orteritems of that order will be deleted
router.get('/get/total', isAdmin, orderTotalSum)
router.get('/orderitems/:id',isAuth, getOrderItems)

router.get('/confirmOrder/:orderId', confirmOrder)
router.get('/cancelOrder/:orderId', cancelOrder)

module.exports = router
