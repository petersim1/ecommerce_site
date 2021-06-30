const router = require('express').Router() ;

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    newProductReview,
    getProductReviews,
    deleteProductReview,
    getAdminProducts
} = require('../controllers/productController');
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth');

router.route('/products')
    .get(getProducts);

router.route('/admin/products')
    .get(getAdminProducts);

router.route('/product/:id')
    .get(isAuthenticatedUser,getSingleProduct);

router.route('/admin/product/new')
    .post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
    .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

router.route('/review')
    .put(isAuthenticatedUser,newProductReview)

router.route('/reviews')
    .get(isAuthenticatedUser,getProductReviews)
    .delete(isAuthenticatedUser,deleteProductReview)

module.exports = router;