// client/src/components/ProductItem.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

function ProductItem({ product }) {
    const { user, isAuthenticated, wishlist, addToWishlist, removeFromWishlist } = useContext(AppContext);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Get product image with proper URL handling
    const getProductImage = () => {
        let imageUrl = '';
        if (product.images && product.images.length > 0) {
            imageUrl = product.images[0];
        } else if (product.image) {
            imageUrl = product.image;
        } else {
            return 'https://via.placeholder.com/200x200?text=No+Image';
        }
        
        // Handle empty or invalid image URLs
        if (!imageUrl || imageUrl.trim() === '') {
            return 'https://via.placeholder.com/200x200?text=No+Image';
        }
        
        // If image is a relative path, add server URL
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//') && !imageUrl.startsWith('data:')) {
            // Remove leading slash if present to avoid double slashes
            const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
            return `http://localhost:5000/${cleanPath}`;
        }
        return imageUrl;
    };
    
    const productImage = getProductImage();

    // Check if product is in wishlist
    useEffect(() => {
        if (wishlist && wishlist.items) {
            const found = wishlist.items.some(item => item.product._id === product._id);
            setIsInWishlist(found);
        }
    }, [wishlist, product._id]);

    const getConfig = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated) {
            alert('Please login to add items to wishlist');
            return;
        }

        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(product._id);
            } else {
                await addToWishlist(product._id);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    // Calculate discount display
    const originalPrice = product.originalPrice || product.price;
    const currentPrice = product.price;
    const discountPercentage = product.discountPercentage || 
        (originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);
    const showDiscount = discountPercentage > 0 && originalPrice > currentPrice;

    return (
        <div className='card h-100 position-relative' style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }} 
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}>
                {/* Wishlist Heart Icon */}
                {isAuthenticated && (
                    <button
                        className='btn btn-link position-absolute'
                        style={{
                            top: '8px',
                            right: '8px',
                            zIndex: 10,
                            padding: '4px 8px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderRadius: '50%',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                    >
                        <i 
                            className={`fas fa-heart ${isInWishlist ? 'text-danger' : 'text-muted'}`}
                            style={{ fontSize: '18px' }}
                        ></i>
                    </button>
                )}

                {/* Discount Badge */}
                {showDiscount && (
                    <div 
                        className='position-absolute'
                        style={{
                            top: '8px',
                            left: '8px',
                            zIndex: 10,
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        {discountPercentage}% OFF
                    </div>
                )}

                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '220px', 
                        overflow: 'hidden', 
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px 8px 0 0'
                    }}>
                        <img 
                            src={productImage} 
                            className='card-img-top' 
                            alt={product.name} 
                            style={{ 
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                padding: '15px'
                            }}
                            onError={(e) => {
                                if (e.target.src !== 'https://via.placeholder.com/200x200?text=Image+Error') {
                                    e.target.src = 'https://via.placeholder.com/200x200?text=Image+Error';
                                }
                            }}
                        />
                    </div>
                </Link>
                
                <div className='card-body d-flex flex-column p-3' style={{ minHeight: '140px' }}>
                    <h6 className='card-title mb-2' style={{ fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '40px', lineHeight: '1.4' }}>
                        {product.name}
                    </h6>
                    
                    {/* Rating - Placeholder for now */}
                    <div className='mb-2' style={{ fontSize: '12px', color: '#666' }}>
                        <i className='fas fa-star text-warning'></i>
                        <span className='ms-1'>4.0</span>
                    </div>
                    
                    {/* Price Section */}
                    <div className='mt-auto'>
                        <div className='d-flex align-items-baseline gap-2 mb-1'>
                            <span className='fw-bold' style={{ fontSize: '16px', color: '#212529' }}>
                                ₹{currentPrice.toFixed(0)}
                            </span>
                            {showDiscount && (
                                <>
                                    <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>
                                        ₹{originalPrice.toFixed(0)}
                                    </span>
                                </>
                            )}
                        </div>
                        {showDiscount && (
                            <div style={{ fontSize: '12px', color: '#388e3c', fontWeight: '500' }}>
                                ({discountPercentage}% OFF)
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
}

export default ProductItem;
