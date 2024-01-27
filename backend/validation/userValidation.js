const { body } = require('express-validator')

const loginValidator = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
]

const registerValidator = [
    body('firstname')
        .trim()
        .notEmpty().withMessage('Firstname is required.')
        .isLength({ min: 2, max: 20 }).withMessage('Firstname must be between 2 and 20 characters'),

    body('lastname')
        .trim()
        .notEmpty().withMessage('Lastname is required.')
        .isLength({ min: 2, max: 20 }).withMessage('Lastname must be between 2 and 20 characters'),

    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address'),
    
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])/, 'g')
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character')

]
const editValidator = [
    body('firstname')
        .optional()
        .trim()
        .notEmpty().withMessage('Firstname is required.')
        .isLength({ min: 2, max: 20 }).withMessage('Firstname must be between 2 and 20 characters'),

    body('lastname')
        .optional()
        .trim()
        .notEmpty().withMessage('Lastname is required.')
        .isLength({ min: 2, max: 20 }).withMessage('Lastname must be between 2 and 20 characters'),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])/, 'g')
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character')
];
const updateEmailValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
]
module.exports = {
    registerValidator,
    loginValidator,
    editValidator,
    updateEmailValidation
}