import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function CheckoutScreen() {
    const navigate = useNavigate();
    
    // 🔑 CONTEXT: Consume state and actions
    const { cart, createNewOrder, fetchCart, isLoading, isAuthenticated, error } = useContext(AppContext);

    // Local state for shipping details
    const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', });
    const { address, city } = shippingAddress;

    // Side effect to handle errors and cart fetching
    useEffect(() => {
        if (!isAuthenticated) {
            // Optional: Handle unauthenticated checkout attempt
            navigate('/login');
            return;
        }

        // 🔑 FIX 1: Immediately fetch the cart when the CheckoutScreen mounts
        // This ensures the cart data is fresh and available.
        fetchCart();
        
        if (error) { console.error(error); }
    }, [isAuthenticated, error]);


    // Side effect to check for empty cart AFTER fetching has potentially finished
    useEffect(() => {
        // 🔑 FIX 2: Only check for empty cart once the cart state is loaded (i.e., not null/undefined and not currently loading)
        if (cart && cart.items && cart.items.length === 0 && !isLoading) {
            alert('Your cart is empty. Redirecting to cart.');
            navigate('/cart');
        }
        
    }, [cart, navigate, isLoading]); // Depend on cart and isLoading to react to changes


    const onChange = (e) => { setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value, }); };

    const submitHandler = async (e) => {
        e.preventDefault();

        // 🔑 ACTION: Call the context action
        const order = await createNewOrder({ shippingAddress });
        
        // Navigation relies on the success of the async call
        if (order && order._id) {
            // Note: Per instructions, using alert() is acceptable here.
            alert(`Order #${order._id.substring(18)} placed successfully!`); 
            navigate('/myorders'); 
        }
    };
    
    // Calculate total price for display
    const total = cart?.items?.reduce((acc, item) => 
        acc + item.product.price * item.quantity, 0
    ).toFixed(2);


    if (isLoading) { return <h2 className='text-center mt-5'>Processing Order...</h2>; }

    // Render nothing if cart is not yet loaded, preventing the form from showing prematurely
    if (!cart || !cart.items) { return <h2 className='text-center mt-5'>Loading Cart Data...</h2>; }

    return (
        <div className='container mt-5' style={{ maxWidth: '800px' }}>
            <h1>Checkout</h1>
            <div className='row'>
                <div className='col-md-7'>
                    <h2>Shipping Information</h2>
                    <form onSubmit={submitHandler}>
                        {/* Address Input */}
                        <div className='form-group mb-3'>
                            <label>Address</label>
                            <input type='text' name='address' value={address} onChange={onChange} className='form-control' required />
                        </div>
                        {/* City Input */}
                        <div className='form-group mb-3'>
                            <label>City</label>
                            <input type='text' name='city' value={city} onChange={onChange} className='form-control' required />
                        </div>
                        <button 
                            type='submit' 
                            className='btn btn-success w-100 mt-3' 
                            // Check cart.items.length here as the ultimate guard
                            disabled={isLoading || cart.items.length === 0}
                        >
                            Place Order (${total})
                        </button>
                    </form>
                </div>

                <div className='col-md-5'>
                    <div className='card p-4 bg-light'>
                        <h3>Order Summary</h3>
                        <hr />
                        {cart?.items?.map(item => (
                            // Key prop added here for stability
                            <div key={item.product._id} className='d-flex justify-content-between mb-1'> 
                                <span>{item.product.name} ({item.quantity})</span>
                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <h4 className='d-flex justify-content-between'>
                            <span>Total:</span>
                            <strong>${total}</strong>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutScreen;
