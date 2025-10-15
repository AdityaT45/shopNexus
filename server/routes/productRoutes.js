const express=require('express')
const router=express.Router()
const { protect, admin } = require('../middleware/authMiddleware');
const {createProduct,getAllProducts,updateProduct,deleteProduct,getPublicProducts,getPublicProductDetails }=require('../controllers/productController')


router.route('/')
    .post(protect, admin, createProduct)
    .get(protect, admin, getAllProducts); 

router.route('/:id')
    .put(protect,admin,updateProduct)
    .delete(protect,admin,deleteProduct)

router.route('/public')
    .get(getPublicProducts )

router.route('/public/:id')
    .get(getPublicProductDetails)

module.exports = router;