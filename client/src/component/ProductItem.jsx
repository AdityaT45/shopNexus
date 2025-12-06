// client/src/components/ProductItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ProductItem({ product }) {
    // Handle both old format (single image) and new format (images array)
    // Display first image from array, or fallback to single image field
    const productImage = (product.images && product.images.length > 0) 
        ? product.images[0] 
        : (product.image || 'https://via.placeholder.com/200x200?text=No+Image');

    return (
        <div className='col-md-4 col-lg-3 mb-4'>
            <div className='card h-100'>
                <Link to={`/products/${product._id}`}> 
                    <img 
                        src={productImage} 
                        className='card-img-top' 
                        alt={product.name} 
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=Image+Error';
                        }}
                    />
                </Link>
                <div className='card-body d-flex flex-column'>
                    <h5 className='card-title'>{product.name}</h5>
                    <p className='card-text mt-auto'>
                        <span className='fw-bold'>₹ {product.price.toFixed(2)}</span>
                    </p>
                    <Link to={`/products/${product._id}`} className='btn btn-primary mt-2'>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;