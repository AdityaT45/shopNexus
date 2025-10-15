const express=require('express')
const router=express.Router()
const { protect } = require('../middleware/authMiddleware');
const {addToCart,getCart,clearCart,removeItemFromCart}=require('../controllers/cartController')


router.route('/')
    .post(protect, addToCart)
    .get(protect,getCart)
    .delete(protect,clearCart)
    
router.route('/:productId')
    .delete(protect,removeItemFromCart)






module.exports = router;