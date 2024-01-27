const { body } = require('express-validator');

const createOrderValidation = [
    body('userId').isNumeric().withMessage('User ID must be a number'),
    body('zip').trim().notEmpty().isPostalCode('any').withMessage('Invalid zip code'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('country').trim().notEmpty().withMessage('Country is required').withMessage('Country is required'),
    body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
    body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
];

module.exports = { createOrderValidation }
