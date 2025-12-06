import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
function CartScreen() {
    const navigate = useNavigate();
    
    // 🔑 CONTEXT: Consume cart state and actions
    const { 
        cart, 
        isLoading, 
        isAuthenticated, 
        error, 
        fetchCart, 
        updateCart,         // Used for quantity change
        removeItemFromCart  // Used for item removal
    } = useContext(AppContext);

    // Fetch cart data on load
    useEffect(() => {
        if (isAuthenticated) {
            // 🔑 ACTION: Call context action to fetch the user's cart
            fetchCart();
        } else {
            // Optional: Redirect unauthenticated user
            // navigate('/login');
        }
        
        if (error) {
            console.error(error);
        }
        
    }, [isAuthenticated, error]); // Only depend on isAuthenticated and error


    // Handler to update the quantity of an item
    const updateQuantityHandler = (productId, newQuantity) => {
        // 🔑 ACTION: Call context action directly. Backend handles the update.
        updateCart({ productId, quantity: newQuantity });
    };

    // Handler to remove item
    const removeHandler = (productId) => {
        // NOTE: Use of window.confirm is acceptable here per instructions
        if (window.confirm('Are you sure you want to remove this item?')) { 
            // 🔑 ACTION: Call context action directly
            removeItemFromCart(productId); 
        }
    };

    // Calculate totals
    let subtotal = 0;
    const cartItems = cart?.items || [];
    
    if (cartItems.length > 0) {
        subtotal = cartItems.reduce((acc, item) => 
            acc + (item.product?.price || 0) * item.quantity, 0
        ).toFixed(2);
    }

    // Handle checkout button click
    const checkoutHandler = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/checkout'); // Navigate to the next step
        }
    };

    // --- Loading and Empty State ---
    if (isLoading && !cart) { // Only show loading if we haven't loaded anything yet
        return <h2 className='text-center mt-5'>Loading Cart...</h2>;
    }

    if (cartItems.length === 0) {
        return (
            <div className='container mt-5'>
                <h1>Your Cart</h1>
                <p className='lead mt-3'>Your cart is empty. <a href="/">Start Shopping!</a></p>
            </div>
        );
    }
    
    // --- Display Cart Content ---
    return (
        <div className='container mt-5'>
            <h1>Shopping Cart</h1>
            <div className='row mt-4'>
                
                {/* === Cart Items Column === */}
                <div className='col-md-8'>
                    {cartItems.map((item, index) => (
                        <div key={item.product?._id || `cart-item-${index}`} className='card mb-3 p-3'>
                            <div className='row align-items-center'>
                                <div className='col-md-2'>
                                    <img 
                                        src={
                                            (item.product?.images && item.product.images.length > 0)
                                                ? item.product.images[0]
                                                : (item.product?.image || 'https://via.placeholder.com/100x100?text=No+Image')
                                        } 
                                        alt={item.product?.name || 'Product'} 
                                        className='img-fluid rounded'
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100x100?text=Image+Error';
                                        }}
                                    />
                                </div>
                                <div className='col-md-5'>
                                    <a href={`/products/${item.product?._id}`}>{item.product?.name || 'Unknown Product'}</a>
                                </div>
                                <div className='col-md-2'>
                                    ₹ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                                <div className='col-md-3'>
                                    {/* Quantity Selector */}
                                    <select 
                                        value={item.quantity} 
                                        onChange={(e) => updateQuantityHandler(item.product?._id, Number(e.target.value))}
                                        className='form-select'
                                    >
                                        {[...Array(item.product?.countInStock || 1).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                    
                                    {/* Remove Button */}
                                    <button 
                                        className='btn btn-sm btn-outline-danger mt-2 w-100'
                                        onClick={() => removeHandler(item.product?._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* === Subtotal/Checkout Column === */}
                <div className='col-md-4'>
                    <div className='card p-3 bg-light'>
                        <h4>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}) items</h4>
                        <h2>Total: ₹ {subtotal}</h2>
                        <button 
                            className='btn btn-success mt-3' 
                            onClick={checkoutHandler}
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartScreen;
