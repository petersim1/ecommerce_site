const router = require('express').Router() ;
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth');

const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updatePassword,
    updateProfile,
    forgotPassword,
    resetPassword,
    getAllUsers,
    getUserInfo,
    updateUserInfo,
    deleteUserInfo
} = require('../controllers/userController');

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .get(logoutUser);

router.route('/me')
    .get(isAuthenticatedUser,getUserProfile);

router.route('/me/update')
    .put(isAuthenticatedUser,updateProfile);

router.route('/password/forgot')
    .post(forgotPassword);

router.route('/password/reset/:token')
    .put(resetPassword);

router.route('/password/update')
    .put(isAuthenticatedUser,updatePassword);

router.route('/admin/users')
    .get(isAuthenticatedUser,authorizeRoles('admin'),getAllUsers);

router.route('/admin/user/:id')
    .get(isAuthenticatedUser,authorizeRoles('admin'),getUserInfo)
    .put(isAuthenticatedUser,authorizeRoles('admin'),updateUserInfo)
    .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUserInfo);

module.exports = router;