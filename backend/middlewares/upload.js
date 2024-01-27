const multer = require('multer');

const allowedFile = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isAllowed = allowedFile[file.mimetype];
        if (isAllowed) {
            cb(null, 'public/images');
        } else {
            const err = new Error("You can only upload image files");
            err.code = "WRONG_MIMETYPE"
            console.log(file);
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.replace(' ', '_');
        cb(null, Date.now() + '-' + fileName);
    },

});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 }// 1 MB limit

}).single('image');

const uploading = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            if (err.code === 'WRONG_MIMETYPE') {
                return res.status(400).json({ error: 'Invalid file type', details: err.message });
            } else if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size limit exceeded', details: `Maximum allowed size is 1MB. ${err.message}` });
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
        next();
    });
};

module.exports = uploading
