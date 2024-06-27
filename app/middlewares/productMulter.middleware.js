const multer = require('multer');

const productStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploadProduct/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadProduct = multer({ 
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // limit file size to 5MB
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = uploadProduct;
