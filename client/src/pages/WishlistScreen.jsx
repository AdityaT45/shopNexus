// client/src/pages/WishlistScreen.jsx
import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductItem from '../component/ProductItem';

function WishlistScreen() {
    const navigate = useNavigate();
    const { user, isAuthenticated, wishlist, fetchWishlist, isLoading } = useContext(AppContext);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    if (isLoading) {
        return <h2 className='text-center mt-5'>Loading Wishlist...</h2>;
    }

    const wishlistItems = wishlist?.items || [];

    return (
        <div className='container mt-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>My Wishlist</h1>
                <Link to='/dashboard' className='btn btn-outline-primary'>
                    <i className='fas fa-arrow-left me-2'></i>Continue Shopping
                </Link>
            </div>

            {wishlistItems.length === 0 ? (
                <div className='text-center py-5'>
                    <i className='fas fa-heart' style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
                    <h3>Your wishlist is empty</h3>
                    <p className='text-muted'>Start adding products you love!</p>
                    <Link to='/dashboard' className='btn btn-primary mt-3'>
                        <i className='fas fa-shopping-bag me-2'></i>Browse Products
                    </Link>
                </div>
            ) : (
                <>
                    <p className='text-muted mb-4'>{wishlistItems.length} item(s) in your wishlist</p>
                    <div className='row'>
                        {wishlistItems.map((item) => (
                            <ProductItem key={item.product._id} product={item.product} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default WishlistScreen;

