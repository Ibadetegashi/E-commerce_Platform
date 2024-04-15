const { body } = require('express-validator');

const createProductValidation = [
    body('name').trim().notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.'),

    body('description').trim().notEmpty().withMessage('Description is required.')
        .isLength({ min: 10, max: 599 }).withMessage('Description must be between 10 and 599 characters.'),

    body('price')
        .isFloat({ min: 0, max: 10000 })
        .withMessage('Price must be a valid float between 0 and 10000.'),

    body('categoryId').notEmpty().withMessage('CategoryId is required.'),
    body('Category').notEmpty().withMessage('Category is required.'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a positiv number').notEmpty().withMessage('Stock is required.'),
];

const editProductValidation = [
    body('name').optional().trim().notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.'),

    body('description').optional().trim().notEmpty().withMessage('Description is required.')
        .isLength({ min: 10, max: 599 }).withMessage('Description must be between 10 and 599 characters.'),

    body('price').optional()
        .isFloat({ min: 0, max: 10000 })
        .withMessage('Price must be a valid float between 0 and 10000.'),

    body('categoryId').optional().notEmpty().withMessage('CategoryId is required.'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a positiv number').notEmpty().withMessage('Stock is required.'),
];

const createCategoryValidation = [
    body('name').trim().notEmpty().withMessage('Category name is required.')
        .isLength({ min: 2, max: 20 }).withMessage('Category name must be between 2 and 20 characters.'),
]


module.exports = {
    editProductValidation,
    createProductValidation,
    createCategoryValidation
}
