// client/src/pages/ProductScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function ProductScreen() {
    const { id } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate();

    // 🔑 CONTEXT: Consume state and actions
    const { 
        productDetails, 
        isAuthenticated, 
        fetchProductDetails, // Action to fetch one product
        updateCart,         // Action to add item to cart
        isLoading, 
        error 
    } = useContext(AppContext);

    // State for cart quantity selection
    const [quantity, setQuantity] = useState(1);
    
    // Fetch product details on component load or ID change
    useEffect(() => {
        // 🔑 ACTION: Call context action to fetch details
        fetchProductDetails(id);

        if (error) {
            alert(error);
        }
    }, [id, error]); 


    // Handle Add to Cart button click
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            alert('Please login to add items to your cart.');
            navigate('/login');
            return;
        }
        
        const itemData = {
            productId: productDetails._id,
            quantity: quantity, 
        };

        // 🔑 ACTION: Call context action to update cart
        updateCart(itemData); 
        
        navigate('/cart'); // Redirect to cart page after adding item
    };


    if (isLoading) { return <h2 className='text-center mt-5'>Loading Product Details...</h2>; }
    if (error || !productDetails) { return <h2 className='text-center mt-5 text-danger'>{error || 'Product details could not be loaded.'}</h2>; }

    const product = productDetails; 

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-md-6 mb-4'>
                    <img src={product.image} alt={product.name} className='img-fluid rounded' />
                </div>
                <div className='col-md-6'>
                    <h2>{product.name}</h2>
                    <hr />
                    <p className='lead'><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <hr />

                    {/* Quantity and Cart Status Section */}
                    <div className="card p-3">
                        <p className='mb-2'>
                            <strong>Status:</strong> 
                            <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                                {product.countInStock > 0 ? ' In Stock' : ' Out of Stock'} ({product.countInStock})
                            </span>
                        </p>

                        {/* Quantity Selector */}
                        {product.countInStock > 0 && (
                            <div className='d-flex align-items-center mb-3'>
                                <label className='me-3'>Qty:</label>
                                <select 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className='form-select w-auto'
                                >
                                    {[...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {/* Add to Cart Button */}
                        <button 
                            className='btn btn-success w-100'
                            onClick={handleAddToCart}
                            disabled={product.countInStock === 0}
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductScreen;