const { validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array());
    if (!errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.mapped() });
    }
    next();
}
const handleMulterError = (err, res) => {
    console.log('err',err);
    if (err.code === 'WRONG_MIMETYPE') {
        return res.status(400).json({ error: 'Invalid file type', details: err.message, field: err.field });
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size limit exceeded', details: `Maximum allowed size is 1MB. ${err.message}` });
    } else {
        return res.status(400).json({ error: 'Multer error', details: err.message });
    }
};
module.exports = { handleValidationErrors, handleMulterError }