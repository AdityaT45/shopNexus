// client/src/component/SuperAdmin/SuperAdminSidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

function SuperAdminSidebar() {
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
            if (window.innerWidth >= 992) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };
        
        setIsOpen(window.innerWidth >= 992);
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Toggle Button for Mobile and Tablet */}
            <button
                className="btn btn-dark d-lg-none position-fixed"
                style={{ 
                    top: '70px', 
                    left: isOpen ? '245px' : '10px',
                    zIndex: 1031,
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    transition: 'left 0.3s ease'
                }}
                onClick={toggleSidebar}
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} fs-5`}></i>
            </button>

            {/* Overlay for Mobile and Tablet */}
            {isOpen && (
                <div
                    className="d-lg-none position-fixed"
                    style={{
                        top: '56px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 1019,
                        transition: 'opacity 0.3s ease'
                    }}
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`d-flex flex-column flex-shrink-0 p-3 bg-dark text-white admin-sidebar ${isOpen ? 'show' : ''}`}
                style={{
                    position: 'fixed',
                    top: '56px',
                    left: isOpen ? 0 : '-280px',
                    minHeight: 'calc(100vh - 56px)',
                    width: '280px',
                    zIndex: 1020,
                    transition: 'left 0.3s ease',
                    overflowY: 'auto',
                    boxShadow: isOpen && window.innerWidth < 992 ? '2px 0 10px rgba(0,0,0,0.3)' : 'none'
                }}
            >
                {/* Header with Logo */}
                <NavLink 
                    to="/superadmin/dashboard" 
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                    onClick={() => {
                        if (window.innerWidth < 992) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <span className="fs-4 me-2">
                        <i className="fas fa-crown"></i>
                    </span>
                    <span className="fs-4 fw-bold">Super Admin</span>
                </NavLink>
                <hr className="text-white" />

                {/* Navigation Links */}
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mb-2">
                        <NavLink 
                            to="/superadmin/dashboard" 
                            className={({ isActive }) => 
                                `nav-link text-white d-flex align-items-center ${isActive ? 'bg-warning active' : 'hover-bg-secondary'}`
                            }
                            onClick={() => {
                                if (window.innerWidth < 992) {
                                    setIsOpen(false);
                                }
                            }}
                            style={{ borderRadius: '8px', padding: '10px 15px', transition: 'all 0.2s ease' }}
                        >
                            <i className="fas fa-tachometer-alt me-3" style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink 
                            to="/superadmin/admins" 
                            className={({ isActive }) => 
                                `nav-link text-white d-flex align-items-center ${isActive ? 'bg-warning active' : 'hover-bg-secondary'}`
                            }
                            onClick={() => {
                                if (window.innerWidth < 992) {
                                    setIsOpen(false);
                                }
                            }}
                            style={{ borderRadius: '8px', padding: '10px 15px', transition: 'all 0.2s ease' }}
                        >
                            <i className="fas fa-user-shield me-3" style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}></i>
                            <span>Manage Admins</span>
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink 
                            to="/superadmin/users" 
                            className={({ isActive }) => 
                                `nav-link text-white d-flex align-items-center ${isActive ? 'bg-warning active' : 'hover-bg-secondary'}`
                            }
                            onClick={() => {
                                if (window.innerWidth < 992) {
                                    setIsOpen(false);
                                }
                            }}
                            style={{ borderRadius: '8px', padding: '10px 15px', transition: 'all 0.2s ease' }}
                        >
                            <i className="fas fa-users me-3" style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}></i>
                            <span>All Users</span>
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink 
                            to="/superadmin/orders" 
                            className={({ isActive }) => 
                                `nav-link text-white d-flex align-items-center ${isActive ? 'bg-warning active' : 'hover-bg-secondary'}`
                            }
                            onClick={() => {
                                if (window.innerWidth < 992) {
                                    setIsOpen(false);
                                }
                            }}
                            style={{ borderRadius: '8px', padding: '10px 15px', transition: 'all 0.2s ease' }}
                        >
                            <i className="fas fa-shopping-basket me-3" style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}></i>
                            <span>All Orders</span>
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink 
                            to="/superadmin/products" 
                            className={({ isActive }) => 
                                `nav-link text-white d-flex align-items-center ${isActive ? 'bg-warning active' : 'hover-bg-secondary'}`
                            }
                            onClick={() => {
                                if (window.innerWidth < 992) {
                                    setIsOpen(false);
                                }
                            }}
                            style={{ borderRadius: '8px', padding: '10px 15px', transition: 'all 0.2s ease' }}
                        >
                            <i className="fas fa-box-open me-3" style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}></i>
                            <span>All Products</span>
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
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'Super Admin'}&background=ffc107&color=000&size=32`}
                            alt="User" 
                            width="32" 
                            height="32" 
                            className="rounded-circle me-2"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/32x32/ffc107/000000?text=' + (user?.name?.charAt(0) || 'S');
                            }}
                        />
                        <strong>{user?.name || 'Super Admin'}</strong>
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

export default SuperAdminSidebar;







