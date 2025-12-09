// client/src/pages/UserDashboard.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductItem from '../component/ProductItem';
import CategoryNavigation from '../component/CategoryNavigation';

function UserDashboard() {
    const navigate = useNavigate();
    const [urlSearchParams] = useSearchParams();
    // 🔑 CONTEXT: Consume state and actions
    const { products, fetchProducts, isLoading, error, user, myOrders, fetchMyOrders, cart, fetchActiveBanners, activeBanners, categories, fetchCategories, topProducts, fetchTopProducts, fetchWishlist } = useContext(AppContext);
    
    // Get search params from URL
    const keyword = urlSearchParams.get('keyword') || '';
    const category = urlSearchParams.get('category') || '';
    const subcategory = urlSearchParams.get('subcategory') || '';

    // Fetch products whenever the component mounts OR search/filter parameters change
    useEffect(() => {
        if (error) {
            console.error(error);
        }
        
        // 1. CONSTRUCT QUERY STRING
        let queryString = '';
        if (keyword) { queryString += `?keyword=${keyword}`; }
        if (category) { queryString += `${queryString ? '&' : '?'}category=${category}`; }
        if (subcategory) { queryString += `${queryString ? '&' : '?'}subcategory=${subcategory}`; }
        
        // 2. 🔑 ACTION: Call context action with the query string
        fetchProducts(queryString);
        fetchTopProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword, category, subcategory]);

    // Fetch user's orders and wishlist
    useEffect(() => {
        if (user) {
            fetchMyOrders();
            fetchWishlist();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const cartItemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

    useEffect(() => {
        fetchActiveBanners();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading && products.length === 0) {
        return <h2 className='text-center mt-5'>Loading Dashboard...</h2>;
    }



    return (
        <>
            {/* Category Navigation Bar */}
            {/* <CategoryNavigation /> */}
            
            <div className='container-fluid mt-4'>
            {/* Banners Section */}
            <div className="mb-4">
  {activeBanners && activeBanners.length > 0 ? (
    <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">

      {/* Indicators */}
      <div className="carousel-indicators">
        {activeBanners.map((banner, index) => (
          <button
            key={banner._id}
            type="button"
            data-bs-target="#bannerCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
          ></button>
        ))}
      </div>

      {/* Carousel images */}
      <div className="carousel-inner">
        {activeBanners.map((banner, index) => (
          <div
            key={banner._id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={banner.image}
              className="d-block w-100 rounded"
              alt={banner.title}
              style={{ height: "350px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>{banner.title}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>

    </div>
  ) : (
    <p>No active banners</p>
  )}

                    {/* TOP SELLING PRODUCTS */}
                    {topProducts && topProducts.length > 0 && (
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
                                            onClick={() => navigate(`/product/${product.productId || product._id}`)}
                                        >
                                            <img
                                                src={product.image || 'https://via.placeholder.com/150?text=Product'}
                                                alt={product.name}
                                                className='card-img-top'
                                                style={{ height: '120px', objectFit: 'contain', padding: '10px' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                            />
                                            <div className='card-body text-center p-2'>
                                                <h6 className='card-title mb-1' style={{ fontSize: '13px' }}>{product.name}</h6>
                                                <small className='text-muted d-block'>Sold: {product.totalSold}</small>
                                                <strong className='text-success'>₹ {product.price?.toFixed(2) || '0.00'}</strong>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
</div>


            <h4 className='mb-4'>Welcome back, {user?.name || 'Guest'}!</h4>


            {/* Products Section */}
            <div className='mb-4'>
                <h2 className='mb-3'>Latest Products</h2>

                
                {/* Product Grid */}
                {products.length === 0 ? (
                    <p>No products found or currently in stock.</p>
                ) : (
                    <div className='row'>
                        {products.map((product) => (
                            <ProductItem key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* SHOP BY CATEGORY Section - Flipkart Style */}
            {categories && categories.length > 0 && (
                <div className='mb-4' style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '30px 20px',
                    borderRadius: '8px',
                    marginTop: '40px'
                }}>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h2 style={{ 
                            fontSize: '24px', 
                            fontWeight: '600',
                            color: '#212529',
                            margin: 0
                        }}>
                            Shop by Category
                        </h2>
                        <button 
                            className='btn btn-outline-primary btn-sm'
                            onClick={() => navigate('/categories')}
                            style={{ 
                                fontSize: '14px',
                                padding: '6px 16px'
                            }}
                        >
                            View All <i className='fas fa-arrow-right ms-1'></i>
                        </button>
                    </div>
                    <div className='row g-3'>
                        {categories.filter(cat => cat.isActive).slice(0, 8).map((category) => (
                            <div key={category._id} className='col-lg-2 col-md-3 col-4 col-sm-4'>
                                <div 
                                    className='card h-100 border-0'
                                    style={{ 
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '8px',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    onClick={() => {
                                        navigate({
                                            pathname: "/dashboard",
                                            search: new URLSearchParams({ category: category.name }).toString()
                                        });
                                    }}
                                >
                                    <div style={{ 
                                        padding: '15px',
                                        textAlign: 'center',
                                        backgroundColor: '#ffffff'
                                    }}>
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            style={{ 
                                                width: '100%',
                                                height: '100px',
                                                objectFit: 'contain',
                                                marginBottom: '10px'
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150x100?text=Category';
                                            }}
                                        />
                                        <h6 className='mb-0' style={{ 
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: '#212529',
                                            lineHeight: '1.3',
                                            minHeight: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {category.name}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
        </>
    );
}

export default UserDashboard;

