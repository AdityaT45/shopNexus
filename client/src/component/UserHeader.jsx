// client/src/component/UserHeader.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function UserHeader() {
    const navigate = useNavigate();
    // 🔑 CONTEXT: Consume state and action
    const { user, logoutUser, cart, wishlist } = useContext(AppContext);
    const [searchKeyword, setSearchKeyword] = useState('');
    
    const cartItemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
    const wishlistCount = wishlist?.items?.length || 0;

    const onLogout = () => {
        logoutUser(); 
        navigate('/login'); 
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/dashboard?keyword=${encodeURIComponent(searchKeyword.trim())}`);
            // Reload page to trigger product fetch with new keyword
            window.location.reload();
        }
    };

    return (
        <>
            {/* Main Header with Search Bar */}
            <header className='bg-dark text-white py-2'>
                <div className='container-fluid'>
                    <div className='row align-items-center'>
                        {/* Logo */}
                        <div className='col-md-2 col-lg-2'>
                            <Link className='text-white text-decoration-none fw-bold fs-4' to='/dashboard'>
                                ShopNexus
                            </Link>
                        </div>
                        
                        {/* Search Bar */}
                        <div className='col-md-6 col-lg-7'>
                            <form onSubmit={handleSearch} className='d-flex'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Search for products, brands and more'
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                                <button type='submit' className='btn btn-light ms-2'>
                                    <i className='fas fa-search'></i>
                                </button>
                            </form>
                        </div>
                        
                        {/* Right Side Actions */}
                        <div className='col-md-4 col-lg-3 text-end'>
                            <div className='d-flex align-items-center justify-content-end gap-2 flex-wrap'>
                                {user ? (
                                    <>
                                        
                                        <Link className='text-white text-decoration-none position-relative me-2 ' to='/wishlist' style={{ fontSize: '16px' }}>
                                            <i className='fas fa-heart'></i>
                                            {wishlistCount > 0 && (
                                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger' style={{ fontSize: '0.7rem' }}>
                                                    {wishlistCount}
                                                </span>
                                            )}
                                        </Link>
                                        <Link className='text-white text-decoration-none position-relative me-2' to='/cart' style={{ fontSize: '16px' }}>
                                            <i className='fas fa-shopping-cart'></i> 
                                            {cartItemCount > 0 && (
                                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger' style={{ fontSize: '0.7rem' }}>
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </Link>
                                        <Link className='text-white text-decoration-none me-2' to='/myorders' style={{ fontSize: '16px' }}>
                                            <i className='fas fa-shopping-bag'></i> 
                                        </Link>

                                        <div className='dropdown'>
                                            <button className='btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center' data-bs-toggle='dropdown'>
                                                <img
                                                    src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&size=32&background=fff&color=0d6efd`}
                                                    alt={user.name}
                                                    className='rounded-circle me-2'
                                                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}&size=32&background=fff&color=0d6efd`;
                                                    }}
                                                />
                                                {user.name} <i className='fas fa-chevron-down ms-1'></i>
                                            </button>
                                            <ul className='dropdown-menu'>
                                                <li><Link className='dropdown-item' to='/profile'><i className='fas fa-user me-2'></i>My Profile</Link></li>
                                                <li><Link className='dropdown-item' to='/myorders'><i className='fas fa-shopping-bag me-2'></i>My Orders</Link></li>
                                                <li><hr className='dropdown-divider' /></li>
                                                <li><button className='dropdown-item' onClick={onLogout}><i className='fas fa-sign-out-alt me-2'></i>Logout</button></li>
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link className='text-white text-decoration-none' to='/login'>Login</Link>
                                        <Link className='text-white text-decoration-none' to='/register'>Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default UserHeader;

