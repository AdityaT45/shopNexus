import React from "react";
import { useNavigate } from "react-router-dom";

function TopSellingProducts({ topProducts }) {
  const navigate = useNavigate();

  if (!topProducts || topProducts.length === 0) {
    return null; // hide if no top selling products
  }

  return (
    <div className='mb-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2 className='h4 mb-0'>Top Selling Products</h2>
      </div>

      <div className='row g-3'>
        {topProducts.slice(0, 6).map((product) => (
          <div key={product.productId || product._id} className='col-lg-2 col-md-3 col-6'>
            <div
              className='card h-100 border-0 shadow-sm'
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/products/${product.productId || product._id}`)}
            >
              <img
                src={product.image || 'https://via.placeholder.com/150?text=Product'}
                alt={product.name}
                className='card-img-top'
                style={{ height: '120px', objectFit: 'contain', padding: '10px' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                }}
              />
              <div className='card-body text-center p-2'>
                <h6 className='card-title mb-1' style={{ fontSize: '13px' }}>{product.name}</h6>
               
                <strong className='text-success'>₹ {product.price?.toFixed(2) || '0.00'}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopSellingProducts;
