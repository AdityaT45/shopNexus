// client/src/component/AdminHeader.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function AdminHeader() {
    const navigate = useNavigate();
    // 🔑 CONTEXT: Consume state and action
    const { user, logoutUser } = useContext(AppContext);

    const onLogout = () => {
        logoutUser(); 
        navigate('/login'); 
    };

    return (
        <header className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <div className='container'>
                <Link className='navbar-brand' to='/admin/dashboard'>
                    ShopNexus - Admin
                </Link>
                <div className='collapse navbar-collapse'>
                    <ul className='navbar-nav ms-auto'>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/admin/dashboard'>
                                Dashboard
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/admin/users'>
                                Users
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/admin/products'>
                                Products
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/admin/orders'>
                                Orders
                            </Link>
                        </li>
                        
                        {user ? (
                            // LOGGED IN VIEW
                            <li className='nav-item dropdown'>
                                <Link className='nav-link dropdown-toggle' to="#" data-bs-toggle="dropdown">
                                    {user.name} (Admin)
                                </Link>
                                <ul className='dropdown-menu dropdown-menu-dark'>
                                    <li><button className='dropdown-item' onClick={onLogout}>Logout</button></li>
                                </ul>
                            </li>
                        ) : (
                            // LOGGED OUT VIEW
                            <li className='nav-item'>
                                <Link className='nav-link' to='/login'>Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;

