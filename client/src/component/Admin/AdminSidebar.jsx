// client/src/components/AdminSidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

function AdminSidebar() {
    const { user, logoutUser } = useContext(AppContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // Set initial state and handle resize
    useEffect(() => {
        const handleResize = () => {
            // On desktop, always show sidebar
            if (window.innerWidth >= 992) {
                setIsOpen(true);
            }
            // On mobile, keep current state (don't auto-close on resize)
        };
        
        // Set initial state: open on desktop, closed on mobile
        setIsOpen(window.innerWidth >= 992);
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Toggle Button for Mobile */}
            <button
                className="btn btn-dark d-lg-none position-fixed"
                style={{ top: '10px', left: '10px', zIndex: 1001 }}
                onClick={toggleSidebar}
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="d-lg-none position-fixed"
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`d-flex flex-column flex-shrink-0 p-3 bg-dark text-white ${isOpen ? 'show' : ''}`}
                style={{
                    position: 'fixed',
                    top: '56px', // Start below navbar
                    left: isOpen ? 0 : '-280px',
                    minHeight: 'calc(100vh - 56px)',
                    width: '280px',
                    zIndex: 1020,
                    transition: 'left 0.3s ease'
                }}
            >
            {/* Header with Logo */}
            <NavLink to="/admin/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4 me-2">
                    <i className="fas fa-store"></i>
                </span>
                <span className="fs-4 fw-bold">ShopNexus</span>
            </NavLink>
            <hr className="text-white" />

            {/* Navigation Links */}
            <ul className="nav nav-pills flex-column mb-auto">
                
                <li className="nav-item">
                    <NavLink 
                        to="/admin/dashboard" 
                        className={({ isActive }) => 
                            `nav-link text-white ${isActive ? 'bg-primary active' : ''}`
                        }
                    >
                        <i className="fas fa-tachometer-alt me-2"></i>
                        Dashboard
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink 
                        to="/admin/orders" 
                        className={({ isActive }) => 
                            `nav-link text-white ${isActive ? 'bg-primary active' : ''}`
                        }
                    >
                        <i className="fas fa-shopping-basket me-2"></i>
                        Orders
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink 
                        to="/admin/products" 
                        className={({ isActive }) => 
                            `nav-link text-white ${isActive ? 'bg-primary active' : ''}`
                        }
                    >
                        <i className="fas fa-box-open me-2"></i>
                        Products
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink 
                        to="/admin/categories" 
                        className={({ isActive }) => 
                            `nav-link text-white ${isActive ? 'bg-primary active' : ''}`
                        }
                    >
                        <i className="fas fa-tags me-2"></i>
                        Categories
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink 
                        to="/admin/users" 
                        className={({ isActive }) => 
                            `nav-link text-white ${isActive ? 'bg-primary active' : ''}`
                        }
                    >
                        <i className="fas fa-users me-2"></i>
                        Customers
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink 
                        to="/admin/banners" 
                        className={({ isActive }) => 
                            `nav-link text-white ${isActive ? 'bg-primary active' : ''}`
                        }
                    >
                        <i className="fas fa-image me-2"></i>
                        Banners
                    </NavLink>
                </li>
            </ul>
            <hr className="text-white" />

            {/* User Profile Section */}
            <div className="dropdown">
                <a 
                    href="#" 
                    className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" 
                    id="dropdownUser1" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                >
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0d6efd&color=fff&size=32`}
                        alt="User" 
                        width="32" 
                        height="32" 
                        className="rounded-circle me-2"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/32x32/0d6efd/ffffff?text=' + (user?.name?.charAt(0) || 'A');
                        }}
                    />
                    <strong>{user?.name || 'Admin'}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                            Sign out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        </>
    );
}

export default AdminSidebar;