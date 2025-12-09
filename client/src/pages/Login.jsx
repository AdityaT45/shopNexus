// client/src/pages/Login.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from '../context/AppContext';
// import { Modal, Button, Table } from 'react-bootstrap'; // Assuming you have react-bootstrap installed or compatible Bootstrap components

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for controlling the modal visibility
    
    const navigate = useNavigate();
    const { loginUser, isAuthenticated, isLoading, error } = useContext(AppContext);

    // Sample users for demonstration purposes
    const sampleUsers = [
        { role: "Super Admin", email: "super@admin.com", password: "password" },
        { role: "Admin", email: "admin@user.com", password: "password" },
        { role: "User", email: "user@user.com", password: "password" },
    ];

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        if (isAuthenticated) {
            const stored = JSON.parse(localStorage.getItem('user'));
            if (stored?.role === 'Super Admin') {
                navigate('/superadmin/dashboard');
            } else if (stored?.role === 'Admin' || stored?.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, error, navigate]);

    const onChange = (e) => { 
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value })); 
    };

    const onSubmit = (e) => {
        e.preventDefault();
        loginUser({ email, password });
    };

    // Style specifically for the full-page background container with 0 margin/padding
    const backgroundStyle = {
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflowY: 'auto' 
    };

    // Custom style for smaller form floating labels to match form-control-sm
    const formFloatingSmStyle = {
        '--bs-form-check-label-font-size': '0.875rem', 
        '--bs-form-floating-line-height': '1.25',
        '--bs-form-floating-padding-y': '0.75rem',
        '--bs-form-floating-padding-x': '0.75rem',
    };

    if (isLoading) { 
        return (
            <div className="d-flex justify-content-center align-items-center bg-light" style={backgroundStyle}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Logging in...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-center bg-light" style={backgroundStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4"> 
                        <div className="card shadow-lg border-0"> 
                            
                            {/* Header Section */}
                            <div className="card-header bg-primary text-white text-center py-3 border-0"> 
                                <div className="mb-2"> 
                                    <i className="fas fa-store" style={{ fontSize: '2rem' }}></i> 
                                </div>
                                <h3 className="mb-1 fw-bold">Welcome Back!</h3> 
                                <p className="mb-0 opacity-75 small">Sign in to your ShopNexus account</p>
                            </div>

                            {/* Form Section */}
                            <div className="card-body p-4 bg-white">
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center p-2" role="alert">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        <div className="small">{error}</div>
                                    </div>
                                )}

                                <form onSubmit={onSubmit}>
                                    <div className="form-floating mb-3" style={formFloatingSmStyle}>
                                        <input
                                            type="email"
                                            className="form-control form-control-sm"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            placeholder="Email"
                                            required
                                        />
                                        <label htmlFor="email"><i className="fas fa-envelope me-2 text-primary"></i>Email</label>
                                    </div>

                                    <div className="mb-4 position-relative">
                                        <div className="form-floating" style={formFloatingSmStyle}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control form-control-sm"
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={onChange}
                                                placeholder="Password"
                                                required
                                                style={{ paddingRight: '45px' }}
                                            />
                                            <label htmlFor="password"><i className="fas fa-lock me-2 text-primary"></i>Password</label>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ border: 'none', background: 'none', color: '#6c757d', fontSize: '0.875rem' }}
                                        >
                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                                            <label className="form-check-label small" htmlFor="rememberMe">
                                                Remember me
                                            </label>
                                        </div>
                                        <a href="#" className="text-decoration-none text-primary small">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-md w-100 mb-3" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Demo Info Button */}
                                <div className="text-center mb-4">
                                    <button 
                                        onClick={handleShow} 
                                        className="btn btn-sm btn-danger" // Small, red button
                                    >
                                        <i className="fas fa-eye me-1"></i> Demo Info
                                    </button>
                                </div>
                                
                                {/* Divider */}
                                <div className="text-center my-3">
                                    <div className="d-flex align-items-center">
                                        <hr className="flex-grow-1" />
                                        <span className="px-3 text-muted small">OR</span>
                                        <hr className="flex-grow-1" />
                                    </div>
                                </div>

                                {/* Register Link */}
                                <div className="text-center">
                                    <p className="mb-0 text-muted small">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-primary fw-bold text-decoration-none">
                                            Create Account
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="text-center mt-3">
                            <p className="text-muted mb-0">
                                <small>
                                    <i className="fas fa-shield-alt me-1"></i>
                                    Secure login with encrypted data
                                </small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal for Demo Credentials */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: showModal ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white py-2">
                            <h5 className="modal-title fs-5"><i className="fas fa-users me-2"></i>Demo Login Credentials</h5>
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body p-3">
                            <p className="small text-muted mb-3">
                                Use one of these accounts to quickly access the platform demo.
                            </p>
                            <table className="table table-striped table-sm mb-0 small">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Role</th>
                                        <th>Email</th>
                                        <th>Password</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleUsers.map((user) => (
                                        <tr key={user.role}>
                                            <td className="fw-bold">{user.role}</td>
                                            <td>{user.email}</td>
                                            <td>{user.password}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer py-2">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Modal */}
        </div>
    );
}

export default Login;