const router = require('express').Router() ;
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth');

const {
    addOrder,
    getSingleOrder,
    deleteSingleOrder,
    getMyOrder,
    getOrders,
    updateOrder
} = require('../controllers/orderController');

router.route('/orders/new')
    .post(isAuthenticatedUser,addOrder);

router.route('/order/:id')
    .get(isAuthenticatedUser,getSingleOrder);

router.route('/orders/me')
    .get(isAuthenticatedUser,getMyOrder);

router.route('/admin/orders')
    .get(isAuthenticatedUser,authorizeRoles('admin'),getOrders);

router.route('/admin/order/:id')
    .put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
    .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteSingleOrder);


module.exports = router;