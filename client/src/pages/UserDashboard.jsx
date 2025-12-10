// client/src/pages/UserDashboard.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductItem from '../component/ProductItem';
import CategoryNavigation from '../component/CategoryNavigation';
import BannerCarousel from '../pages/user/BannerCarousel.jsx';
import TopSellingProducts from '../pages/user/TopSellingProducts.jsx';

function UserDashboard() {
    const navigate = useNavigate();
    const [urlSearchParams] = useSearchParams();
    // 🔑 CONTEXT: Consume state and actions
    const { products, fetchProducts, isLoading, error, user, myOrders, fetchMyOrders, cart, fetchActiveBanners, activeBanners, categories, fetchCategories, topProducts, fetchTopProducts, fetchWishlist } = useContext(AppContext);
    
    // Get search params from URL
    const keyword = urlSearchParams.get('keyword') || '';
    const category = urlSearchParams.get('category') || '';
    const subcategory = urlSearchParams.get('subcategory') || '';

    // Redirect to products page if category or search is provided
    useEffect(() => {
        if (category || keyword) {
            const params = new URLSearchParams();
            if (keyword) params.set('keyword', keyword);
            if (category) params.set('category', category);
            if (subcategory) params.set('subcategory', subcategory);
            navigate(`/products?${params.toString()}`);
        }
    }, [category, keyword, subcategory, navigate]);

    // Fetch products whenever the component mounts (only for dashboard view)
    useEffect(() => {
        if (error) {
            console.error(error);
        }
        
        // Only fetch if no category/search filters (dashboard view)
        if (!category && !keyword) {
            fetchProducts('');
            fetchTopProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    <BannerCarousel activeBanners={activeBanners} />           

    <h4 className='mb-4'>Welcome back, {user?.name || 'Guest'}!</h4>

    {topProducts && topProducts.length > 0 && (
    <TopSellingProducts topProducts={topProducts} />
)}


            {/* Products Section */}
            <div className='mb-4'>
                <h2 className='mb-3'>Latest Products</h2>

                
                {/* Product Grid */}
                {products.length === 0 ? (
                    <p>No products found or currently in stock.</p>
                ) : (
                    <div className='row'>
                        {products.map((product) => (
                            <div key={product._id} className='col-lg-2 col-md-3 col-sm-4 col-6 mb-4'>
                                <ProductItem product={product} />
                            </div>
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

