const router = require('express').Router();
const {
    register,
    getUserById,
    confirmToken,
    login,
    getUsers,
    editUser,
    confirmEmailUpdate,
    updateUserEmail,
    deleteUser,
    makeUserAdmin,
    userCount
} = require('../controllers/user.js');

const { handleValidationErrors } = require('../middlewares/errorHandler.js');
const { isAdmin, isAuth } = require('../middlewares/verifyToken.js');
const {
    registerValidator,
    loginValidator,
    editValidator,
    updateEmailValidation
} = require('../validation/userValidation.js');

router.post('/register', registerValidator, handleValidationErrors, register);
router.get('/confirm/:token', confirmToken);
router.post('/login', loginValidator, handleValidationErrors, login);

router.get('/', isAdmin, getUsers);
router.get('/:id', isAuth, getUserById);
router.put('/:id', isAuth, editValidator, handleValidationErrors, editUser);

router.put('/updateEmail/:id', isAuth, updateEmailValidation, handleValidationErrors, updateUserEmail);
router.get('/confirm-update/:token', confirmEmailUpdate);

router.delete('/:id', isAdmin, deleteUser);
router.put('/:id/status', isAdmin, makeUserAdmin);

module.exports = router;
