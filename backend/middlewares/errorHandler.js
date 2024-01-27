const { validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array());
    if (!errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.mapped() });
    }
    next();
}

module.exports = { handleValidationErrors }