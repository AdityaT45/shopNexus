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
        <header className='navbar navbar-expand-lg navbar-dark bg-dark' style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1030 }}>
            <div className='container-fluid'>
                <Link className='navbar-brand' to='/admin/dashboard'>
                    ShopNexus - Admin
                </Link>
                <button 
                    className='navbar-toggler' 
                    type='button' 
                    data-bs-toggle='collapse' 
                    data-bs-target='#adminNavbar'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='adminNavbar'>
                    <ul className='navbar-nav ms-auto'>
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

