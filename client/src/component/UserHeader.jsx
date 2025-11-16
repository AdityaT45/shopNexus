// client/src/component/UserHeader.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function UserHeader() {
    const navigate = useNavigate();
    // 🔑 CONTEXT: Consume state and action
    const { user, logoutUser, cart } = useContext(AppContext);
    
    const cartItemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

    const onLogout = () => {
        logoutUser(); 
        navigate('/login'); 
    };

    return (
        <header className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <div className='container'>
                <Link className='navbar-brand' to='/dashboard'>
                    ShopNexus
                </Link>
                <div className='collapse navbar-collapse'>
                    <ul className='navbar-nav ms-auto'>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/dashboard'>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/cart'>
                                Cart ({cartItemCount})
                            </Link>
                        </li>
                        
                        {user ? (
                            // LOGGED IN VIEW
                            <li className='nav-item dropdown'>
                                <Link className='nav-link dropdown-toggle' to="#" data-bs-toggle="dropdown">
                                    {user.name}
                                </Link>
                                <ul className='dropdown-menu dropdown-menu-dark'>
                                    <li><Link className='dropdown-item' to='/myorders'>My Orders</Link></li>
                                    <li><hr className='dropdown-divider' /></li>
                                    <li><button className='dropdown-item' onClick={onLogout}>Logout</button></li>
                                </ul>
                            </li>
                        ) : (
                            // LOGGED OUT VIEW
                            <>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/login'>Login</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/register'>Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default UserHeader;

