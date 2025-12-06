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
    const { products, fetchProducts, isLoading, error, user, myOrders, fetchMyOrders, cart, fetchActiveBanners, activeBanners, categories, fetchCategories } = useContext(AppContext);
    
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword, category, subcategory]);

    // Fetch user's orders
    useEffect(() => {
        if (user) {
            fetchMyOrders();
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
            <CategoryNavigation />
            
            <div className='container mt-4'>
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
</div>


            <h1 className='mb-4'>Welcome back, {user?.name || 'Guest'}!</h1>

            {/* User Statistics */}
            <div className='row mb-4'>
                <div className='col-md-4 mb-3'>
                    <div className='card bg-primary text-white'>
                        <div className='card-body'>
                            <h5 className='card-title'>Cart Items</h5>
                            <h2>{cartItemCount}</h2>
                            <button 
                                className='btn btn-light btn-sm mt-2'
                                onClick={() => navigate('/cart')}
                            >
                                View Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 mb-3'>
                    <div className='card bg-success text-white'>
                        <div className='card-body'>
                            <h5 className='card-title'>My Orders</h5>
                            <h2>{myOrders?.length || 0}</h2>
                            <button 
                                className='btn btn-light btn-sm mt-2'
                                onClick={() => navigate('/myorders')}
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 mb-3'>
                    <div className='card bg-info text-white'>
                        <div className='card-body'>
                            <h5 className='card-title'>Account</h5>
                            <p className='mb-0'>{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

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

            {/* SHOP BY CATEGORY Section */}
            {categories && categories.length > 0 && (
                <div className='mb-4'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h2>Shop by Category</h2>
                        <button 
                            className='btn btn-outline-primary'
                            onClick={() => navigate('/categories')}
                        >
                            View All Categories <i className='fas fa-arrow-right ms-1'></i>
                        </button>
                    </div>
                    <div className='row'>
                        {categories.slice(0, 8).map((category) => (
                            <div key={category._id} className='col-md-3 col-6 mb-3'>
                                <div 
                                    className='card h-100 shadow-sm'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedCategory(category.name);
                                        setSearchParams({
                                            ...searchParams,
                                            category: category.name
                                        });
                                    }}
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className='card-img-top'
                                        style={{ height: '150px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x150?text=Category';
                                        }}
                                    />
                                    <div className='card-body text-center'>
                                        <h6 className='card-title mb-0'>{category.name}</h6>
                                        {category.subcategories && category.subcategories.length > 0 && (
                                            <small className='text-muted'>
                                                {category.subcategories.length} subcategories
                                            </small>
                                        )}
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

